'use client'

import './supply-good.css'
import { useCallback, useState } from 'react'
import { StorageManager } from '@aws-amplify/ui-react-storage'
import { generateClient } from 'aws-amplify/data'
import { type Schema } from '../../../amplify/data/resource'
import { useAuthenticator } from '@aws-amplify/ui-react'
import { generateIdentifier } from '@/user/generateIdentifier'

const client = generateClient<Schema>()

export default function () {
  const [wasValidated, setWasValidated] = useState<boolean>(false)

  const { user } = useAuthenticator(({ route, signOut, user }) => [
    route,
    signOut,
    user,
  ])

  const [fileKey, setFileKey] = useState<string | null>(null)

  const onUploadSuccess = useCallback(function onUploadSuccess({ key }: any) {
    setFileKey(key)
  }, [])

  const onSubmit = useCallback(
    async function onSubmit(event) {
      event.preventDefault()

      const form = event.target

      const isValid = form.checkValidity()

      if (!isValid) {
        event.stopPropagation()
      }

      form.classList.add('was-validated')
      setWasValidated(true)

      if (isValid && fileKey) {
        const formData = new FormData(form)

        const title = formData.get('title')?.toString()
        const priceString = formData.get('price')?.toString()
        if (title && priceString) {
          const price = parseFloat(priceString)

          const { errors, data: good } = await client.models.Good.create({
            title,
            price,
            file: fileKey,
            supplier: generateIdentifier(user),
          })
          debugger
        }
      }
    },
    [fileKey, user]
  )

  return (
    <form onSubmit={onSubmit} noValidate>
      <h2>Good</h2>

      <div className='mb-3'>
        <label htmlFor='title' className='form-label'>
          Title
        </label>
        <input
          type='text'
          className='form-control'
          id='title'
          name='title'
          autoFocus
          required
        />
        <div className='invalid-feedback'>Please provide a title.</div>
      </div>
      <div className='mb-3'>
        <label htmlFor='price' className='form-label'>
          Price
        </label>
        <div className='input-group mb-3'>
          <input
            type='text'
            className='form-control'
            aria-label='Price in €'
            id='price'
            name='price'
            required
            pattern='\d+(\.\d{1,2})?'
          />
          <span className='input-group-text'>€</span>
          <div className='invalid-feedback'>
            Please provide a price in the format "XX.XX" or "XX".
          </div>
        </div>
      </div>

      <div className='mb-3'>
        <label htmlFor='title' className='form-label'>
          File
        </label>
        <div className={wasValidated && !fileKey ? 'is-invalid' : ''}>
          <StorageManager
            acceptedFileTypes={['*/*']}
            path='public/'
            maxFileCount={1}
            isResumable
            onUploadSuccess={onUploadSuccess}
          />
        </div>
        <div className='invalid-feedback'>Please provide a file.</div>
      </div>

      <div className='text-end'>
        <button type='submit' className='btn btn-primary'>
          Supply good
        </button>
      </div>
    </form>
  )
}
