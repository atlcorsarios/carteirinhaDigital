import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { i18n } from './plugins/i18n'
import vuetify from './plugins/vuetify'
import { createRulesPlugin } from 'vuetify/labs/rules'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(createRulesPlugin({}, vuetify.locale))
app.mount('#app')
