<template>
   <nuxt-layout>
      <nuxt-page/>
   </nuxt-layout>
</template>

<script setup lang="ts">
useHead({
   titleTemplate: (title) => {
      return title ? `${title} - SIMBA School` : 'SIMBA School'
   }
})
</script>