import * as React from 'npm:react@18.3.1'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Props {
  firstName?: string
  amountLabel?: string
  receiptUrl?: string
  examUrl?: string
}

const Email = ({
  firstName,
  amountLabel = '5,00 €',
  receiptUrl,
  examUrl = 'https://letestcivique.org/quiz/mock-exam',
}: Props) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>Bienvenue dans Le Test Civique Premium — accès illimité activé 🎉</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>Le Test Civique</Heading>
        </Section>

        <Section style={card}>
          <Heading style={h1}>Bienvenue en Premium 🎉</Heading>
          <Text style={text}>
            {firstName ? `Bonjour ${firstName},` : 'Bonjour,'}
          </Text>
          <Text style={text}>
            Merci pour votre confiance ! Votre accès <strong>illimité à vie</strong> est
            désormais activé. Vous pouvez enchaîner autant de questions, de thèmes et
            d'examens blancs que vous voulez.
          </Text>

          <Section style={ctaWrap}>
            <Button style={cta} href={examUrl}>
              Lancer un examen blanc
            </Button>
          </Section>

          <Hr style={hr} />

          <Heading as="h2" style={h2}>Reçu</Heading>
          <Text style={receiptLine}>
            <strong>Montant :</strong> {amountLabel}
          </Text>
          <Text style={receiptLine}>
            <strong>Produit :</strong> Le Test Civique — Accès Premium à vie
          </Text>
          {receiptUrl ? (
            <Text style={text}>
              Reçu détaillé Stripe :{' '}
              <a href={receiptUrl} style={link}>Télécharger</a>
            </Text>
          ) : null}

          <Hr style={hr} />

          <Text style={smallText}>
            Une question ? Répondez simplement à cet email.
          </Text>
        </Section>

        <Text style={footer}>
          Le Test Civique — préparation à l'examen civique français
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Bienvenue en Premium — accès illimité activé 🎉',
  displayName: 'Bienvenue Premium',
  previewData: {
    firstName: 'Marie',
    amountLabel: '5,00 €',
    receiptUrl: 'https://pay.stripe.com/receipts/example',
    examUrl: 'https://letestcivique.org/quiz/mock-exam',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', color: '#1f2937' }
const container = { margin: '0 auto', padding: '24px 16px', maxWidth: '560px' }
const header = { textAlign: 'center' as const, paddingBottom: '8px' }
const brand = { fontSize: '20px', fontWeight: 700, color: '#0ea5e9', margin: 0 }
const card = { backgroundColor: '#f8fafc', borderRadius: '16px', padding: '28px 24px', border: '1px solid #e2e8f0' }
const h1 = { fontSize: '24px', fontWeight: 700, margin: '0 0 12px', color: '#0f172a' }
const h2 = { fontSize: '16px', fontWeight: 700, margin: '8px 0', color: '#0f172a' }
const text = { fontSize: '15px', lineHeight: '24px', margin: '10px 0', color: '#334155' }
const receiptLine = { fontSize: '14px', margin: '4px 0', color: '#334155' }
const smallText = { fontSize: '13px', color: '#64748b', margin: '8px 0 0' }
const ctaWrap = { textAlign: 'center' as const, margin: '20px 0 8px' }
const cta = {
  backgroundColor: '#22c55e',
  color: '#ffffff',
  borderRadius: '9999px',
  padding: '12px 24px',
  fontSize: '15px',
  fontWeight: 700,
  textDecoration: 'none',
  display: 'inline-block',
}
const hr = { borderColor: '#e2e8f0', margin: '20px 0' }
const link = { color: '#0ea5e9', textDecoration: 'underline' }
const footer = { fontSize: '12px', color: '#94a3b8', textAlign: 'center' as const, marginTop: '16px' }
