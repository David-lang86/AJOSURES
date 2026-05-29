import { serve } from
"std/http/server"

serve(async () => {

  try {

    console.log(
      'Sending reminders...'
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

  } catch (error: unknown) {

    let message =
      'Unknown error'

    if (
      error instanceof Error
    ) {

      message =
        error.message

    }

    return new Response(
      JSON.stringify({
        error: message,
      }),
      {
        status: 500,
      }
    )

  }

})