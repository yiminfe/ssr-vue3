<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store'
import { useI18n } from 'vue-i18n'
import type { IRoomListParams } from '@/api/interface'

const store = useStore()
const { t } = useI18n()
const cityCode = ref(store.state.cityCode)
const cityArr = [
  {
    cityCode: 'cd',
    cityName: '成都'
  },
  {
    cityCode: 'nj',
    cityName: '南京'
  },
  {
    cityCode: 'cq',
    cityName: '重庆'
  },
  {
    cityCode: 'bj',
    cityName: '北京'
  },
  {
    cityCode: 'sz',
    cityName: '苏州'
  }
]
function cityClick(tab: any) {
  console.log(tab)
  const { name } = tab.props
  cityCode.value = name
  store.dispatch('getRoomList', {
    pageNo: 1,
    cityCode: name
  } as IRoomListParams)
}
</script>

<template>
  <!-- 城市筛选 -->
  <el-tabs v-model="cityCode" @tab-click="cityClick" type="card">
    <el-tab-pane
      v-for="(item, index) in cityArr"
      :key="index"
      :label="t(`home.city['${item.cityCode}']`)"
      :name="item.cityCode"
    ></el-tab-pane>
  </el-tabs>
</template>
