import React from 'react'

const page = ({params}:{params:{id:string,id_test:string}}) => {
    console.log(`this is id ${params.id} and this is id_test ${params.id_test}`)
  return (
    <div>page</div>
  )
}

export default page