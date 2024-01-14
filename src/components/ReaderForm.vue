<script>
import * as yup from "yup"
import other from "@/helper/other"
/// configure here
const fieldList = [
  { fullName: "Mã đọc giả", field: "MaDocGia", type: "text", min: 1 },
  { fullName: "Họ lót", field: "HoLot", type: "text", min: 1 },
  { fullName: "Tên", field: "Ten", type: "text", min: 1 },
  { fullName: "Ngày sinh", field: "NgaySinh", type: "myDate", min: 1 },
  { fullName: "Giới tính", field: "Phai", type: "text", min: 1 },
  { fullName: "Địa chỉ", field: "DiaChi", type: "text", min: 1 },
  { fullName: "Số điện thoại", field: "DienThoai", type: "text", min: 10 },
  { fullName: "Mật khẩu", field: "Password", type: "password", min: 8 },
]

////
function createYupObject() {
  let result = {}
  fieldList.forEach((field) => {
    if (field.type == "text" || field.type == "password") {
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
    formatNgaySinh() {
      this.objectLocal.NgaySinh = other.formatDate(this.objectLocal.NgaySinh)
    },
    submitObject() {
      this.objectLocal.NgaySinh = other.createDate(this.objectLocal.NgaySinh)
      if (this.mode == "edit")
        this.$emit("submit:object", this.objectLocal._id, this.objectLocal)
      else this.$emit("submit:object", this.objectLocal)
      this.formatNgaySinh()
    },
    deleteObject() {
      this.$emit("delete:object", this.objectLocal._id)
    },
  },
  created() {
    this.formatNgaySinh()
  },
  updated() {
    ;(this.objectLocal = this.currentObject
      ? { ...this.currentObject }
      : createEmptyObject()),
      this.formatNgaySinh()
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
