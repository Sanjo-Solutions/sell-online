'use client'

import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'
import { fetchAuthSession } from 'aws-amplify/auth'
import { useEffect } from 'react'

Amplify.configure(outputs, { ssr: true })
const existingConfig = Amplify.getConfig()
Amplify.configure(
  {
    ...existingConfig,
    API: {
      ...existingConfig.API,
      REST: outputs.custom.API,
    },
  },
  { ssr: true }
)

export function ConfigureAmplifyClientSide() {
  useEffect(function () {
    async function a() {
      const session = await fetchAuthSession()
      const authToken = session.tokens?.idToken?.toString()

      Amplify.configure(Amplify.getConfig(), {
        ssr: true,
        API: {
          REST: {
            headers: async () => {
              return {
                Authorization: authToken,
              }
            },
          },
        },
      })
    }

    a()
  }, [])

  return null
}
