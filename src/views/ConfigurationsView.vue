<template>
  <button @click="installPWA" v-if="deferredPrompt">
    Instalar App
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const deferredPrompt = ref()

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
  })
})

const installPWA = () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    deferredPrompt.value = null
  }
}
</script>
