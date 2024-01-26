<template>
   <div class="grid gap-4 grid-cols-12 place-items-start">
      <div class="col-span-7 grid gap-4 w-full">
         <u-card>
            <data-table
               :data="students"
               :headers="tableHeaders"
               :total="(students || []).length"
               :loading="loading"
               :pagination="false"
            >
               <template #filter>
                  <div class="p-4 grid gap-4">
                     <u-form-group label="Tahun ajaran">
                        <year-picker
                           v-model="(filters.year as string)"
                           :callback="() => fetchStudents()"
                        />
                     </u-form-group>

                     <div class="flex items-center justify-end">
                        <u-button
                           color="black"
                           leading-icon="i-heroicons-arrow-path-16-solid"
                           @click.stop="resetFilter"
                        >
                           Atur Ulang
                        </u-button>
                     </div>
                  </div>
               </template>

               <template #header>
                  <div class="flex items-center justify-end gap-4">
                     <u-badge
                        color="gray"
                     >
                        {{ filters.year }}
                     </u-badge>
                  </div>
               </template>
            </data-table>
         </u-card>
      </div>

      <div class="col-span-5 grid gap-4 w-full">
         <u-card>
            <div class="flex items-center justify-between gap-4 mb-2">
               <p class="text-sm text-gray-700">
                  Jumlah Siswa
               </p>

               <u-badge
                  color="gray"
               >
                  {{ filters.year }}
               </u-badge>
            </div>
            <span class="text-xl font-semibold">
               {{ totalStudents }}
            </span>
         </u-card>

         <u-card>
            <div class="grid gap-4">
               <p class="text-sm text-gray-700">
                  Pertumbuhan Siswa
               </p>

               <div class="flex items-center gap-2">
                  <vue-date-picker
                     v-model="studentsGrowthFilter.start_year"
                     year-picker
                     auto-apply
                     @update:model-value="fetchStudentsGrowth"
                  >
                     <template #trigger>
                        <u-input
                           :value="studentsGrowthFilter.start_year"
                           input-class="cursor-pointer"
                           readonly
                           icon="i-heroicons-calendar-days-16-solid"
                           placeholder="Tahun mulai"
                        ></u-input>
                     </template>
                  </vue-date-picker>

                  <span class="text-sm text-gray-700">
                     sampai
                  </span>

                  <vue-date-picker
                     v-model="studentsGrowthFilter.end_year"
                     year-picker
                     auto-apply
                     @update:model-value="fetchStudentsGrowth"
                  >
                     <template #trigger>
                        <u-input
                           :value="studentsGrowthFilter.end_year"
                           input-class="cursor-pointer"
                           readonly
                           icon="i-heroicons-calendar-days-16-solid"
                           placeholder="Tahun selesai"
                        ></u-input>
                     </template>
                  </vue-date-picker>
               </div>

               <apexchart
                  :options="chartOptions"
                  :series="chartData"
               ></apexchart>
            </div>
         </u-card>
      </div>
   </div>
</template>

<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'

const store = useAppStore()
store.setPageTitle('Siswa')
store.setBreadcrumb([
   {
      label: 'Home',
      to: '/',
   },
   {
      label: 'Siswa'
   }
])

const loading = ref<boolean>(false)
const dayjs = useDayjs()

const students = ref<Utility.Map.Student[]>([])
const raw = ref<Model.Student[]>([])

const filters = ref<API.Request.Query.Student>({
   school_id: useAuthStore().getUser?.userable_id as number,
   year: `${dayjs().year()}-${dayjs().add(1, 'year').year()}`
})

const studentsGrowth = ref<Utility.Growth[]>([])
const studentsGrowthFilter = ref<API.Request.Query.Growth>({
   start_year: dayjs().subtract(5, 'years').year(),
   end_year: dayjs().year()
})

const totalStudents = computed(() => students.value.map((item) => item.total).reduce((sum, current) => sum + current, 0))

const tableHeaders = computed(() => [
   { key: 'year', label: 'Tahun ajaran' },
   { key: 'grade', label: 'Kelas' },
   { key: 'islam', label: 'Islam' },
   { key: 'katolik', label: 'Katolik' },
   { key: 'kristen', label: 'Kristen' },
   { key: 'hindu', label: 'Hindu' },
   { key: 'buddha', label: 'Buddha' },
   { key: 'konghucu', label: 'Konghucu' },
   { key: 'total', label: 'Jumlah' },
])

onBeforeMount(async () => {
   await fetchStudents()
   await fetchStudentsGrowth()
})

const chartData = computed(() => {
   const value: any = []

   studentsGrowth.value.forEach((item, index) => {
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

const fetchStudents = async () => {
   loading.value = true
   await getStudents(filters.value)
      .then(async (resp) => {
         students.value = await mapStudents(resp)
         raw.value = resp
      })
      .finally(() => loading.value = false)
}

const fetchStudentsGrowth = async () => {
   await getStudentsGrowth(filters.value.school_id as number, studentsGrowthFilter.value)
      .then(resp => {
         studentsGrowth.value = resp
      })
}

const resetFilter = () => {
   filters.value = {
      school_id: useAuthStore().getUser?.userable_id as number,
      year: `${dayjs().year()}-${dayjs().add(1, 'year').year()}`
   }
}
</script>