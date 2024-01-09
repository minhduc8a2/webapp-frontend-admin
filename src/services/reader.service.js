import createApiClient from "./api.service"
//configure here
class ReaderService {
  //configure here
  constructor(baseUrl = "/api/readers") {
    this.api = createApiClient(baseUrl)
  }
  async getAll() {
    return (await this.api.get("/")).data
  }
  async create(data) {
    return (await this.api.post("/", data)).data
  }
  async deleteAll() {
    return (await this.api.delete("/")).data
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data
  }
}
//configure here
export default new ReaderService()