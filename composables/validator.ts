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