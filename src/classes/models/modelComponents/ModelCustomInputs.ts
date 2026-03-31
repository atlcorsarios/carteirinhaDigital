import type { Density } from 'vuetify/lib/composables/density.mjs';

export interface IPropsCustomInputs {
  label?: string
  hint?: string
  density?: Density | undefined
  variant?: "outlined" | "filled" | "plain" | "solo" | "solo-filled" | "solo-inverted" | "underlined" | undefined
  disabled?: boolean
  size?: number | string
  rules?: any[]
}
