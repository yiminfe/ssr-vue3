<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup

import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import { computed, watchEffect } from 'vue'
import commonHeader from './components/layout/commonHeader.vue'
import commonFooter from './components/layout/commonFooter.vue'
import { useRoute } from 'vue-router'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'

const store = useStore()
const route = useRoute()

const locale = computed(() => {
  return store.state.locale === 'en' ? en : zhCn
})

const { locale: localeI18n } = useI18n()
watchEffect(() => {
  localeI18n.value = store.state.locale
})
</script>

<template>
  <el-config-provider :locale="locale">
    <!-- 头部 -->
    <commonHeader v-show="route.fullPath.indexOf('login') === -1" />
    <!-- 主体 -->
    <div class="container">
      <router-view />
    </div>
    <!-- 底部 -->
    <commonFooter v-show="route.fullPath.indexOf('login') === -1" />
  </el-config-provider>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
