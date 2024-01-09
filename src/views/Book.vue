<script>
//configure here
import BookService from "@/services/book.service"
import BookForm from "@/components/BookForm.vue"

const fieldList = [
  "MaSach",
  "TenSach",
  "DonGia",
  "SoQuyen",
  "DangYeuCau",
  "DangMuon",
  "NamXuatBan",
  "MaNXB",
  "NguonGoc/TacGia",
]
const rawName = "book"
const objectName = "Sách"
const mainField = "TenSach"
const service = BookService
const ThisForm = BookForm
////////////////////////////////////////////////////////////////////////
import ObjectList from "@/components/ObjectList.vue"
import { onUpdated } from "vue"
export default {
  components: {
    ObjectList,
    ThisForm,
  },
  data() {
    return {
      objectList: [],
      rawName,
      objectName,
      mainField,
      searchText: "",
      activeIndex: 1,
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
  methods: {
    async retrieveObjectList() {
      try {
        const res = await service.getAll()
        this.objectList = res.data
      } catch (error) {
        console.log(error)
      }
    },
    refreshList() {
      this.retrieveObjectList()
    },
    async removeAllList() {
      if (confirm(`Bạn muốn xóa tất cả ${objectName}?`)) {
        try {
          await service.deleteAll()
          this.refreshList()
        } catch (error) {
          console.log(error)
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
  <div class="container">
    <div class="row">
      <div class="col-6">
        <ObjectList
          v-if="filteredListCount > 0"
          :objectList="objectList"
          :mainField="mainField"
          :rawObjectName="rawName"
          v-model:activeIndex="activeIndex"
        />
      </div>
      <div class="col-6">
        <ThisForm
          mode="edit"
          :currentObject="objectList[activeIndex]"
          v-if="filteredListCount > 0"
        />
      </div>
    </div>
  </div>
</template>
