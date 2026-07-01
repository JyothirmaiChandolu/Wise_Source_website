import { useState, useEffect, useRef } from 'react';
import { Menu, X, ArrowRight, CheckCircle, Briefcase, Cloud, Shield, Database, TrendingUp, Users, Heart, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram, Award, Globe, Zap, Code, BarChart, Server, Layers, GitBranch, Cpu, Sun, Moon, ChevronDown, Sparkles, Plus, Minus, BookOpen } from 'lucide-react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import PhoneInput, { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

type Page = 'home' | 'about' | 'services' | 'blogs' | 'careers' | 'contact';

const SERVICE_NAV_ITEMS = [
  { slug: 'software-engineering', label: 'Software Engineering' },
  { slug: 'cloud-architecture', label: 'Cloud Architecture' },
  { slug: 'data-engineering', label: 'Data Engineering' },
  { slug: 'data-analytics', label: 'Data Analytics' },
  { slug: 'devops', label: 'DevOps & Automation' },
  { slug: 'ai-ml', label: 'AI & Machine Learning' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [serviceSlug, setServiceSlug] = useState('software-engineering');
  const [selectedBlogPost, setSelectedBlogPost] = useState<number | null>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    const meta: Record<Page, { title: string; description: string }> = {
      home: {
        title: 'WiseSource | IT Solutions & Technology Consulting',
        description: 'WiseSource delivers expert IT solutions including software engineering, cloud architecture, data engineering, DevOps, and AI & ML services.',
      },
      about: {
        title: 'About Us | WiseSource',
        description: 'Learn about WiseSource — our mission, vision, and the team of senior engineers and cloud architects driving client-focused technology delivery.',
      },
      services: {
        title: 'Services | WiseSource',
        description: 'Explore WiseSource services: software engineering, cloud architecture, data engineering, data analytics, DevOps & automation, and AI & machine learning.',
      },
      blogs: {
        title: 'Blog | WiseSource',
        description: 'Read the latest insights from WiseSource on AI, cloud computing, data engineering, DevOps, and modern software development.',
      },
      careers: {
        title: 'Careers | WiseSource',
        description: 'Join the WiseSource team. Explore open roles in software engineering, cloud, data, and AI. We offer remote-first culture, equity, and growth opportunities.',
      },
      contact: {
        title: 'Contact Us | WiseSource',
        description: 'Get in touch with WiseSource. Reach our team at contact@wisesource.com or visit us at 1712 Pioneer Ave, STE 7000, Cheyenne, WY 82001.',
      },
    };
    const { title, description } = meta[currentPage];
    document.title = title;
    const descTag = document.querySelector('meta[name="description"]');
    if (descTag) descTag.setAttribute('content', description);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);
    const twTitle = document.querySelector('meta[name="twitter:title"]');
    if (twTitle) twTitle.setAttribute('content', title);
    const twDesc = document.querySelector('meta[name="twitter:description"]');
    if (twDesc) twDesc.setAttribute('content', description);
  }, [currentPage]);

  const navigate = (page: Page) => {
    if (page === 'blogs') setSelectedBlogPost(null);
    setCurrentPage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToService = (slug: string) => {
    setServiceSlug(slug);
    setCurrentPage('services');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <HorizontalNav currentPage={currentPage} navigate={navigate} navigateToService={navigateToService} mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} darkMode={darkMode} setDarkMode={setDarkMode} />
      <main>
        {currentPage === 'home' && <HomePage navigate={navigate} navigateToService={navigateToService} />}
        {currentPage === 'about' && <AboutPage navigate={navigate} navigateToService={navigateToService} />}
        {currentPage === 'services' && <ServicesPage navigate={navigate} serviceSlug={serviceSlug} navigateToService={navigateToService} />}
        {currentPage === 'blogs' && <BlogsPage navigate={navigate} navigateToService={navigateToService} selectedPost={selectedBlogPost} setSelectedPost={setSelectedBlogPost} />}
        {currentPage === 'careers' && <CareersPage navigate={navigate} navigateToService={navigateToService} />}
        {currentPage === 'contact' && <ContactPage navigate={navigate} navigateToService={navigateToService} />}
      </main>
    </div>
  );
}

