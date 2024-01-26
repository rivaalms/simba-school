<template>
   <u-form
      :schema="useUpdateDataSchema"
      :state="state"
      @submit="submit"
   >
      <div class="grid grid-cols-2 gap-4">
         <u-form-group
            label="Tahun Ajaran"
            name="year"
         >
            <year-picker
               v-model="(state.year as string)"
               :disabled="loading"
            ></year-picker>
         </u-form-group>

         <u-form-group
            label="Kategori"
         >
            <u-select-menu
               v-model="(dataCategory as number)"
               :options="dataCategoryOptions"
               option-attribute="label"
               value-attribute="value"
               placeholder="Pilih kategori..."
               :disabled="loading"
            ></u-select-menu>
         </u-form-group>

         <u-form-group
            label="Tipe Data"
            name="data_type_id"
         >
            <u-select-menu
               v-model="(state.data_type_id as number)"
               :options="dataTypeOptions"
               option-attribute="label"
               value-attribute="value"
               :placeholder="!!dataCategory ? 'Pilih tipe...' : 'Pilih kategori terlebih dahulu'"
               :loading="dataTypeLoading"
               :disabled="!dataCategory ||loading"
            ></u-select-menu>
         </u-form-group>

         <u-form-group
            v-if="isCreate || showFileInput"
            label="Upload File"
            name="file"
         >
            <file-input
               v-model="state.file"
            ></file-input>
         </u-form-group>

         <div v-if="!isCreate" class="col-span-2 flex items-center gap-4">
            <u-toggle
               v-model="showFileInput"
            ></u-toggle>

            <span class="text-sm text-gray-700">Perbarui file data?</span>
         </div>

         <div class="col-span-2 flex items-center justify-end gap-4">
            <u-button
               color="gray"
               variant="outline"
               icon="i-heroicons-arrow-uturn-left-16-solid"
               :disabled="loading"
               @click.stop="store.clearDialog()"
            >
               Batal
            </u-button>

            <u-popover
               v-model:open="submitPopover"
               overlay
            >
               <u-button
                  color="emerald"
                  icon="i-heroicons-check-16-solid"
                  :loading="loading"
               >
                  Simpan
               </u-button>

               <template #panel>
                  <div class="p-4 grid gap-2">
                     <p class="text-sm text-gray-700">
                        Konfirmasi simpan data?
                     </p>
                     <u-button
                        block
                        color="emerald"
                        icon="i-heroicons-check-16-solid"
                        @click.stop="async () => {
                           submitPopover = false
                           await submit()
                        }"
                     >
                        Simpan Data
                     </u-button>
                  </div>
               </template>
            </u-popover>
         </div>
      </div>
   </u-form>
</template>

<script setup lang="ts">
const store = useAppStore()
const yearDefault = computed(() => `${(useDayjs())().year()}-${(useDayjs())().add(1, 'year').year()}`)
const data = store.dialog.data as Model.Data
const isCreate = computed(() => store.dialog.id.includes('create'))
const loading = ref<boolean>(false)

const state = ref<API.Request.Form.Data>({
   school_id: useAuthStore().getUser!.userable_id,
   year: isCreate.value ? yearDefault.value : data.year,
   data_type_id: isCreate.value ? null : data.data_type_id,
   data_status_id: isCreate.value ? null : data.data_status_id,
   file: undefined
})

const showFileInput = ref<boolean>(false)
const dataCategory = ref(isCreate.value ? null :data.type.data_category_id)
const dataCategoryOptions = ref<Utility.SelectOption[]>([])
const dataTypeOptions = ref<Utility.SelectOption[]>([])
const dataTypeLoading = ref<boolean>(false)

const statusOptions = ref<Utility.SelectOption[]>([])
const submitPopover = ref<boolean>(false)

watch(dataCategory, async (val, old) => {
   if (!!old) {
      state.value.data_type_id = null
   }

   dataTypeLoading.value = true
   await getDataTypeOptions(val as number)
      .then(resp => dataTypeOptions.value = resp)
      .finally(() => dataTypeLoading.value = false)
}, { immediate: true })

onBeforeMount(async () => {
   await getDataCategoryOptions()
      .then(resp => dataCategoryOptions.value = resp)

   if (isCreate.value) {
      await getDataStatusOptions()
         .then(resp => statusOptions.value = resp)
   }
})

const submit = async () => {
   loading.value = true
   state.value.data_status_id = isCreate.value ? 1 : 4

   try {
      const resp = isCreate.value ? await createData(state.value) : await updateData(data.id, state.value)

      if (!isCreate.value && !!state.value.file) {
         const file : any = state.value.file
         await updateDataFile(data.id, { file })
            .then((resp) => {
               store.notify('success', resp, 'data-form-file-success')
            })
      }

      store.notify('success', resp, 'data-form-success')
      if (store.dialog.callback) store.dialog.callback()
      store.clearDialog()
   }
   catch (e: any) {
      store.notify('error', e.message || e, 'data-form-error')
   }
   finally {
      loading.value = false
   }
}
</script>