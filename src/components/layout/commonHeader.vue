<script setup lang="ts">
import { ref, getCurrentInstance, defineAsyncComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { userLogoutApi } from '@/api/login'
import type { IResultOr } from '@/api/interface'
import { useStore } from '@/store'
import useLoginInterceptor from '@/composables/common/useLoginInterceptor'
import { clearAllCookie } from '@/utils/util'

const OrderPopover = defineAsyncComponent(
  () => import('@/views/order/components/orderPopover.vue')
)

const activeIndex = ref('orders')

const { t } = useI18n()
const router = useRouter()
const store = useStore()

const { proxy }: any = getCurrentInstance()
// 登出接口
function userLogout() {
  userLogoutApi().then((res: IResultOr) => {
    const { success, message } = res
    if (success) {
      router.push({ name: 'login' })
      store.commit('setUserStatus', 0)
      localStorage.removeItem('userId')
      clearAllCookie()
    } else {
      proxy.$message.error(message)
    }
  })
}

const { pushPath, checkLogin } = useLoginInterceptor()
function handleSelect(e: string) {
  if (['zh', 'en'].indexOf(e) > -1) {
    store.dispatch('saveLanguage', e)
  } else if (e === 'login') {
    router.push({ name: 'login' })
  } else if (e === 'logout') {
    userLogout()
  } else if (e === 'orders') {
    checkLogin() && store.commit('setOrderVisible', true)
  } else if (e === 'records') {
    pushPath('/record')
  }
  console.log(e)
}
</script>

<template>
  <div class="header-common">
    <img
      @click="
        () => {
          router.push({ name: 'home' })
        }
      "
      class="logo"
      src="../../assets/images/layout/logo.png"
      alt="爱此迎"
    />
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="orders">
        {{ t('header.orders') }}
        <template v-if="store.state.orderVisible">
          <Suspense>
            <template #default>
              <OrderPopover />
            </template>
            <template #fallback>
              <div class="loading-block">{{ t('common.loading') }}</div>
            </template>
          </Suspense>
        </template>
      </el-menu-item>
      <el-menu-item index="records">{{ t('header.records') }}</el-menu-item>
      <el-sub-menu index="language">
        <template #title>{{ t('header.language') }}</template>
        <el-menu-item index="zh">中文</el-menu-item>
        <el-menu-item index="en">English</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="logout" v-if="store.state.userStatus === 1">{{
        t('login.logout')
      }}</el-menu-item>
      <el-menu-item index="login" v-else
        >{{ t('login.loginTab') }}/{{ t('login.signTab') }}</el-menu-item
      >
    </el-menu>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/layout/commonHeader.scss';
</style>
