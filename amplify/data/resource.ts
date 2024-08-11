import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { postConfirmation } from '../auth/post-confirmation/resource'

const schema = a
  .schema({
    UserProfile: a
      .model({
        id: a.string().required(),
        email: a.string(),
        stripeAccountID: a.string(),
      })
      .authorization(allow => [allow.ownerDefinedIn('id').to(['read'])]),
  })
  .authorization(allow => [allow.resource(postConfirmation)])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
