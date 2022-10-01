<script lang="ts">
import { defineComponent, watchEffect } from 'vue'
import RoomDetail from './components/detail.vue'
import type { IRoomDetailParams } from '@/api/interface'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from '@/store'

export default defineComponent({
  components: {
    RoomDetail
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    console.log('setup--------router', router)
    watchEffect(() => store.dispatch('getRoomDetail', route.params))
  },
  asyncData({ store, route }: any) {
    console.log('asyncData----详情页', store, route.value)
    const { roomId } = store.state
    const { id } = route.value.params
    console.log('roomId----------', roomId)
    return store.dispatch('getRoomDetail', {
      id: roomId || id
    } as IRoomDetailParams)
  }
})
</script>

<template>
  <RoomDetail />
</template>
