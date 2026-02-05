import { Layout } from '@/components/layout/Layout';
import { ThemeCard } from '@/components/dashboard/ThemeCard';
import { THEMES, ThemeId } from '@/lib/constants';

export default function ThemesPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-display font-bold">
            Entraînement par thème
          </h1>
          <p className="text-muted-foreground">
            Choisissez un thème pour vous concentrer sur un sujet spécifique.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(Object.keys(THEMES) as ThemeId[]).map((themeId) => (
            <ThemeCard key={themeId} themeId={themeId} progress={0} className="h-full" />
          ))}
        </div>
      </div>
    </Layout>
  );
}
