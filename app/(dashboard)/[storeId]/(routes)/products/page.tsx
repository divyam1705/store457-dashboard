import React from 'react'
import {format} from "date-fns";
import ProductClient from './components/client'
import prismadb from '@/lib/prismadb'
import { ProductColumn } from './components/columns';
import { formatter } from '@/lib/utils';
async function ProductsPage(
  { params }: { params: { storeId: string } }
) {
  const products = await prismadb.product.findMany({
    where:{
      storeId:params.storeId
    },
    include:{
      category:true,
      color:true,
      stocks:true
    },
    orderBy:{
      createdAt:"desc"
    }
  });
  const formattedProducts : ProductColumn [] = products.map(
    (item)=>{
      return ({
        id:item.id,
        name:item.name,
        category:item.category.name,
        price:formatter.format(item.price.toNumber()),
        isFeatured:item.isFeatured,
        isArchived:item.isArchived,
        color:item.color.value,
        sizes:item.stocks.filter((stk)=>stk.stockValue!==0).map((stock) => stock.sizeValue).join(", "),
        createdAt: format(item.createdAt,"MMMM do, yyyy")
      }

      )
    }
  );
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <ProductClient data={formattedProducts}/>
      </div>
    </div>
  )
}

export default ProductsPage