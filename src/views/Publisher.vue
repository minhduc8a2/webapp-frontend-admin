<script>
//configure here
import publisherService from "@/services/publisher.service"
import PublisherForm from "@/components/PublisherForm.vue"

const fieldList = ["MaNXB", "TenNXB", "DiaChi"]
const rawName = "publisher"
const objectName = "Nhà xuất bản"
const mainField = "TenNXB"
const service = publisherService
const ThisForm = PublisherForm
////////////////////////////////////////////////////////////////////////
import ObjectList from "@/components/ObjectList.vue"
import InputSearch from "@/components/InputSearch.vue"

export default {
  components: {
    ObjectList,
    ThisForm,
    InputSearch,
  },
  data() {
    return {
      objectList: [],
      rawName,
      objectName,
      mainField,
      searchText: "",
      activeIndex: 1,
      create: false,
    }
  },

  computed: {
    objectStrings() {
      return this.objectList.map((item) => {
        let temp = ""
        for (const field of fieldList) {
          temp += item[field]
        }
        return temp
      })
    },

    filteredList() {
      if (!this.searchText) return this.objectList
      return this.objectList.filter((item, index) =>
        this.objectStrings[index].includes(this.searchText)
      )
    },

    filteredListCount() {
      return this.filteredList.length
    },
  },
  watch: {
    searchText() {
      this.activeIndex = -1
    },
  },
  methods: {
    async createObject(data) {
      try {
        let result = await service.create(data)

        if (result.status == true) {
          alert("Tạo thành công!")
        } else alert(result.message)
        this.create = false
        this.refreshList()
      } catch (error) {
        alert(error.response.data.message)
      }
    },
    async updateObject(id, data) {
      try {
        let result = await service.update(id, data)

        if (result.status == true) {
          alert("Cập nhật thành công!")
        } else alert(result.message)
        this.refreshList()
      } catch (error) {
        alert(error.response.data.message)
      }
    },
    async deleteObject(id) {
      if (confirm("Bạn chắc chắn muốn xóa?")) {
        try {
          let result = await service.delete(id)
          if (result.status == true) {
            alert("Xóa thành công!")
          } else alert(result.message)
          this.refreshList()
        } catch (error) {
          alert(error.response.data.message)
        }
      }
    },
    async retrieveObjectList() {
      try {
        const res = await service.getAll()
        this.objectList = res.data
      } catch (error) {
        alert(error.response.data.message)
      }
    },
    refreshList() {
      this.retrieveObjectList()
      this.activeIndex = 0
    },
    async removeAllList() {
      if (confirm(`Bạn muốn xóa tất cả ${objectName}?`)) {
        try {
          await service.deleteAll()
          this.refreshList()
        } catch (error) {
          alert(error.response.data.message)
        }
      }
    },
  },
  mounted() {
    this.refreshList()
  },
}
</script>
<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-6">
        <div
          class="d-flex justify-content-between align-items-center text-nowrap gap-4"
        >
          <InputSearch v-model="searchText" />
          <div
            class="bg-secondary opacity-50"
            style="width: 1px; height: 2rem"
          ></div>
          <button class="btn border btn-light" @click="create = !create">
            <span v-if="!create"
              ><i class="fa-solid fa-plus"></i> Thêm
              <span class="text-lowercase">{{ objectName }}</span> mới</span
            >
            <span v-else><i class="fa-solid fa-xmark"></i> Hủy</span>
          </button>
        </div>

        <hr class="my-4" />
        <ObjectList
          v-if="filteredListCount > 0 && !create"
          :objectList="filteredList"
          :mainField="mainField"
          :rawObjectName="rawName"
          v-model:activeIndex="activeIndex"
        />
      </div>
      <div class="col-6">
        <ThisForm
          mode="edit"
          :currentObject="filteredList[activeIndex]"
          :mainField="mainField"
          :objectName="objectName"
          v-if="filteredListCount > 0 && create == false && activeIndex >= 0"
          @submit:object="updateObject"
          @delete:object="deleteObject"
        />
        <ThisForm
          mode="create"
          v-if="create"
          :mainField="mainField"
          :objectName="objectName"
          @submit:object="createObject"
          @delete:object="deleteObject"
        />
      </div>
    </div>
  </div>
</template>
