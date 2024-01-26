<template>
   <u-form
      class="grid gap-4 grid-cols-2"
      :schema="useCreateTeachersSchema"
      :state="state"
      @submit="submit"
   >
      <u-form-group
         label="Tahun ajaran"
         name="year"
      >
         <year-picker
            v-model="(state.year as string)"
            :disabled="loading"
         ></year-picker>
      </u-form-group>

      <u-form-group
         label="Mata pelajaran"
         name="subject_id"
      >
         <u-select-menu
            v-model="(state.subject_id as number)"
            :options="subjectOptions"
            option-attribute="label"
            value-attribute="value"
            placeholder="Pilih mata pelajaran..."
            :disabled="loading"
         ></u-select-menu>
      </u-form-group>

      <u-form-group
         label="Jumlah"
         name="count"
      >
         <u-input
            v-model="(state.count as number)"
            :disabled="loading"
            @keypress="validateNumber"
         ></u-input>
      </u-form-group>

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

         <u-button
            color="emerald"
            icon="i-heroicons-check-16-solid"
            :loading="loading"
            type="submit"
         >
            Simpan
         </u-button>
      </div>
   </u-form>
</template>

<script setup lang="ts">
const authStore = useAuthStore()
const store = useAppStore()
const dayjs = useDayjs()

const loading = ref<boolean>(false)
const state = ref<API.Request.Form.Teacher>({
   school_id: authStore.getUser?.userable_id as number,
   year: `${dayjs().year()}-${dayjs().add(1, 'year').year()}`,
   subject_id: null,
   count: null
})

const subjectOptions = ref<Utility.SelectOption[]>([])

onBeforeMount(async () => {
   await getSubjectOptions()
      .then(resp => {
         subjectOptions.value = resp
      })
})

const submit = async () => {
   loading.value = true
   await createTeacher(state.value)
      .then(resp => {
         store.notify('success', resp, 'create-teacher-form-success')
         if (store.dialog.callback) store.dialog.callback()
         store.clearDialog()
      })
      .finally(() => loading.value = false)
}
</script>