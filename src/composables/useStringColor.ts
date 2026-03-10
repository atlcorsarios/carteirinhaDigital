import { useTheme } from 'vuetify'
import { computed } from 'vue'

export function useStringColor() {
  const theme = useTheme()
  const isDark = computed(() => theme.global.current.value.dark)

  const stringToColor = (str: string): string => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    const hue = Math.abs(hash % 360)
    const saturation = isDark.value ? 60 : 70
    const lightness = isDark.value ? 45 : 40
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
  }

  return { stringToColor }
}
