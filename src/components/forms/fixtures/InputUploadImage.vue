<template>
  <div class="d-flex flex-column align-center justify-center">
    <div class="avatar-wrapper position-relative" @click="triggerInput">
      <v-avatar
        size="120"
        color="grey-lighten-3"
        class="elevation-2 cursor-pointer border"
      >
        <v-img v-if="displayUrl" :src="displayUrl" cover>
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular indeterminate color="primary" v-if="isProcessing" />
              <v-icon v-else icon="mdi-image" size="48" color="grey-darken-1" />
            </div>
          </template>
        </v-img>

        <div v-else class="d-flex align-center justify-center fill-height w-100">
          <v-progress-circular indeterminate color="primary" v-if="isProcessing" />
          <v-icon v-else icon="mdi-camera-plus" size="48" color="grey-darken-1" />
        </div>
      </v-avatar>

      <v-btn
        icon="mdi-camera"
        size="small"
        color="primary"
        elevation="4"
        class="camera-badge"
        @click.stop="triggerInput"
        :disabled="isProcessing || disabled"
        v-tooltip="t('tooltips.forms.attach') || 'Alterar foto'"
      />
    </div>

    <div v-if="label" class="text-caption mt-2 text-medium-emphasis">
      <v-progress-circular v-if="isProcessing" color="primary" indeterminate :size="40" />
      <p v-else>
        {{ t(label) }}
      </p>
    </div>

    <input
      ref="fileInputRef"
      type="file"
      :accept="accept"
      capture="environment"
      class="d-none"
      @change="handleFileSelection"
    />
  </div>
</template>

<script setup lang="ts">
import imageCompression from 'browser-image-compression'
import { supabase } from '@/services/supabase'
import { sanitizeName } from '@/utils/sanitizeForBucket'
import { useSnackbar } from '@/composables/useSnackbar'
import { useAuthStore } from '@/stores/authStore';
import { useI18n } from 'vue-i18n'
import { ref, computed } from 'vue'

const { t } = useI18n()
const { notify } = useSnackbar()
const authStore = useAuthStore()

const modelUrl = defineModel<string>('url', { required: false, default: '' });

const props = withDefaults(defineProps<{
  label?: string
  bucket: string
  pathPrefix?: string
  fileName?: string
  disabled?: boolean
  accept?: string
  compressionOptions?: Object
}>(), {
  label: 'forms.formUser.avatar_url.label',
  pathPrefix: 'uploads',
  fileName: '',
  disabled: false,
  accept: 'image/*',
  compressionOptions: () => ({
    maxSizeMB: 1,
    maxWidthOrHeight: 1080,
    useWebWorker: true,
    fileType: 'image/webp',
    initialQuality: 0.8
  })
})

const fileInputRef = ref<HTMLInputElement | null>(null)
const isProcessing = ref(false)
const localPreview = ref('')

const displayUrl = computed(() => localPreview.value || modelUrl.value)
const owner = computed(() => {
  const idUser = String(authStore.userProfile?.id)
  if (idUser === undefined || idUser === '') throw new Error('id undefined')
  return sanitizeName(idUser);
})

function triggerInput() {
  if (!isProcessing.value && !props.disabled) {
    fileInputRef.value?.click()
  }
}

async function handleFileSelection(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  try {
    isProcessing.value = true

    if (localPreview.value) URL.revokeObjectURL(localPreview.value)
    localPreview.value = URL.createObjectURL(file)

    const compressedFile = await imageCompression(file, props.compressionOptions)

    const fileExt = compressedFile.name.split('.').pop()
    const originalNameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
    const sanitizedFileName = sanitizeName(originalNameWithoutExt)
    const fileName = `${props.pathPrefix}/${owner.value}/${sanitizedFileName}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from(props.bucket)
      .upload(fileName, compressedFile, { upsert: true })

    if (uploadError) {
      notify(uploadError, "error")
      throw uploadError
    }

    const { data } = supabase.storage
      .from(props.bucket)
      .getPublicUrl(fileName)

    modelUrl.value = data.publicUrl

  } catch (error) {
    notify(error, 'error')
    localPreview.value = ''
  } finally {
    isProcessing.value = false
    if (target) target.value = ''
  }
}
</script>

<style scoped>
.avatar-wrapper {
  display: inline-block;
  border-radius: 50%;
}

.camera-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translate(10%, 10%);
  border: 2px solid white !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
