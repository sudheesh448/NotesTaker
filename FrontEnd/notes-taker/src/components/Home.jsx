import React, { useState } from 'react'
import Head from './Home/Head'
import List from './Home/List'
import Create from './Home/Create'


function Home() {
  const [update,setUpdate]=useState("")
  return (
    <div className='w-full m-0'>
        <div className='w-full'>
            <Head/>
            <div className='md:flex'>
            <div className=' md:w-1/3'>
                  <Create update={update} setUpdate={setUpdate}/>
                </div>
                <div className='md:w-2/3'>
                    <List update={update} setUpdate={setUpdate}/>
                </div>
                
             
            </div>
            <div className='bg-indigo-600'>

            </div>
        </div>
    </div>
  )
}

export default Home