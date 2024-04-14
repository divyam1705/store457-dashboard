"use client"
import AlertModal from '@/components/modals/alert-model';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
// import useOrigin from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Size} from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

interface SizeFormProps {
    initialData: Size | null;
}
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
});
type SizeFormValues = z.infer<typeof formSchema>;
function SizeForm({ initialData }: SizeFormProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const form = useForm<SizeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: ""
        }
    });
    const title = initialData ? "Edit Size" : "Create Size";
    const toastMessage = initialData ? "Size Edited" : "Size Created";
    const router = useRouter();
    const onSubmit = async (data: SizeFormValues) => {
        let title,description;
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`, data)
                title="Success";
                description="Size Updated Successfully"
            }
            else{
                await axios.post(`/api/${params.storeId}/sizes`, data);
                title="Success";
                description="Size Created Successfully"
            }
            router.refresh();

            toast({
                variant: "success",
                title: title,
                description: description
            })
            router.push(`/${params.storeId}/sizes`);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Could not complete your request"
            })
        }
        finally {
            setLoading(false);
        }
    }
    async function onDelete() {
        try {
            setLoading(true);
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`);
            router.refresh();
            router.push(`/${params.storeId}/sizes`);
            toast({
                variant: "success",
                title: "Success",
                description: "Size Deleted Successfully"
            })

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Could not delete the Size. Make sure you delete all products using this size first"
            })
        }
        finally {
            setLoading(false);
        }


    }
    // const origin = useOrigin();
    return (
        <>
            <AlertModal isOpen={open}
                onClose={() => { setOpen(false) }}
                loading={loading}
                onConfirm={onDelete}
            />
            <div className='flex items-center justify-between'>
                <Heading
                    title={title}
                    description={initialData ? "Edit your size" : "Create new size"}
                />
                {initialData && <Button disabled={loading} variant="destructive" size="sm"
                    onClick={() => { setOpen(true) }}
                >
                    <Trash />
                </Button>}

            </div>
            <Separator />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
                    
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Size name' {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            }}
                        />
                        <FormField
                        control={form.control}
                        name="value"
                        render={({ field }) => {
                            return <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                <Input disabled={loading} placeholder='Size value' {...field} />
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        }}
                    />

                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {initialData ? "Save Changes" : "Create size"}
                    </Button>
                </form>

            </Form>
        </>
    )
}

export default SizeForm