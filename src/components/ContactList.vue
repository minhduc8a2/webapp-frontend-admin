<script>
import { onMounted, onUpdated } from "vue"
export default {
  setup() {
    onMounted(() => {
      console.log("rerendered") // <div>
    })
    onUpdated(() => {
      // text content should be the same as current `count.value`
      console.log("updated") // <
    })
  },
  props: {
    contacts: { type: Array, default: [] },
    activeIndexxx: { type: Number, default: -1 },
  },
  emits: ["update:activeIndexxx"],
  methods: {
    updateActiveIndex(index) {
      this.$emit("update:activeIndexxx", index)
    },
  },
}
</script>
<template>
  <ul class="list-group">
    <li
      class="list-group-item"
      v-for="(contact, index) in contacts"
      :key="contact._id"
      :class="{ active: index === activeIndexxx }"
      @click="updateActiveIndex(index)"
    >
      {{ contact.name }}
    </li>
  </ul>
</template>
