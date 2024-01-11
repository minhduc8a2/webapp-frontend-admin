<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch("logout")
    },
  },
}
</script>

<template>
  <nav class="navbar navbar-expand-lg bg-body-tertiary">
    <div class="container">
      <router-link class="navbar-brand fs-4 text-success" to="/books"
        ><i class="fa-solid fa-book"></i
      ></router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav nav-tabs d-none d-lg-flex">
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'books' }"
              class="nav-link"
              aria-current="page"
              to="/books"
              >Quản lý Sách</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'readers' }"
              class="nav-link"
              to="/readers"
              >Quản lý đọc giả</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'borrowTrackers' }"
              class="nav-link"
              to="/borrowTrackers"
              >Theo dõi mượn sách</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'staffs' }"
              class="nav-link"
              to="/staffs"
              >Quản lý nhân viên</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'publishers' }"
              class="nav-link"
              to="/publishers"
              >Quản lý nhà xuất bản</router-link
            >
          </li>
        </ul>
        <ul class="navbar-nav d-lg-none">
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'books' }"
              class="nav-link"
              aria-current="page"
              to="/books"
              >Quản lý Sách</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'readers' }"
              class="nav-link"
              to="/readers"
              >Quản lý đọc giả</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'borrowTrackers' }"
              class="nav-link"
              to="/borrowTrackers"
              >Theo dõi mượn sách</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'staffs' }"
              class="nav-link"
              to="/staffs"
              >Quản lý nhân viên</router-link
            >
          </li>
          <li class="nav-item">
            <router-link
              :class="{ active: this.$route.name == 'publishers' }"
              class="nav-link"
              to="/publishers"
              >Quản lý nhà xuất bản</router-link
            >
          </li>
        </ul>
        <button
          class="btn btn-danger ms-4"
          @click="logout"
          v-if="this.$store.state.logined"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  </nav>
</template>
