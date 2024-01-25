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
               :loading="dataTypeLoading"
               :disabled="!dataCategory ||loading"
            ></u-select-menu>
         </u-form-group>

         <u-form-group
            v-if="isCreate"
            label="Status"
            name="data_status_id"
         >
            <u-select-menu
               v-model="(state.data_status_id as number)"
               :options="statusOptions"
               option-attribute="label"
               value-attribute="value"
               :disabled="loading"
            ></u-select-menu>
         </u-form-group>

         <u-form-group
            v-if="isCreate"
            class="col-span-2"
            label="Upload File"
            name="file"
         >
            <file-input
               v-model="state.file"
            ></file-input>
         </u-form-group>
      </div>
   </u-form>
</template>

<script setup lang="ts">
const store = useAppStore()
const data = store.dialog.data as Model.Data
const isCreate = computed(() => store.dialog.id.includes('create'))
const loading = ref<boolean>(false)

const state = ref<API.Request.Form.Data>({
   school_id: isCreate.value ? null : data.school_id,
   year: isCreate.value ? null : data.year,
   data_type_id: isCreate.value ? null : data.data_type_id,
   data_status_id: isCreate.value ? null : data.data_status_id,
   file: undefined
})

const file = ref<any>(null)
const dataCategory = ref(isCreate.value ? null :data.type.data_category_id)
const dataCategoryOptions = ref<Utility.SelectOption[]>([])
const dataTypeOptions = ref<Utility.SelectOption[]>([])
const dataTypeLoading = ref<boolean>(false)

const statusOptions = ref<Utility.SelectOption[]>([])

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
   console.log(state.value)
}
</script>