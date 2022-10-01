// 获取客户端的cookie
export function getQueryCookie(cookie: string, variable: string) {
  const vars = cookie.split(';')
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=')
    if (pair[0].indexOf(variable) !== -1) {
      return pair[1]
    }
  }
  return false
}

//清除所有cookie函数
export function clearAllCookie() {
  const keys = document.cookie.match(/[^ =;]+(?==)/g)
  if (keys) {
    for (let i = keys.length; i--; ) {
      document.cookie =
        keys[i] + '=0;expires=' + new Date(0).toUTCString() + ';max-age=0'
    }
  }
}
