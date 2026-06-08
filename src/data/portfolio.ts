export const projects = [
  {
  id: 1,
  title: "Happidoo",
  titleAr: "هابيدو",
  description: "Full-stack site where customers browse and book inflatable rentals — a catalog and photo gallery, a quote-based booking flow with tiered package discounts, and one-tap WhatsApp leads. Owners manage their own inventory through a Supabase-backed admin.",
  descriptionAr: "موقع متكامل يتيح للعملاء تصفّح وحجز الألعاب النطّاطة — كتالوج ومعرض صور، ونظام حجز عبر طلب عرض سعر مع خصومات حسب الباقة، وتواصل فوري عبر واتساب. يدير المالكون مخزونهم بأنفسهم عبر لوحة تحكم مبنية على Supabase.",
  image: "/happidoo_screen.png",
  tags: ["Next.js", "Tailwind CSS", "Supabase"],
  category: "web",
  live: "https://www.happidoo.org",
  github: "https://github.com/Alaa-Fayyad-22/happidoo",
  featured: true,
  color: "from-violet-500 to-purple-600"
},
{
  id: 2,
  title: "Developer Portfolio",
  titleAr: "الموقع الشخصي",
  description: "The site you're on. A bilingual (English + Arabic, full RTL) single-page portfolio with a custom design-token system, scroll-reveal animations, and a data-driven structure — designed and built from scratch.",
  descriptionAr: "الموقع الذي تتصفّحه الآن. موقع شخصي ثنائي اللغة (إنجليزي وعربي مع دعم كامل للكتابة من اليمين إلى اليسار) مبني بنظام تصميم مخصّص وحركات ظهور سلسة وبنية معتمدة على البيانات — صُمّم وطُوّر من الصفر.",
  image: "/portfolio_screen.png",
  tags: ["React", "TypeScript", "i18n / RTL"],
  category: "web",
  live: "https://alaafayyad.vercel.app",
  github: "https://github.com/Alaa-Fayyad-22/alaa-fayyad",
  featured: true,
  color: "from-blue-500 to-cyan-500"
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
    role: "Junior Web Developer",
    roleAr: "مطوّر ويب مبتدئ",
    company: "Multiframes S.A.R.L",
    companyAr: "Multiframes S.A.R.L",
    period: "March 2023 – August 2023",
    periodAr: "مارس 2023 – أغسطس 2023",
    description: "Contributed to the development and maintenance of web applications using C# and ASP.NET for back-end functionality. Implemented front-end updates with HTML and CSS, and managed databases via phpMyAdmin. Handled data entry and content management through a CMS to ensure data accuracy and streamline operations.",
    descriptionAr: "أسهمت في تطوير وصيانة تطبيقات الويب باستخدام C# و ASP.NET للواجهة الخلفية. نفّذت تحديثات الواجهة الأمامية بـ HTML و CSS، وأدرت قواعد البيانات عبر phpMyAdmin. تولّيت إدخال البيانات وإدارة المحتوى عبر نظام CMS لضمان دقة البيانات وتسهيل العمليات.",
    tech: ["C#", "ASP.NET", "MySQL", "HTML", "CSS"],
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
      { name: "MySQL", level: 75 }
    ]
  },
  {
    key: "devops",
    skills: [
      { name: "CI/CD", level: 75 },
      { name: "Docker", level: 72 },
      { name: "AWS / Vercel", level: 80 }
    ]
  }
];