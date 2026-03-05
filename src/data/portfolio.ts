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
    role: "Python / Web Developer",
    roleAr: "مطوّر Python",
    company: "Softech S.A.R.L.",
    companyAr: "Softech S.A.R.L.",
    period: "January 2024 – Present",
    periodAr: "يناير 2024 – حتى الآن",
    description: "Developed and maintained backend services using Python with Django and Flask. Designed and integrated RESTful and third-party APIs. Automated data processing, validation, and scraping workflows. Collaborated with cross-functional teams to deliver scalable web applications.",
    descriptionAr: "طوّرت وصنت خدمات الواجهة الخلفية باستخدام Python مع Django و Flask. صمّمت ودمجت RESTful APIs وواجهات برمجية خارجية. أتمتت سير عمل معالجة البيانات والتحقق منها وجمعها. تعاونت مع الفرق لتسليم تطبيقات ويب قابلة للتوسع.",
    tech: ["Python", "Django", "Flask", "REST APIs", "Web Scraping"],
    type: "full-time"
},
  {
    role: "Web Developer & UI/UX Designer",
    roleAr: "مطوّر ومصمم UI/UX",
    company: "Freelance",
    companyAr: "عمل حر",
    period: "January 2022 – Present",
    periodAr: "يناير 2022 – حتى الآن",
    description: "Independently designed and developed full-stack web applications from concept to production-ready state. Built a personal design system and reusable component library, ensuring consistency and efficiency across all projects.",
    descriptionAr: "صمّمت وطوّرت تطبيقات ويب متكاملة بشكل مستقل من الفكرة حتى مرحلة الإنتاج. بنيت نظام تصميم خاص ومكتبة مكوّنات قابلة لإعادة الاستخدام لضمان الاتساق والكفاءة في جميع المشاريع.",
    tech: ["Next.js", "Figma", "C# ASP.NET", "PostgreSQL", "MySQL", "Laravel"],
    type: "full-time"
  },
  {
    role: "Junior Web Developer",
    roleAr: "مطوّر ويب مبتدئ",
    company: "Multiframes S.A.R.L",
    companyAr: "Multiframes S.A.R.L",
    period: "February 2023 – August 2023",
    periodAr: "فبراير 2023 – أغسطس 2023",
    description: "Contributed to the development and maintenance of web applications using C# and ASP.NET for back-end functionality. Implemented front-end updates with HTML and CSS, and managed databases via phpMyAdmin. Handled data entry and content management through a CMS to ensure data accuracy and streamline operations.",
    descriptionAr: "أسهمت في تطوير وصيانة تطبيقات الويب باستخدام C# و ASP.NET للواجهة الخلفية. نفّذت تحديثات الواجهة الأمامية بـ HTML و CSS، وأدرت قواعد البيانات عبر phpMyAdmin. تولّيت إدخال البيانات وإدارة المحتوى عبر نظام CMS لضمان دقة البيانات وتسهيل العمليات.",
    tech: ["C#", "ASP.NET", "MySQL", "HTML", "CSS"],
    type: "full-time"
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
      { name: "JavaScript", level: 82 }
    ]
  },
  {
    key: "backend",
    skills: [
      { name: "Node.js / Express", level: 88 },
      { name: "Python / FastAPI", level: 80 },
      { name: "REST APIs", level: 92 },
      { name: "Laravel", level: 75 },
      { name: "ASP.NET", level: 78 }
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
      { name: "MySQL", level: 75 },
      { name: "AWS / Vercel", level: 80 },
      { name: "Docker", level: 72 }
    ]
  }
];