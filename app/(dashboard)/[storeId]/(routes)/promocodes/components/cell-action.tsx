"use client"

import { PromoCode } from '@prisma/client'
import React, { useState } from 'react'
import { PromoCodeColumn } from './columns'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import AlertModal from '@/components/modals/alert-model';


interface CellActionProps {
    data: PromoCodeColumn;
}
function CellAction({ data }: CellActionProps) {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const { toast } = useToast();
    async function onDelete() {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/promocodes/${data.id}`);
            router.refresh();
            toast({
                variant: "success",
                title: "Success",
                description: "PromoCode Deleted Successfully"
            })

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Could not delete the PromoCode. Make sure you delete all products using this PromoCode first"
            })
        }
        finally {
            setLoading(false);
            setOpen(false);
        }


    }
    const onCopy = (id: string) => {

        navigator.clipboard.writeText(id);
        toast({
            variant: "success",
            title: "Copied",
            description: "PromoCode Id copied to Clipboard"
        })
    }
    const router = useRouter();
    const params = useParams();
    return (
        <div>
            <AlertModal isOpen={open}
                onClose={() => { setOpen(false) }}
                loading={loading}
                onConfirm={onDelete}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open Menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>
                        Actions
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => router.push(`/${params.storeId}/promocodes/${data.id}`)}>
                        <Edit className='mr-2 h-4 w-4' />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onCopy(data.id)}>
                        <Copy className='mr-2 h-4 w-4' />
                        Copy Id
                    </DropdownMenuItem>
                    <DropdownMenuItem className='text-red-500' onClick={() => setOpen(true)}>
                        <Trash className='mr-2 h-4 w-4 ' />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default CellAction