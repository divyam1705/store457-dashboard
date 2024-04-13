"use client"
import AlertModal from '@/components/modals/alert-model';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
// import useOrigin from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard} from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

interface BillboardFormProps {
    initialData: Billboard | null;
}
const formSchema = z.object({
    label: z.string().min(1),
    imageUrl: z.string().min(1)
});
type BillboardFormValues = z.infer<typeof formSchema>;
function BillboardForm({ initialData }: BillboardFormProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const form = useForm<BillboardFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            label: "",
            imageUrl: ""
        }
    });
    const title = initialData ? "Edit Billboard" : "Create Billboard";
    const toastMessage = initialData ? "Billboard Edited" : "Billboard Created";
    const router = useRouter();
    const onSubmit = async (data: BillboardFormValues) => {
        let title,description;
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`, data)
                title="Success";
                description="Billboard Updated Successfully"
            }
            else{
                await axios.post(`/api/${params.storeId}/billboards`, data);
                title="Success";
                description="Billboard Created Successfully"
            }
            router.refresh();

            toast({
                variant: "success",
                title: title,
                description: description
            })
            router.push(`/${params.storeId}/billboards`);
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`);
            router.refresh();
            router.push(`/${params.storeId}/billboards`);
            toast({
                variant: "success",
                title: "Success",
                description: "Billboard Deleted Successfully"
            })

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Could not delete the Billboard. Make sure you delete all categories using this billboard first"
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
                    description={initialData ? "Edit your billboard" : "Create new billboard"}
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
                    <FormField
                        control={form.control}
                        name="imageUrl"
                        render={({ field }) => {
                            return <FormItem>
                                <FormLabel>Background Image</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                    disabled={loading}
                                    onChange={(url)=>field.onChange(url)}
                                    onRemove={()=>field.onChange("")}
                                     value={field.value?[field.value]:[]}/>
                                    </FormControl>
                                <FormMessage />

                            </FormItem>
                        }}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name="label"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Label</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Billboard label' {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            }}
                        />

                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {initialData ? "Save Changes" : "Create billboard"}
                    </Button>
                </form>

            </Form>
        </>
    )
}

export default BillboardForm