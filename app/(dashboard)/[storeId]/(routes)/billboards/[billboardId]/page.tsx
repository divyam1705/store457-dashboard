import prismadb from '@/lib/prismadb'
import React from 'react'
import BillboardForm from './components/billboard-form';

async function BillboardPage({
    params:{billboardId}
}:{params:{billboardId:string}}) {

    const billboard= await prismadb.billboard.findUnique({
        where:{
            id:billboardId
        }
    });
    //if no billboard exists then the billboardId will be new
    // even if no billboard no problem
    //depending of whether there is a billboard or not we show
    // an edit form or a create form
  return (
    <div className='flex-col'>
       <div className='flex-1 space-y-4 p-8 pt-6'>
            <BillboardForm initialData={billboard}/>
       </div>

    </div>
  )
}

export default BillboardPage