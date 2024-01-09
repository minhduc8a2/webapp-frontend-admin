<script>
import * as yup from "yup"

const fieldList = [
  { fullName: "Mã Sách", field: "MaSach", type: "text", min: 1, max: 50 },
  { fullName: "Tên Sách", field: "TenSach", type: "text", min: 1, max: 50 },
  { fullName: "Đơn Giá", field: "DonGia", type: "number", min: 1, max: 50 },
  { fullName: "Số Quyển", field: "SoQuyen", type: "number", min: 1, max: 50 },
  {
    fullName: "Số lượng yêu cầu mượn",
    field: "DangYeuCau",
    type: "number",
    min: 0,
    max: 50,
  },
  {
    fullName: "Số lượng đang được mượn",
    field: "DangMuon",
    type: "number",
    min: 0,
    max: 50,
  },
  { fullName: "Năm xuất bản", field: "NamXuatBan", type: "myDate" },
  {
    fullName: "Mã nhà xuất bản",
    field: "MaNXB",
    type: "text",
    min: 1,
    max: 50,
  },
  {
    fullName: "Nguồn gốc/ tác giả",
    field: "NguonGoc/TacGia",
    type: "text",
    min: 1,
    max: 50,
  },
]
function createYupObject() {
  let result = {}
  fieldList.forEach((field) => {
    if (field.type == "text") {
      result[field.field] = yup
        .string()
        .required(`${field.field} phải có giá trị.`)
        .min(field.min, `${field.field} phải ít nhất ${field.min} ký tự.`)
        .max(field.max, `${field.field} có nhiều nhất ${field.max} ký tự.`)
    } else if (field.type == "number") {
      result[field.field] = yup
        .number()
        .required(`${field.field} phải có giá trị.`)
        .min(field.min, `${field.field} phải lớn hơn ${field.min}.`)
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
import { Form, Field, ErrorMessage } from "vee-validate"

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["submit:currentObject", "delete:currentObject"],
  props: {
    currentObject: { type: Object, required: true },
    mode: { type: String, required: true },
  },
  data() {
    const objectFormSchema = yup.object().shape(createYupObject())
    return {
      // Chúng ta sẽ không muốn hiệu chỉnh props, nên tạo biến cục bộ
      // contactLocal để liên kết với các input trên form
      objectLocal: this.currentObject,
      objectFormSchema,
      fieldList: fieldList,
    }
  },
  methods: {
    submitObject() {
      this.$emit("submit:currentObject", this.ObjectLocal)
    },
    deleteObject() {
      this.$emit("delete:currentObject", this.objectLocal.id)
    },
  },
  updated() {
    this.objectLocal = this.currentObject
  },
}
</script>
<template>
  <Form
    @submit="submitObject"
    :validation-schema="objectFormSchema"
    class="p-5 shadow rounded-3"
  >
    <h2 v-if="mode == 'edit'" class="text-center">{{ objectLocal.TenSach }}</h2>
    <h2 v-else class="text-center">Thêm sách mới</h2>
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

    <div class="form-group">
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
