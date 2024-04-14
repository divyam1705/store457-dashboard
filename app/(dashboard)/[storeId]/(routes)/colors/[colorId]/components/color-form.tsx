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
import { Color } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

interface ColorFormProps {
    initialData: Color | null;
}
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(4).regex(/^#/, {
        message: "String must be valid hex code",
    })
});
type ColorFormValues = z.infer<typeof formSchema>;
function ColorForm({ initialData }: ColorFormProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const form = useForm<ColorFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: ""
        }
    });
    const title = initialData ? "Edit Color" : "Create Color";
    const toastMessage = initialData ? "Color Edited" : "Color Created";
    const router = useRouter();
    const onSubmit = async (data: ColorFormValues) => {
        let title, description;
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/colors/${params.colorId}`, data)
                title = "Success";
                description = "Color Updated Successfully"
            }
            else {
                await axios.post(`/api/${params.storeId}/colors`, data);
                title = "Success";
                description = "Color Created Successfully"
            }
            router.refresh();

            toast({
                variant: "success",
                title: title,
                description: description
            })
            router.push(`/${params.storeId}/colors`);
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
            await axios.delete(`/api/${params.storeId}/colors/${params.colorId}`);
            router.refresh();
            router.push(`/${params.storeId}/colors`);
            toast({
                variant: "success",
                title: "Success",
                description: "Color Deleted Successfully"
            })

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Could not delete the Color. Make sure you delete all products using this color first"
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
                    description={initialData ? "Edit your color" : "Create new color"}
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
                                        <Input disabled={loading} placeholder='Color name' {...field} />
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
                                    <FormLabel>Hex Value</FormLabel>
                                    <FormControl>
                                        <div className='flex items-center gap-x-4'>
                                            
                                            <Input disabled={loading} placeholder='Color value' {...field} />
                                            <div className='border p-4 rounded-full'
                                            style={{backgroundColor:field.value}}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            }}
                        />

                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {initialData ? "Save Changes" : "Create Color"}
                    </Button>
                </form>

            </Form>
        </>
    )
}

export default ColorForm