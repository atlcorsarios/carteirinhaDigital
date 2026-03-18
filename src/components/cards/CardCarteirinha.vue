<template>
  <v-card
    class="mx-auto carteirinha-card elevation-10"
    max-width="800"
    width="100%"
  >  
    <div class="titulo-absoluto">
      <h5
        class="text-white text-uppercase font-weight-black titulo-carteirinha"
        :class="{ 'text-body-1': mobile, 'text-h5': !mobile }"
      >
        {{ t('cardPass.title') }}
      </h5>
    </div>

    <div class="safe-zone">
      <v-row class="ma-0 w-100" align="center">
        <v-col cols="4" class="d-flex justify-center align-center pa-0">
          <v-avatar
            :size="mobile ? 50 : 125"
            class="border-avatar elevation-5"
          >
            <v-img
              v-if="authStore.userProfile?.avatar_url"
              :src="authStore.userProfile.avatar_url"
              cover
            />

            <v-icon
              v-else
              :size="mobile ? 28 : 60"
              color="grey"
              icon="mdi-camera-off"
            />
          </v-avatar>
        </v-col>

        <v-col cols="8" class="py-0 info-col">
          <div class="mb-1 mb-sm-4">
            <div class="info-label">{{ t('cardPass.fields.name') }}</div>
            <div
              class="text-white font-weight-black text-uppercase text-truncate"
              :class="[ mobile ? 'text-caption' : 'text-h6' ]"
              style="line-height: 1.2;"
            >
              {{ authStore.userProfile?.username || authStore.user?.user_metadata?.full_name }}
            </div>
          </div>

          <v-row no-gutters class="mb-1 mb-sm-4 align-center">
            <v-col cols="12" sm="6" class="mb-1 mb-sm-0 pr-sm-2">
              <div class="info-label mb-sm-1">{{ t('cardPass.fields.role') }}</div>
              <v-chip
                :size="mobile ? 'x-small' : 'default'"
                density="compact"
                color="amber-darken-2"
                variant="elevated"
                elevation="2"
                class="font-weight-bold text-uppercase px-2"
              >
                <v-icon
                  start
                  icon="mdi-shield-star"
                  :size="mobile ? 10 : 16"
                  class="mr-1"
                />
                {{ authStore.userProfile?.cargo }}
              </v-chip>
            </v-col>

            <v-col cols="12" sm="6">
              <div class="info-label mb-1">{{ t('cardPass.fields.valid') }}</div>
              <div class="font-weight-black d-flex align-center"
                :class="[
                  mobile ? 'text-caption' : 'text-h6',
                  (isVencida && !loadingAssinatura) ? 'text-red-accent-2' : 'text-green-accent-3'
                ]"
                style="line-height: 1;"
              >
                <v-icon
                  start
                  :icon="(isVencida && !loadingAssinatura) ? 'mdi-calendar-remove' : 'mdi-calendar-check'"
                  :size="mobile ? 12 : 18"
                  class="mr-1"
                />
                
                <v-skeleton-loader
                  v-if="loadingAssinatura"
                  type="text"
                  :width="mobile ? 50 : 80"
                  class="d-inline-flex bg-transparent mt-1 loader-validade"
                />

                <span v-else>{{ dataValidadeFormatada }}</span>
              </div>
            </v-col>
          </v-row>

          <div>
            <div class="info-label mb-sm-1">{{ t('cardPass.fields.reg') }}</div>
            <v-chip
              color="primary"
              variant="flat"
              :size="mobile ? 'x-small' : 'default'"
              density="compact"
              class="px-2 elevation-2"
              style="max-width: 90%;"
              @click="copiarRegistro"
            >
              <span
                class="font-weight-mono text-uppercase text-truncate"
                :style="mobile ? 'font-size: 0.6rem;' : ''"
              >
                {{ shortId }}
              </span>
              <v-icon
                right
                :size="mobile ? 10 : 16"
                class="ml-1 ml-sm-2"
                icon="mdi-content-copy"
              />
            </v-chip>
          </div>
        </v-col>
      </v-row>

      <div class="qr-wrapper elevation-4">
        <qrcode-vue
          :value="qrCodeUrl"
          :size="mobile ? 35 : 75"
          level="M"
        />
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import { AssinaturaService } from '@/services/resources/assinaturasService'
import { useAuthStore } from '@/stores/authStore'
import { useSnackbar } from '@/composables/useSnackbar'
import { useDisplay } from 'vuetify'
import { useI18n } from 'vue-i18n'
import { computed, ref, onMounted } from 'vue'

const authStore = useAuthStore()
const { mobile } = useDisplay()
const { notify } = useSnackbar()
const { t } = useI18n()

const dataVencimento = ref<string | null>(null)
const loadingAssinatura = ref(true)

onMounted(async () => {
  const userId = String(authStore.userProfile?.id)
  if (userId && userId !== 'undefined') {
    try {
      loadingAssinatura.value = true
      const assinatura = await AssinaturaService.buscarAssinaturaPorUsuarioId(userId)
      if (assinatura) {
        dataVencimento.value = assinatura.data_vencimento
      }
    } catch (error) {
      console.error(error)
      notify(error, 'error')
    } finally {
      loadingAssinatura.value = false
    }
  } else {
    loadingAssinatura.value = false
  }
})

const dataValidadeFormatada = computed(() => {
  if (!dataVencimento.value) return t('cardPass.status.inactive')
  return new Date(dataVencimento.value).toLocaleDateString('pt-BR')
})

const isVencida = computed(() => {
  if (!dataVencimento.value) return true
  return new Date(dataVencimento.value) < new Date()
})

const fullId = computed(() => String(authStore.userProfile?.id || ''))
const shortId = computed(() => fullId.value.split('-')[0])

const copiarRegistro = async () => {
  try {
    if (!fullId.value) return
    await navigator.clipboard.writeText(fullId.value)
    notify('messages.copy')
  } catch (error) {
    notify(error, 'error')
  }
}

const qrCodeUrl = computed(() => {
  const baseUrl = window.location.origin
  return `${baseUrl}/validar/${fullId.value}`
})

</script>

<style scoped src="@/assets/components/cardCarteirinha.css"></style>
