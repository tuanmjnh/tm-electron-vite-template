<script setup lang="ts">
import { useAppStore } from '@/store'

const router = useRouter()
const appStore = useAppStore()

const APP_NAME = import.meta.env.RENDERER_VITE_APP_NAME
</script>

<template>
  <div class="h-60px text-xl flex-center cursor-pointer gap-2 p-x-2" @click="router.push('/')">
    <svg-icons-logo class="text-1.5em" />
    <span v-show="!appStore.collapsed" class="text-ellipsis overflow-hidden whitespace-nowrap">{{ APP_NAME }}</span>
  </div>
</template>

<style scoped></style>
