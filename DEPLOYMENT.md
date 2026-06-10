# WiseSource Deployment Guide

## Architecture

```
Browser
  ↓ HTTPS
AWS Amplify (Frontend)
  ↓ HTTPS
AWS API Gateway
  ↓ HTTP
AWS ECS Fargate (FastAPI Backend)
  ↓
AWS RDS PostgreSQL (Database)
```

---

## Services Used — Why & Cost

| Service | Why We Use It | Estimated Monthly Cost |
|---|---|---|
| **AWS ECR** | Stores the Docker image of the FastAPI backend. ECS pulls from here on every deployment. | ~$0 (first 50 GB free; our image is ~60 MB) |
| **AWS ECS Fargate** | Runs the FastAPI backend as a container without managing any servers. Fargate handles infrastructure automatically. | ~$9/month (0.25 vCPU + 0.5 GB RAM running 24/7) |
| **AWS RDS PostgreSQL** | Persistent database for storing contacts, job applications, newsletter subscriptions. Survives container restarts. | ~$14/month (db.t3.micro + 20 GB storage). Free for 12 months with AWS free tier. |
| **AWS API Gateway** | Provides a stable HTTPS URL in front of ECS. Needed because Amplify is HTTPS and browsers block HTTP API calls from HTTPS pages (mixed content). | ~$0 (first 1 million requests/month free; $1 per million after) |
| **AWS Amplify** | Hosts the React frontend with built-in CDN (CloudFront), CI/CD from GitHub, and HTTPS. Auto-deploys on every push. | ~$0 (first 1000 build minutes + 15 GB/month free. $0.01/build minute + $0.15/GB after) |
| **AWS CloudWatch** | Required by ECS Fargate for container logs. Useful for debugging if the backend crashes. | ~$0 (first 5 GB/month free) |

**Total estimated cost: ~$23/month** (after AWS free tier expires)
**With AWS free tier (first 12 months): ~$9/month** (only Fargate is charged)

---

## AWS Resources

| Resource | Name / ID |
|---|---|
| ECR Repository | `wisesource-api` |
| ECS Cluster | `wisesource-cluster` |
| ECS Service | `wisesource-api-service` |
| RDS Instance | `wisesource-db` |
| RDS Endpoint | `wisesource-db.ccmexaipn0mb.us-east-1.rds.amazonaws.com` |
| API Gateway ID | `3b2wfchszh` |
| Amplify URL | `https://main.d28qsol90tm0c9.amplifyapp.com` |
| AWS Region | `us-east-1` |
| AWS Account ID | `700294801275` |
| VPC ID | `vpc-8751dafd` |

---

## Full Setup (First Time)

### Step 1: Configure AWS CLI

```bash
aws configure
# Enter: Access Key ID, Secret Access Key, Region (us-east-1), Output format (json)
```

### Step 2: Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name wisesource-api \
  --region us-east-1
```

### Step 3: Authenticate Docker with ECR

```bash
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  700294801275.dkr.ecr.us-east-1.amazonaws.com
```

### Step 4: Build & Push Docker Image

```bash
cd server/

docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --push \
  -t 700294801275.dkr.ecr.us-east-1.amazonaws.com/wisesource-api:latest \
  .
```

> Always use `--platform linux/amd64` and `--provenance=false` — Fargate requires amd64, and provenance=false avoids OCI manifest index issues on Mac.

### Step 5: Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name wisesource-cluster
```

### Step 6: Create IAM Execution Role

```bash
aws iam create-role \
  --role-name ecsTaskExecutionRole \
  --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ecs-tasks.amazonaws.com"},"Action":"sts:AssumeRole"}]}'

aws iam attach-role-policy \
  --role-name ecsTaskExecutionRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
```

### Step 7: Create CloudWatch Log Group

```bash
aws logs create-log-group \
  --log-group-name /ecs/wisesource-api \
  --region us-east-1
```

---

### Step 8: Set Up RDS PostgreSQL

**8a. Get subnet IDs from VPC**

```bash
aws ec2 describe-subnets \
  --filters Name=vpc-id,Values=vpc-8751dafd \
  --query "Subnets[*].SubnetId" \
  --output text
```

