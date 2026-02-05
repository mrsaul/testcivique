export const THEMES = {
  principes_valeurs: {
    id: 'principes_valeurs',
    name: 'Principes et Valeurs',
    shortName: 'Principes',
    description: 'Liberté, Égalité, Fraternité, Laïcité et symboles de la République',
    icon: 'Scale',
    color: 'theme-principes',
    bgClass: 'bg-theme-principes',
  },
  systeme_institutionnel: {
    id: 'systeme_institutionnel',
    name: 'Système Institutionnel',
    shortName: 'Institutions',
    description: 'Les trois pouvoirs, le Parlement, le Président et l\'Union Européenne',
    icon: 'Building2',
    color: 'theme-institutions',
    bgClass: 'bg-theme-institutions',
  },
  droits_devoirs: {
    id: 'droits_devoirs',
    name: 'Droits et Devoirs',
    shortName: 'Droits',
    description: 'DDHC de 1789, droit de vote, libertés individuelles et devoirs civiques',
    icon: 'FileText',
    color: 'theme-droits',
    bgClass: 'bg-theme-droits',
  },
  histoire_geographie: {
    id: 'histoire_geographie',
    name: 'Histoire et Géographie',
    shortName: 'Histoire',
    description: 'Dates clés, territoire français, culture et patrimoine',
    icon: 'MapPin',
    color: 'theme-histoire',
    bgClass: 'bg-theme-histoire',
  },
  vivre_societe: {
    id: 'vivre_societe',
    name: 'Vivre en France',
    shortName: 'Société',
    description: 'Éducation, travail, santé, famille et vie quotidienne',
    icon: 'Users',
    color: 'theme-vivre',
    bgClass: 'bg-theme-vivre',
  },
} as const;

export type ThemeId = keyof typeof THEMES;

export const EXAM_CONFIG = {
  totalQuestions: 40,
  passingScore: 32,
  passingPercentage: 80,
  dailyQuestionsGoal: 10,
  mockExamDuration: 45, // minutes
};

export const SESSION_TYPES = {
  daily: {
    name: 'Entraînement Quotidien',
    description: '10 questions variées pour s\'améliorer chaque jour',
    questionCount: 10,
    icon: 'Calendar',
  },
  theme: {
    name: 'Par Thème',
    description: 'Concentrez-vous sur un thème spécifique',
    questionCount: 10,
    icon: 'BookOpen',
  },
  mock_exam: {
    name: 'Examen Blanc',
    description: 'Simulez les conditions réelles de l\'examen',
    questionCount: 40,
    icon: 'GraduationCap',
  },
} as const;