function HorizontalNav({ currentPage, navigate, navigateToService, mobileMenuOpen, setMobileMenuOpen, darkMode, setDarkMode }: {
  currentPage: Page;
  navigate: (page: Page) => void;
  navigateToService: (slug: string) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const transparent = false;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-background/95 backdrop-blur-xl border-b border-border shadow-lg">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.button
            onClick={() => navigate('home')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <img
              src="/images/services/Image.png"
              alt="WiseSource IT Services"
              className="h-32 w-auto object-contain transition-all"
            />
          </motion.button>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {/* About */}
            <motion.button
              onClick={() => navigate('about')}
              className={`text-sm font-medium transition-colors capitalize relative group ${transparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
              whileHover={{ y: -2 }}
            >
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.button>

            {/* Services dropdown */}
            <div className="relative" onMouseEnter={() => setServicesOpen(true)} onMouseLeave={() => setServicesOpen(false)}>
              <motion.button
                onClick={() => setServicesOpen(!servicesOpen)}
                className={`text-sm font-medium transition-colors flex items-center gap-1 relative group ${transparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'} ${currentPage === 'services' ? (transparent ? 'text-white' : 'text-foreground') : ''}`}
                whileHover={{ y: -2 }}
              >
                Services
                <motion.div animate={{ rotate: servicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.div>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </motion.button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 bg-card border border-border rounded-xl shadow-xl overflow-hidden"
                  >
                    {SERVICE_NAV_ITEMS.map((item) => (
                      <button
                        key={item.slug}
                        onClick={() => { navigateToService(item.slug); setServicesOpen(false); }}
                        className="w-full text-left px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-colors border-b border-border/40 last:border-0"
                      >
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Blogs */}
            <motion.button
              onClick={() => navigate('blogs')}
              className={`text-sm font-medium transition-colors relative group ${transparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
              whileHover={{ y: -2 }}
            >
              Blogs
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.button>

            {/* Careers */}
            <motion.button
              onClick={() => navigate('careers')}
              className={`text-sm font-medium transition-colors relative group ${transparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
              whileHover={{ y: -2 }}
            >
              Careers
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.button>

            {/* Contact */}
            <motion.button
              onClick={() => navigate('contact')}
              className={`text-sm font-medium transition-colors relative group ${transparent ? 'text-white/80 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
              whileHover={{ y: -2 }}
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
            </motion.button>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-lg border transition-all ${transparent ? 'border-white/30 text-white hover:border-white' : 'border-border bg-card hover:border-primary'}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
            <motion.button
              onClick={() => navigate('contact')}
              className="px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Get a Quote</span>
              <motion.div className="absolute inset-0 bg-accent" initial={{ x: '-100%' }} whileHover={{ x: 0 }} transition={{ duration: 0.3 }} />
            </motion.button>
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className={`lg:hidden ${transparent ? 'text-white' : ''}`}>
            <motion.div whileTap={{ scale: 0.9 }}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-card border-t border-border shadow-xl"
        >
          <div className="px-6 py-4 space-y-1">
            <motion.button onClick={() => navigate('about')} className="block w-full text-left py-2.5 text-sm font-medium hover:text-primary transition-colors" whileHover={{ x: 5 }}>About</motion.button>

            {/* Mobile Services accordion */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className="flex items-center justify-between w-full py-2.5 text-sm font-medium hover:text-primary transition-colors"
              >
                Services
                <motion.div animate={{ rotate: mobileServicesOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={14} />
                </motion.div>
              </button>
              {mobileServicesOpen && (
                <div className="pl-4 pb-2 space-y-1 border-l-2 border-primary/30 ml-2">
                  {SERVICE_NAV_ITEMS.map((item) => (
                    <button
                      key={item.slug}
                      onClick={() => navigateToService(item.slug)}
                      className="block w-full text-left py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <motion.button onClick={() => navigate('blogs')} className="block w-full text-left py-2.5 text-sm font-medium hover:text-primary transition-colors" whileHover={{ x: 5 }}>Blogs</motion.button>
            <motion.button onClick={() => navigate('careers')} className="block w-full text-left py-2.5 text-sm font-medium hover:text-primary transition-colors" whileHover={{ x: 5 }}>Careers</motion.button>
            <motion.button onClick={() => navigate('contact')} className="block w-full text-left py-2.5 text-sm font-medium hover:text-primary transition-colors" whileHover={{ x: 5 }}>Contact</motion.button>
            <button onClick={() => navigate('contact')} className="w-full px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold mt-4">
              Get a Quote
            </button>
          </div>
        </motion.div>
      )}
    </nav>
  );
}

function VerticalSidebar({ currentPage, navigate, darkMode, setDarkMode }: {
  currentPage: Page;
  navigate: (page: Page) => void;
  darkMode: boolean;
  setDarkMode: (v: boolean) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden fixed top-6 left-6 z-50 p-2 bg-card rounded-lg border border-border shadow-lg">
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-screen w-64 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="p-8">
          <button onClick={() => navigate('home')} className="text-2xl font-bold text-sidebar-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            Wise<span className="text-sidebar-primary">Source</span>
          </button>
        </div>

        <nav className="px-4 space-y-2">
          {[
            { page: 'home' as Page, label: 'Home' },
            { page: 'about' as Page, label: 'About' },
            { page: 'services' as Page, label: 'Services' },
            { page: 'industries' as Page, label: 'Industries' },
            { page: 'careers' as Page, label: 'Careers' },
            { page: 'contact' as Page, label: 'Contact' }
          ].map(({ page, label }) => (
            <motion.button
              key={page}
              onClick={() => { navigate(page); setMobileOpen(false); }}
              className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                currentPage === page
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-semibold'
                  : 'text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`}
              whileHover={{ x: currentPage === page ? 0 : 5 }}
            >
              {label}
            </motion.button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-4 right-4 space-y-3">
          <motion.button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full px-4 py-2.5 border border-sidebar-border rounded-lg text-sidebar-foreground/70 hover:text-sidebar-foreground hover:border-sidebar-primary transition-all flex items-center justify-center gap-2 text-sm"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </motion.button>
          <motion.button
            className="w-full px-6 py-3 bg-sidebar-primary text-sidebar-primary-foreground rounded-lg font-semibold hover:bg-sidebar-primary/90 transition-all"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Get a Quote
          </motion.button>
        </div>
      </aside>
    </>
  );
}

function VisionMission() {
  const items = [
    {
      icon: <Server size={32} />,
      title: 'Enterprise IT Solutions Delivered',
      description: 'Architected and deployed enterprise-grade software solutions across finance, healthcare, and logistics sectors globally.',
    },
    {
      icon: <Cloud size={32} />,
      title: 'End-to-End Digital Transformation',
      description: 'Helping organizations modernize legacy systems, migrate to the cloud, and build scalable digital infrastructure.',
    },
    {
      icon: <Globe size={32} />,
      title: 'Global Technology Partnerships',
      description: 'Strategic alliances with leading technology providers powering innovation and growth across 20+ countries.',
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: 'radial-gradient(ellipse at top left, #bfdbfe 0%, transparent 55%), radial-gradient(ellipse at bottom right, #bfdbfe 0%, transparent 55%), var(--background)' }}>
      <div className="max-w-6xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Our Vision and Our Mission
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-lg text-muted-foreground mb-16 max-w-2xl mx-auto"
        >
          We partner with forward-thinking enterprises to architect, build, and scale technology solutions that create lasting competitive advantage.
        </motion.p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -4 }}
              className="relative flex flex-col items-center p-8 rounded-2xl border border-transparent hover:border-blue-100 transition-all duration-300 group overflow-hidden cursor-default"
            >
              {/* Hover background — solid white card to contrast the section's blue gradient */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none shadow-xl" style={{ background: 'var(--card)', border: '1px solid #93c5fd', boxShadow: '0 8px 32px rgba(59,130,246,0.15)' }} />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomePage({ navigate, navigateToService }: { navigate: (page: Page) => void; navigateToService: (slug: string) => void }) {
  return (
    <div>
      <HeroSection navigate={navigate} />
      <VisionMission />
      <ServicesSection navigate={navigate} />
      <WhyChooseUs />
      <IndustriesSection />
      <ConnectWithUs navigate={navigate} />
      <Footer navigate={navigate} navigateToService={navigateToService} />
    </div>
  );
}

function HeroSection({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <section className="relative min-h-screen overflow-hidden">
      <img
        src="/images/services/imageing.png"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center justify-end min-h-screen px-6 pb-24 text-center"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-white"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Transforming Ideas into
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-teal-300 to-blue-300 bg-[length:200%_auto] animate-gradient">
            Digital Solutions
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl text-white/80 mb-10 max-w-3xl leading-relaxed"
        >
          We architect, build, and scale digital ecosystems that drive innovation and deliver measurable business outcomes for forward-thinking enterprises worldwide.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={() => navigate('contact')}
            className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-secondary transition-all flex items-center justify-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Request a Consultation
            <ArrowRight size={20} />
          </motion.button>
          <motion.button
            onClick={() => navigate('services')}
            className="px-8 py-4 border-2 border-white/40 text-white/80 rounded-lg font-semibold hover:border-white hover:text-white transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Services
          </motion.button>
        </motion.div>
      </motion.div>
    </section>
  );
}


function ServicesSection({ navigate }: { navigate: (page: Page) => void }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const services = [
    {
      icon: <Code className="w-14 h-14 text-primary" />,
      title: 'Software Engineering',
      description: 'Custom enterprise applications with cutting-edge frameworks and scalable architecture patterns that grow with your business needs.',
      features: ['Custom Web & Mobile Apps', 'API Design & Integration', 'Legacy System Modernization', 'Microservices Architecture', 'Performance Optimization', 'DevSecOps Pipelines'],
      stat: '500+ enterprise apps built',
      image: '/images/services/software_engineering.jpg',
      fallback: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&h=700&fit=crop'
    },
    {
      icon: <Cloud className="w-14 h-14 text-accent" />,
      title: 'Cloud Solutions',
      description: 'AWS, Azure, and GCP infrastructure design, migration, and continuous optimization for performance and cost efficiency at any scale.',
      features: ['Multi-Cloud Migration', 'Kubernetes Orchestration', 'Serverless Architecture', 'FinOps & Cost Optimization', 'Cloud-Native Development', 'Disaster Recovery'],
      stat: '99.99% uptime achieved',
      image: '/images/services/cloud_solutions.jpg',
      fallback: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=700&fit=crop'
    },
    {
      icon: <GitBranch className="w-14 h-14 text-chart-2" />,
      title: 'Data Engineering',
      description: 'Build robust, scalable data pipelines and infrastructure that power real-time analytics, ETL workflows, and enterprise data platforms.',
      features: ['ETL/ELT Pipelines', 'Data Lake & Warehouse', 'Real-time Streaming', 'Apache Spark & Kafka', 'Data Quality & Governance', 'Lakehouse Architecture'],
      stat: '10x faster data processing',
      image: '/images/services/data_engineering.jpg',
      fallback: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&h=700&fit=crop'
    },
    {
      icon: <Database className="w-14 h-14 text-chart-4" />,
      title: 'Data Analytics',
      description: 'Turn raw data into strategic insights with ML pipelines, real-time dashboards, and predictive analytics at enterprise scale.',
      features: ['Data Warehousing', 'ML Pipelines', 'Real-time Dashboards', 'Predictive Analytics', 'Data Governance', 'Business Intelligence'],
      stat: '10x faster time-to-insight',
      image: '/images/services/Data_analytics.jpg',
      fallback: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=700&fit=crop'
    },
    {
      icon: <TrendingUp className="w-14 h-14 text-chart-5" />,
      title: 'Digital Transformation',
      description: 'End-to-end modernization programs aligning technology investments with business outcomes and long-term strategic goals.',
      features: ['Strategy & Roadmapping', 'Process Automation', 'Change Management', 'Technology Selection', 'Digital Experience Design', 'RPA & Automation'],
      stat: '80% efficiency gains avg.',
      image: '/images/services/digital_transformation.jpg',
      fallback: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&h=700&fit=crop'
    },
    {
      icon: <Users className="w-14 h-14 text-primary" />,
      title: 'IT Consulting',
      description: 'Strategic guidance from industry veterans helping you navigate complex technology decisions and vendor landscapes with confidence.',
      features: ['Architecture Review', 'Vendor Evaluation', 'Project Governance', 'Training & Enablement', 'Digital Transformation Roadmaps', 'Risk Management'],
      stat: '200+ CTO advisory engagements',
      image: '/images/services/IT_solutions.jpg',
      fallback: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=700&fit=crop'
    }
  ];

  return (
    <section ref={ref} className="pt-8 pb-16 px-6 bg-card">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Our Core Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Comprehensive technology solutions designed to elevate your enterprise
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-0 lg:items-stretch">
          {/* Col 1: service name list */}
          <div className="lg:w-64 flex-shrink-0 relative">
            <div className="hidden lg:block absolute right-0 top-0 bottom-0 w-px bg-border" />
            {services.map((service, i) => (
              <motion.button
                key={i}
                onMouseEnter={() => setActiveIndex(i)}
                onClick={() => setActiveIndex(i)}
                className={`relative w-full text-left px-0 lg:pr-8 py-4 flex items-center gap-3 transition-all border-b border-border/50 last:border-0 ${activeIndex === i ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                initial={{ opacity: 0, x: -20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: i * 0.08 }}
              >
                {activeIndex === i && (
                  <motion.div layoutId="serviceBarIndicator" className="hidden lg:block absolute right-0 top-0 bottom-0 w-0.5 bg-primary" />
                )}
                <motion.div
                  className={`w-2 h-2 rounded-full flex-shrink-0 transition-all ${activeIndex === i ? 'bg-primary scale-125' : 'bg-border'}`}
                />
                <span className={`font-semibold transition-all ${activeIndex === i ? 'text-base' : 'text-sm'}`}>{service.title}</span>
              </motion.button>
            ))}
          </div>

          {/* Col 2: animated content */}
          <div className="flex-1 lg:px-12 pt-8 lg:pt-0 min-h-80">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div className="mb-6" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                  {services[activeIndex].icon}
                </motion.div>
                <h3 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  {services[activeIndex].title}
                </h3>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  {services[activeIndex].description}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {services[activeIndex].features.map((f, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                    >
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm font-medium">{f}</span>
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-sm font-semibold text-primary">{services[activeIndex].stat}</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Col 3: animated service image */}
          <div className="hidden lg:block lg:w-[400px] flex-shrink-0 pl-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex + '-img'}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl overflow-hidden shadow-xl"
                style={{ width: '100%', height: '380px' }}
              >
                <img
                  src={services[activeIndex].image}
                  alt={services[activeIndex].title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={(e) => { (e.target as HTMLImageElement).src = services[activeIndex].fallback; }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-6"
        >
          <motion.button
            onClick={() => navigate('services')}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View All Services
            <ArrowRight size={20} />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

function WhyChooseUs() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const features = [
    { icon: <Award className="w-8 h-8" />, title: 'Industry Expertise', desc: 'Deep domain knowledge across sectors' },
    { icon: <Users className="w-8 h-8" />, title: 'Top Talent', desc: 'Handpicked experts across every technology' },
    { icon: <Zap className="w-8 h-8" />, title: 'Rapid Delivery', desc: 'Agile methodologies' },
    { icon: <Shield className="w-8 h-8" />, title: 'Security First', desc: 'Enterprise-grade protection' }
  ];

  return (
    <section ref={ref} className="relative py-16 px-6 bg-background overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&h=900&fit=crop"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.30 }}
      />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Why Choose WiseSource
          </h2>
          <p className="text-lg text-muted-foreground">
            Trusted by industry leaders worldwide
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary transition-all group"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-lg font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustriesSection() {
  const industries = [
    {
      name: 'Financial Services',
      description: 'Delivering secure, scalable fintech platforms and compliance-ready digital banking solutions.',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600&h=400&fit=crop',
    },
    {
      name: 'Healthcare & Life Sciences',
      description: 'Building HIPAA-compliant clinical systems, patient portals, and medical data pipelines.',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=600&h=400&fit=crop',
    },
    {
      name: 'Retail & E-commerce',
      description: 'Engineering high-performance storefronts, inventory systems, and personalization engines.',
      image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop',
    },
    {
      name: 'Logistics & Supply Chain',
      description: 'Modernizing operations with real-time tracking, route optimization, and supply chain automation.',
      image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
    },
  ];

  return (
    <section className="py-24 px-6" style={{ background: 'radial-gradient(ellipse at top left, #bfdbfe 0%, transparent 55%), radial-gradient(ellipse at bottom right, #bfdbfe 0%, transparent 55%), var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold mb-16 text-center uppercase tracking-widest"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Industries We Serve
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="border border-border rounded-2xl overflow-hidden bg-card hover:shadow-lg transition-shadow"
              whileHover={{ y: -4 }}
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={industry.image}
                  alt={industry.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {industry.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{industry.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GlobalPresence() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const locations = [
    {
      country: 'USA',
      address: '1712 Pioneer Ave, STE 7000, Cheyenne, WY 82001',
      image: '/images/services/Houston_skyline.jpg',
      landmark: 'Houston Skyline'
    }
  ];

  return (
    <section className="pt-10 pb-24 px-6 bg-background">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Global Presence
          </h2>
          <p className="text-lg text-muted-foreground">
            Headquartered in the United States, serving clients nationwide
          </p>
        </motion.div>

        <div className="flex justify-center">
          {locations.map((location, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:border-primary transition-all shadow-lg w-full max-w-sm"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              whileHover={{ y: -8 }}
            >
              <div className="relative h-48 overflow-hidden">
                <motion.img
                  src={location.image}
                  alt={location.landmark}
                  className="w-full h-full object-cover"
                  animate={{
                    scale: hoveredCard === index ? 0.85 : 1,
                    filter: hoveredCard === index ? 'brightness(0.7)' : 'brightness(1)'
                  }}
                  transition={{ duration: 0.4 }}
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredCard === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute bottom-4 left-4 text-white font-semibold text-sm"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: hoveredCard === index ? 0 : 20, opacity: hoveredCard === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {location.landmark}
                </motion.div>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                    {location.country}
                  </h3>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {location.address}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ConnectWithUs({ navigate }: { navigate?: (page: Page) => void }) {
  return (
    <section className="py-16 px-6 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
            Let's Build Something Amazing Together
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Ready to transform your business? Our experts are here to help.
          </p>

          {navigate && (
            <motion.button
              onClick={() => navigate('contact')}
              className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Contact Us</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div
                className="absolute inset-0 bg-accent"
                initial={{ x: '-100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          )}
        </motion.div>
      </div>
    </section>
  );
}

function Footer({ navigate, navigateToService }: { navigate: (page: Page) => void; navigateToService: (slug: string) => void }) {
  return (
    <footer className="bg-secondary text-secondary-foreground py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Wise<span className="text-primary">Source</span>
          </h3>
          <p className="text-secondary-foreground/70 mb-4">
            Empowering businesses through intelligent technology solutions.
          </p>
          <div className="flex gap-3">
            {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                className="p-2 bg-secondary-foreground/10 rounded-lg hover:bg-primary transition-colors"
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Company</h4>
          <div className="space-y-2">
            {[{ page: 'about', label: 'About' }, { page: 'blogs', label: 'Blogs' }, { page: 'careers', label: 'Careers' }, { page: 'contact', label: 'Contact' }].map(({ page, label }) => (
              <button
                key={page}
                onClick={() => navigate(page as Page)}
                className="block text-secondary-foreground/70 hover:text-secondary-foreground transition-colors"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Services</h4>
          <div className="space-y-2">
            {SERVICE_NAV_ITEMS.map(({ slug, label }) => (
              <button
                key={slug}
                onClick={() => navigateToService(slug)}
                className="block text-secondary-foreground/70 hover:text-secondary-foreground transition-colors text-left"
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Contact</h4>
          <div className="space-y-3">
            <a href="mailto:contact@wisesource.com" className="flex items-start gap-2 text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>contact@wisesource.com</span>
            </a>
            <a href="tel:+18329377277" className="flex items-start gap-2 text-secondary-foreground/70 hover:text-secondary-foreground transition-colors">
              <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <span>+1 832 937 7277</span>
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-secondary-foreground/10 text-center text-secondary-foreground/70">
        <p>&copy; 2026 WiseSource. All rights reserved.</p>
      </div>
    </footer>
  );
}

function AboutPage({ navigate, navigateToService }: { navigate: (page: Page) => void; navigateToService: (slug: string) => void }) {
  return (
    <div>
      <AboutHero />
      <ProcessTimeline />
      <CoreValuesCircular />
      <TeamExcellence />
      <ConnectWithUs navigate={navigate} />
      <Footer navigate={navigate} navigateToService={navigateToService} />
    </div>
  );
}

const HERO_STATES = [
  {
    tag: 'Who We Are',
    headline: 'Built by\nEngineers,\nFor Enterprises',
    sub: 'A collective of elite architects, engineers, and strategists who have delivered digital infrastructure for Fortune 500 companies worldwide.',
    accent: 'from-primary/20 via-accent/10 to-background',
    highlight: 'text-primary'
  },
  {
    tag: 'Our Mission',
    headline: 'Technology\nThat Moves\nBusiness Forward',
    sub: 'We don\'t just write code — we solve problems, unlock growth, and future-proof organizations through purposeful digital transformation.',
    accent: 'from-accent/20 via-primary/10 to-background',
    highlight: 'text-accent'
  },
  {
    tag: 'Our Culture',
    headline: 'Curiosity.\nCraft.\nCommitment.',
    sub: 'Every engagement is driven by relentless curiosity, obsessive attention to craft, and unwavering commitment to delivering measurable outcomes.',
    accent: 'from-chart-2/20 via-primary/10 to-background',
    highlight: 'text-chart-2'
  },
  {
    tag: 'Our Impact',
    headline: 'Global Reach.\nLocal Expertise.\nReal Results.',
    sub: 'We bring both global perspective and deep local knowledge to every engagement, partnering with clients across industries to drive meaningful impact.',
    accent: 'from-chart-5/20 via-accent/10 to-background',
    highlight: 'text-chart-5'
  }
];

function AboutHero() {
  const [stateIdx, setStateIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStateIdx((prev) => (prev + 1) % HERO_STATES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const state = HERO_STATES[stateIdx];

  return (
    <section className="min-h-[80vh] flex flex-col px-6 pt-52 pb-24 relative overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&h=900&fit=crop"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.5 }}
      />

      <div className="relative z-10 max-w-5xl mx-auto text-center flex-1 flex flex-col justify-center pb-12 w-full">
        <motion.div
          key={stateIdx + '-tag'}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-6"
        >
          <span className={`px-4 py-1.5 rounded-full text-xs font-semibold border border-border bg-card/80 backdrop-blur-sm ${state.highlight}`}>
            {state.tag}
          </span>
        </motion.div>

        <div className="overflow-hidden">
          <motion.h1
            key={stateIdx + '-h'}
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -60 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="text-6xl md:text-8xl font-bold mb-8 leading-[1.05] whitespace-pre-line"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {state.headline}
          </motion.h1>
        </div>

        <motion.p
          key={stateIdx + '-p'}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
        >
          {state.sub}
        </motion.p>
      </div>
    </section>
  );
}

function TravelingDot({ activeStep }: { activeStep: number }) {
  const positions = ['4%', '29%', '58%', 'calc(100% - 24px)'];
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary border-4 border-background shadow-lg z-10"
      animate={{ top: positions[activeStep] }}
      transition={{ type: 'spring', stiffness: 120, damping: 18 }}
    />
  );
}

function ProcessTimeline() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: 'Discovery',
      description: 'Deep-dive workshops to understand your business context, technical constraints, and strategic objectives.',
      details: ['Stakeholder interviews & requirement mapping', 'Technical audit of existing systems', 'Competitive landscape & risk analysis'],
      metric: { value: '2–3 weeks', label: 'Typical Duration' },
    },
    {
      title: 'Architecture',
      description: 'Design scalable systems with proven patterns, selecting the optimal tech stack for your requirements.',
      details: ['System design & infrastructure blueprinting', 'Tech stack evaluation & selection', 'Security model & compliance planning'],
      metric: { value: '99.9%', label: 'Uptime Target' },
    },
    {
      title: 'Development',
      description: 'Agile sprints with continuous integration, automated testing, and regular stakeholder reviews.',
      details: ['2-week sprint cycles with daily standups', 'Automated CI/CD pipeline from day one', 'Code reviews, QA & regression testing'],
      metric: { value: '80%+', label: 'Test Coverage' },
    },
    {
      title: 'Deployment',
      description: 'Zero-downtime releases with comprehensive monitoring, rollback strategies, and post-launch support.',
      details: ['Blue-green & canary release strategies', 'Full observability stack (metrics, logs, traces)', '30-day hypercare & dedicated support'],
      metric: { value: '< 1 hr', label: 'Mean Time to Deploy' },
    },
  ];

  return (
    <section className="py-24 px-6 relative" style={{ background: 'radial-gradient(ellipse at top left, #bfdbfe 0%, transparent 55%), radial-gradient(ellipse at bottom right, #bfdbfe 0%, transparent 55%), var(--background)' }}>
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-20"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Our Process
        </motion.h2>

        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-border hidden lg:block" style={{ transform: 'translateX(-50%)' }}>
            <TravelingDot activeStep={activeStep} />
          </div>

          {steps.map((step, index) => (
            <TimelineStep key={index} step={step} index={index} onActive={() => setActiveStep(prev => Math.max(prev, index))} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TimelineStep({ step, index, onActive }: { step: { title: string; description: string; details: string[]; metric: { value: string; label: string } }; index: number; onActive: () => void }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const isCentered = useInView(ref, { margin: '-35% 0px -35% 0px' });
  const isLeft = index % 2 === 0;

  useEffect(() => {
    if (isCentered) onActive();
  }, [isCentered]);

  return (
    <div ref={ref} className="relative mb-8 lg:mb-10">
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`lg:w-1/2 ${isLeft ? 'lg:pr-12 lg:text-right' : 'lg:pl-12 lg:ml-auto'}`}
      >
        <div className="p-8 bg-card border border-border rounded-xl hover:border-primary transition-all group relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"
            initial={{ scale: 0 }}
            whileHover={{ scale: 1 }}
          />
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 items-center">
            {/* Left: number + title + description */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <motion.div
                  className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground font-bold text-sm flex-shrink-0"
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  {index + 1}
                </motion.div>
                <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  {step.title}
                </h3>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
            {/* Right: bullet points + metric */}
            <div className="text-left">
              <ul className="space-y-2 mb-4">
                {step.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    {d}
                  </li>
                ))}
              </ul>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-sm font-bold text-primary">{step.metric.value}</span>
                <span className="text-xs text-muted-foreground">{step.metric.label}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

    </div>
  );
}

const SEGMENTS = [
  {
    label: 'Consulting',
    desc: 'Strategic advisory and roadmapping',
    color: '#0d9488',
    textColor: 'text-white',
    bgClass: 'bg-[#0d9488]',
    // top quarter: 270° → 0° (M 250,250 L 250,70 A 180 0 1 430,250 Z)
    path: 'M 250 250 L 250 30 A 220 220 0 0 1 470 250 Z',
    labelPos: { x: 345, y: 155 },
    badgePos: 'top-[8%] left-1/2 -translate-x-1/2'
  },
  {
    label: 'Implementation',
    desc: 'Engineering & delivery excellence',
    color: '#c026d3',
    textColor: 'text-white',
    bgClass: 'bg-[#c026d3]',
    // right quarter: 0° → 90°
    path: 'M 250 250 L 470 250 A 220 220 0 0 1 250 470 Z',
    labelPos: { x: 345, y: 362 },
    badgePos: 'top-1/2 right-[4%] -translate-y-1/2'
  },
  {
    label: 'Lifecycle',
    desc: 'Ongoing support & iteration',
    color: '#1d4ed8',
    textColor: 'text-white',
    bgClass: 'bg-[#1d4ed8]',
    // bottom quarter: 90° → 180°
    path: 'M 250 250 L 250 470 A 220 220 0 0 1 30 250 Z',
    labelPos: { x: 155, y: 362 },
    badgePos: 'bottom-[8%] left-1/2 -translate-x-1/2'
  },
  {
    label: 'Optimization',
    desc: 'Performance & continuous improvement',
    color: '#fbbf24',
    textColor: 'text-foreground',
    bgClass: 'bg-[#fbbf24]',
    // left quarter: 180° → 270°
    path: 'M 250 250 L 30 250 A 220 220 0 0 1 250 30 Z',
    labelPos: { x: 155, y: 155 },
    badgePos: 'top-1/2 left-[4%] -translate-y-1/2'
  }
];

function CoreValuesCircular() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-24 px-6 bg-background">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          className="text-4xl md:text-5xl font-bold mb-4 text-center"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Our Service Lifecycle
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.3 }}
          className="text-center text-muted-foreground mb-16 text-lg"
        >
          Digital services embedded throughout — AI-driven, predictive, data-informed
        </motion.p>

        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Circular diagram */}
          <motion.div
            className="relative w-full max-w-[540px] aspect-square flex-shrink-0"
            initial={{ opacity: 0, scale: 0.7, rotate: -30 }}
            animate={isInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <svg viewBox="0 0 500 500" className="w-full h-full drop-shadow-2xl">
              <defs>
                <filter id="segGlow">
                  <feGaussianBlur stdDeviation="4" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              {/* Outer dashed orbit */}
              <circle cx="250" cy="250" r="240" fill="none" stroke="rgba(124,58,237,0.12)" strokeWidth="1.5" strokeDasharray="6 4" />

              {/* Segments */}
              {SEGMENTS.map((seg, i) => (
                <motion.path
                  key={i}
                  d={seg.path}
                  fill={seg.color}
                  opacity={hovered === null ? 1 : hovered === i ? 1 : 0.55}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.15, ease: 'backOut' }}
                  style={{ transformOrigin: '250px 250px', cursor: 'pointer' }}
                  whileHover={{ scale: 1.05, transition: { duration: 0.12 } }}
                />
              ))}

              {/* Segment labels inside */}
              {SEGMENTS.map((seg, i) => {
                const labelColor = seg.color === '#fbbf24' ? '#0f172a' : 'white';
                return (
                  <motion.text
                    key={i + '-label'}
                    x={seg.labelPos.x}
                    y={seg.labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={labelColor}
                    fontSize="17"
                    fontWeight="700"
                    fontFamily="var(--font-display)"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.9 + i * 0.15 }}
                    style={{ pointerEvents: 'none' }}
                  >
                    {seg.label}
                  </motion.text>
                );
              })}

              {/* Gap lines */}
              {[0, 90, 180, 270].map((angle) => {
                const rad = (angle - 90) * Math.PI / 180;
                const x = 250 + 220 * Math.cos(rad);
                const y = 250 + 220 * Math.sin(rad);
                return (
                  <line key={angle} x1="250" y1="250" x2={x} y2={y}
                    stroke="var(--background)" strokeWidth="3" />
                );
              })}

              {/* Center circle */}
              <circle cx="250" cy="250" r="88" fill="var(--card)" />
              <circle cx="250" cy="250" r="84" fill="none" stroke="var(--border)" strokeWidth="1.5" />
              <text x="250" y="242" textAnchor="middle" fill="var(--foreground)" fontSize="20" fontWeight="800" fontFamily="var(--font-display)">
                Wise
              </text>
              <text x="250" y="264" textAnchor="middle" fill="var(--foreground)" fontSize="20" fontWeight="800" fontFamily="var(--font-display)">
                Source
              </text>
            </svg>
          </motion.div>

          {/* Legend cards */}
          <div className="flex flex-col gap-5 flex-1 self-stretch">
            {SEGMENTS.map((seg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.5 + i * 0.15 }}
                className={`flex-1 p-5 rounded-xl border-2 transition-all cursor-default flex flex-col justify-center ${hovered === i ? 'border-current shadow-lg scale-[1.02]' : 'border-border'}`}
                style={{ borderColor: hovered === i ? seg.color : undefined }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
                  <h3 className="font-bold text-lg" style={{ fontFamily: 'var(--font-display)', color: seg.color }}>
                    {seg.label}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">{seg.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeamExcellence() {
  return (
    <section className="py-24 px-6 bg-secondary">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-center mb-16 text-secondary-foreground"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Team Excellence
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { num: 'Senior', label: 'Engineering Talent' },
            { num: 'Cloud', label: 'Native Architects' },
            { num: 'Client', label: 'Focused Delivery' },
            { num: 'Deep', label: 'Domain Expertise' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center p-8 bg-card border border-border rounded-xl hover:border-primary transition-all"
              whileHover={{ y: -5 }}
            >
              <motion.div
                className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-2"
                style={{ fontFamily: 'var(--font-display)' }}
                whileHover={{ scale: 1.1 }}
              >
                {stat.num}
              </motion.div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

type ServiceData = {
  slug: string; title: string; badge: string; tagline: string; description: string;
  heroImage: string; extraImages: string[];
  benefits: string[];
  tools: { name: string; logo: string | null }[];
  process: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
};

const SERVICE_DATA: Record<string, ServiceData> = {
  'software-engineering': {
    slug: 'software-engineering', title: 'Corporate Software Engineering', badge: 'Build & Scale',
    tagline: 'Precision-Engineered Software for the Enterprise',
    description: 'We architect and build enterprise-grade applications that stand the test of time — leveraging modern frameworks, microservices, and automated delivery pipelines to ship faster and more reliably.',
    heroImage: '/images/services/software_engineering.jpg',
    extraImages: ['/images/services/IT_solutions.jpg', '/images/services/digital_transformation.jpg'],
    benefits: ['Custom Web & Mobile Apps', 'API Design & Integration', 'Legacy System Modernization', 'Microservices Architecture', 'Performance Optimization', 'DevSecOps Pipelines'],
    tools: [
      { name: 'React', logo: 'https://cdn.simpleicons.org/react/ffffff' },
      { name: 'Node.js', logo: 'https://cdn.simpleicons.org/nodedotjs/ffffff' },
      { name: 'Python', logo: 'https://cdn.simpleicons.org/python/ffffff' },
      { name: 'TypeScript', logo: 'https://cdn.simpleicons.org/typescript/ffffff' },
      { name: 'Java', logo: 'https://cdn.simpleicons.org/openjdk/ffffff' },
      { name: 'Go', logo: 'https://cdn.simpleicons.org/go/ffffff' },
      { name: 'Docker', logo: 'https://cdn.simpleicons.org/docker/ffffff' },
      { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/ffffff' },
    ],
    process: [
      { title: 'Discovery', desc: 'Deep-dive workshops to understand business goals, user needs, and technical constraints.' },
      { title: 'Architecture', desc: 'Design scalable system architecture with the right tech stack for your requirements.' },
      { title: 'Development', desc: 'Agile sprints with CI/CD, code reviews, automated testing, and regular stakeholder demos.' },
      { title: 'Deployment', desc: 'Zero-downtime releases with full monitoring, rollbacks, and post-launch support.' },
    ],
    faqs: [
      { q: 'What technologies do you specialize in?', a: 'We specialize in React, Node.js, Python, Java, Go, TypeScript, and the full cloud-native ecosystem. We select the right stack based on your requirements.' },
      { q: 'How do you handle legacy system modernization?', a: 'We use a phased strangler-fig approach — gradually replacing legacy components while keeping systems operational, minimizing business risk.' },
      { q: 'What is your typical project timeline?', a: 'MVP delivery typically ranges from 8–16 weeks. Enterprise platforms are delivered in phased releases over 3–6 months with continuous value each sprint.' },
      { q: 'Do you provide ongoing maintenance and support?', a: 'Yes. We offer flexible retainer and SLA-based support packages covering bug fixes, monitoring, security patches, and feature enhancements.' },
      { q: 'How do you ensure code quality?', a: 'We enforce automated testing (unit, integration, E2E), coverage thresholds, peer reviews, static analysis, and security scanning in every CI/CD pipeline.' },
    ],
  },
  'cloud-architecture': {
    slug: 'cloud-architecture', title: 'Cloud Architecture', badge: 'Cloud & Infrastructure',
    tagline: 'Resilient Cloud Infrastructure at Any Scale',
    description: 'We design, migrate, and optimize cloud infrastructure across AWS, Azure, and GCP — delivering high-availability architectures that are cost-efficient, secure, and built for enterprise scale.',
    heroImage: '/images/services/cloud_solutions.jpg',
    extraImages: ['/images/services/software_engineering.jpg', '/images/services/data_engineering.jpg'],
    benefits: ['Multi-Cloud Migration', 'Kubernetes Orchestration', 'Serverless Architecture', 'FinOps & Cost Optimization', 'Cloud-Native Development', 'Disaster Recovery'],
    tools: [
      { name: 'Cloudflare', logo: 'https://cdn.simpleicons.org/cloudflare/ffffff' },
      { name: 'Azure', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
      { name: 'GCP', logo: 'https://cdn.simpleicons.org/googlecloud/ffffff' },
      { name: 'K8s', logo: 'https://cdn.simpleicons.org/kubernetes/ffffff' },
      { name: 'Terraform', logo: 'https://cdn.simpleicons.org/terraform/ffffff' },
      { name: 'Docker', logo: 'https://cdn.simpleicons.org/docker/ffffff' },
      { name: 'Helm', logo: 'https://cdn.simpleicons.org/helm/ffffff' },
      { name: 'Pulumi', logo: 'https://cdn.simpleicons.org/pulumi/ffffff' },
    ],
    process: [
      { title: 'Assessment', desc: 'Audit current infrastructure, identify migration blockers, and build a phased cloud readiness plan.' },
      { title: 'Architecture Design', desc: 'Define target architecture with VPCs, IAM, networking, and multi-region resilience patterns.' },
      { title: 'Migration', desc: 'Execute phased migration using lift-and-shift, re-platforming, or re-architecting per workload.' },
      { title: 'Optimization', desc: 'Continuous cost monitoring, rightsizing, reserved instances, and performance tuning post-migration.' },
    ],
    faqs: [
      { q: 'Which cloud providers do you work with?', a: 'We are certified partners with AWS, Microsoft Azure, and Google Cloud Platform, and can design multi-cloud and hybrid-cloud environments.' },
      { q: 'How do you approach cloud cost optimization?', a: 'We implement FinOps practices: tagging, rightsizing, reserved/spot instance planning, and monthly cost reviews to continuously reduce cloud spend.' },
      { q: 'What is your approach to cloud security?', a: 'Security is built in from day one — IAM least-privilege, encryption, security groups, WAF, VPC isolation, and continuous compliance monitoring.' },
      { q: 'Can you help with a hybrid cloud setup?', a: 'Absolutely. We design hybrid architectures connecting on-premise systems to cloud via VPN, Direct Connect, or ExpressRoute with seamless workload orchestration.' },
      { q: 'What does a typical cloud migration take?', a: 'Small workloads (under 50 servers) can be migrated in 4–8 weeks. Large enterprise migrations are phased over 3–12 months depending on complexity.' },
    ],
  },
  'data-engineering': {
    slug: 'data-engineering', title: 'Data Engineering', badge: 'Data Pipelines',
    tagline: 'Scalable Data Infrastructure for Modern Enterprises',
    description: 'We build robust, high-throughput data pipelines and lakehouse architectures that make your data reliable, accessible, and analytics-ready — at any scale, in real-time or batch.',
    heroImage: '/images/services/data_engineering.jpg',
    extraImages: ['/images/services/Data_analytics.jpg', '/images/services/cloud_solutions.jpg'],
    benefits: ['ETL/ELT Pipelines', 'Data Lake & Warehouse', 'Real-time Streaming', 'Apache Spark & Kafka', 'Data Quality & Governance', 'Lakehouse Architecture'],
    tools: [
      { name: 'Spark', logo: 'https://cdn.simpleicons.org/apachespark/ffffff' },
      { name: 'Airflow', logo: 'https://cdn.simpleicons.org/apacheairflow/ffffff' },
      { name: 'Databricks', logo: 'https://cdn.simpleicons.org/databricks/ffffff' },
      { name: 'Kafka', logo: 'https://cdn.simpleicons.org/apachekafka/ffffff' },
      { name: 'Snowflake', logo: 'https://cdn.simpleicons.org/snowflake/ffffff' },
      { name: 'PostgreSQL', logo: 'https://cdn.simpleicons.org/postgresql/ffffff' },
      { name: 'MongoDB', logo: 'https://cdn.simpleicons.org/mongodb/ffffff' },
      { name: 'Python', logo: 'https://cdn.simpleicons.org/python/ffffff' },
    ],
    process: [
      { title: 'Data Audit', desc: 'Map all data sources, assess quality, volume, velocity, and identify governance gaps.' },
      { title: 'Architecture', desc: 'Design a lakehouse or warehouse architecture with ingestion, storage, and serving layers.' },
      { title: 'Pipeline Build', desc: 'Implement ETL/ELT pipelines with data validation, monitoring, and automated alerting.' },
      { title: 'Go-Live & Govern', desc: 'Deploy to production, establish data contracts, lineage tracking, and SLA monitoring.' },
    ],
    faqs: [
      { q: 'What is the difference between ETL and ELT?', a: 'ETL transforms data before loading into the warehouse. ELT loads raw data first, then transforms inside the warehouse. ELT is more scalable with modern cloud warehouses.' },
      { q: 'Can you handle real-time streaming data?', a: 'Yes. We build streaming pipelines using Apache Kafka, Spark Streaming, and cloud-native services like Kinesis for sub-second latency data processing.' },
      { q: 'How do you ensure data quality?', a: 'We implement automated data quality checks using Great Expectations, dbt tests, and custom validation rules at every pipeline stage with alerting on breaches.' },
      { q: 'What cloud data warehouses do you support?', a: 'We work with Snowflake, BigQuery, Redshift, Azure Synapse, and Databricks — and help you select and migrate to the right platform.' },
      { q: 'Do you help with data governance?', a: 'Yes. We implement data cataloging, lineage tracking, access controls, PII masking, and compliance frameworks to ensure governance at scale.' },
    ],
  },
  'data-analytics': {
    slug: 'data-analytics', title: 'Data Analytics', badge: 'Insights & BI',
    tagline: 'Turn Raw Data into Strategic Business Intelligence',
    description: 'We transform your data into actionable insights through machine learning pipelines, real-time dashboards, and predictive analytics — giving decision-makers the intelligence they need exactly when they need it.',
    heroImage: '/images/services/Data_analytics.jpg',
    extraImages: ['/images/services/data_engineering.jpg', '/images/services/IT_solutions.jpg'],
    benefits: ['Data Warehousing', 'ML Pipelines', 'Real-time Dashboards', 'Predictive Analytics', 'Data Governance', 'Business Intelligence'],
    tools: [
      { name: 'TensorFlow', logo: 'https://cdn.simpleicons.org/tensorflow/ffffff' },
      { name: 'Python', logo: 'https://cdn.simpleicons.org/python/ffffff' },
      { name: 'Looker', logo: 'https://cdn.simpleicons.org/looker/ffffff' },
      { name: 'PostgreSQL', logo: 'https://cdn.simpleicons.org/postgresql/ffffff' },
      { name: 'Spark', logo: 'https://cdn.simpleicons.org/apachespark/ffffff' },
      { name: 'Databricks', logo: 'https://cdn.simpleicons.org/databricks/ffffff' },
      { name: 'Grafana', logo: 'https://cdn.simpleicons.org/grafana/ffffff' },
      { name: 'Snowflake', logo: 'https://cdn.simpleicons.org/snowflake/ffffff' },
    ],
    process: [
      { title: 'Data Discovery', desc: 'Identify KPIs, define business questions, and audit existing data assets for analytics readiness.' },
      { title: 'Modeling', desc: 'Build semantic data models, dimensional schemas, and ML feature stores for your analytics use cases.' },
      { title: 'Visualization', desc: 'Create interactive dashboards and self-service BI tools that put insights directly in stakeholders\' hands.' },
      { title: 'Productionize', desc: 'Automate ML model retraining, deploy A/B testing, and establish KPI monitoring and alerting.' },
    ],
    faqs: [
      { q: 'What BI tools do you work with?', a: 'We work with Tableau, Power BI, Looker, Metabase, and Grafana, and build semantic layers that connect your data warehouse to business users.' },
      { q: 'Can you build predictive models for our business?', a: 'Yes. We build custom ML models for forecasting, churn prediction, recommendation engines, anomaly detection, and more.' },
      { q: 'How long does it take to build a dashboard?', a: 'Simple dashboards can be ready in 1–2 weeks. Complex, multi-source executive dashboards with automated pipelines typically take 4–8 weeks.' },
      { q: 'What is the difference between BI and ML analytics?', a: 'BI focuses on what happened and why (reporting). ML analytics focuses on what will happen and what should you do (predictive and prescriptive). We deliver both.' },
      { q: 'Do you provide self-service analytics?', a: 'Yes. We build semantic layers and governed data marts that enable business users to run their own analyses without data engineering support for every query.' },
    ],
  },
  'devops': {
    slug: 'devops', title: 'DevOps & Automation', badge: 'DevOps',
    tagline: 'Ship Faster, Break Nothing, Recover Instantly',
    description: 'We implement modern DevOps practices that compress release cycles from weeks to hours — with automated testing, CI/CD pipelines, infrastructure as code, and full observability in every deployment.',
    heroImage: '/images/services/software_engineering.jpg',
    extraImages: ['/images/services/cloud_solutions.jpg', '/images/services/IT_solutions.jpg'],
    benefits: ['CI/CD Pipelines', 'Infrastructure as Code', 'Container Orchestration', 'Monitoring & Observability', 'Security Automation', 'Incident Response'],
    tools: [
      { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/ffffff' },
      { name: 'GitLab', logo: 'https://cdn.simpleicons.org/gitlab/ffffff' },
      { name: 'Docker', logo: 'https://cdn.simpleicons.org/docker/ffffff' },
      { name: 'K8s', logo: 'https://cdn.simpleicons.org/kubernetes/ffffff' },
      { name: 'Terraform', logo: 'https://cdn.simpleicons.org/terraform/ffffff' },
      { name: 'Prometheus', logo: 'https://cdn.simpleicons.org/prometheus/ffffff' },
      { name: 'Grafana', logo: 'https://cdn.simpleicons.org/grafana/ffffff' },
      { name: 'Ansible', logo: 'https://cdn.simpleicons.org/ansible/ffffff' },
    ],
    process: [
      { title: 'Assessment', desc: 'Audit current deployment processes, identify bottlenecks, manual steps, and security gaps in the delivery pipeline.' },
      { title: 'Pipeline Design', desc: 'Design CI/CD pipeline architecture with automated testing, security scanning, and approval gates.' },
      { title: 'Implementation', desc: 'Build and deploy pipelines, IaC modules, and observability stack across all environments.' },
      { title: 'Continuous Improvement', desc: 'Monthly pipeline reviews, DORA metric tracking, and incremental automation improvements.' },
    ],
    faqs: [
      { q: 'What CI/CD tools do you use?', a: 'We work with GitHub Actions, GitLab CI, Jenkins, CircleCI, and cloud-native services like AWS CodePipeline, choosing the best fit for your existing toolchain.' },
      { q: 'How do you implement Infrastructure as Code?', a: 'We use Terraform for multi-cloud IaC, Ansible for configuration management, and Helm for Kubernetes — all version-controlled, reviewed, and tested like application code.' },
      { q: 'What monitoring tools do you deploy?', a: 'We implement Prometheus + Grafana for metrics, ELK/Loki for logs, Jaeger for tracing, and PagerDuty for alerting and on-call management.' },
      { q: 'How do you handle zero-downtime deployments?', a: 'We implement blue-green deployments, canary releases, and feature flags for safe, incremental production rollouts with instant rollback capability.' },
      { q: 'Can you improve our pipeline without disrupting development?', a: 'Yes. We improve pipelines incrementally alongside active development — adding stages, improving coverage, and automating manual steps without blocking velocity.' },
    ],
  },
  'ai-ml': {
    slug: 'ai-ml', title: 'AI & Machine Learning', badge: 'AI Innovation',
    tagline: 'Intelligent Systems That Learn, Predict, and Act',
    description: 'We integrate cutting-edge AI into your products and workflows — from large language models and computer vision to predictive analytics and intelligent automation — delivering measurable business outcomes.',
    heroImage: '/images/services/digital_transformation.jpg',
    extraImages: ['/images/services/Data_analytics.jpg', '/images/services/software_engineering.jpg'],
    benefits: ['Natural Language Processing', 'Computer Vision', 'Predictive Models', 'AI Strategy Consulting', 'LLM Integration', 'MLOps Deployment'],
    tools: [
      { name: 'TensorFlow', logo: 'https://cdn.simpleicons.org/tensorflow/ffffff' },
      { name: 'PyTorch', logo: 'https://cdn.simpleicons.org/pytorch/ffffff' },
      { name: 'Python', logo: 'https://cdn.simpleicons.org/python/ffffff' },
      { name: 'Spark', logo: 'https://cdn.simpleicons.org/apachespark/ffffff' },
      { name: 'Airflow', logo: 'https://cdn.simpleicons.org/apacheairflow/ffffff' },
      { name: 'Docker', logo: 'https://cdn.simpleicons.org/docker/ffffff' },
      { name: 'Hugging Face', logo: 'https://cdn.simpleicons.org/huggingface/ffffff' },
      { name: 'GitHub', logo: 'https://cdn.simpleicons.org/github/ffffff' },
    ],
    process: [
      { title: 'AI Readiness', desc: 'Assess data quality, infrastructure, and use cases to define the highest-value AI opportunities.' },
      { title: 'Model Development', desc: 'Build, train, and evaluate models using your data with rigorous validation and bias testing.' },
      { title: 'Integration', desc: 'Deploy models via APIs or embedded in applications with A/B testing and gradual rollout.' },
      { title: 'MLOps & Monitoring', desc: 'Implement model monitoring, automated retraining pipelines, and drift detection in production.' },
    ],
    faqs: [
      { q: 'How do you integrate LLMs into existing products?', a: 'We use API-based integration (OpenAI, Anthropic, Gemini), fine-tuning for domain-specific cases, RAG architectures for proprietary data, and build LLM-powered features with guardrails.' },
      { q: 'How much data do we need to build an AI model?', a: 'It depends on the use case. Pre-trained LLMs need minimal data. Custom computer vision or predictive models typically need thousands to hundreds of thousands of labeled samples.' },
      { q: 'How do you ensure AI models are fair and unbiased?', a: 'We implement bias detection, fairness metrics, and diverse dataset validation throughout model development, and conduct regular audits of model outputs in production.' },
      { q: 'What is MLOps and why does it matter?', a: 'MLOps automates ML model lifecycle management — training, deployment, monitoring, and retraining. Without it, models degrade silently. We build robust MLOps pipelines that keep models accurate over time.' },
      { q: 'Can AI be applied to our specific industry?', a: 'Yes. We have deployed AI across financial services (fraud detection), healthcare (clinical NLP), retail (recommendation engines), and logistics (demand forecasting).' },
    ],
  },
};

function ServicesPage({ navigate, serviceSlug, navigateToService }: { navigate: (page: Page) => void; serviceSlug: string; navigateToService: (slug: string) => void }) {
  const service = SERVICE_DATA[serviceSlug] || SERVICE_DATA['software-engineering'];
  return <ServiceDetailPage service={service} navigate={navigate} navigateToService={navigateToService} />;
}

function ServiceDetailPage({ service, navigate, navigateToService }: { service: ServiceData; navigate: (page: Page) => void; navigateToService: (slug: string) => void }) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2d6e 0%, #1a3fa3 60%, #1e4fc8 100%)', height: '620px' }}>
        <div className="max-w-7xl mx-auto px-6 h-full flex flex-row">
          {/* Left: vertically centered text + buttons */}
          <motion.div
            initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
            className="flex-1 text-white flex flex-col justify-center"
            style={{ paddingTop: '96px' }}
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-10"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {service.title}
            </motion.h1>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex flex-wrap gap-4">
              <motion.button onClick={() => navigate('contact')} className="px-7 py-3 rounded-lg font-semibold inline-flex items-center gap-2 transition-all" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)' }} whileHover={{ background: 'rgba(255,255,255,0.25)', scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Get a Quote <ArrowRight size={18} />
              </motion.button>
              <motion.button onClick={() => navigate('contact')} className="px-7 py-3 rounded-lg font-semibold transition-all" style={{ color: 'rgba(255,255,255,0.75)', border: '1px solid rgba(255,255,255,0.2)' }} whileHover={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                Learn More
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right: staggered columns, bottom-aligned, fully contained */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:flex items-end gap-4 flex-shrink-0"
            style={{ paddingBottom: '28px' }}
          >
            {[
              { src: service.heroImage,                            h: 260 },
              { src: service.extraImages[0] || service.heroImage, h: 390 },
              { src: service.extraImages[1] || service.heroImage, h: 490 },
            ].map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15, duration: 0.7 }}
                className="relative flex-shrink-0 overflow-hidden"
                style={{ width: '210px', height: `${img.h}px`, borderRadius: '14px' }}
              >
                <img
                  src={img.src}
                  alt={service.title}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = service.heroImage; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>About {service.title}</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">{service.description} Our team of senior engineers brings deep domain expertise and a track record of delivering production-grade systems for Fortune 500 clients across the globe.</p>
            <motion.button onClick={() => navigate('contact')} className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all" whileHover={{ x: 4 }}>
              Start your project <ArrowRight size={18} />
            </motion.button>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border hover:border-primary transition-all" whileHover={{ x: 4 }}>
                <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium">{b}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tools ── */}
      <section className="py-20 px-6 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Tools & Technologies</h2>
            <p className="text-secondary-foreground/60 text-lg">Best-in-class tools we use to deliver {service.title}</p>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-6">
            {service.tools.map((tool, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.85 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ scale: 1.12, y: -4 }} title={tool.name} className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-2xl bg-white/8 border border-white/15 flex items-center justify-center hover:bg-primary/30 hover:border-primary/60 transition-all p-3 cursor-default">
                  {tool.logo ? (
                    <img src={tool.logo} alt={tool.name} className="w-full h-full object-contain" style={tool.logo?.includes('devicons') ? { filter: 'brightness(0) invert(1)' } : undefined} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  ) : (
                    <Shield className="w-7 h-7 text-secondary-foreground/60" />
                  )}
                </div>
                <span className="text-xs text-secondary-foreground/60 font-medium">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Process ── */}
      <section className="py-20 px-6" style={{ background: 'radial-gradient(ellipse at top left, #bfdbfe 0%, transparent 55%), radial-gradient(ellipse at bottom right, #bfdbfe 0%, transparent 55%), var(--background)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Our Process</h2>
            <p className="text-muted-foreground text-lg">A proven approach that delivers results every time</p>
          </motion.div>
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-px bg-border" />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {service.process.map((step, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }} className="relative flex flex-col items-center text-center">
                  <motion.div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl mb-6 relative z-10 shadow-lg" whileHover={{ scale: 1.1 }} style={{ fontFamily: 'var(--font-display)' }}>
                    {String(i + 1).padStart(2, '0')}
                  </motion.div>
                  <h3 className="text-lg font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Everything you need to know about our {service.title} services</p>
          </motion.div>
          <div className="space-y-3">
            {service.faqs.map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} className="border border-border rounded-xl overflow-hidden hover:border-primary/40 transition-all">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/40 transition-colors">
                  <span className="font-semibold pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }} className="flex-shrink-0 text-primary">
                    <Plus size={18} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                      <p className="px-5 pb-5 text-muted-foreground leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-6 bg-gradient-to-br from-primary/5 via-accent/5 to-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Ready to Build Something Great?</h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Let's discuss your {service.title.toLowerCase()} needs and create a solution tailored to your business.</p>
            <motion.button onClick={() => navigate('contact')} className="px-10 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all inline-flex items-center gap-2" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              Let's Get in Touch <ArrowRight size={20} />
            </motion.button>
          </motion.div>
        </div>
      </section>

      <Footer navigate={navigate} navigateToService={navigateToService} />
    </>
  );
}

function BlogsPage({ navigate, navigateToService, selectedPost, setSelectedPost }: { navigate: (page: Page) => void; navigateToService: (slug: string) => void; selectedPost: number | null; setSelectedPost: (v: number | null) => void }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [blogListPage, setBlogListPage] = useState(0);
  const POSTS_PER_PAGE = 7;

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/blogs`)
      .then(r => r.json())
      .then(data => {
        setPosts(data.map((p: any) => ({
          ...p,
          readTime: p.read_time,
          content: p.content_intro ? {
            intro: p.content_intro,
            points: JSON.parse(p.content_points || '[]'),
            conclusion: { heading: p.content_conclusion_heading, text: p.content_conclusion_text },
          } : null,
        })));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedPost]);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Loading blogs...</span>
        </div>
      </div>
    );
  }

  if (selectedPost !== null) {
    const post = posts[selectedPost];
    return (
      <>
        <section className="min-h-screen pt-24 pb-20 px-6" style={{ background: 'radial-gradient(ellipse at top left, #bfdbfe 0%, transparent 55%), radial-gradient(ellipse at bottom right, #bfdbfe 0%, transparent 55%), var(--background)' }}>
          <div className="max-w-3xl mx-auto">
            <motion.button
              onClick={() => setSelectedPost(null)}
              className="inline-flex items-center gap-2 text-primary font-semibold text-sm mb-10 hover:gap-3 transition-all"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: -3 }}
            >
              <ArrowRight size={16} className="rotate-180" /> Back to Blogs
            </motion.button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block text-xs font-bold tracking-widest uppercase text-primary mb-4">{post.category}</span>
              <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{post.title}</h1>
              {post.caption && <p className="text-lg text-primary font-medium italic mb-4">{post.caption}</p>}
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-8">
                <span>{post.date}</span>
                <span>·</span>
                <span>{post.readTime}</span>
              </div>

              <div className="rounded-2xl overflow-hidden mb-10 h-72 md:h-96">
                <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
              </div>

              {post.content && (
                <div className="prose prose-lg max-w-none">
                  <p className="text-foreground leading-relaxed mb-8 text-base">{post.content.intro}</p>

                  <div className="space-y-6 mb-8">
                    {post.content.points.map((point: { title: string; text: string }, i: number) => (
                      <div key={i} className="flex gap-4 p-5 rounded-xl bg-card border border-border">
                        <div className="w-2 h-2 mt-2.5 rounded-full bg-primary flex-shrink-0" />
                        <div>
                          <span className="font-bold text-foreground">{point.title}: </span>
                          <span className="text-muted-foreground leading-relaxed">{point.text}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-xl border-l-4 border-primary bg-primary/5">
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: 'var(--font-display)' }}>{post.content.conclusion.heading}</h3>
                    <p className="text-muted-foreground leading-relaxed">{post.content.conclusion.text}</p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </section>
        <Footer navigate={navigate} navigateToService={navigateToService} />
      </>
    );
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[45vh] flex items-center" style={{ background: 'linear-gradient(135deg, #0f2d6e 0%, #1a3fa3 60%, #1e4fc8 100%)' }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-16 w-full">
          <motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs font-bold tracking-widest uppercase border border-white/30 text-white bg-white/10">
            <BookOpen size={12} /> Insights & Perspectives
          </motion.span>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.7 }} className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            The WiseSource Blog
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-lg text-white/60 max-w-xl">
            Practical insights on cloud, data, AI, and enterprise technology from our team of senior engineers.
          </motion.p>
        </motion.div>
      </section>

      {/* Posts */}
      <section className="py-20 px-6" style={{ background: 'radial-gradient(ellipse at top left, #bfdbfe 0%, transparent 55%), radial-gradient(ellipse at bottom right, #bfdbfe 0%, transparent 55%), var(--background)' }}>
        <div className="max-w-6xl mx-auto space-y-16">

          {(() => {
            const pageStart = blogListPage * POSTS_PER_PAGE;
            const pagePosts = posts.slice(pageStart, pageStart + POSTS_PER_PAGE);
            const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
            const featured = pagePosts[0];
            const gridPosts = pagePosts.slice(1);
            return (
              <>
                {/* Featured — first post of page */}
                {featured && (
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-border shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="relative overflow-hidden h-64 md:h-auto">
                      <motion.img src={featured.image} alt={featured.title} className="w-full h-full object-cover" whileHover={{ scale: 1.05 }} transition={{ duration: 0.5 }} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <span className="absolute top-4 left-4 px-3 py-1 text-xs font-bold tracking-widest uppercase bg-primary text-white rounded-full">
                        {blogListPage === 0 ? 'Latest' : `Page ${blogListPage + 1}`}
                      </span>
                    </div>
                    <div className="p-10 flex flex-col justify-center bg-secondary text-secondary-foreground">
                      <span className="text-xs font-bold tracking-widest uppercase text-primary mb-3">{featured.category}</span>
                      <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>{featured.title}</h2>
                      <p className="text-sm text-secondary-foreground/60 leading-relaxed mb-6">{featured.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-secondary-foreground/40">{featured.date} · {featured.readTime}</span>
                        {featured.content && (
                          <motion.button onClick={() => setSelectedPost(pageStart)} className="inline-flex items-center gap-2 text-primary font-semibold text-sm" whileHover={{ x: 3 }}>
                            Read More <ArrowRight size={16} />
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Remaining 6 — 3-column grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {gridPosts.map((post, i) => (
                    <motion.div
                      key={pageStart + i + 1}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.08 }}
                      className="blog-card group relative flex flex-col bg-card rounded-xl border border-border hover:border-transparent hover:shadow-md transition-colors duration-300"
                    >
                      <svg className="blog-card-svg absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible">
                        <rect x="0" y="0" width="100" height="100" rx="3" ry="3" fill="none" stroke="rgb(29,78,216)" strokeWidth="0.8" />
                      </svg>
                      <div className="relative h-44 overflow-hidden rounded-t-xl">
                        <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      </div>
                      <div className="flex flex-col flex-1 p-5">
                        <span className="text-xs font-bold tracking-widest uppercase text-primary mb-2">{post.category}</span>
                        <h3 className="text-base font-bold leading-snug mb-3 text-foreground line-clamp-2" style={{ fontFamily: 'var(--font-display)' }}>{post.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 mb-4 flex-1">{post.excerpt}</p>
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <span className="text-xs text-muted-foreground/60">{post.date} · {post.readTime}</span>
                          {post.content && (
                            <motion.button onClick={() => setSelectedPost(pageStart + i + 1)} className="inline-flex items-center gap-1 text-primary text-xs font-semibold" whileHover={{ x: 2 }}>
                              Read <ArrowRight size={13} />
                            </motion.button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                      onClick={() => { setBlogListPage(p => p - 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={blogListPage === 0}
                      className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, idx) => (
                      <button
                        key={idx}
                        onClick={() => { setBlogListPage(idx); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        className={`w-9 h-9 rounded-lg border text-sm font-medium transition-colors ${idx === blogListPage ? 'bg-primary text-white border-primary' : 'border-border hover:bg-muted'}`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => { setBlogListPage(p => p + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      disabled={blogListPage === totalPages - 1}
                      className="px-4 py-2 rounded-lg border border-border text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-muted transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            );
          })()}

        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 px-6" style={{ background: 'linear-gradient(135deg, #0f2d6e 0%, #1a3fa3 60%, #1e4fc8 100%)' }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full text-xs font-bold tracking-widest uppercase border border-white/20 text-white/80 bg-white/10">
            <Mail size={12} /> Newsletter
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Stay Ahead of the Curve
          </h2>
          <p className="text-white/70 text-lg mb-10 leading-relaxed">
            Get practical insights on cloud, data, AI, and DevOps delivered to your inbox every two weeks — no fluff, just signal.
          </p>
          <NewsletterForm />
        </motion.div>
      </section>

      <ConnectWithUs navigate={navigate} />
      <Footer navigate={navigate} navigateToService={navigateToService} />
    </>
  );
}

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/subscriptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (data.success) {
      setSubmitted(true);
    } else if (data.message === 'Already subscribed') {
      setAlreadySubscribed(true);
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-3">
        <CheckCircle className="w-12 h-12 text-green-400" />
        <p className="text-white font-semibold text-lg">
          {alreadySubscribed ? 'Already subscribed!' : "You're subscribed!"}
        </p>
        <p className="text-white/60 text-sm">
          {alreadySubscribed ? 'This email is already on our list.' : 'Look out for our next issue in your inbox.'}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        required
        className="flex-1 px-5 py-3 rounded-xl text-sm bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:border-white/50 focus:bg-white/15 transition-all"
      />
      <motion.button
        type="submit"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="px-7 py-3 rounded-xl font-semibold text-sm bg-white text-blue-900 hover:bg-white/90 transition-all flex-shrink-0"
      >
        Subscribe
      </motion.button>
    </form>
  );
}

function IndustriesPage({ navigate, navigateToService }: { navigate: (page: Page) => void; navigateToService: (slug: string) => void }) {
  const industries = [
    {
      name: 'Financial Services',
      description: 'Secure, compliant platforms for banking, insurance, and fintech innovation.',
      projects: 47,
      icon: <TrendingUp className="w-12 h-12" />,
      color: 'from-chart-1 to-accent'
    },
    {
      name: 'Healthcare & Life Sciences',
      description: 'HIPAA-compliant systems for patient care, research, and medical device integration.',
      projects: 32,
      icon: <Heart className="w-12 h-12" />,
      color: 'from-chart-2 to-primary'
    },
    {
      name: 'Retail & E-commerce',
      description: 'Omnichannel commerce platforms with real-time inventory and personalization.',
      projects: 58,
      icon: <Briefcase className="w-12 h-12" />,
      color: 'from-primary to-chart-3'
    },
    {
      name: 'Logistics & Supply Chain',
      description: 'End-to-end visibility solutions for freight, warehousing, and last-mile delivery.',
      projects: 29,
      icon: <Globe className="w-12 h-12" />,
      color: 'from-chart-4 to-chart-1'
    },
    {
      name: 'Technology & SaaS',
      description: 'Platform engineering, API development, and infrastructure scaling.',
      projects: 65,
      icon: <Layers className="w-12 h-12" />,
      color: 'from-chart-5 to-primary'
    },
    {
      name: 'Manufacturing',
      description: 'IoT integration, predictive maintenance, and supply chain optimization.',
      projects: 23,
      icon: <Server className="w-12 h-12" />,
      color: 'from-accent to-chart-2'
    }
  ];

  return (
    <>
    <div className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Industries We Serve
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Specialized expertise across critical business sectors
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {industries.map((industry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-8 bg-card border border-border rounded-xl hover:border-primary transition-all group relative overflow-hidden"
              whileHover={{ y: -8 }}
            >
              <motion.div
                className={`absolute inset-0 bg-gradient-to-br ${industry.color} opacity-0 group-hover:opacity-10 transition-opacity`}
              />
              <div className="relative z-10">
                <motion.div
                  className="inline-flex p-4 rounded-lg bg-primary/10 text-primary mb-6"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  {industry.icon}
                </motion.div>
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-2xl font-bold flex-1" style={{ fontFamily: 'var(--font-display)' }}>
                    {industry.name}
                  </h2>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold ml-2">
                    {industry.projects}+
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {industry.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <CaseStudies />
      </div>
    </div>
    <ConnectWithUs navigate={navigate} />
    <Footer navigate={navigate} navigateToService={navigateToService} />
    </>
  );
}

function CaseStudies() {
  return (
    <section className="mt-24 pt-24 border-t border-border">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-4xl font-bold text-center mb-12"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Success Stories
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[
          {
            title: 'Global Bank Digital Transformation',
            industry: 'Financial Services',
            result: '40% faster transaction processing'
          },
          {
            title: 'Healthcare Platform Migration',
            industry: 'Healthcare',
            result: '99.99% uptime achieved'
          }
        ].map((study, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
            className="p-8 bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl border border-border hover:border-primary transition-all"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              {study.title}
            </h3>
            <p className="text-sm text-primary mb-4">{study.industry}</p>
            <p className="text-lg font-semibold text-accent">{study.result}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

type Job = {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  is_active: number;
};

function ApplyModal({ role, onClose }: { role: Job; onClose: () => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', consent: false });
  const [phone, setPhone] = useState<string | undefined>(undefined);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setResumeFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!phone || !isValidPhoneNumber(phone)) { setError('Please enter a valid phone number.'); return; }
    if (!form.consent) { setError('Please provide consent to proceed.'); return; }
    if (!resumeFile) { setError('Please upload your resume.'); return; }
    setError('');
    const fd = new FormData();
    fd.append('job_id', String(role.id));
    fd.append('job_title', role.title);
    fd.append('first_name', form.first_name);
    fd.append('last_name', form.last_name);
    fd.append('email', form.email);
    fd.append('phone', phone);
    fd.append('consent', String(form.consent));
    fd.append('resume', resumeFile);

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/applications`, { method: 'POST', body: fd });
    const data = await res.json();
    if (data.success) setSubmitted(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Modal panel */}
      <motion.div
        className="relative bg-card border border-border rounded-2xl shadow-2xl w-full max-w-lg"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2 }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        >
          <X size={18} />
        </button>

        <div className="p-6">
          <p className="text-xs font-bold tracking-widest uppercase text-muted-foreground mb-1">MY APPLICATION</p>
          <h2 className="text-xl font-bold text-primary mb-2" style={{ fontFamily: 'var(--font-display)' }}>
            {role.title}
          </h2>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-muted text-muted-foreground mb-4">
            <MapPin size={12} /> {role.location}
          </span>

          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-10 text-center">
              <CheckCircle className="w-14 h-14 text-primary" />
              <p className="text-xl font-semibold">Application submitted!</p>
              <p className="text-muted-foreground text-sm">We'll review your application and be in touch soon.</p>
              <button onClick={onClose} className="mt-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all">Close</button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Requirements to apply:</p>

              {/* Name row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide">First Name</label>
                  <input
                    type="text"
                    required
                    value={form.first_name}
                    onChange={(e) => setForm(f => ({ ...f, first_name: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="Jane"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide">Last Name</label>
                  <input
                    type="text"
                    required
                    value={form.last_name}
                    onChange={(e) => setForm(f => ({ ...f, last_name: e.target.value }))}
                    className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="Smith"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide">Email</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-input-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="jane.smith@email.com"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold mb-1.5 text-muted-foreground uppercase tracking-wide">Phone</label>
                <PhoneInput
                  international
                  defaultCountry="US"
                  value={phone}
                  onChange={setPhone}
                  className={`phone-input-wrapper ${phone && !isValidPhoneNumber(phone) ? 'phone-input-invalid' : ''}`}
                />
                {phone && !isValidPhoneNumber(phone) && (
                  <p className="text-xs text-destructive mt-1">Enter a valid phone number for the selected country.</p>
                )}
              </div>

              {/* Consent */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm(f => ({ ...f, consent: e.target.checked }))}
                  className="mt-0.5 w-4 h-4 accent-primary flex-shrink-0"
                />
                <span className="text-xs text-muted-foreground leading-relaxed">
                  I consent to receive employment-related communications from WiseSource Inc. at the contact information provided.
                </span>
              </label>

              {/* Resume upload */}
              <div>
                <label className="block text-xs font-semibold mb-2 text-muted-foreground uppercase tracking-wide">Upload Resume</label>
                <div
                  className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center gap-1 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ArrowRight size={22} className="text-muted-foreground rotate-[-90deg]" />
                  <p className="text-sm text-muted-foreground">Drag and drop a file</p>
                  <p className="text-sm">
                    or <span className="text-primary font-semibold">browse your device</span>
                  </p>
                  {resumeFile && (
                    <p className="text-xs text-primary font-medium mt-1 truncate max-w-full">{resumeFile.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground/60">PDF, DOC, DOCX accepted</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>

              {error && <p className="text-xs text-destructive font-medium">{error}</p>}

              <motion.button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Application
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function CareersPage({ navigate, navigateToService }: { navigate: (page: Page) => void; navigateToService: (slug: string) => void }) {
  const [roles, setRoles] = useState<Job[]>([]);
  const [applyModalRole, setApplyModalRole] = useState<Job | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/jobs`)
      .then((r) => r.json())
      .then((data) => setRoles(data))
      .catch(() => {/* server not running, roles stay empty */});
  }, []);

  const cultureImages = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop'
  ];

  return (
    <>
    {/* Apply Now modal */}
    <AnimatePresence>
      {applyModalRole && (
        <ApplyModal role={applyModalRole} onClose={() => setApplyModalRole(null)} />
      )}
    </AnimatePresence>

    {/* ── Hero ── */}
    <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f2d6e 0%, #1a3fa3 60%, #1e4fc8 100%)', height: '520px' }}>
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-row items-center justify-between" style={{ paddingTop: '80px' }}>

        {/* Left column: decorative blob behind image */}
        <motion.div
          initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          className="hidden lg:block relative flex-shrink-0"
          style={{ width: '220px', height: '280px' }}
        >
          {/* Decorative shape offset behind */}
          <div style={{
            position: 'absolute', bottom: '-18px', left: '-18px',
            width: '220px', height: '260px',
            background: 'rgba(147,186,255,0.22)',
            borderRadius: '32px',
          }} />
          {/* Image card */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=500&fit=crop" alt="Team member" className="w-full h-full object-cover" />
          </div>
        </motion.div>

        {/* Center text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-white flex-1 px-8 lg:px-16"
        >
          <h1 className="text-6xl lg:text-8xl font-bold mb-5 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>Join Us</h1>
          <p className="text-base lg:text-lg max-w-sm mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            We'll help put your company on the digital map, through cutting-edge technology and world-class engineering.
          </p>
        </motion.div>

        {/* Right column: plus/cross shape with image overlapping */}
        <motion.div
          initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.1 }}
          className="hidden lg:block relative flex-shrink-0"
          style={{ width: '260px', height: '280px' }}
        >
          {/* Plus vertical bar */}
          <div style={{
            position: 'absolute', left: '90px', right: '90px', top: 0, bottom: 0,
            background: 'rgba(147,186,255,0.22)', borderRadius: '32px',
          }} />
          {/* Plus horizontal bar */}
          <div style={{
            position: 'absolute', top: '90px', bottom: '90px', left: 0, right: 0,
            background: 'rgba(147,186,255,0.22)', borderRadius: '32px',
          }} />
          {/* Image card anchored to bottom-right of cross */}
          <div style={{
            position: 'absolute', bottom: 0, right: 0,
            width: '180px', height: '220px',
            borderRadius: '24px', overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}>
            <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=320&h=400&fit=crop" alt="Team member" className="w-full h-full object-cover" />
          </div>
        </motion.div>

      </div>
    </section>

    <div className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Open Positions
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Build the future alongside exceptional engineers and visionaries
          </p>
        </motion.div>

        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
            Open Positions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {roles.map((role, index) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="flex flex-col bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: 'var(--font-display)' }}>
                  {role.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 flex-1">{role.description}</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">{role.department}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground font-medium">{role.location}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">{role.type}</span>
                </div>
                <motion.button
                  onClick={() => setApplyModalRole(role)}
                  className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Apply Now
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>

        <LifeAtWiseSource images={cultureImages} />
        <BenefitsSection />
      </div>
    </div>
    <ConnectWithUs navigate={navigate} />
    <Footer navigate={navigate} navigateToService={navigateToService} />
    </>
  );
}

const LIFE_GRID: { gridColumn: string; gridRow: string; height: string }[] = [
  { gridColumn: '1 / 3', gridRow: '1 / 2', height: '320px' },
  { gridColumn: '3 / 4', gridRow: '1 / 2', height: '320px' },
  { gridColumn: '1 / 2', gridRow: '2 / 3', height: '260px' },
  { gridColumn: '2 / 4', gridRow: '2 / 3', height: '260px' },
];

function LifeAtWiseSource({ images }: { images: string[] }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <div ref={ref} className="mb-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-10"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Life at WiseSource
      </motion.h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
        {images.slice(0, 4).map((src, index) => {
          const cfg = LIFE_GRID[index];
          return (
            <motion.div
              key={index}
              style={{ gridColumn: cfg.gridColumn, gridRow: cfg.gridRow, height: cfg.height }}
              className="overflow-hidden rounded-2xl group relative"
              initial={{ x: -120, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : {}}
              transition={{ delay: index * 0.18, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={src}
                alt={`Team culture ${index + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function BenefitsSection() {
  const benefits = [
    { icon: <Heart className="w-6 h-6" />, title: 'Health & Wellness', desc: 'Comprehensive medical, dental, and vision coverage for you and your family' },
    { icon: <TrendingUp className="w-6 h-6" />, title: 'Career Growth', desc: 'Annual learning budgets, certifications, and conference sponsorships' },
    { icon: <Globe className="w-6 h-6" />, title: 'Remote-First', desc: 'Flexible work-from-anywhere culture with async-friendly collaboration' },
    { icon: <Award className="w-6 h-6" />, title: 'Equity', desc: 'Stock options for all full-time employees from day one' },
    { icon: <Zap className="w-6 h-6" />, title: 'Home Office Setup', desc: 'One-time stipend to build your ideal home office environment' },
    { icon: <Shield className="w-6 h-6" />, title: 'Paid Time Off', desc: 'Generous PTO policy plus paid holidays and mental health days' },
    { icon: <Users className="w-6 h-6" />, title: 'Team Retreats', desc: 'Annual company retreats to connect, collaborate, and recharge' },
    { icon: <Sparkles className="w-6 h-6" />, title: 'Performance Bonus', desc: 'Quarterly performance bonuses tied to individual and team outcomes' },
  ];

  return (
    <section className="mb-20">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-3xl font-bold mb-8"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        Benefits & Perks
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-card border border-border rounded-xl hover:border-primary transition-all"
            whileHover={{ y: -5 }}
          >
            <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
              {benefit.icon}
            </div>
            <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
              {benefit.title}
            </h3>
            <p className="text-sm text-muted-foreground">{benefit.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

function ContactPage({ navigate, navigateToService }: { navigate: (page: Page) => void; navigateToService: (slug: string) => void }) {
  const [contactForm, setContactForm] = useState({ first_name: '', last_name: '', email: '', company: '', message: '' });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactForm),
    });
    const data = await res.json();
    if (data.success) setContactSubmitted(true);
  };

  return (
    <>
    <div className="pt-24 pb-10 px-6" style={{ background: 'radial-gradient(ellipse at top left, #bfdbfe 0%, transparent 55%), radial-gradient(ellipse at bottom right, #bfdbfe 0%, transparent 55%), var(--background)' }}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Wise Source is committed to supporting your software staffing and project needs with precision and reliability. Please contact us with your requirements or questions regarding ERP, BI, AI, or Security solutions. Our knowledgeable team is ready to provide detailed assistance.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card border border-border rounded-2xl p-10"
          >
            <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
              Send us a message
            </h2>
            {contactSubmitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 py-12 text-center">
                <CheckCircle className="w-14 h-14 text-primary" />
                <p className="text-xl font-semibold">Message sent!</p>
                <p className="text-muted-foreground">We'll get back to you within 1 business day.</p>
              </motion.div>
            ) : (
            <form className="space-y-6" onSubmit={handleContactSubmit}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">First Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.first_name}
                    onChange={(e) => setContactForm(f => ({ ...f, first_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Last Name</label>
                  <input
                    type="text"
                    required
                    value={contactForm.last_name}
                    onChange={(e) => setContactForm(f => ({ ...f, last_name: e.target.value }))}
                    className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={contactForm.email}
                  onChange={(e) => setContactForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="john.doe@company.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Company</label>
                <input
                  type="text"
                  value={contactForm.company}
                  onChange={(e) => setContactForm(f => ({ ...f, company: e.target.value }))}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring transition-all"
                  placeholder="Acme Corporation"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                  rows={5}
                  value={contactForm.message}
                  onChange={(e) => setContactForm(f => ({ ...f, message: e.target.value }))}
                  className="w-full px-4 py-3 bg-input-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
                  placeholder="Tell us about your project..."
                />
              </div>

              <motion.button
                type="submit"
                className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all relative overflow-hidden group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="relative z-10">Send Message</span>
                <motion.div
                  className="absolute inset-0 bg-accent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8 mt-16"
          >
            <div>
              <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>
                Contact Information
              </h2>
              <div className="space-y-6">
                <motion.div
                  className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary transition-all"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Email</div>
                    <div className="text-muted-foreground">contact@wisesource.com</div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary transition-all"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-3 bg-accent/10 rounded-lg text-accent">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-semibold mb-1">Phone</div>
                    <div className="text-muted-foreground">+1 832 937 7277</div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex items-start gap-4 p-4 bg-card border border-border rounded-xl hover:border-primary transition-all"
                  whileHover={{ x: 5 }}
                >
                  <div className="p-3 bg-chart-2/10 rounded-lg text-chart-2 flex-shrink-0 mt-0.5">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold mb-3">Office Locations</div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-0.5">USA</div>
                        <div className="text-sm text-muted-foreground leading-snug">
                          1712 Pioneer Ave, STE 7000<br />Cheyenne, WY 82001
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl border border-primary/20">
              <h3 className="font-bold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                Business Hours
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <div>Monday - Friday: 9:00 AM - 6:00 PM EST</div>
                <div>Saturday - Sunday: Closed</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
    {/* Google Maps */}
    <section className="px-6 pb-20">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6" style={{ fontFamily: 'var(--font-display)' }}>Our Office</h2>
        <div className="rounded-2xl overflow-hidden border border-border shadow-sm h-96">
          <iframe
            title="WiseSource Office Location"
            src="https://maps.google.com/maps?q=1712+Pioneer+Ave+STE+7000+Cheyenne+WY+82001&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
          />
        </div>
      </div>
    </section>

    <GlobalPresence />
    <Footer navigate={navigate} navigateToService={navigateToService} />
    </>
  );
}
