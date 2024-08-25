<script setup lang="ts">
const props = defineProps({
  routePath: { type: String, default: null },
});
</script>
<template>
  <router-view :key="routePath?routePath:$route.path" />
</template>

<style scoped></style>
