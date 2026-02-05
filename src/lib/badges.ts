import { Trophy, Flame, Star, BookOpen, Target, Award, Zap, Crown, Medal, Sparkles } from 'lucide-react';

export type BadgeType = 
  | 'first_quiz'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'perfect_quiz'
  | 'theme_master_principes'
  | 'theme_master_institutions'
  | 'theme_master_droits'
  | 'theme_master_histoire'
  | 'theme_master_vivre'
  | 'questions_50'
  | 'questions_100'
  | 'questions_500'
  | 'exam_passed'
  | 'all_themes_started';

export interface BadgeDefinition {
  id: BadgeType;
  name: string;
  description: string;
  icon: typeof Trophy;
  color: string;
  bgColor: string;
}

export const BADGES: Record<BadgeType, BadgeDefinition> = {
  first_quiz: {
    id: 'first_quiz',
    name: 'Premier Pas',
    description: 'Complétez votre premier quiz',
    icon: Star,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-100',
  },
  streak_3: {
    id: 'streak_3',
    name: 'Régulier',
    description: '3 jours de série',
    icon: Flame,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
  },
  streak_7: {
    id: 'streak_7',
    name: 'Déterminé',
    description: '7 jours de série',
    icon: Flame,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  streak_30: {
    id: 'streak_30',
    name: 'Inarrêtable',
    description: '30 jours de série',
    icon: Crown,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  perfect_quiz: {
    id: 'perfect_quiz',
    name: 'Sans Faute',
    description: '100% sur un quiz',
    icon: Zap,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
  },
  theme_master_principes: {
    id: 'theme_master_principes',
    name: 'Maître des Principes',
    description: '100% sur le thème Principes et Valeurs',
    icon: Award,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  theme_master_institutions: {
    id: 'theme_master_institutions',
    name: 'Maître des Institutions',
    description: '100% sur le thème Système Institutionnel',
    icon: Award,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
  },
  theme_master_droits: {
    id: 'theme_master_droits',
    name: 'Maître des Droits',
    description: '100% sur le thème Droits et Devoirs',
    icon: Award,
    color: 'text-emerald-500',
    bgColor: 'bg-emerald-100',
  },
  theme_master_histoire: {
    id: 'theme_master_histoire',
    name: 'Maître de l\'Histoire',
    description: '100% sur le thème Histoire et Géographie',
    icon: Award,
    color: 'text-amber-500',
    bgColor: 'bg-amber-100',
  },
  theme_master_vivre: {
    id: 'theme_master_vivre',
    name: 'Maître de la Société',
    description: '100% sur le thème Vivre en France',
    icon: Award,
    color: 'text-rose-500',
    bgColor: 'bg-rose-100',
  },
  questions_50: {
    id: 'questions_50',
    name: 'Apprenti',
    description: '50 questions répondues',
    icon: Target,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  questions_100: {
    id: 'questions_100',
    name: 'Confirmé',
    description: '100 questions répondues',
    icon: Medal,
    color: 'text-indigo-500',
    bgColor: 'bg-indigo-100',
  },
  questions_500: {
    id: 'questions_500',
    name: 'Expert',
    description: '500 questions répondues',
    icon: Trophy,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  exam_passed: {
    id: 'exam_passed',
    name: 'Examen Réussi',
    description: 'Réussir un examen blanc (80%+)',
    icon: Trophy,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  all_themes_started: {
    id: 'all_themes_started',
    name: 'Explorateur',
    description: 'Commencer les 5 thèmes',
    icon: Sparkles,
    color: 'text-violet-500',
    bgColor: 'bg-violet-100',
  },
};

export const BADGE_ORDER: BadgeType[] = [
  'first_quiz',
  'perfect_quiz',
  'streak_3',
  'streak_7',
  'streak_30',
  'questions_50',
  'questions_100',
  'questions_500',
  'all_themes_started',
  'theme_master_principes',
  'theme_master_institutions',
  'theme_master_droits',
  'theme_master_histoire',
  'theme_master_vivre',
  'exam_passed',
];
