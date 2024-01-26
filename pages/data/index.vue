<template>
   <u-card>
      <data-table
         :data="(data as Utility.DataTable<Model.Data[]>)?.data"
         :headers="headers"
         :page="(filter.page as number)"
         :per-page="(filter.per_page as number)"
         :total="data?.total"
         :loading="loading"
         @update="onTableUpdate"
      >
         <template #filter>
            <div class="p-4 grid gap-4">
               <u-form-group label="Tahun ajaran">
                  <year-picker
                     v-model="(filter.year as string)"
                     :callback="() => fetchData()"
                  />
               </u-form-group>

               <u-form-group label="Kategori">
                  <u-select-menu
                     v-model="(filter.category as number)"
                     :options="categoryOptions"
                     value-attribute="value"
                     searchable
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     @update:model-value="(val) => {
                        fetchTypeOptions(val)
                        fetchData()
                     }"
                  >
                     <template #label>
                        {{ displaySelectLabel(categoryOptions, (filter.category as number), 'Pilih kategori...') }}
                     </template>
                  </u-select-menu>
               </u-form-group>

               <u-form-group label="Tipe">
                  <u-select-menu
                     v-model="(filter.type as number)"
                     :options="typeOptions"
                     value-attribute="value"
                     seearchable
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     :disabled="!filter.category || (filter.category as number) < 1"
                     @update:model-value="fetchData"
                  >
                     <template #label>
                        {{ displaySelectLabel(typeOptions, (filter.type as number), 'Pilih tipe...') }}
                     </template>
                  </u-select-menu>

                  <template #help v-if="!filter.category || (filter.category as number) < 1">
                     Pilih kategori terlebih dahulu
                  </template>
               </u-form-group>

               <u-form-group label="Status">
                  <u-select-menu
                     v-model="(filter.status as number)"
                     :options="statusOptions"
                     value-attribute="value"
                     searchable
                     searchable-placeholder="Cari..."
                     :search-attributes="['label']"
                     @update:model-value="fetchData"
                  >
                     <template #label>
                        <span
                           v-if="!!filter.status"
                           class="inline-block h-2 w-2 rounded-full flex-shrink-0"
                           :class="statusOptionColor(filter.status as number)"
                           aria-hidden="true"
                        ></span>

                        {{ displaySelectLabel(statusOptions, filter.status as number, 'Pilih status...') }}
                     </template>
                  </u-select-menu>
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
               <u-button
                  icon="i-heroicons-plus-16-solid"
                  @click.stop="store.showDialog('data-create', 'Tambah Data', null, () => fetchData())"
               >
                  Tambah
               </u-button>
            </div>
         </template>

         <template #actions="{ row }">
            <u-dropdown
               :items="actionMenu(row)"
            >
               <u-button
                  color="gray"
                  variant="ghost"
                  icon="i-heroicons-ellipsis-vertical-20-solid"
               ></u-button>

               <template #delete="{ item }">
                  <u-icon :name="item.icon" class="flex-shrink-0 h-4 w-4 text-red-500"></u-icon>
                  <span class="truncate text-red-500">{{ item.label }}</span>
               </template>
            </u-dropdown>
         </template>
      </data-table>
   </u-card>
</template>

<script setup lang="ts">
const store = useAppStore()
store.setPageTitle('Data')
store.setBreadcrumb([
   {
      label: 'Home',
      to: '/',
   },
   {
      label: 'Data',
   }
])

const user = useAuthStore().getUser

const data = ref<Utility.DataTable<Model.Data[]>>()
const headers = computed(() => [
   { key: 'type.name', label: 'Tipe' },
   { key: 'type.category.name', label: 'Kategori' },
   { key: 'year', label: 'Tahun Ajaran' },
   { key: 'status.name', label: 'Status' },
   { key: 'updated_at', label: 'Diperbarui' },
   { key: 'actions' }
])

const filter = ref<API.Request.Query.Data>({
   school: user?.userable_id,
   page: 1,
   per_page: 10,
   year: null,
   status: null,
   type: null,
   category: null
})

const loading = ref<boolean>(false)

const actionMenu = (row: Model.Data) => ([
   [
      {
         label: 'Unduh file',
         icon: 'i-heroicons-folder-arrow-down-20-solid',
         class: 'text-emerald-500',
         iconClass: 'text-emerald-500',
         click: () => downloadDataFile(row)
            .then(() => store.notify('success', 'Data berhasil diunduh', 'download-data-file'))
      },
      {
         label: 'Lihat detail',
         class: 'text-primary',
         iconClass: 'text-primary',
         icon: 'i-heroicons-document-magnifying-glass-20-solid',
         click: () => navigateTo(`/data/${row.id}`)
      },
      {
         label: 'Sunting data',
         class: 'text-amber-500',
         iconClass: 'text-amber-500',
         icon: 'i-heroicons-pencil-square-20-solid',
         click: () => store.showDialog('data-update', 'Sunting Data', row, () => fetchData())
      },
   ],
])

const statusOptions = ref<Utility.SelectOption[]>([])
const typeOptions = ref<Utility.SelectOption[]>([])
const categoryOptions = ref<Utility.SelectOption[]>([])

onBeforeMount(async () => {
   await fetchData()

   await getDataStatusOptions()
      .then(resp => {
         statusOptions.value = resp
      })

   await getDataCategoryOptions()
      .then(resp => {
         categoryOptions.value = resp
      })
})

const fetchData = async () => {
   loading.value = true
   await getData(filter.value)
      .then(resp => {
         data.value = resp
      })
      .finally(() => loading.value = false)
}

const fetchTypeOptions = async (categoryId: number) => {
   await getDataTypeOptions(categoryId)
      .then(resp => {
         typeOptions.value = resp
      })
}

const onTableUpdate = async (emit: Wildcard) => {
   filter.value = {
      ...filter.value,
      ...emit
   }

   await fetchData()
}

const resetFilter = async () => {
   filter.value = {
      school: user?.userable_id,
      page: 1,
      per_page: 10,
      year: null,
      status: null,
      type: null,
      category: null
   }

   await fetchData()
}

const statusOptionColor = (value: number) => {
   switch (value) {
      case 1:
         return 'bg-gray-500'
      case 2:
         return 'bg-emerald-500'
      case 3:
         return 'bg-amber-500'
      case 4:
         return 'bg-cyan-500'
      default:
         return 'bg-primary'
   }
}
</script>