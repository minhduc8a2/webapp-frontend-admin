<script>
import BookService from "@/services/book.service"
import ReaderService from "@/services/reader.service"

export default {
  props: {
    readerId: { type: String, required: true },
    bookId: { type: String, required: true },
  },
  data() {
    return {
      reader: null,
      book: null,
    }
  },
  watch: {
    readerId() {
      this.getInfo()
    },
    bookId() {
      this.getInfo()
    },
  },
  methods: {
    async getInfo() {
      console.log("getting book reader")

      try {
        let bookResult = await BookService.get(this.bookId)
        let readerResult = await ReaderService.get(this.readerId)

        if (bookResult.status == true && readerResult.status == true) {
          this.book = bookResult.data
          this.reader = readerResult.data
        } else {
          this.book = null
          this.reader = null
          console.log("null")
        }
      } catch (error) {
        this.book = null
        this.reader = null
        console.log("null")
      }
    },
  },
  mounted() {
    this.getInfo()
  },
}
</script>

<template>
  <div class="" v-if="book != null && reader != null">
    <h2 class="text-center mb-4">Thông tin mượn sách</h2>
    <div class="p-4 rounded-2 shadow my-3">
      <p>
        Tên đọc giả:
        <span class="fw-bold"> {{ reader.HoLot + " " + reader.Ten }}</span>
      </p>
      <p>
        Số điện thoại: <span class="fw-bold"> {{ reader.DienThoai }}</span>
      </p>
    </div>
    <div class="p-4 rounded-2 shadow my-3">
      <p>
        Tên sách: <span class="fw-bold"> {{ book.TenSach }}</span>
      </p>
      <p>
        Nguồn gốc/tác giả:
        <span class="fw-bold"> {{ book["NguonGoc/TacGia"] }}</span>
      </p>
    </div>
  </div>
</template>
