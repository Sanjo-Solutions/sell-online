import { defineBackend } from '@aws-amplify/backend'
import { auth } from './auth/resource.js'
import { data } from './data/resource.js'
import { storage } from './storage/resource.js'
import { checkout } from './functions/checkout/resource.js'
import { Stack } from 'aws-cdk-lib'
import {
  CorsHttpMethod,
  HttpApi,
  HttpMethod,
} from 'aws-cdk-lib/aws-apigatewayv2'
import { HttpUserPoolAuthorizer } from 'aws-cdk-lib/aws-apigatewayv2-authorizers'
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations'
import { Policy, PolicyStatement } from 'aws-cdk-lib/aws-iam'
import { accountLink } from './functions/account-link/resource.js'

const backend = defineBackend({
  auth,
  data,
  storage,
  accountLink,
  checkout,
})

const apiStack = backend.createStack('api-stack')

const userPoolAuthorizer = new HttpUserPoolAuthorizer(
  'userPoolAuth',
  backend.auth.resources.userPool,
  {
    userPoolClients: [backend.auth.resources.userPoolClient],
  }
)

const accountLinkHttpLambdaIntegration = new HttpLambdaIntegration(
  'AccountLinkLambdaIntegration',
  backend.accountLink.resources.lambda
)

const checkoutHttpLambdaIntegration = new HttpLambdaIntegration(
  'CheckoutLambdaIntegration',
  backend.checkout.resources.lambda
)

const httpApi = new HttpApi(apiStack, 'HttpApi', {
  apiName: 'API',
  corsPreflight: {
    allowMethods: [CorsHttpMethod.POST],
    allowOrigins: ['*'], // TODO: FIXME
    allowHeaders: ['*'],
  },
  createDefaultStage: true,
})

httpApi.addRoutes({
  path: '/account-link',
  methods: [HttpMethod.POST],
  integration: accountLinkHttpLambdaIntegration,
  authorizer: userPoolAuthorizer,
})

httpApi.addRoutes({
  path: '/checkout',
  methods: [HttpMethod.POST],
  integration: checkoutHttpLambdaIntegration,
})

const apiPolicy = new Policy(apiStack, 'ApiPolicy', {
  statements: [
    new PolicyStatement({
      actions: ['execute-api:Invoke'],
      resources: [
        `${httpApi.arnForExecuteApi('*', '/account-link')}`,
        `${httpApi.arnForExecuteApi('*', '/checkout')}`,
      ],
    }),
  ],
})

backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(apiPolicy)
backend.auth.resources.unauthenticatedUserIamRole.attachInlinePolicy(apiPolicy)

backend.addOutput({
  custom: {
    API: {
      [httpApi.httpApiName!]: {
        endpoint: httpApi.url,
        region: Stack.of(httpApi).region,
        apiName: httpApi.httpApiName,
      },
    },
  },
})
