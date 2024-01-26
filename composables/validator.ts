import * as yup from 'yup'

export const useLoginSchema = yup.object({
   email: yup.string().email('Email tidak valid').required('Email tidak boleh kosong'),
   password: yup.string().required('Kata sandi harus diisi')
})

export const useUpdateDataSchema = yup.object({
   school_id: yup.string().required('Sekolah wajib diisi'),
   year: yup.string().required('Tahun ajaran wajib diisi'),
   data_type_id: yup.number().typeError('Tipe data wajib diisi').required('Tipe data wajib diisi'),
   data_status_id: yup.number().typeError('Status wajib diisi').required('Status wajib diisi'),
})

export const useCreateStudentsSchema = yup.object({
   school_id: yup.string().required('Sekolah wajib diisi'),
   year: yup.string().required('Tahun ajaran wajib diisi'),
   grade: yup.number().typeError('Kelas wajib diisi').required('Kelas wajib diisi'),
   religion_id: yup.number().typeError('Agama wajib diisi').required('Agama wajib diisi'),
   count: yup.number().typeError('Jumlah wajib diisi').required('Jumlah wajib diisi'),
})

export const useCreateTeachersSchema = yup.object({
   school_id: yup.string().required('Sekolah wajib diisi'),
   year: yup.string().required('Tahun ajaran wajib diisi'),
   subject_id: yup.number().typeError('Mata pelajaran wajib diisi').required('Mata pelajaran wajib diisi'),
   count: yup.number().typeError('Jumlah wajib diisi').required('Jumlah wajib diisi'),
})