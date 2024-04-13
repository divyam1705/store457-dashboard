import prismadb from '@/lib/prismadb'
import React from 'react'
import CategoryForm from './components/category-form';

async function CategoryPage({
  params: { categoryId , storeId}
}: { params: { categoryId: string, storeId: string } }) {

  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId
    }
  });
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId
    }
  });
  //if no billboard exists then the billboardId will be new
  // even if no billboard no problem
  //depending of whether there is a billboard or not we show
  // an edit form or a create form
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <CategoryForm billboards={billboards} initialData={category} />
      </div>

    </div>
  )
}

export default CategoryPage