**8b. Create RDS security group**

```bash
aws ec2 create-security-group \
  --group-name wisesource-rds-sg \
  --description "RDS PostgreSQL security group" \
  --vpc-id vpc-8751dafd
# Note the GroupId returned (sg-xxxxxxxxx)
```

**8c. Allow port 5432 from VPC**

```bash
aws ec2 authorize-security-group-ingress \
  --group-id <rds-sg-id> \
  --protocol tcp \
  --port 5432 \
  --cidr 172.31.0.0/16
```

**8d. Create DB subnet group**

```bash
aws rds create-db-subnet-group \
  --db-subnet-group-name wisesource-subnet-group \
  --db-subnet-group-description "WiseSource RDS subnet group" \
  --subnet-ids subnet-9c404ed6 subnet-b289b8bd subnet-7eff7d40 subnet-540f4a7a subnet-ec3d46b0 subnet-06dea161
```

**8e. Create RDS instance**

```bash
aws rds create-db-instance \
  --db-instance-identifier wisesource-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15 \
  --master-username wisesource \
  --master-user-password WiseSource2026! \
  --db-name wisesource \
  --allocated-storage 20 \
  --vpc-security-group-ids <rds-sg-id> \
  --db-subnet-group-name wisesource-subnet-group \
  --no-multi-az \
  --no-publicly-accessible \
  --backup-retention-period 0
```

**8f. Wait for RDS to be ready (~5-10 min)**

```bash
aws rds wait db-instance-available --db-instance-identifier wisesource-db

# Get endpoint
aws rds describe-db-instances \
  --db-instance-identifier wisesource-db \
  --query "DBInstances[0].Endpoint.Address" \
  --output text
```

---

### Step 9: Set Up ECS Networking

**9a. Create ECS security group**

```bash
aws ec2 create-security-group \
  --group-name wisesource-ecs-sg \
  --description "ECS Fargate security group" \
  --vpc-id vpc-8751dafd
# Note the GroupId returned (sg-xxxxxxxxx)
```

**9b. Allow inbound port 8000**

```bash
aws ec2 authorize-security-group-ingress \
  --group-id <ecs-sg-id> \
  --protocol tcp \
  --port 8000 \
  --cidr 0.0.0.0/0
```

---

### Step 10: Register ECS Task Definition

```bash
aws ecs register-task-definition \
  --family wisesource-api \
  --network-mode awsvpc \
  --requires-compatibilities FARGATE \
  --cpu 256 \
  --memory 512 \
  --execution-role-arn arn:aws:iam::700294801275:role/ecsTaskExecutionRole \
  --container-definitions '[{"name":"wisesource-api","image":"700294801275.dkr.ecr.us-east-1.amazonaws.com/wisesource-api:latest","portMappings":[{"containerPort":8000,"protocol":"tcp"}],"environment":[{"name":"DATABASE_URL","value":"postgresql://wisesource:WiseSource2026!@wisesource-db.ccmexaipn0mb.us-east-1.rds.amazonaws.com:5432/wisesource"}],"logConfiguration":{"logDriver":"awslogs","options":{"awslogs-group":"/ecs/wisesource-api","awslogs-region":"us-east-1","awslogs-stream-prefix":"ecs"}}}]'
```

### Step 11: Create ECS Service

```bash
aws ecs create-service \
  --cluster wisesource-cluster \
  --service-name wisesource-api-service \
  --task-definition wisesource-api \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-9c404ed6,subnet-b289b8bd,subnet-7eff7d40,subnet-540f4a7a,subnet-ec3d46b0,subnet-06dea161],securityGroups=[sg-0bd54617323639c99],assignPublicIp=ENABLED}"
```

### Step 12: Get ECS Task Public IP

```bash
# Get task ARN
aws ecs list-tasks \
  --cluster wisesource-cluster \
  --service-name wisesource-api-service

# Get ENI ID
aws ecs describe-tasks \
  --cluster wisesource-cluster \
  --tasks <task-arn> \
  --query "tasks[0].attachments[0].details[?name=='networkInterfaceId'].value|[0]"

# Get public IP
aws ec2 describe-network-interfaces \
  --network-interface-ids <eni-id> \
  --query "NetworkInterfaces[0].Association.PublicIp" \
  --output text
```

