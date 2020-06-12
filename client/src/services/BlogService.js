import api from './api'

export default {
  list() {
    return api.get('/blog')
  },
  listOne(id) {
    return api.get(`/blog/${id}`)
  },
  create(token, data) {
    return api.post(`/blog/?token=${token}`, data)
  },
  edit(id, token, data) {
    return api.put(`/blog/${id}?token=${token}`, data)
  },
  delete(id, token) {
    return api.delete(`/blog/${id}?token=${token}`)
  }

}
