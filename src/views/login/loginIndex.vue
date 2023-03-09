<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { getCurrentInstance, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import useFormProperties from '@/composables/login/useFormProperties'
import useFormOperates from '@/composables/login/useFormOperates'
import type { log } from 'console'

const name: string = 'login'

console.log(name)

const router = useRouter()
const { t } = useI18n()
const { ruleForm, loginText, ruleFormRef, activeName, rules } =
  useFormProperties(t)
const { userSign, userLogin } = useFormOperates(router, ruleForm)
function handleClick(e: any) {
  const { name } = e.props
  loginText.value = t(`login['${name}Btn']`)
}

function submitForm() {
  ruleFormRef.value.validate((valid: any) => {
    if (valid) {
      if (activeName.value === 'sign') {
        userSign()
      } else if (activeName.value === 'login') {
        userLogin()
      }
    } else {
      return false
    }
  })
}

const { proxy }: any = getCurrentInstance()
const route = useRoute()
const { redirect }: any = route.query

onMounted(() => {
  if (redirect) {
    proxy.$message.warning(t('login.loginLost'))
  }
})
</script>

<template>
  <div class="login-page">
    <div class="left-part"></div>
    <div class="right-part">
      <div class="login-panel">
        <!-- tabs -->
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="t('login.loginTab')" name="login"></el-tab-pane>
          <el-tab-pane :label="t('login.signTab')" name="sign"></el-tab-pane>
        </el-tabs>
        <!-- 表单组件 -->
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
          <el-form-item prop="mobile">
            <el-input
              :placeholder="t('login.placeMobile')"
              v-model="ruleForm.mobile"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :placeholder="t('login.placePass')"
              v-model="ruleForm.password"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="login-btn" type="primary" @click="submitForm">{{
              loginText
            }}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import '@/assets/scss/login/index.scss';
</style>
