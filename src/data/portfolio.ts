export const projects = [
  {
  id: 3,
  title: "Fattoura",
  titleAr: "فاتورة",
  description: "AI-powered web app that turns a photo of a restaurant receipt into a fully settled bill. Snap the receipt and a vision model (Google Gemini) reads every item, quantity, and price via OCR; assign each line to whoever shared it — including multi-quantity orders and uneven splits — and the app calculates who owes whom across multiple payers, in both lira and dollars. It removes the slow, error-prone manual math of splitting a group bill.",
  descriptionAr: "تطبيق ويب مدعوم بالذكاء الاصطناعي يحوّل صورة فاتورة المطعم إلى حساب مقسَّم ومسوَّى بالكامل. التقط صورة للفاتورة فيقرأ نموذج رؤية (Google Gemini) كل صنف وكمية وسعر عبر تقنية OCR؛ ثم أسنِد كل بند إلى من شاركه — بما في ذلك الطلبات متعددة الكميات والحصص غير المتساوية — ويحتسب التطبيق من يدفع لمن بين عدّة دافعين، بالليرة والدولار معاً. يلغي الحساب اليدوي البطيء والمعرّض للأخطاء عند تقسيم فاتورة جماعية.",
  image: "/fattoura_cover.svg",
  imageAlt: "Fattoura cover art: a restaurant receipt being split into per-person shares.",
  imageAltAr: "صورة غلاف فاتورة: فاتورة مطعم تُقسَّم إلى حصص لكل شخص.",
  tags: ["Next.js", "React", "Gemini OCR"],
  category: "web",
  live: "https://fattoura.vercel.app/",
  github: "https://github.com/Alaa-Fayyad-22/split-the-bill",
  featured: true,
  color: "from-amber-500 to-orange-600"
},
{
  id: 1,
  title: "Happidoo",
  titleAr: "هابيدو",
  description: "Full-stack site where customers browse and book inflatable rentals — a catalog and photo gallery, a quote-based booking flow with tiered package discounts, and one-tap WhatsApp leads. Owners manage their own inventory through a Supabase-backed admin.",
  descriptionAr: "موقع متكامل يتيح للعملاء تصفّح وحجز الألعاب النطّاطة — كتالوج ومعرض صور، ونظام حجز عبر طلب عرض سعر مع خصومات حسب الباقة، وتواصل فوري عبر واتساب. يدير المالكون مخزونهم بأنفسهم عبر لوحة تحكم مبنية على Supabase.",
  image: "/happidoo.png",
  imageAlt: "Happidoo home page, showing the inflatable rental catalog with booking options.",
  imageAltAr: "الصفحة الرئيسية لموقع هابيدو، تعرض كتالوج الألعاب النطّاطة مع خيارات الحجز.",
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
  imageAlt: "This portfolio site, showing the terminal-style hero section on a dark background.",
  imageAltAr: "هذا الموقع الشخصي، ويظهر فيه قسم البداية بأسلوب الطرفية على خلفية داكنة.",
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