import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import http from '@/services/axios'
import { useListCacheStore } from './listCacheStore'
import { ClassUsers } from '@/classes/resources/ClassUsers'
import type { IUser } from '@/classes/models/resources/ModelUser'
import type { IVerifyWithOtp } from '@/classes/models/modelOtp/IVerifyWithOtp'
import type { IOTPVerifyOptions } from '@/composables/useOTPVerify'

export const useAuthStore = defineStore('auth', () => {
  const classUser = new ClassUsers({
    email: 'avelito@gmail.com',
    username: 'AVELITO',
    role: 'ADMIN',
  })
  const user = ref<IUser | undefined>(classUser.model)
  const token = ref(localStorage.getItem('token') || null)
  const isAuthenticated = true // computed(() => !!token.value);
  const listCacheStore = useListCacheStore()
  const isAdmin = true // computed(() => user.value?.role === 'ADMIN');

  async function fetchUser() {
    if (!token.value) return
    try {
      const res = await http.get('/api/me')
      user.value = res.data
    } catch (error) {
      logout()
    }
  }

  function logout() {
    token.value = null
    user.value = undefined
    localStorage.removeItem('token')
    listCacheStore.clearAll()
  }

  async function generateOTP(emailSender: string, options: IOTPVerifyOptions = {}) {}

  async function verify(payload: IVerifyWithOtp, options: IOTPVerifyOptions = {}) {}

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    fetchUser,
    logout,
    generateOTP,
    verify
  }
})
