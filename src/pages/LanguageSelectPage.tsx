import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const languages = [
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦' },
];

export default function LanguageSelectPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const selectLanguage = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem('i18nextLng', code);
    navigate('/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center mb-6">
        <span className="text-white font-bold text-lg">🇫🇷</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-center">
        Choisissez votre langue
      </h1>
      <p className="text-muted-foreground mb-10 text-center">
        Select your language / اختر لغتك
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        {languages.map((lang) => (
          <Button
            key={lang.code}
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 gap-3 min-w-[180px]"
            onClick={() => selectLanguage(lang.code)}
          >
            <span className="text-2xl">{lang.flag}</span>
            {lang.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
