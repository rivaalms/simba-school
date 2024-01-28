<template>
   <u-card>
      <div class="grid gap-4">
         <p class="text-gray-700">
            Informasi Guru
         </p>

         <u-card class="ring-0 shadow-md">
            <div class="flex items-center justify-between gap-4 mb-2">
               <p class="text-gray-700 text-sm">
                  Jumlah Guru
               </p>
               <u-badge variant="subtle">
                  {{ `${dayjs().year()}-${dayjs().add(1, 'year').year()}` }}
               </u-badge>
            </div>

            <span class="text-xl text-gray-700 font-semibold">
               {{ count }}
            </span>
         </u-card>

         <u-card class="ring-0 shadow-none">
            <p class="text-gray-700 text-sm mb-4">
               Perkembangan Guru
            </p>
            <apexchart
               :options="chartOptions"
               :series="chartData"
            />
         </u-card>
      </div>
   </u-card>
</template>

<script setup lang="ts">
const dayjs = useDayjs()

const count = ref<number>(0)
const countLoading = ref<boolean>(false)

const growth = ref<Utility.Growth[]>([])
const growthFilter = ref<API.Request.Query.Growth>({
   start_year: dayjs().subtract(5, 'years').year(),
   end_year: dayjs().year()
})
const growthLoading = ref<boolean>(false)

const chartData = computed(() => {
   const value: any = []

   growth.value.forEach((item, index) => {
      value[index] = {
         x: item.year,
         y: item.total
      }
   })

   return [{
      name: 'Jumlah Siswa',
      data: value,
   }]
})

const chartOptions = computed(() => ({
   chart: {
      id: 'studentGrowth',
      type: 'line'
   },
   colors: ['#3b82f6'],
   dataLabels: {
      style: {
         fontSize: '12px',
         fontFamily: 'Lato'
      },
   },
   markers: {
      size: 4,
      hover: { sizeOffset: 2 }
   },
   stroke: { curve: 'smooth' }
}))

onBeforeMount(async () => {
   await fetchCount()
   await fetchGrowth()
})

const fetchCount = async () => {
   countLoading.value = true
   await countTeachers(`${dayjs().year()}-${dayjs().add(1, 'year').year()}`)
      .then(resp => {
         count.value = resp
      })
      .finally(() => countLoading.value = false)
}

const fetchGrowth = async () => {
   growthLoading.value = true
   await getTeachersGrowth(useAuthStore().getUser!.userable_id!, growthFilter.value)
      .then(resp => {
         growth.value = resp
      })
}
</script>