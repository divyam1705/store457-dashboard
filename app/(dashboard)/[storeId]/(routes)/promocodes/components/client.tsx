"use client"
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { PromoCode } from '@prisma/client'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { PromoCodeColumn, columns } from './columns'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'
interface PromoCodeClientProps{
  data:PromoCodeColumn[]
}
function PromoCodeClient({data}:PromoCodeClientProps) {
  const router = useRouter();
  const params =useParams();
  return (
    <>
    <div className='flex items-center justify-between'>
        <Heading title={`PromoCodes (${data.length})`} description='Manage promocodes for your store'/>
        <Button onClick={()=>{router.push(`/${params.storeId}/promocodes/new`)}}>
            <Plus className='mr-2 h-4 w-4'/>
            Add New
        </Button>
        </div>
        <Separator/>
        <DataTable searchKey='name' columns={columns} data={data}/>
        <Heading title="API " description='API calls for PromoCodes'/>
        <Separator/>
        <ApiList entityName='promocodes' entityIdName='promoCodeId'/>
    </>
  )
}

export default PromoCodeClient