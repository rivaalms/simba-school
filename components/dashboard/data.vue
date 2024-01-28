<template>
   <u-card class="overflow-visible">
      <div class="grid gap-4">
         <div class="flex items-center justify-between gap-4">
            <p class="text-gray-700 truncate">
               Informasi Data
            </p>

            <div class="flex items-center gap-2">
               <year-picker
                  v-model="filter.year"
                  @update:model-value="fetchDataCount"
               ></year-picker>
            </div>
         </div>

         <div v-if="loading" class="grid gap-4">
            <u-skeleton class="h-8 w-1/2"></u-skeleton>
            <u-skeleton class="h-8 w-3/4"></u-skeleton>
         </div>

            <div v-else class="grid grid-cols-2 gap-4">
               <u-card class="col-span-2 ring-0 shadow-md">
                  <p class="text-sm text-gray-700 mb-2">
                     Jumlah Data
                  </p>
                  <span class="text-xl text-gray-700 font-semibold">
                     {{ data?.total }}
                  </span>
               </u-card>

               <u-card
                  v-for="item in data?.data_by_status"
                  class="flex-1 ring-0 shadow-md"
                  :class="{
                     'bg-gray-50 text-gray-600': item.name === 'Sedang diverifikasi',
                     'bg-emerald-50 text-emerald-600': item.name == 'Terverifikasi',
                     'bg-cyan-50 text-cyan-600': item.name == 'Verifikasi revisi',
                     'bg-amber-50 text-amber-600': item.name == 'Revisi'
                  }"
               >
                  <p class="text-sm mb-2 capitalize">
                     {{ item.name }}
                  </p>
                  <span class="text-xl font-semibold">
                     {{ item.count }}
                  </span>
               </u-card>
            </div>
      </div>
   </u-card>
</template>

<script setup lang="ts">
const dayjs = useDayjs()

const loading = ref<boolean>(false)
const data = ref<Utility.Map.DataCount>()

const filter = ref<API.Request.Query.DataCount>({
   year: `${dayjs().year()}-${dayjs().add(1, 'year').year()}`
})

onBeforeMount(async () => {
   await fetchDataCount()
})

const fetchDataCount = async () => {
   loading.value = true
   await countData(filter.value)
      .then(resp => {
         data.value = resp
      })
      .finally(() => loading.value = false)
}
</script>