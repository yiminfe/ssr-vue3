// 当前语言环境
const locale: string = window.navigator.language
// 中英文语言环境（key为所有可能的语言环境标识情况，value为本应用中定义的标准化语言环境标识）
const language: any = {
  'zh-CN': 'zh', // key为'zh-CN'表示浏览器端语言环境
  'zh-cn': 'zh', // key为'zh-cn'表示element-plus组件语言包中的语言环境name
  en: 'en' // key为'en'表示浏览器端或者element-plus语言包中的语言环境name
}
// 语言包自定义字段维护
const messages: any = {
  zh: {
    home: '首页',
    mine: '个人中心'
  },
  en: {
    home: 'home',
    mine: 'mine'
  }
}

// 封装一个自定义t函数
export function t(localeLanguage: string) {
  return messages[language[localeLanguage || locale]]
}
