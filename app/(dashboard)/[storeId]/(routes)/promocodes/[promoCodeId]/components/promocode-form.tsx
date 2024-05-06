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
import { PromoCode } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

interface PromoCodeFormProps {
    initialData: PromoCode | null;
}
const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1)
});
type PromoCodeFormValues = z.infer<typeof formSchema>;
function PromoCodeForm({ initialData }: PromoCodeFormProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const form = useForm<PromoCodeFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            value: ""
        }
    });
    const title = initialData ? "Edit PromoCode" : "Create PromoCode";
    const router = useRouter();
    const onSubmit = async (data: PromoCodeFormValues) => {
        let title, description;
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/promocodes/${params.promoCodeId}`, data)
                title = "Success";
                description = "PromoCode Updated Successfully"
            }
            else {
                await axios.post(`/api/${params.storeId}/promocodes`, data);
                title = "Success";
                description = "PromoCode Created Successfully"
            }
            router.refresh();

            toast({
                variant: "success",
                title: title,
                description: description
            })
            router.push(`/${params.storeId}/promocodes`);
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
            await axios.delete(`/api/${params.storeId}/promocodes/${params.promoCodeId}`);
            router.refresh();
            router.push(`/${params.storeId}/promocodes`);
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
                    description={initialData ? "Edit your PromoCode" : "Create new PromoCode"}
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
                                        <Input disabled={loading} placeholder='PromoCode name' {...field} />
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
                                        <div className='flex items-center gap-x-4'>
                                            
                                            <Input disabled={loading} placeholder='PromoCode value' {...field} />
                                            
                                        </div>
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            }}
                        />

                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {initialData ? "Save Changes" : "Create PromoCode"}
                    </Button>
                </form>

            </Form>
        </>
    )
}

export default PromoCodeForm