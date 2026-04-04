import { useSnackbar } from '@/composables/useSnackbar'
import { useAuthStore } from '@/stores/authStore'
import { supabase } from '@/services/supabase'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const requiresAuth = to.meta.requiresAuth
  const authStore = useAuthStore()
  const { notify } = useSnackbar()

  // pega a sessão real do Supabase
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (isAuthenticated) {
    if (!authStore.userProfile && session?.user?.id) {
      await authStore.fetchUser(session.user.id)
    }

    if (!authStore.userProfile?.usuario_ativo) {
      notify('messages.errors.accessInactive', 'error');
      next({ name: 'Forbidden' });
    }

    if (to.name === 'Login') {
      next({ name: 'Home' })
      return
    }

    const isProfileComplete = !!authStore.userProfile?.documento
    if (!isProfileComplete && to.name !== 'Onboarding') {
      next({ name: 'Onboarding' })
      return
    }

    // if (isProfileComplete && to.name === 'Onboarding') {
    //   next({ name: 'Home' })
    //   return
    // }
  }

  next()
}
