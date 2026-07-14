import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { Gift, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function RedeemCodeCard() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('redeem-partner-code', {
        body: { code: code.trim() },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      toast.success(
        `🎉 Premium activé (${data.months} mois) — offert par ${data.partner_name}`,
      );
      setCode('');
      queryClient.invalidateQueries({ queryKey: ['premium-status'] });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    } catch (err: any) {
      const msg = err?.context ? await err.context.text().catch(() => err.message) : err.message;
      toast.error(msg || 'Code invalide');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Gift className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Vous avez un code partenaire ?</h3>
            <p className="text-sm text-muted-foreground">
              Association, mairie ou centre d'accompagnement — activez votre accès premium offert.
            </p>
          </div>
        </div>
        <form onSubmit={handleRedeem} className="flex gap-2">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="CIMADE2026"
            className="uppercase"
            disabled={loading}
            maxLength={40}
          />
          <Button type="submit" disabled={loading || !code.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Activer'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
