<template>
   <u-form
      class="grid gap-4 grid-cols-2"
      :schema="useCreateStudentsSchema"
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
         />
      </u-form-group>

      <u-form-group
         label="Kelas"
         name="grade"
      >
         <u-select-menu
            v-model="(state.grade as number)"
            :options="gradeOptions"
            placeholder="Pilih kelas..."
            :disabled="loading"
         >
            <template #label>
               {{ state.grade || 'Pilih kelas...' }}
            </template>
         </u-select-menu>
      </u-form-group>

      <u-form-group
         label="Agama"
         name="religion_id"
      >
         <u-select-menu
            v-model="(state.religion_id as number)"
            :options="religionOptions"
            option-attribute="label"
            value-attribute="value"
            placeholder="Pilih agama..."
            :disabled="loading"
         ></u-select-menu>
      </u-form-group>

      <u-form-group
         label="Jumlah"
         name="count"
      >
         <u-input
            v-model="(state.count as number)"
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
import { createStudent } from '~/utils/apis/students';

const authStore = useAuthStore()
const store = useAppStore()
const dayjs = useDayjs()

const loading = ref<boolean>(false)
const state = ref<API.Request.Form.Student>({
   school_id: authStore.getUser?.userable_id as number,
   year: `${dayjs().year()}-${dayjs().add(1, 'year').year()}`,
   grade: null,
   religion_id: null,
   count: null,
})

const gradeOptions = computed(() => {
   const schoolTypeId = authStore.getUser?.userable?.school_type_id
   if (!schoolTypeId) return []

   if (schoolTypeId === 1) {
      return ['7', '8', '9']
   }
   return ['1', '2', '3', '4', '5', '6']
})

const religionOptions = ref<Utility.SelectOption[]>([])

onBeforeMount(async () => {
   await getReligionOptions()
      .then(resp => religionOptions.value = resp)
})

const submit = async () => {
   loading.value = true
   await createStudent(state.value)
      .then(resp => {
         store.notify('success', resp)
         if (store.dialog.callback) store.dialog.callback()
         store.clearDialog()
      })
      .finally(() => loading.value = false)
}
</script>