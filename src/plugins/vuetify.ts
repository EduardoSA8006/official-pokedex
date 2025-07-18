// src/plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import 'vuetify/styles'

export default createVuetify({
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
