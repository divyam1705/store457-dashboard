import React from 'react'
import { format } from "date-fns";
import OrderClient from './components/client'
import prismadb from '@/lib/prismadb'
import { OrderColumn } from './components/columns';
import { formatter } from '@/lib/utils';
import { boolean } from 'zod';
async function OrdersPage(
  { params }: { params: { storeId: string } }
) {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      orderItems: {
        include: {
          product: {
            include: { color: true }
          }
        }
      },
      promoCode: true

    },
    orderBy: {
      createdAt: "desc"
    }
  });
  const formattedOrders: OrderColumn[] = orders.map(
    (item) => {
      return ({
        id: item.id,
        phone: item.phone,
        email: item.email,
        address: item.address,
        promoCode: item.promoCode.name,
        products: item.orderItems.map((orderItem) => `${orderItem.product.name} ${orderItem.sizeValue} ${orderItem.product.color.name}`).join(", "),
        totalPrice: formatter.format(item.orderItems.reduce((total, prod) => {
          return total + Math.floor(Number(prod.product.price) - Number(item.promoCode.value) * Number(prod.product.price) / 100)
        }, 0)),
        isPaid: item.isPaid,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
      }
      )
    }
  );
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  )
}

export default OrdersPage