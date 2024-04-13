"use client"

import { ColumnDef } from "@tanstack/react-table"
import CellAction from "./cell-action"

export type CategoryColumn = {
  id: string
  name: string
  createdAt:string
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "Name",
    header: "name",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    header:"Actions",
    id:"actions",
    cell:({row})=><CellAction data={row.original}/>
  }
]
