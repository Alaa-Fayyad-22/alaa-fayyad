export const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    titleAr: "منصة تجارة إلكترونية",
    description: "Full-stack e-commerce solution with real-time inventory, payment integration, and admin dashboard. Scaled to handle 10,000+ daily active users.",
    descriptionAr: "منصة تجارة إلكترونية متكاملة مع إدارة المخزون الفوري وتكامل الدفع ولوحة تحكم للمشرفين. تخدم أكثر من 10,000 مستخدم يومياً.",
    image: "/projects/ecommerce.png",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "Redis"],
    category: "web",
    live: "https://demo.example.com",
    github: "https://github.com",
    featured: true,
    color: "from-violet-500 to-purple-600"
  },
  {
    id: 2,
    title: "SaaS Dashboard",
    titleAr: "لوحة تحكم SaaS",
    description: "Analytics and project management SaaS with real-time collaboration, custom reporting, and team management features.",
    descriptionAr: "منصة SaaS للتحليلات وإدارة المشاريع مع تعاون فوري وتقارير مخصصة وإدارة الفرق.",
    image: "/projects/saas.png",
    tags: ["React", "TypeScript", "FastAPI", "MongoDB", "WebSockets"],
    category: "web",
    live: "https://demo.example.com",
    github: "https://github.com",
    featured: true,
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    title: "Mobile Banking App",
    titleAr: "تطبيق بنكي موبايل",
    description: "Secure mobile banking application with biometric auth, instant transfers, and AI-powered expense categorization.",
    descriptionAr: "تطبيق مصرفي آمن مع المصادقة البيومترية والتحويلات الفورية وتصنيف المصروفات بالذكاء الاصطناعي.",
    image: "/projects/banking.png",
    tags: ["React Native", "Node.js", "PostgreSQL", "JWT", "Plaid API"],
    category: "mobile",
    live: "https://demo.example.com",
    github: "https://github.com",
    featured: true,
    color: "from-emerald-500 to-teal-500"
  },
  {
    id: 4,
    title: "Restaurant Ordering System",
    titleAr: "نظام طلبات مطعم",
    description: "Complete restaurant management system with QR menu, live order tracking, kitchen display, and analytics.",
    descriptionAr: "نظام إدارة مطعم متكامل مع قائمة QR وتتبع الطلبات المباشر وشاشة المطبخ والتحليلات.",
    image: "/projects/restaurant.png",
    tags: ["Next.js", "Prisma", "MySQL", "Socket.io", "Tailwind"],
    category: "web",
    live: "https://demo.example.com",
    github: "https://github.com",
    featured: false,
    color: "from-orange-500 to-red-500"
  },
  {
    id: 5,
    title: "Design System & UI Kit",
    titleAr: "نظام تصميم وحزمة UI",
    description: "Comprehensive design system with 100+ components, dark mode, RTL support, Figma library and React implementation.",
    descriptionAr: "نظام تصميم شامل يضم أكثر من 100 مكوّن مع الوضع الداكن ودعم RTL ومكتبة Figma وتنفيذ React.",
    image: "/projects/design-system.png",
    tags: ["Figma", "React", "Storybook", "TypeScript", "CSS Variables"],
    category: "design",
    live: "https://demo.example.com",
    github: "https://github.com",
    featured: false,
    color: "from-pink-500 to-rose-500"
  },
  {
    id: 6,
    title: "Real Estate Platform",
    titleAr: "منصة عقارية",
    description: "Property listing and management platform with virtual tours, mortgage calculator, and agent CRM.",
    descriptionAr: "منصة لإدراج وإدارة العقارات مع جولات افتراضية وحاسبة الرهن العقاري وإدارة علاقات الوكلاء.",
    image: "/projects/realestate.png",
    tags: ["Next.js", "Django", "PostgreSQL", "Mapbox", "AWS S3"],
    category: "web",
    live: "https://demo.example.com",
    github: "https://github.com",
    featured: false,
    color: "from-indigo-500 to-blue-600"
  }
];

export const experiences = [
  {
    role: "Senior Full Stack Developer",
    roleAr: "مطوّر Full Stack أول",
    company: "TechVentures MENA",
    companyAr: "تك فنتشرز الشرق الأوسط",
    period: "2023 – Present",
    periodAr: "2023 – حتى الآن",
    description: "Lead engineer on a team of 5, architecting and building core product features for a B2B SaaS platform serving 500+ companies. Reduced load time by 60% through performance optimizations.",
    descriptionAr: "مهندس رئيسي في فريق مكوّن من 5 أشخاص، أصمم وأبني الميزات الأساسية لمنصة SaaS تخدم أكثر من 500 شركة. خفّضت زمن التحميل بنسبة 60% عبر تحسينات الأداء.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "AWS", "Docker"],
    type: "full-time"
  },
  {
    role: "UI/UX Designer & Frontend Developer",
    roleAr: "مصمم UI/UX ومطوّر Frontend",
    company: "Creative Studio LB",
    companyAr: "كريتيف ستوديو لبنان",
    period: "2022 – 2023",
    periodAr: "2022 – 2023",
    description: "Designed and developed 12+ client projects across various industries. Established design system and component library used across all projects, reducing development time by 40%.",
    descriptionAr: "صمّمت وطوّرت أكثر من 12 مشروعاً للعملاء في قطاعات متنوعة. أنشأت نظام تصميم ومكتبة مكوّنات استُخدمت في جميع المشاريع مما قلّص وقت التطوير بنسبة 40%.",
    tech: ["React", "Figma", "Node.js", "MongoDB", "Tailwind CSS"],
    type: "full-time"
  },
  {
    role: "Junior Web Developer",
    roleAr: "مطوّر ويب مبتدئ",
    company: "Freelance",
    companyAr: "عمل حر",
    period: "2021 – 2022",
    periodAr: "2021 – 2022",
    description: "Built and delivered 10+ websites and web applications for small businesses and entrepreneurs. Specialized in responsive design, WordPress development, and custom React applications.",
    descriptionAr: "بنيت وسلّمت أكثر من 10 مواقع وتطبيقات ويب للشركات الصغيرة والمؤسسين. تخصّصت في التصميم المتجاوب وتطوير WordPress وتطبيقات React المخصصة.",
    tech: ["React", "WordPress", "PHP", "MySQL", "CSS3"],
    type: "freelance"
  }
];

export const skillCategories = [
  {
    key: "frontend",
    skills: [
      { name: "React / Next.js", level: 92 },
      { name: "TypeScript", level: 88 },
      { name: "Tailwind CSS", level: 95 },
      { name: "React Native", level: 78 },
      { name: "Framer Motion", level: 82 }
    ]
  },
  {
    key: "backend",
    skills: [
      { name: "Node.js / Express", level: 88 },
      { name: "Python / FastAPI", level: 80 },
      { name: "REST APIs", level: 92 },
      { name: "GraphQL", level: 75 },
      { name: "WebSockets", level: 78 }
    ]
  },
  {
    key: "design",
    skills: [
      { name: "Figma", level: 90 },
      { name: "UI/UX Design", level: 88 },
      { name: "Design Systems", level: 85 },
      { name: "Prototyping", level: 87 },
      { name: "Adobe XD", level: 75 }
    ]
  },
  {
    key: "databases",
    skills: [
      { name: "PostgreSQL", level: 85 },
      { name: "MongoDB", level: 82 },
      { name: "Redis", level: 75 },
      { name: "AWS / Vercel", level: 80 },
      { name: "Docker", level: 72 }
    ]
  }
];