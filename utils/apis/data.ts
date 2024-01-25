export async function getData (payload: API.Request.Query.Data) : Promise <Utility.DataTable<Model.Data[]>> {
   const query = payload
   query.school = useAuthStore().getUser?.userable_id || query.school

   const response = await $api (`/data`, {
      method: 'get',
      query
   }) as API.Response <Utility.DataTable<Model.Data[]>>

   return response.data
}

export async function getDataDetails (id: number) : Promise <Model.Data> {
   const response = await $api (`/data/${id}`, {
      method: 'get'
   }) as API.Response <Model.Data>

   return response.data
}

export async function createData (payload: API.Request.Form.Data) : Promise <string> {
   const body: Wildcard & API.Request.Form.Data = payload
   const form = new FormData()

   for (const i in body) {
      form.append(i, body[i] as string | Blob)
   }

   const response = await $api (`/data`, {
      method: 'post',
      body: form,
      headers: {
         'Content-Type': 'multipart/form-data'
      }
   }) as API.Response <Model.Data>

   return response.message!
}

export async function updateData (dataId: number, payload: Omit <API.Request.Form.Data, 'file'>) : Promise <string> {
   const response = await $api (`/data/${dataId}`, {
      method: 'put',
      body: payload
   }) as API.Response <boolean>

   return response.message!
}

export async function updateDataFile (dataId: number, payload: Pick <API.Request.Form.Data, 'file'>) : Promise <string> {
   const form = new FormData()
   form.append('file', payload.file as Blob)

   const response = await $api (`/data/file/${dataId}`, {
      method: 'post',
      body: form
   }) as API.Response <boolean>

   return response.message!
}

export async function downloadDataFile (data: Model.Data) : Promise <boolean> {
   try {
      const response = await $api (`/data/download`, {
         method: 'post',
         body: {
            id: data.id
         }
      }) as Blob | API.Response<null>

      const url = window.URL.createObjectURL(response as Blob)
      const a = document.createElement('a')
      const fileName = `${data.school.user!.name}_${data.type.category!.name}_${data.type.name}_${data.year}`

      a.href = url
      a.setAttribute('download', fileName)
      a.click()
      return true
   } catch (e: any) {
      throw e
   }
}