import React from 'react'
import {format} from "date-fns";
import CategoryClient from './components/client'
import prismadb from '@/lib/prismadb'
import { CategoryColumn } from './components/columns';
async function CategoriesPage(
  { params }: { params: { storeId: string } }
) {
  const categories = await prismadb.category.findMany({
    where:{
      storeId:params.storeId
    },
    include:{
      billboard:true,

    },
    orderBy:{
      createdAt:"desc"
    }
  });
  const formattedcategories : CategoryColumn [] = categories.map(
    (item)=>{
      return ({
        id:item.id,
        name:item.name,
        billboardLabel:item.billboard.label,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
      }

      )
    }
  );
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryClient data={formattedcategories}/>
      </div>
    </div>
  )
}

export default CategoriesPage