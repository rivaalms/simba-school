<template>
   <div class="grid gap-4 grid-cols-12 place-items-start">
      <div class="col-span-7 grid gap-4 w-full">
         <u-card>
            <data-table
               :data="teachers"
               :headers="tableHeaders"
               :total="(teachers || []).length"
               :loading="loading"
               :pagination="false"
               :use-default-filter="false"
            >
               <template #header>
                  <div class="flex items-center gap-4">
                     <year-picker
                        v-model="(filter.year as string)"
                        :callback="() => fetchTeachers()"
                        placeholder="Tahun ajaran"
                     ></year-picker>

                     <div class="flex-grow"></div>

                     <u-button
                        class="justify-self-end"
                        icon="i-heroicons-arrow-path-20-solid"
                        @click.stop="store.showDialog('teacher-create', 'Perbarui Data Guru', null, () => fetchTeachers())"
                     >
                        Perbarui
                     </u-button>
                  </div>
               </template>
            </data-table>
         </u-card>
      </div>

      <div class="col-span-5 grid gap-4 w-full">
         <u-card>
            <div class="flex items-center justify-between gap-4 mb-2">
               <p class="text-sm text-gray-700">
                  Jumlah Guru
               </p>

               <u-badge
                  color="gray"
               >
                  {{ filter.year }}
               </u-badge>
            </div>
            <span class="text-xl font-semibold">
               {{ totalTeacher }}
            </span>
         </u-card>

         <u-card>
            <div class="grid gap-4">
               <p class="text-sm text-gray-700">
                  Pertumbuhan Guru
               </p>

               <div class="flex items-center gap-2">
                     <vue-date-picker
                        v-model="teacherGrowthFilter.start_year"
                        year-picker
                        auto-apply
                        @update:model-value="fetchTeacherGrowth"
                     >
                        <template #trigger>
                           <u-input
                              :value="teacherGrowthFilter.start_year"
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
                        v-model="teacherGrowthFilter.end_year"
                        year-picker
                        auto-apply
                        @update:model-value="fetchTeacherGrowth"
                     >
                        <template #trigger>
                           <u-input
                              :value="teacherGrowthFilter.end_year"
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

const dayjs = useDayjs()
const store = useAppStore()
store.setPageTitle('Guru')
store.setBreadcrumb([
   {
      label: 'Home',
      to: '/',
   },
   {
      label: 'Guru'
   }
])

const loading = ref<boolean>(false)

const teachers = ref<Utility.Map.Teacher[]>([])
const totalTeacher = computed(() => teachers.value.map(item => item.value).reduce((sum, current) => (sum as number) + (current as number), 0))

const filter = ref<API.Request.Query.Teacher>({
   school_id: useAuthStore().getUser?.userable_id as number,
   year: `${dayjs().year()}-${dayjs().add(1, 'year').year()}`,
})

const teacherGrowth = ref<Utility.Growth[]>([])
const teacherGrowthFilter = ref<API.Request.Query.Growth>({
   start_year: dayjs().subtract(5, 'years').year(),
   end_year: dayjs().year()
})

const tableHeaders = computed(() => [
   { key: 'subject', label: 'Mata Pelajaran' },
   { key: 'value', label: 'Jumlah' }
])

onBeforeMount(async () => {
   await fetchTeachers()
   await fetchTeacherGrowth()
})

const chartData = computed(() => {
   const value: any = []

   teacherGrowth.value.forEach((item, index) => {
      value[index] = {
         x: item.year,
         y: item.total
      }
   })

   return [{
      name: 'Jumlah Guru',
      data: value
   }]
})

const chartOptions = computed(() => ({
   chart: {
      id: 'teacherGrowth',
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

const fetchTeachers = async () => {
   loading.value = true
   await getTeachers(filter.value)
      .then(async (resp: Model.Teacher[]) => {
         teachers.value = await mapTeachers(resp)
      })
      .finally(() => loading.value = false)
}

const fetchTeacherGrowth = async () => {
   await getTeachersGrowth(filter.value.school_id as number, teacherGrowthFilter.value)
      .then(resp => {
         teacherGrowth.value = resp
      })
}
</script>