---

### Step 13: Set Up API Gateway

**13a. Create HTTP API**

```bash
aws apigatewayv2 create-api \
  --name wisesource-api-gateway \
  --protocol-type HTTP \
  --cors-configuration AllowOrigins="https://main.d28qsol90tm0c9.amplifyapp.com",AllowMethods="*",AllowHeaders="*",AllowCredentials=false
# Note the ApiId returned
```

**13b. Create integration**

```bash
aws apigatewayv2 create-integration \
  --api-id <api-id> \
  --integration-type HTTP_PROXY \
  --integration-uri http://<ecs-public-ip>:8000/{proxy} \
  --integration-method ANY \
  --payload-format-version 1.0
# Note the IntegrationId returned
```

**13c. Create route**

```bash
aws apigatewayv2 create-route \
  --api-id <api-id> \
  --route-key "ANY /{proxy+}" \
  --target integrations/<integration-id>
```

**13d. Create and deploy stage**

```bash
aws apigatewayv2 create-stage \
  --api-id <api-id> \
  --stage-name prod \
  --auto-deploy
```

API Gateway URL: `https://<api-id>.execute-api.us-east-1.amazonaws.com/prod`

---

### Step 14: Deploy Frontend on Amplify

1. Push code to GitHub
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
3. Click **Create new app** → connect GitHub repo → select `main` branch
4. Confirm build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm install
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

5. Add environment variable:
   ```
   VITE_API_URL = https://3b2wfchszh.execute-api.us-east-1.amazonaws.com/prod
   ```
6. Deploy

---

## Updating the Backend

When you make changes to FastAPI code:

```bash
# 1. Rebuild and push
cd server/
docker buildx build \
  --platform linux/amd64 \
  --provenance=false \
  --push \
  -t 700294801275.dkr.ecr.us-east-1.amazonaws.com/wisesource-api:latest \
  .

# 2. Redeploy ECS
aws ecs update-service \
  --cluster wisesource-cluster \
  --service wisesource-api-service \
  --force-new-deployment

# 3. Check deployment status
aws ecs describe-services \
  --cluster wisesource-cluster \
  --services wisesource-api-service \
  --query "services[0].events[0:3]"
```

> After redeployment, the ECS task gets a new public IP. Update the API Gateway integration with the new IP (see below).

---

## Updating API Gateway When ECS IP Changes

```bash
# 1. Get new ECS public IP (follow Step 12 above)

# 2. Get integration ID
aws apigatewayv2 get-integrations --api-id 3b2wfchszh

# 3. Update integration with new IP
aws apigatewayv2 update-integration \
  --api-id 3b2wfchszh \
  --integration-id <integration-id> \
  --integration-uri http://<new-ip>:8000/{proxy}
```

---

## Useful URLs

| Purpose | URL |
|---|---|
| Frontend | https://main.d28qsol90tm0c9.amplifyapp.com |
| API Gateway | https://3b2wfchszh.execute-api.us-east-1.amazonaws.com/prod |
| Admin Data | https://3b2wfchszh.execute-api.us-east-1.amazonaws.com/prod/api/admin/data?key=wisesource-admin-2026 |
| Jobs API | https://3b2wfchszh.execute-api.us-east-1.amazonaws.com/prod/api/jobs |

---

## Adding a Job Role

```bash
curl -X POST https://3b2wfchszh.execute-api.us-east-1.amazonaws.com/prod/api/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Job Title",
    "department": "Engineering",
    "location": "Remote",
    "type": "Full-time",
    "description": "Job description here."
  }'
```

---

## Viewing Submitted Data

```bash
curl "https://3b2wfchszh.execute-api.us-east-1.amazonaws.com/prod/api/admin/data?key=wisesource-admin-2026"
```

Returns all contacts, job applications, newsletter subscriptions, and jobs.

---

## Local Development

```bash
# Backend
cd server/
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

# Frontend (separate terminal)
cd ../
npm install
npm run dev
```

Set in `.env`:
```
VITE_API_URL=http://localhost:8000
```
