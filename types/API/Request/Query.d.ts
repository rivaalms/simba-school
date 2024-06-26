declare namespace API {
   namespace Request.Query {
      type Comment = {
         sort?: string | null
      }

      type Data = {
         school?: number | string | null
         year?: string | null
         category?: number | string | null
         type?: number | string | null
         status?: number | string | null
         per_page?: number | string
         page?: number
      }

      type Religion = {
         search?: string | null
         page?: number | null
         per_page?: number | null
      }

      type Subject = API.Request.Query.Religion

      type Student = {
         year: string
         school_id: number | string
      }

      type Teacher = Student

      type Growth = {
         start_year: string | number
         end_year: string | number
      }

      type DataCount = {
         year: string
      }
   }
}