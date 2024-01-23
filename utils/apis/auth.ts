export async function login (payload: API.Request.Form.Login) : Promise <{ user: Model.User<Model.School>, token: string }> {
   const response = await $api(`/login`, {
      method: 'get',
      body: payload
   }) as API.Response<{ user: Model.User<Model.School>, token: string }>

   return response.data
}

export async function logout () : Promise <void> {
   await $api (`/logout`, {
      method: 'post'
   }) as API.Response <null>
}

export async function forgotPassword (payload: API.Request.Form.ForgotPassword) : Promise <string> {
   const response = await $api (`/forgot-password`, {
      method: 'post',
      body: payload
   }) as API.Response <boolean>

   return response.message!
}

export async function resetPassword (payload: API.Request.Form.ResetPassword) : Promise <string> {
   const response = await $api (`/reset-password`, {
      method: 'post',
      body: payload
   }) as API.Response <boolean>

   return response.message!
}

export async function checkResetPasswordToken (payload: API.Request.Form.CheckResetPasswordToken) : Promise <boolean> {
   const response = await $api (`/check-reset-password-token`, {
      method: 'post',
      body: payload
   }) as API.Response <boolean>

   return response.data
}