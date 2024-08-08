'use client'

import styles from './page.module.css'
import { StorageManager } from '@aws-amplify/ui-react-storage'
import { Amplify } from 'aws-amplify'
import outputs from '../../amplify_outputs.json'
import '@aws-amplify/ui-react/styles.css'

Amplify.configure(outputs)
const existingConfig = Amplify.getConfig()
Amplify.configure({
  ...existingConfig,
  API: {
    ...existingConfig.API,
    REST: outputs.custom.API,
  },
})

export default function Home() {
  return (
    <main className={styles.main}>
      <StorageManager
        acceptedFileTypes={['*/*']}
        path='public/'
        maxFileCount={1}
        isResumable
      />
    </main>
  )
}
