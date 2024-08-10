'use client'

import styles from './page.module.css'
import { StorageManager } from '@aws-amplify/ui-react-storage'
import '@aws-amplify/ui-react/styles.css'

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
