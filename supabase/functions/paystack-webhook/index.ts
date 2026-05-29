import { serve } from
"std/http/server"

serve(async (req: Request) => {

  try {

    const body =
      await req.json()

    const event =
      body.event

    // PAYMENT SUCCESS
    if (
      event ===
      'charge.success'
    ) {

      console.log(
        'Payment verified:',
        body.data.reference
      )

      // TODO:
      // Update wallet
      // Create transaction
      // Send notification

    }

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