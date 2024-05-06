import prismadb from '@/lib/prismadb'
import React from 'react'
import PromoCodeForm from './components/promocode-form';

async function PromoCodePage({
    params:{promoCodeId}
}:{params:{promoCodeId:string}}) {

    const promocode= await prismadb.promoCode.findUnique({
        where:{
            id:promoCodeId
        }
    });
  return (
    <div className='flex-col'>
       <div className='flex-1 space-y-4 p-8 pt-6'>
            <PromoCodeForm initialData={promocode}/>
       </div>

    </div>
  )
}

export default PromoCodePage