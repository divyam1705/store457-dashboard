"use client"

import { ColumnDef } from "@tanstack/react-table"


export type OrderColumn = {
  id: string
  email: string
  phone: string
  address: string
  isPaid: boolean
  totalPrice: string
  products: string
  createdAt: string
  promoCode: string
}



export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "id",
    header: "Order Id",
    // cell:({row})=>(
    //   <div className=" ">
    //     {row.original.id}
    //   </div>
    // )
  },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total Price",
  },
  {
    accessorKey: "promoCode",
    header: "PromoCode",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  }

]
