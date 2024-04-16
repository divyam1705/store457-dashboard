"use client"
import { Button } from '@/components/ui/button'
import Heading from '@/components/ui/heading'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { OrderColumn, columns } from './columns'
import { Separator } from '@/components/ui/separator'
import { DataTable } from '@/components/ui/data-table'
import ApiList from '@/components/ui/api-list'
interface OrderClientProps {
  data: OrderColumn[]
}
function OrderClient({ data }: OrderClientProps) {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <Heading title={`Orders (${data.length})`} description='Manage orders for your store' />
      <Separator />
      <DataTable searchKey='products' columns={columns} data={data} />
    </>
  )
}

export default OrderClient