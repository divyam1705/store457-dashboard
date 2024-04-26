"use client"
import AlertModal from '@/components/modals/alert-model';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import ImageUpload from '@/components/ui/image-upload';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import StockUpload from '@/components/ui/stock-upload';
import { toast } from '@/components/ui/use-toast';
// import useOrigin from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Category, Color, Image, Product, Size } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
// import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

interface ProductFormProps {
    initialData: Product & { images: Image[] } | null;
    categories: Category[];
    sizes: Size[];
    colors: Color[]
}
const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({ url: z.string() }).array(),
    price: z.coerce.number().min(50, {
        message: "atleast rupees 50"
    }), //setting min item price to 50
    categoryId: z.string().min(1),
    colorId: z.string().min(1),
    stocks: z.object({ sizeId: z.string().min(1), stockValue: z.number(), sizeValue: z.string().min(1) }).array(),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional()
});
type ProductFormValues = z.infer<typeof formSchema>;
function ProductForm({ initialData, categories, sizes, colors }: ProductFormProps) {

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const params = useParams();
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price: parseFloat(String(initialData?.price)),
        } : {
            name: "",
            images: [],
            price: 0,
            categoryId: "",
            colorId: "",
            stocks: [],
            isFeatured: false,
            isArchived: false
        }
    });
    const title = initialData ? "Edit Product" : "Create Product";
    const toastMessage = initialData ? "Product Edited" : "Product Created";
    const router = useRouter();
    const onSubmit = async (data: ProductFormValues) => {
        let title, description;
        try {
            setLoading(true);
            if (initialData) {
                await axios.patch(`/api/${params.storeId}/products/${params.productId}`, data)
                title = "Success";
                description = "Product Updated Successfully"
            }
            else {
                await axios.post(`/api/${params.storeId}/products`, data);
                title = "Success";
                description = "Product Created Successfully"
            }
            router.refresh();

            toast({
                variant: "success",
                title: title,
                description: description
            })
            router.push(`/${params.storeId}/products`);
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
            await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
            router.refresh();
            router.push(`/${params.storeId}/products`);
            toast({
                variant: "success",
                title: "Success",
                description: "Product Deleted Successfully"
            })

        } catch (error) {
            toast({
                variant: "destructive",
                title: "Something went wrong",
                description: "Could not delete the Product. "
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
                    description={initialData ? "Edit your product" : "Create new product"}
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
                        name="images"
                        render={({ field }) => {
                            return <FormItem>
                                <FormLabel>Images</FormLabel>
                                <FormControl>
                                    <ImageUpload
                                        disabled={loading}
                                        onChange={(url) => field.onChange([...field.value, { url }])}
                                        onRemove={(url) => field.onChange([...field.value.filter((cur) => (cur.url !== url))])}
                                        value={field.value.map((image) => image.url)} />
                                </FormControl>
                                <FormMessage />

                            </FormItem>
                        }}
                    />
                    <div className='grid grid-cols-3 gap-8'>
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder='Product name' {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => {
                                return <FormItem>
                                    <FormLabel>Price</FormLabel>
                                    <FormControl>
                                        <Input type="number" disabled={loading} placeholder='599' {...field} />
                                    </FormControl>
                                    <FormMessage />

                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) =>
                            (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value} >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue defaultValue={field.value}
                                                    placeholder="Select a Category">

                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent >
                                            {categories.map((item) => {
                                                return (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        <div>{item.name}</div>
                                                    </SelectItem>)
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>)}

                        />

                        <FormField
                            control={form.control}
                            name="colorId"
                            render={({ field }) =>
                            (
                                <FormItem>
                                    <FormLabel>Color</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value} >
                                        <FormControl>
                                            <SelectTrigger >
                                                <SelectValue defaultValue={field.value}
                                                    placeholder="Select a Color">

                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent >
                                            {colors.map((item) => {
                                                return (
                                                    <SelectItem key={item.id} value={item.id}>
                                                        <div className='flex items-center gap-x-4'
                                                        >{item.name}
                                                            <div className='w-4 h-4 rounded-full border' style={{ backgroundColor: item.value }} />
                                                        </div>
                                                    </SelectItem>)
                                            })}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>)}

                        />

                    </div>
                    <div className='gap-6 flex'>
                        <FormField
                            control={form.control}
                            name="isFeatured"
                            render={({ field }) => {
                                return <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 max-w-[300px]'>
                                    <FormControl>
                                        <Checkbox
                                            disabled={loading}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Featured
                                        </FormLabel>
                                        <FormDescription className='text-sm'>
                                            This product will be featured on Home Page
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            }}
                        />
                        <FormField
                            control={form.control}
                            name="isArchived"
                            render={({ field }) => {
                                return <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 max-w-[300px]'>
                                    <FormControl>
                                        <Checkbox
                                            disabled={loading}
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className='space-y-1 leading-none'>
                                        <FormLabel>
                                            Archived
                                        </FormLabel>
                                        <FormDescription className='text-sm'>
                                            This product will not appear anywhere in the store
                                        </FormDescription>
                                    </div>
                                </FormItem>
                            }}
                        />
                    </div>
                    <div><FormField
                        control={form.control}
                        name="stocks"
                        render={({ field }) =>
                        (
                            <FormItem>
                                <FormLabel>Size & Stock</FormLabel>
                                <FormControl>
                                    <StockUpload
                                        sizes={sizes}
                                        disabled={loading}
                                        onInitialize={(arr: { sizeId: string, stockValue: number, sizeValue: string }[]) => field.onChange([...arr])}
                                        onChange={(updatedStock) => field.onChange(field.value.map((stock) => {
                                            if (stock.sizeId === updatedStock.sizeId) {
                                                stock.stockValue = updatedStock.stockValue;
                                            }
                                            return stock;
                                        }))}
                                        // onChange={(stock) => field.onChange([...field.value, stock])}
                                        value={field.value} //array of stocks with size id and value being the number of items
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>)}

                    /></div>
                    <Button disabled={loading} className='ml-auto' type='submit'>
                        {initialData ? "Save Changes" : "Create Product"}
                    </Button>
                </form>

            </Form >
        </>
    )
}

export default ProductForm