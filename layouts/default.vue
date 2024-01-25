<template>
   <app-header class="fixed inset-x-0 top-0 z-20"></app-header>

   <main class="relative mt-[105px] p-2">
      <div class="container mx-auto">
         <slot/>
      </div>
   </main>

   <lazy-app-dialog></lazy-app-dialog>
</template>

<script setup lang="ts">
onBeforeUnmount(() => {
   useAppStore().clearDialog()
})
</script>