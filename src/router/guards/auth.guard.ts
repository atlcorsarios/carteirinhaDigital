import { supabase } from '@/services/supabase'
import { useAuthStore } from '@/stores/authStore'
import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'

export const authGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext
) => {
  const requiresAuth = to.meta.requiresAuth
  const authStore = useAuthStore()

  // pega a sessão real do Supabase
  const { data: { session } } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  if (requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  if (isAuthenticated) {
    if (to.name === 'Login') {
      next({ name: 'Home' })
      return
    }

    if (!authStore.userProfile && session?.user?.id) {
      await authStore.fetchUser(session.user.id)
    }

    const isProfileComplete = !!authStore.userProfile?.documento
    if (!isProfileComplete && to.name !== 'Onboarding') {
      next({ name: 'Onboarding' })
      return
    }

    if (isProfileComplete && to.name === 'Onboarding') {
      next({ name: 'Home' })
      return
    }
  }

  next()
}
