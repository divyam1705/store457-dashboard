"use client"
import AlertModal from '@/components/modals/alert-model';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
// import useOrigin from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Billboard, Category } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

interface CategoryFormProps {
    initialData: Category | null;
    billboards: Billboard[]
}
const formSchema = z.object({
    name: z.string().min(1),
    billboardId: z.string().min(1)
});
type CategoryFormValues = z.infer<typeof formSchema>;
function CategoryForm({ initialData, billboards }: CategoryFormProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const form = useForm<CategoryFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
        }
    });
    const title = initialData ? "Edit Category" : "Create Category";
    const toastMessage = initialData ? "Category Edited" : "Category Created";
    const router = useRouter();
    const onSubmit = async (data: CategoryFormValues) => {
        let title, description;
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`, data)
                title = "Success";
                description = "Category Updated Successfully"
            }
            else {
                await axios.post(`/api/${params.storeId}/categories`, data);
                title = "Success";
                description = "Category Created Successfully"
            }
            router.refresh();

            toast({
                variant: "success",
                title: title,
                description: description
            })
            router.push(`/${params.storeId}/categories`);
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`);
            router.refresh();
            router.push(`/${params.storeId}/categories`);
            toast({
                variant: "success",
                title: "Success",
                description: "Category Deleted Successfully"
            })

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Could not delete the Category"
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
                    description={initialData ? "Edit your Category" : "Create new Category"}
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
                                        <Input disabled={loading} placeholder='Category Name' {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="billboardId"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Billboard</FormLabel>
                                    <Select 
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value} >
                                        <FormControl>
                                            <SelectTrigger className="h-[60px] w-[250px]">
                                                <SelectValue defaultValue={field.value}
                                                    placeholder="Select a Billboard"
                                                    
                                                    >

                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent >
                                            {billboards &&
                                                billboards.map((item) => {
                                                    return (

                                                        <SelectItem key={item.id} value={item.id}>
                                                            <div className='flex justify-center space-x-5 items-center'>
                                                                <Image className='border-2 aspect-[1/1] rounded-md'
                                                                height={40}
                                                                width={50}
                                                                    alt={item.label}
                                                                    src={item.imageUrl}
                                                                     />
                                                                <div>{item.label}</div>
                                                            </div>
                                                        </SelectItem>

                                                    )

                                                })
                                            }
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />

                                </FormItem>
                            }}
                        />

                    </div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {initialData ? "Save Changes" : "Create Category"}
                    </Button>
                </form>

            </Form>
        </>
    )
}

export default CategoryForm