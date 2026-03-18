import type { NavigationGuardNext, RouteLocationNormalized } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { useSnackbar } from '@/composables/useSnackbar'

export const rbacGuard = async (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
) => {
  const authStore = useAuthStore()
  const { notify } = useSnackbar()

  const authorizedRoles = to.meta.authorize as string[] | undefined

  if (!authorizedRoles || authorizedRoles.length === 0) {
    return next()
  }

  if (!authStore.userProfile && authStore.user?.id) {
    await authStore.fetchUser(authStore.user.id)
  }

  if (!authStore.userProfile) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }

  const userRole = authStore.userProfile.cargo

  if (authorizedRoles.includes(userRole)) {
    next()
  } else {
    notify('messages.errors.accessDenied', 'error')
    next({ name: 'Forbidden' })
  }
}
