<template>
   <div>
      <NuxtWelcome />
   </div>
</template>

<script setup lang="ts">
useHead({
   titleTemplate: (title) => {
      return title ? `${title} - SIMBA School` : 'SIMBA School'
   }
})
</script>