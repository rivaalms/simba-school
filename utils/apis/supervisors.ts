export async function getSupervisorDetails (id: number) : Promise <Model.Supervisor> {
   const response = await $api (`/supervisor/${id}`, {
      method: 'get'
   }) as API.Response <Model.Supervisor>

   return response.data
}