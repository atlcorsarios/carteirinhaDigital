import type { IUser } from '@/classes/models/resources/ModelUsuarios'
import { supabase } from '@/services/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { useRoute } from 'vue-router'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const userProfile = ref<IUser | null>(null)
  const fetchPromise = ref<Promise<any> | null>(null)
  const loading = ref(true)

  const route = useRoute()

  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => userProfile.value?.cargo === 'diretoria')
  const isProfileComplete = computed(() => !!userProfile.value?.documento || !!userProfile.value?.cargo)

  async function fetchUser(userId: string) {
    if (!userId) return

    if (userProfile.value?.id === userId) {
      return userProfile.value
    }

    if (fetchPromise.value) {
      return fetchPromise.value
    }

    fetchPromise.value = (async () => {
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', userId)
          .single()

        if (!error && data) {
          userProfile.value = data
          return data
        }
      } finally {
        fetchPromise.value = null
      }
    })()

    return fetchPromise.value
  }

  async function initializeAuth() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user || null

    if (window.location.hash.includes('access_token')) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    if (user.value) {
      await fetchUser(user.value.id)
    }

    loading.value = false

    supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      session.value = currentSession
      user.value = currentSession?.user || null
      if (user.value) {
        await fetchUser(user.value.id)

        const { default: router } = await import('@/router')
        if (!isProfileComplete.value && router.currentRoute.value.name !== 'Onboarding') {
          router.push({ name: 'Onboarding' })
        }
      } else {
        userProfile.value = null
      }
    })
  }

  async function loginWithGoogle() {
    const redirectPath = (route.query.redirect as string) || '/';
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}${redirectPath}`
      }
    })
    if (error) throw error
  }

  async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error

    user.value = null
    session.value = null
    userProfile.value = null

    const { default: router } = await import('@/router')
    router.push({ name: 'Login' })
  }

  return {
    user,
    session,
    userProfile,
    loading,
    isAuthenticated,
    isAdmin,
    isProfileComplete,
    initializeAuth,
    loginWithGoogle,
    logout,
    fetchUser
  }
})
