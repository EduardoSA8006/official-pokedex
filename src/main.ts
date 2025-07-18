import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/styles/variables.css'
import './assets/styles/global.css'
import './assets/styles/components/poke-card.css'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'pokedexDark',
    themes: {
      pokedexDark: {
        dark: true,
        colors: {
          background: '#12121B',
          surface: '#1E1E29',
          primary: '#FF4C4C',
          secondary: '#4CC9F0',
          info: '#81C784',
          warning: '#FFB300',
          error: '#EF5350',
          success: '#00C853',
          onBackground: '#E0E0F0',
          onSurface: '#A0A0B2',
        },
      },
    },
  },
})

const app = createApp(App)

app.use(router)
app.use(vuetify)
app.mount('#app')
