import { type ClientSchema, a, defineData } from '@aws-amplify/backend'
import { postConfirmation } from '../auth/post-confirmation/resource'

const schema = a
  .schema({
    // TODO: Rename to SupplierProfile
    UserProfile: a
      .model({
        id: a.string().required(),
        // .authorization(allow => [
        //   allow.ownerDefinedIn('id').to(['read', 'update']),
        // ]),
        email: a.string(),
        stripeAccountID: a.string(),
        slug: a.string(),
        // .authorization(allow => [
        //   allow.ownerDefinedIn('id').to(['read', 'update']),
        // ]), // TODO: Make sure that slug is unique
      })
      .authorization(allow => [
        allow.ownerDefinedIn('id').to(['read', 'update']),
      ]),
    Good: a
      .model({
        title: a.string().required(),
        price: a.float().required(),
        file: a.string().required(),
        supplier: a.string().required(),
      })
      .authorization(allow => [
        allow.guest().to(['read']),
        allow.ownerDefinedIn('supplier').to(['create', 'update']),
      ]),
  })
  .authorization(allow => [allow.resource(postConfirmation)])

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
})
