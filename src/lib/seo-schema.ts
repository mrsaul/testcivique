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
    { q: "Qu'est-ce que l'examen civique français ?", a: "L'examen civique évalue la connaissance de l'histoire, de la géographie, de la culture, des institutions et des valeurs de la société française. Il est obligatoire pour obtenir la nationalité française par décret." },
    { q: "Quel score faut-il obtenir pour réussir l'examen civique ?", a: "Depuis le 1er janvier 2026, il faut obtenir au moins 80% de bonnes réponses, soit 32 sur 40 questions, pour valider l'examen civique." },
    { q: "Combien de questions y a-t-il à l'examen civique ?", a: "Depuis le 1er janvier 2026, l'examen comporte 40 questions à choix multiples passées sur ordinateur : 28 questions de connaissances (histoire, géographie, institutions, valeurs) et 12 questions de mise en situation." },
    { q: "Quels sont les 5 thèmes de l'examen civique ?", a: "Les 5 thèmes sont : les principes et valeurs de la République, les institutions, les droits et devoirs, l'histoire, la géographie et la culture, et vivre dans la société française." },
    { q: "Combien de temps dure l'examen civique ?", a: "L'examen civique dure 45 minutes pour répondre aux 40 questions à choix multiples sur ordinateur." },
    { q: "Qu'est-ce qu'une question de mise en situation à l'examen civique ?", a: "Introduites au 1er janvier 2026, les 12 questions de mise en situation présentent un scénario concret de la vie quotidienne en France (démarches administratives, vie professionnelle, école, santé, laïcité) et demandent d'identifier la bonne conduite à tenir. Elles diffèrent des 28 questions de connaissances qui portent sur des faits (dates, institutions, symboles) : ici on évalue la compréhension pratique des règles et valeurs républicaines, pas la mémorisation." },
    { q: "L'application Test Civique est-elle gratuite ?", a: "Oui, vous pouvez vous entraîner gratuitement sur 5 questions. L'accès illimité à toutes les questions et modes d'entraînement coûte 5€ à vie." },
  ],
  en: [
    { q: "What is the French civic exam?", a: "The French civic exam tests knowledge of France's history, geography, culture, institutions and republican values. It is required to obtain French nationality by decree." },
    { q: "What score is needed to pass the French civic exam?", a: "Since January 1, 2026, you need at least 80% correct answers — 32 out of 40 questions — to pass the civic exam." },
    { q: "How many questions are on the French civic exam?", a: "Since January 1, 2026, the exam consists of 40 multiple-choice questions taken on a computer: 28 knowledge questions (history, geography, institutions, values) plus 12 situational questions." },
    { q: "What are the 5 themes of the civic exam?", a: "The 5 themes are: principles and values of the Republic, institutions, rights and duties, history/geography/culture, and living in French society." },
    { q: "How long does the civic exam last?", a: "The civic exam lasts 45 minutes to answer the 40 multiple-choice questions on computer." },
    { q: "What is a situational (mise en situation) question on the French civic exam?", a: "Introduced on January 1, 2026, the 12 situational questions describe a concrete everyday scenario in France (administrative procedures, work, school, healthcare, secularism) and ask you to identify the correct behavior. They differ from the 28 knowledge questions, which test facts (dates, institutions, symbols): situational questions assess practical understanding of republican rules and values, not memorization." },
    { q: "Is the Test Civique app free?", a: "Yes, you can practice for free on 5 questions. Unlimited access to all questions and training modes costs €5 for life." },
  ],
  es: [
    { q: "¿Qué es el examen cívico francés?", a: "El examen cívico evalúa el conocimiento de la historia, la geografía, la cultura, las instituciones y los valores republicanos de Francia. Es obligatorio para obtener la nacionalidad francesa por decreto." },
    { q: "¿Qué puntaje se necesita para aprobar el examen cívico?", a: "Desde el 1 de enero de 2026, necesitas al menos un 80% de respuestas correctas (32 sobre 40) para aprobar el examen cívico." },
    { q: "¿Cuántas preguntas tiene el examen cívico?", a: "Desde el 1 de enero de 2026, el examen consta de 40 preguntas de opción múltiple realizadas por ordenador: 28 preguntas de conocimientos (historia, geografía, instituciones, valores) y 12 preguntas de situación práctica." },
    { q: "¿Cuáles son los 5 temas del examen cívico?", a: "Los 5 temas son: principios y valores de la República, instituciones, derechos y deberes, historia/geografía/cultura, y vivir en la sociedad francesa." },
    { q: "¿Cuánto dura el examen cívico?", a: "El examen cívico dura 45 minutos para responder a las 40 preguntas de opción múltiple por ordenador." },
    { q: "¿Qué es una pregunta de situación (mise en situation) en el examen cívico?", a: "Introducidas el 1 de enero de 2026, las 12 preguntas de situación presentan un escenario concreto de la vida cotidiana en Francia (trámites, trabajo, escuela, salud, laicidad) y piden identificar la conducta correcta. Se diferencian de las 28 preguntas de conocimientos, que evalúan hechos (fechas, instituciones, símbolos): aquí se mide la comprensión práctica de las reglas y valores republicanos, no la memorización." },
    { q: "¿La aplicación Test Civique es gratuita?", a: "Sí, puedes practicar gratis con 5 preguntas. El acceso ilimitado a todas las preguntas y modos de entrenamiento cuesta 5€ de por vida." },
  ],
  ar: [
    { q: "ما هو الامتحان المدني الفرنسي؟", a: "يقيّم الامتحان المدني المعرفة بتاريخ فرنسا وجغرافيتها وثقافتها ومؤسساتها وقيم الجمهورية. وهو إلزامي للحصول على الجنسية الفرنسية بمرسوم." },
    { q: "ما النتيجة المطلوبة لاجتياز الامتحان المدني؟", a: "منذ 1 يناير 2026، تحتاج إلى 80% على الأقل من الإجابات الصحيحة، أي 32 من أصل 40 سؤالاً، لاجتياز الامتحان المدني." },
    { q: "كم عدد الأسئلة في الامتحان المدني؟", a: "منذ 1 يناير 2026، يتألف الامتحان من 40 سؤالاً متعدد الخيارات يُجرى على الحاسوب: 28 سؤالاً للمعرفة (التاريخ، الجغرافيا، المؤسسات، القيم) و12 سؤالاً للمحاكاة العملية (mise en situation)." },
    { q: "ما هي المواضيع الخمسة للامتحان المدني؟", a: "المواضيع الخمسة هي: مبادئ وقيم الجمهورية، المؤسسات، الحقوق والواجبات، التاريخ والجغرافيا والثقافة، والعيش في المجتمع الفرنسي." },
    { q: "ما مدة الامتحان المدني؟", a: "يستمر الامتحان المدني 45 دقيقة للإجابة على 40 سؤالاً متعدد الخيارات على الحاسوب." },
    { q: "ما هو سؤال المحاكاة العملية (mise en situation) في الامتحان المدني؟", a: "أُدرجت في 1 يناير 2026، وتقدّم أسئلة المحاكاة الاثنا عشر سيناريو ملموساً من الحياة اليومية في فرنسا (الإجراءات الإدارية، العمل، المدرسة، الصحة، العلمانية) وتطلب تحديد السلوك الصحيح. وهي تختلف عن أسئلة المعرفة الثمانية والعشرين التي تقيس الوقائع (التواريخ، المؤسسات، الرموز): إذ تقيّم هنا الفهم العملي لقواعد الجمهورية وقيمها، لا الحفظ." },
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
