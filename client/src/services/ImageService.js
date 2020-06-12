import axios from 'axios'
import api from './api'

const uploadApi = axios.create({
  baseURL: 'http://localhost:8080/api/',
  headers: {
    'Access-Control-Allow-Origin': '*'
  }
})

export default {
  list() {
    return api.get('/images')
  },
  listOne(id) {
    return api.get(`/images/${id}`)
  },
  create(token, data) {
    return uploadApi.post(`/images?token=${token}`, data)
  },
  move(token, data) {
    return api.put(`/images?token=${token}`, data)
  },
  edit(id, token, data) {
    return api.put(`/images/${id}?token=${token}`, data)
  },
  delete(token, data) {
    return api.delete(`/images?token=${token}`, data)
  }
}
