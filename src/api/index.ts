// https://service-ase3oocp-1302839645.sh.apigw.tencentcs.com/api/room/room/getRoomList?pageNo=1&pageSize=3
import { http } from '../utils/http'
import airbnb from '../db'

// 真实接口
export function fetchRoomList() {
  return http.httpRequestGet(
    'https://service-ase3oocp-1302839645.sh.apigw.tencentcs.com/api/room/room/getRoomList?pageNo=1&pageSize=3',
    {}
  )
}
// Mock接口
export async function fetchElephant() {
  const result = await airbnb.airbnbDB.getList('elephant').then(res => {
    return { code: '000000', message: '操作成功', result: res, success: true }
  })
  return result
}
