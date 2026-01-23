<template>
  <div class="input-upload-image position-relative">
    <div class="d-flex justify-space-between align-center mb-1">
      <div class="text-caption text-medium-emphasis">{{ label }}</div>
      <v-btn
        v-if="!modelValue && !isCompressing && !disabled"
        icon="mdi-paperclip"
        variant="text"
        density="compact"
        color="primary"
        @click="triggerCamera"
        v-tooltip="t('tooltips.forms.attach')"
      />
    </div>

    <v-file-upload
      ref="fileUploadRef"
      :model-value="rawFiles"
      :disabled="disabled || isCompressing"
      :accept="accept"
      :clearable="!isCompressing"
      :title="titleText"
      density="compact"
      variant="outlined"
      :height="isCompressing || rawFiles.length ? 'auto' : 60"
      max-height="80"
      icon="mdi-upload"
      class="custom-file-upload"
      @update:model-value="handleFileSelection"
    >
      <template v-slot:item="{ props: itemProps }">
        <v-file-upload-item v-bind="itemProps" lines="one" nav>
          <template v-slot:prepend>
            <v-avatar size="48" rounded class="mr-2 border">
              <v-img
                v-if="rawFiles[0]?.type.startsWith('image/')"
                :src="previewUrl"
                cover
                alt="Preview"
              >
                <template v-slot:placeholder>
                  <v-icon icon="mdi-image" />
                </template>
              </v-img>

              <v-icon
                v-else
                icon="mdi-file-document-outline"
                color="medium-emphasis"
              />
            </v-avatar>
          </template>

          <template v-slot:title>
            <div class="text-subtitle-2 text-truncate">
              {{ fileName }}
            </div>
          </template>

          <template v-slot:subtitle>
            <span class="text-caption">
              {{ fileSizeFormatted }}
            </span>
          </template>
        </v-file-upload-item>
      </template>
    </v-file-upload>

    <v-progress-linear
      v-if="isCompressing"
      indeterminate
      color="primary"
      height="2"
      class="position-absolute bottom-0 w-100"
    />

    <input
      ref="cameraInputRef"
      type="file"
      :accept="accept"
      capture="environment"
      style="display: none"
      @change="handleCameraCapture"
    />
  </div>
</template>

<script setup lang="ts">
import imageCompression from 'browser-image-compression'
import { useI18n } from 'vue-i18n'
import { ref, computed, watch, onUnmounted, type PropType } from 'vue'

const { t } = useI18n();

const props = defineProps({
  modelValue: {
    type: Object as PropType<File | File[] | null>,
    default: null
  },
  label: { type: String },
  disabled: { type: Boolean, default: false },
  accept: {
    type: String,
    default: 'image/*'
  },
  compressionOptions: {
    type: Object,
    default: () => ({
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      fileType: "image/webp",
      initialQuality: 0.8
    })
  }
})

const emits = defineEmits(['update:modelValue'])

const fileUploadRef = ref()
const cameraInputRef = ref()
const isCompressing = ref(false)
const rawFiles = ref<File[]>([])
const previewUrl = ref('')

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    const file = Array.isArray(newVal) ? newVal[0] : newVal
    if (file) {
      rawFiles.value = [file]
      generatePreview(file)
    } else {
      clearInternal()
    }
  } else {
    clearInternal()
  }
}, { immediate: true })

const titleText = computed(() => isCompressing.value
  ? 'messages.components.inputUploadImage.isCompressing'
  : 'messages.components.inputUploadImage.empty'
)

const fileName = computed(() => {
  if (isCompressing.value) return 'messages.components.inputUploadImage.inLoading'
  const file = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue
  return file?.name || ''
})

const fileSizeFormatted = computed(() => {
  if (isCompressing.value) return 'messages.components.inputUploadImage.inLoading'
  const file = Array.isArray(props.modelValue) ? props.modelValue[0] : props.modelValue
  return formatSize(file?.size || 0)
})

async function handleFileSelection(files: File[] | File) {
  const file = Array.isArray(files) ? files[0] : files
  if (!file) {
    clearFile()
    return
  }
  await processAndEmit(file)
}

async function handleCameraCapture(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    await processAndEmit(target.files[0])
  }
  target.value = ''
}

async function processAndEmit(originalFile: File) {
  if (!originalFile.type.startsWith('image/')) {
    generatePreview(originalFile)
    emits('update:modelValue', originalFile)
    return
  }

  isCompressing.value = true
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = ''

  try {
    const originalName = originalFile.name.replace(/\.[^/.]+$/, "")
    const newFileName = `${originalName}.webp`
    const compressedBlob = await imageCompression(originalFile, props.compressionOptions)

    const compressedFile = new File([compressedBlob], newFileName, {
      type: "image/webp",
      lastModified: Date.now()
    })

    generatePreview(compressedFile)
    emits('update:modelValue', compressedFile)

  } catch (error) {
    console.error('Erro na compressão ou arquivo não suportado:', error)
    generatePreview(originalFile)
    emits('update:modelValue', originalFile)
  } finally {
    isCompressing.value = false
  }
}

function clearFile() {
  emits('update:modelValue', null)
}

function clearInternal() {
  rawFiles.value = []
  previewUrl.value = ''
}

function generatePreview(file: File) {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
  previewUrl.value = URL.createObjectURL(file)
}

function formatSize(bytes: number) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

function triggerCamera() {
  cameraInputRef.value?.click()
}

onUnmounted(() => {
  if (previewUrl.value) URL.revokeObjectURL(previewUrl.value)
})
</script>

<style scoped>
.input-upload-image {
  position: relative;
}
</style>
