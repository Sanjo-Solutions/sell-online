'use client'

import { generateClient } from 'aws-amplify/data'
import { type Schema } from '../../../amplify/data/resource'
import { useEffect, useState } from 'react'

const client = generateClient<Schema>()

type Good = Schema['Good']['type']

export default function ({ params }: { params: { slug: string } }) {
  const [goods, setGoods] = useState<Good[]>([])

  useEffect(function () {
    async function f() {
      // FIXME: Optimize query
      const { data: profiles, errors } =
        await client.models.UserProfile.listUserProfileBySlug({
          slug: params.slug,
        })

      debugger

      if (profiles?.length >= 1) {
        const profile = profiles[0]
        const id = profile.id.includes('::')
          ? profile.id
          : `${profile.id}::${profile.id}`
        const { data: goods, errors } =
          await client.models.Good.listGoodBySupplier({
            supplier: id,
          })
        debugger
        if (goods?.length >= 1) {
          setGoods(goods)
        } else if (errors) {
          console.error(errors)
        } else {
          setGoods([])
        }
      } else if (errors) {
        console.error(errors)
      }
    }

    f()
  }, [])

  return (
    <>
      <h2>Products</h2>

      <div className='row row-cols-1 row-cols-md-4 g-4'>
        {goods.map(good => (
          <div className='col'>
            <div className='card'>
              <svg
                className='bd-placeholder-img card-img-top'
                width='100%'
                height={140}
                xmlns='http://www.w3.org/2000/svg'
                role='img'
                aria-label='Placeholder: Image cap'
                preserveAspectRatio='xMidYMid slice'
                focusable='false'
              >
                <title>Placeholder</title>
                <rect width='100%' height='100%' fill='#868e96' />
                <text x='50%' y='50%' fill='#dee2e6' dy='.3em'>
                  Image cap
                </text>
              </svg>

              <div className='card-body'>
                <h5 className='card-title'>{good.title}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
