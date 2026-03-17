import type { SnackbarColor } from '@/classes/models/modelComponents/ModelSnackbar'
import { defineStore } from 'pinia'
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const { te, t } = useI18n();

  const visible = ref(false)
  const message = ref('')
  const color = ref<SnackbarColor>('success')

  function showSnackbar(msg: string, colorType: SnackbarColor = 'success') {
    visible.value = false
    const messageSnackbar = te(msg) ? t(msg) : msg

    setTimeout(() => {
      message.value = messageSnackbar
      color.value = colorType
      visible.value = true
    }, 100)
  }

  function hideSnackbar() {
    visible.value = false
  }

  return {
    visible,
    message,
    color,
    showSnackbar,
    hideSnackbar,
  }
})
