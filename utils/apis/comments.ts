export async function getComments (dataId: number, payload: API.Request.Query.Comment) : Promise <Model.Comment[]> {
   const response = await $api (`/comments/${dataId}`, {
      method: 'get',
      query: payload
   }) as API.Response <Model.Comment[]>

   return response.data
}

export async function createComment (payload: API.Request.Form.Comment) : Promise <string> {
   const response = await $api (`/comment`, {
      method: 'post',
      body: payload
   }) as API.Response <Model.Comment>

   return response.message!
}

export async function updateComment (id: number, payload: API.Request.Form.Comment) : Promise <string> {
   const response = await $api (`/comment/${id}`, {
      method: 'put',
      body: payload
   }) as API.Response <boolean>

   return response.message!
}

export async function deleteComment (id: number) : Promise <string> {
   const response = await $api (`/comment/${id}`, {
      method: 'delete',
   }) as API.Response <boolean>

   return response.message!
}