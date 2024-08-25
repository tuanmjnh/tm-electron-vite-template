<script setup lang="ts">
import { useAppStore } from '@/store'
import { languages } from '@/modules/i18n'
const appStore = useAppStore()
// const options = [
//   {
//     label: 'English',
//     value: 'enUS',
//   },
//   {
//     label: '中文',
//     value: 'zhCN',
//   },
// ]
</script>

<template>
  <n-popselect :value="appStore.lang" :options="languages" trigger="click" @update:value="appStore.setAppLang">
    <CommonWrapper>
      <icon-park-outline-translate />
    </CommonWrapper>
  </n-popselect>
</template>

<style scoped></style>
