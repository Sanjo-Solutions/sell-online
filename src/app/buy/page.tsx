import outputs from '../../../amplify_outputs.json'

export default function () {
  return (
    <form
      action={`${outputs.custom.API.API.endpoint}checkout`}
      method='POST'
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <button type='submit' className='btn btn-primary btn-lg'>
        Buy
      </button>
    </form>
  )
}
