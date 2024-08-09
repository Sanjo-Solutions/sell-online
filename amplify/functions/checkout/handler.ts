import type { APIGatewayProxyHandlerV2 } from 'aws-lambda'
import Stripe from 'stripe'
import { env } from '$amplify/env/checkout.js'

const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export const handler: APIGatewayProxyHandlerV2 = async event => {
  console.log('event', event)

  if (event.requestContext.http.method === 'POST') {
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'T-shirt',
              },
              unit_amount: 1000,
            },
            quantity: 1,
          },
        ],
        payment_intent_data: {
          application_fee_amount: 123,
          transfer_data: {
            destination: 'acct_1PlyF5E4ePfdP6zT', // TODO: Dynamic based on from which connected account the product is from.
          },
        },
        mode: 'payment',
        success_url: `${event.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      })

      return {
        statusCode: 303,
        headers: {
          Location: session.url!,
        },
      }
    } catch (error: any) {
      console.error(
        'An error occurred when calling the Stripe API to create an account session',
        error
      )
      return {
        statusCode: 500,
        body: JSON.stringify({ error: error.message }),
      }
    }
  } else {
    return {
      statusCode: 501,
    }
  }
}
