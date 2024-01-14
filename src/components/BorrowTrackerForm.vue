<script>
import * as yup from "yup"
/// configure here
import other from "@/helper/other"

const fieldList = [
  {
    fullName: "Mã đọc giả",
    field: "MaDocGia",
    type: "text",
    min: 1,
    readonly: true,
  },
  {
    fullName: "Mã sách",
    field: "MaSach",
    type: "text",
    min: 1,
    readonly: true,
  },
  {
    fullName: "Ngày mượn",
    field: "NgayMuon",
    type: "myDate",
    min: 1,
    readonly: false,
  },
  {
    fullName: "Ngày trả",
    field: "NgayTra",
    type: "myDate",
    min: 1,
    readonly: false,
  },
  {
    fullName: "Trạng thái",
    field: "TrangThai",
    type: "enum",
    min: 1,
    readonly: false,
    regex: "Cancelled|Pending|Accepted|Borrowed|Returned",
  },
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
        .test("", "Ngày không hợp lệ", function (value) {
          if (!value) return true
          return value?.match(/^\d{2}\/\d{2}\/\d{4}$/) != null
        })
      if (field.field == "NgayMuon") {
        result[field.field] = yup
          .string()
          .test("", "Ngày không hợp lệ", function (value) {
            return value?.match(/^\d{2}\/\d{2}\/\d{4}$/) != null
          })
      }
    }
  })
  return result
}

function createEmptyObject() {
  let result = {}
  fieldList.forEach((field) => {
    if (field.type == "text") result[field.field] = ""
    else if (field.type == "number") result[field.field] = 0
    else if (field.type == "myDate" && field.field == "NgayMuon") {
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
      objectLocal: this.currentObject
        ? Object.assign({}, this.currentObject)
        : createEmptyObject(),
      objectFormSchema,
      fieldList: fieldList,
      other,
    }
  },
  methods: {
    formatNgayMuonNgayTra() {
      this.objectLocal.NgayMuon = other.formatDate(this.objectLocal.NgayMuon)
      if (this.objectLocal.NgayTra)
        this.objectLocal.NgayTra = other.formatDate(this.objectLocal.NgayTra)
    },
    submitObject() {
      console.log("submit")
      this.objectLocal.NgayMuon = other.createDate(this.objectLocal.NgayMuon)
      if (this.objectLocal.NgayTra)
        this.objectLocal.NgayTra = other.createDate(this.objectLocal.NgayTra)
      if (this.mode == "edit")
        this.$emit("submit:object", this.objectLocal._id, this.objectLocal)
      else {
        this.$emit("submit:object", this.objectLocal)
      }
      this.formatNgayMuonNgayTra()
    },
    deleteObject() {
      this.$emit("delete:object", this.objectLocal._id)
    },
  },
  mounted() {
    this.formatNgayMuonNgayTra()
    console.log(this.objectLocal)
  },
  updated() {
    this.objectLocal = this.currentObject
      ? Object.assign({}, this.currentObject)
      : createEmptyObject()
    this.formatNgayMuonNgayTra()
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
    <div class="" v-for="(field, index) in fieldList">
      <div
        class="form-group mt-3"
        :class="{ 'pe-none opacity-75': field.readonly && mode == 'edit' }"
        v-if="field.type != 'enum'"
      >
        <label :for="field.field">{{ field.fullName }}</label>
        <Field
          :name="field.field"
          :type="field.type"
          class="form-control mt-1"
          v-model="objectLocal[field.field]"
        />
        <ErrorMessage :name="field.field" class="error-feedback" />
      </div>
    </div>
    <div class="row g-2 my-4" v-if="mode == 'edit'">
      <div class="col-4" v-for="(item, index) in Object.keys(other.bookStatus)">
        <div class="form-check">
          <input
            class="form-check-input"
            type="radio"
            name="flexRadioDefault"
            :id="'submit - ' + index"
            :value="item"
            v-model="objectLocal.TrangThai"
          />
          <label class="form-check-label" :for="'submit - ' + index">
            {{ other.bookStatus[item] }}
          </label>
        </div>
      </div>
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
