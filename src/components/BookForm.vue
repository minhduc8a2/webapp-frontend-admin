<script>
import * as yup from "yup"
import other from "@/helper/other"
/// configure here
const fieldList = [
  { fullName: "Mã Sách", field: "MaSach", type: "text", min: 1 },
  { fullName: "Tên Sách", field: "TenSach", type: "text", min: 1 },
  { fullName: "Đơn Giá", field: "DonGia", type: "number", min: 1 },
  { fullName: "Số Quyển", field: "SoQuyen", type: "number", min: 1 },
  {
    fullName: "Số lượng yêu cầu mượn",
    field: "DangYeuCau",
    type: "number",
    min: 0,
  },
  {
    fullName: "Số lượng đang được mượn",
    field: "DangMuon",
    type: "number",
    min: 0,
  },
  { fullName: "Năm xuất bản", field: "NamXuatBan", type: "myDate" },
  {
    fullName: "Mã nhà xuất bản",
    field: "MaNXB",
    type: "text",
    min: 1,
  },
  {
    fullName: "Nguồn gốc/ tác giả",
    field: "NguonGoc/TacGia",
    type: "text",
    min: 1,
  },
]

////
function createYupObject() {
  let result = {}
  fieldList.forEach((field) => {
    if (field.type == "text") {
      result[field.field] = yup
        .string()
        .required(`${field.fullName} phải có giá trị.`)
        .min(field.min, `${field.fullName} phải ít nhất ${field.min} ký tự.`)
      // .max(field.max, `${field.fullName} có nhiều nhất ${field.max} ký tự.`)
    } else if (field.type == "number") {
      result[field.field] = yup
        .number()
        .required(`${field.fullName} phải có giá trị.`)
        .min(field.min, `${field.fullName} phải lớn hơn ${field.min}.`)
        // .max(field.max, `${field.field} phải ít hơn ${field.max}.`)
        .integer("Phải là số nguyên")
    } else if (field.type == "myDate") {
      result[field.field] = yup
        .string()
        .matches(/^\d{2}\/\d{2}\/\d{4}$/, "Ngày không hợp lệ")
    }
  })
  return result
}

function createEmptyObject() {
  let result = {}
  fieldList.forEach((field) => {
    if (field.type == "text") result[field.field] = ""
    else if (field.type == "number") result[field.field] = 0
    else if (field.type == "myDate") {
      result[field.field] = new Date().toString()
    }
  })
  return result
}
import { Form, Field, ErrorMessage } from "vee-validate"

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:object", "delete:object"],
  props: {
    currentObject: { type: Object },
    mode: { type: String, required: true },
    objectName: { type: String, required: true },
    mainField: { type: String, required: true },
  },
  data() {
    const objectFormSchema = yup.object().shape(createYupObject())
    return {
      other,
      objectLocal: this.currentObject
        ? { ...this.currentObject }
        : createEmptyObject(),
      objectFormSchema,
      fieldList: fieldList,
    }
  },
  methods: {
    formatNamXuatBan() {
      this.objectLocal.NamXuatBan = other.formatDate(
        this.objectLocal.NamXuatBan
      )
    },
    submitObject() {
      this.objectLocal.NamXuatBan = other.createDate(
        this.objectLocal.NamXuatBan
      )
      if (this.mode == "edit")
        this.$emit("submit:object", this.objectLocal._id, this.objectLocal)
      else this.$emit("submit:object", this.objectLocal)
      //
      this.formatNamXuatBan()
    },
    deleteObject() {
      this.$emit("delete:object", this.objectLocal._id)
    },
  },
  created() {
    this.formatNamXuatBan()
  },
  updated() {
    ;(this.objectLocal = this.currentObject
      ? { ...this.currentObject }
      : createEmptyObject()),
      this.formatNamXuatBan()
  },
}
</script>
<template>
  <Form
    @submit="submitObject"
    :validation-schema="objectFormSchema"
    class="p-5 shadow rounded-3"
  >
    <h2 v-if="mode == 'edit'" class="text-center">
      {{ objectLocal[mainField] }}
    </h2>
    <h2 v-else class="text-center">
      Thêm <span class="text-lowercase">{{ objectName }}</span> mới
    </h2>

    <div class="form-group mt-3" v-for="(field, index) in fieldList">
      <label :for="field.field">{{ field.fullName }}</label>
      <Field
        :name="field.field"
        :type="field.type"
        class="form-control mt-1"
        v-model="objectLocal[field.field]"
      />
      <ErrorMessage :name="field.field" class="error-feedback" />
    </div>

    <div class="form-group mt-4 d-flex gap-4">
      <button class="btn btn-primary">Lưu</button>
      <button
        v-if="objectLocal._id"
        type="button"
        class="ml-2 btn btn-danger"
        @click="deleteObject"
      >
        Xóa
      </button>
    </div>
  </Form>
</template>
