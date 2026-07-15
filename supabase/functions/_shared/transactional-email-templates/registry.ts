import * as React from 'npm:react@18.3.1'
import { template as premiumWelcome } from './premium-welcome.tsx'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: any) => string)
  displayName?: string
  previewData?: Record<string, unknown>
  to?: string
}

export const TEMPLATES: Record<string, TemplateEntry> = {
  'premium-welcome': premiumWelcome,
}
