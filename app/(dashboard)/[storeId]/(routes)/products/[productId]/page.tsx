import prismadb from '@/lib/prismadb'
import React from 'react'
import ProductForm from './components/product-form';

async function ProductPage({
    params:{productId,storeId}
}:{params:{productId:string,storeId:string}}) {

    const product= await prismadb.product.findUnique({
        where:{
            id:productId
        },
        include:{
          images:true,
          stocks:true
        }
    });
    const categories = await prismadb.category.findMany({
      where:{
        storeId
      }
    });
    const colors = await prismadb.color.findMany({
      where:{
        storeId
      }
    });
    const sizes = await prismadb.size.findMany({
      where:{
        storeId
      }
    });
    //if no billboard exists then the productId will be new
    // even if no billboard no problem
    //depending of whether there is a billboard or not we show
    // an edit form or a create form
  return (
    <div className='flex-col'>
       <div className='flex-1 space-y-4 p-8 pt-6'>
            <ProductForm initialData={product} categories={categories} sizes={sizes} colors={colors}/>
       </div>

    </div>
  )
}

export default ProductPage