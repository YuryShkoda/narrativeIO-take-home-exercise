import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://6390db190bf398c73a950581.mockapi.io/maritime'
})

export default instance
