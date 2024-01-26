export async function getTeachers (payload: API.Request.Query.Teacher) : Promise <Model.Teacher[]> {
   const response = await $api(`/school-teachers`, {
      method: 'get',
      query: payload
   }) as API.Response <Model.Teacher[]>
   return response.data
}

export async function getTeachersGrowth (schoolId: number, payload: API.Request.Query.Growth) : Promise <Utility.Growth[]> {
   const response = await $api(`/school-teachers/${schoolId}/growth`, {
      method: 'get',
      query: payload
   }) as API.Response <Utility.Growth[]>
   return response.data
}

export async function createTeacher (payload: API.Request.Form.Teacher) : Promise <string> {
   const response = await $api(`/school-teachers`, {
      method: 'post',
      body: payload
   }) as API.Response <Model.Teacher>
   return response.message!
}