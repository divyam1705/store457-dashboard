"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type CategoryColumn = {
  id: string
  name: string
  createdAt:string
  billboardLabel:string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "billboard",
    header: "Billboard",
    cell:({row})=>row.original.billboardLabel
  },
  {
    accessorKey:"createdAt",
    header:"Date"
  },
  {
    header:"Actions",
    id:"actions",
    cell:({row})=><CellAction data={row.original}/>
  }
]
