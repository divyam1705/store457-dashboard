"use client"

import { ColumnDef } from "@tanstack/react-table"


export type OrderColumn = {
  id: string
  email:string
  phone: string
  address:string
  isPaid:boolean
  totalPrice:string
  products: string
  createdAt:string
}

export const columns: ColumnDef<OrderColumn>[] = [
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
    accessorKey: "isPaid",
    header: "Paid",
  }
]
