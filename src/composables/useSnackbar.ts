import type { SnackbarColor } from '@/classes/models/modelComponents/ModelSnackbar'
import { useSnackbarStore } from '@/stores/SnackbarStore'
import { extractErrorMessage } from '@/utils/extractError';

export function useSnackbar() {
  const store = useSnackbarStore()

  const notify = (message: unknown | string, color: SnackbarColor = 'success') => {
    if (typeof message === 'string') {
      store.showSnackbar(message, color);
      return;
    }

    const errorMessage = extractErrorMessage(message, 'errors.unknown');
    store.showSnackbar(errorMessage, color);
  }

  const close = () => {
    store.hideSnackbar()
  }

  return {
    notify,
    close
  }
}
