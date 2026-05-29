import { serve } from "std/http/server"

serve(async () => {

  console.log(
    'Processing deductions...'
  )

  return new Response(
    JSON.stringify({
      success: true,
    }),
    {
      headers: {
        'Content-Type':
          'application/json',
      },
    }
  )

})