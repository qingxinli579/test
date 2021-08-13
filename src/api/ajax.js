import axios from 'axios'
export default function ajax(url = '', params = {}, type = 'GET') {
  let promise
  // 返回promise对象
  return new Promise((resolve, reject) => {
    if (type === 'GET') {
      promise = axios.get(url)
    } else if (type === 'POST') {
      promise = axios.post(url, params)
    }
    promise
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
