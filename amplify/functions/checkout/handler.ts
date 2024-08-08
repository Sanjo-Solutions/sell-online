import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import Stripe from 'stripe'
import { env } from '$amplify/env/checkout.js'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const handler: APIGatewayProxyHandlerV2 = async event => {
  console.log('event', event)

  // if (req.method === 'POST') {
  //   try {
  //     const accountSession = await stripe.accountSessions.create({
  //       account: '{{CONNECTED_ACCOUNT_ID}}',
  //       components: {
  //         payments: {
  //           enabled: true,
  //           features: {
  //             refund_management: true,
  //             dispute_management: true,
  //             capture_payments: true,
  //           },
  //         },
  //       },
  //     })

  //     res.json({
  //       client_secret: accountSession.client_secret,
  //     })
  //   } catch (error) {
  //     console.error(
  //       'An error occurred when calling the Stripe API to create an account session',
  //       error
  //     )
  //     res.status(500)
  //     res.send({ error: error.message })
  //   }
  // }

  return {
    statusCode: 200,
    // Modify the CORS settings below to match your specific requirements
    headers: {
      'Access-Control-Allow-Origin': '*', // Restrict this to domains you trust
      'Access-Control-Allow-Headers': '*', // Specify only the headers you need to allow
    },
    body: JSON.stringify('Hello from api-function!'),
  }
}
