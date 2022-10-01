import { useRouter } from 'vue-router'
import { useStore } from '@/store'

interface Result {
  checkLogin: (path?: string) => boolean
  pushPath: (path: string) => void
}

// 登录拦截
export default function useLoginInterceptor(): Result {
  const router = useRouter()
  const store = useStore()

  function checkLogin(path?: string) {
    const { pathname } = window.location
    if (!store.state.userStatus) {
      router.push({
        path: '/login',
        query: {
          redirect: path || pathname
        }
      })
      return false
    }
    return true
  }

  function pushPath(path: string) {
    const result = checkLogin(path)
    result && router.push({ path })
  }
  return {
    checkLogin,
    pushPath
  }
}
