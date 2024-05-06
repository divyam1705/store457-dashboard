import React from 'react'
import {format} from "date-fns";
import PromoCodeClient from './components/client'
import prismadb from '@/lib/prismadb'
import { PromoCodeColumn } from './components/columns';
async function PromoCodesPage(
  { params }: { params: { storeId: string } }
) {
  const promocodes = await prismadb.promoCode.findMany({
    where:{
      storeId:params.storeId
    },
    orderBy:{
      createdAt:"desc"
    }
  });
  const formattedPromoCodes : PromoCodeColumn [] = promocodes.map(
    (item)=>{
      return ({
        id:item.id,
        name:item.name,
        value:item.value,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
      }

      )
    }
  );
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <PromoCodeClient data={formattedPromoCodes}/>
      </div>
    </div>
  )
}

export default PromoCodesPage