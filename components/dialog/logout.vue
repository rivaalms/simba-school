<template>
   <p>
      Anda yakin ingin keluar?
   </p>

   <div class="mt-6 flex items-center justify-end gap-2">
      <u-button
         color="gray"
         variant="ghost"
         icon="i-heroicons-arrow-uturn-left-16-solid"
         :disabled="loading"
         @click.stop="store.clearDialog()"
      >
         Batal
      </u-button>

      <u-button
         color="red"
         icon="i-heroicons-arrow-left-start-on-rectangle-16-solid"
         :loading="loading"
         @click.stop="logout"
      >
         Keluar
      </u-button>
   </div>
</template>

<script setup lang="ts">
const store = useAppStore()

const loading = ref<boolean>(false)

const logout = async () => {
   loading.value = true
   await useAuthStore().logout()
      .then(() => {
         store.notify('info', 'Berhasil keluar', 'logout')
      })
      .finally(() => loading.value = false)
}
</script>