<script>
//configure here
import borrowTrackerService from "@/services/borrowTracker.service"
import BorrowTrackerForm from "@/components/BorrowTrackerForm.vue"
import other from "@/helper/other"

const fieldList = ["MaDocGia", "MaSach", "NgayMuon", "NgayTra", "TrangThai"]
const rawName = "borrowTracker"
const objectName = "Theo dõi mượn sách"
const mainField = "MaDocGia"
const service = borrowTrackerService
const ThisForm = BorrowTrackerForm
////////////////////////////////////////////////////////////////////////
import ObjectList from "@/components/ObjectList.vue"
import InputSearch from "@/components/InputSearch.vue"
import MoreInfo from "@/components/MoreInfo.vue"

export default {
  components: {
    ObjectList,
    ThisForm,
    InputSearch,
    MoreInfo,
  },
  data() {
    return {
      objectList: [],
      other: other,
      filterType: "",
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
        this.objectStrings[index]
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
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
    filterType() {
      this.searchText = this.filterType
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
    async deleteAll() {
      if (confirm("Bạn chắc chắn muốn xóa tất cả?")) {
        try {
          let result = await service.deleteAll()
          if (result.status == true) {
            alert("Xóa thành công!")
          } else alert(result.message)
          this.refreshList()
        } catch (error) {
          alert(error.response.data.message)
        }
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
    goToAddObject() {
      this.$router.push({ name: `${rawName}.add` })
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
        <div class="row g-2 my-4">
          <div class="col-4">
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                id="flexRadioDefault1"
                value=""
                v-model="filterType"
                checked
              />
              <label class="form-check-label" for="flexRadioDefault1">
                Tất cả
              </label>
            </div>
          </div>
          <div
            class="col-4"
            v-for="(item, index) in Object.keys(other.bookStatus)"
          >
            <div class="form-check">
              <input
                class="form-check-input"
                type="radio"
                name="flexRadioDefault"
                :id="index"
                :value="item"
                v-model="filterType"
              />
              <label class="form-check-label" :for="index">
                {{ other.bookStatus[item] }}
              </label>
            </div>
          </div>
        </div>
        <hr class="my-4" />
        <button class="btn btn-danger" @click="deleteAll">
          <i class="fa-solid fa-triangle-exclamation"></i> Xóa tất cả
          <span class="text-lowercase">{{ objectName }} trong danh sách</span>
        </button>
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
        <MoreInfo
          :bookId="filteredList[activeIndex].MaSach"
          :readerId="filteredList[activeIndex].MaDocGia"
          v-if="filteredListCount > 0 && activeIndex >= 0 && !create"
        />
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
