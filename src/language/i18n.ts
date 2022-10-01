import { createI18n } from 'vue-i18n'
import zh from './zh'
import en from './en'

export function createSSRI18n() {
  return createI18n({
    locale: 'zh',
    legacy: false,
    messages: {
      zh,
      en
    }
  })
}
