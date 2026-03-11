<template>
  <button @click="installPWA" v-if="deferredPrompt">
    Instalar App
  </button>
</template>

<script setup lang="js">
import { ref, onMounted } from 'vue'

const deferredPrompt = ref(null)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })

  window.addEventListener('appinstalled', () => {
    deferredPrompt.value = null
  })

  console.log(deferredPrompt)
})

const installPWA = () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    deferredPrompt.value = null
  }
}
</script>
