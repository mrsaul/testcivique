// Localized JSON-LD schema content for SEO

type Lang = 'fr' | 'en' | 'es' | 'ar';

const APP_NAME = 'Test Civique';
const APP_URL = 'https://www.letestcivique.org';

const APP_DESC: Record<Lang, string> = {
  fr: "Préparez votre examen civique français avec des quiz interactifs. 5 thèmes officiels, 300+ questions, suivi de progression.",
  en: "Prepare for the French civic exam with interactive quizzes. 5 official themes, 300+ questions, progress tracking.",
  es: "Prepara el examen cívico francés con cuestionarios interactivos. 5 temas oficiales, 300+ preguntas, seguimiento del progreso.",
  ar: "استعد للامتحان المدني الفرنسي من خلال اختبارات تفاعلية. 5 مواضيع رسمية، أكثر من 300 سؤال، ومتابعة للتقدم.",
};

const FAQS: Record<Lang, { q: string; a: string }[]> = {
  fr: [
    { q: "Qu'est-ce que l'examen civique français ?", a: "L'examen civique évalue la connaissance de l'histoire, de la culture et des valeurs de la société française. Il est obligatoire pour obtenir la nationalité française par décret." },
    { q: "Quel score faut-il obtenir pour réussir l'examen civique ?", a: "Il faut obtenir au moins 80% de bonnes réponses (soit 16 sur 20 questions) pour valider l'examen civique." },
    { q: "Combien de questions y a-t-il à l'examen civique ?", a: "L'examen comporte 20 questions à choix multiples couvrant les 5 thèmes officiels du livret du citoyen." },
    { q: "Quels sont les 5 thèmes de l'examen civique ?", a: "Les 5 thèmes sont : les principes et valeurs de la République, les institutions, les droits et devoirs, l'histoire de France et vivre en France." },
    { q: "Combien de temps dure l'examen civique ?", a: "L'examen civique dure 45 minutes pour répondre aux 20 questions à choix multiples." },
    { q: "L'application Test Civique est-elle gratuite ?", a: "Oui, vous pouvez vous entraîner gratuitement sur 5 questions. L'accès illimité à toutes les questions et modes d'entraînement coûte 5€ à vie." },
  ],
  en: [
    { q: "What is the French civic exam?", a: "The French civic exam tests knowledge of France's history, culture and republican values. It is required to obtain French nationality by decree." },
    { q: "What score is needed to pass the French civic exam?", a: "You need at least 80% correct answers (16 out of 20) to pass the civic exam." },
    { q: "How many questions are on the French civic exam?", a: "The exam consists of 20 multiple-choice questions covering the 5 official themes of the citizen's booklet." },
    { q: "What are the 5 themes of the civic exam?", a: "The 5 themes are: principles and values of the Republic, institutions, rights and duties, history of France, and living in France." },
    { q: "How long does the civic exam last?", a: "The civic exam lasts 45 minutes to answer the 20 multiple-choice questions." },
    { q: "Is the Test Civique app free?", a: "Yes, you can practice for free on 5 questions. Unlimited access to all questions and training modes costs €5 for life." },
  ],
  es: [
    { q: "¿Qué es el examen cívico francés?", a: "El examen cívico evalúa el conocimiento de la historia, la cultura y los valores republicanos de Francia. Es obligatorio para obtener la nacionalidad francesa por decreto." },
    { q: "¿Qué puntaje se necesita para aprobar el examen cívico?", a: "Necesitas al menos un 80% de respuestas correctas (16 sobre 20) para aprobar el examen cívico." },
    { q: "¿Cuántas preguntas tiene el examen cívico?", a: "El examen consta de 20 preguntas de opción múltiple que cubren los 5 temas oficiales del cuadernillo del ciudadano." },
    { q: "¿Cuáles son los 5 temas del examen cívico?", a: "Los 5 temas son: principios y valores de la República, instituciones, derechos y deberes, historia de Francia y vivir en Francia." },
    { q: "¿Cuánto dura el examen cívico?", a: "El examen cívico dura 45 minutos para responder a las 20 preguntas de opción múltiple." },
    { q: "¿La aplicación Test Civique es gratuita?", a: "Sí, puedes practicar gratis con 5 preguntas. El acceso ilimitado a todas las preguntas y modos de entrenamiento cuesta 5€ de por vida." },
  ],
  ar: [
    { q: "ما هو الامتحان المدني الفرنسي؟", a: "يقيّم الامتحان المدني المعرفة بتاريخ فرنسا وثقافتها وقيم الجمهورية. وهو إلزامي للحصول على الجنسية الفرنسية بمرسوم." },
    { q: "ما النتيجة المطلوبة لاجتياز الامتحان المدني؟", a: "تحتاج إلى 80% على الأقل من الإجابات الصحيحة (16 من أصل 20) لاجتياز الامتحان المدني." },
    { q: "كم عدد الأسئلة في الامتحان المدني؟", a: "يتألف الامتحان من 20 سؤالاً متعدد الخيارات يغطي المواضيع الرسمية الخمسة لكتيب المواطن." },
    { q: "ما هي المواضيع الخمسة للامتحان المدني؟", a: "المواضيع الخمسة هي: مبادئ وقيم الجمهورية، المؤسسات، الحقوق والواجبات، تاريخ فرنسا، والعيش في فرنسا." },
    { q: "ما مدة الامتحان المدني؟", a: "يستمر الامتحان المدني 45 دقيقة للإجابة على الأسئلة العشرين متعددة الخيارات." },
    { q: "هل تطبيق Test Civique مجاني؟", a: "نعم، يمكنك التدرب مجاناً على 5 أسئلة. الوصول غير المحدود إلى جميع الأسئلة وأوضاع التدريب يكلف 5€ مدى الحياة." },
  ],
};

export function buildSchema(lang: string, pageTitle: string, pageUrl: string, opts: { includeFaq?: boolean } = {}) {
  const l = (['fr', 'en', 'es', 'ar'] as const).includes(lang as Lang) ? (lang as Lang) : 'fr';

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": APP_NAME,
    "url": APP_URL,
    "logo": `${APP_URL}/pwa-icon-512.png`,
    "email": "contact@letestcivique.org",
    "sameAs": [APP_URL],
  };

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": APP_NAME,
    "url": APP_URL,
    "inLanguage": l,
    "description": APP_DESC[l],
    "publisher": { "@type": "Organization", "name": APP_NAME, "url": APP_URL },
  };

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": APP_NAME,
    "url": APP_URL,
    "description": APP_DESC[l],
    "applicationCategory": "EducationalApplication",
    "educationalUse": "Exam Preparation",
    "operatingSystem": "Web, iOS, Android",
    "inLanguage": l,
    "offers": [
      { "@type": "Offer", "price": "0", "priceCurrency": "EUR", "name": "Free trial (5 questions)" },
      { "@type": "Offer", "price": "5", "priceCurrency": "EUR", "name": "Lifetime premium access" },
    ],
    "audience": { "@type": "EducationalAudience", "educationalRole": "Candidate for French nationality" },
  };

  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "inLanguage": l,
    "mainEntity": FAQS[l].map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a },
    })),
  };

  const base = [organization, website, webApp];
  return opts.includeFaq ? [...base, faq] : base;
}

export function getFaqs(lang: string) {
  const l = (['fr', 'en', 'es', 'ar'] as const).includes(lang as Lang) ? (lang as Lang) : 'fr';
  return FAQS[l];
}
