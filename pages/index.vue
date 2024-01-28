<template>
   <div class="grid gap-4 grid-cols-6">
      <u-card class="col-span-4 bg-primary-500">
         <div class="flex gap-4 items-center">
            <img src="/img/hello.svg" alt="Hello" class="h-96 w-auto">

            <div class="flex flex-col gap-4">
               <p class="text-white font-semibold text-xl">
                  Selamat datang, {{ user?.name }}
               </p>

               <div class="text-white">
                  <p>
                     Selamat datang di Sistem Informasi Manajemen Berkas Administrasi Sekolah.
                  </p>
                  <p>
                     Aplikasi ini dikembangkan oleh <span class="font-semibold">Riva Almero</span>.
                  </p>
               </div>

               <div class="flex items-center gap-4">
                  <u-button
                     color="amber"
                     size="md"
                     icon="i-heroicons-plus-16-solid"
                     @click.stop="store.showDialog('data-create', 'Buat Data Baru', null, () => navigateTo('/data'))"
                  >
                     Buat data baru
                  </u-button>
               </div>
            </div>
         </div>
      </u-card>

      <dashboard-data class="col-span-2"></dashboard-data>
      <dashboard-students class="col-span-3"></dashboard-students>
      <dashboard-teachers class="col-span-3"></dashboard-teachers>
   </div>
</template>
s
<script setup lang="ts">
const store = useAppStore()
store.setPageTitle('Home')
store.setBreadcrumb([
   {
      label: 'Home'
   }
])

const user = computed(() => useAuthStore().getUser)
</script>