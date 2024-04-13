"use client"
import AlertModal from '@/components/modals/alert-model';
import ApiAlert from '@/components/ui/api-alert';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import Heading from '@/components/ui/heading';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/use-toast';
import useOrigin from '@/hooks/use-origin';
import { zodResolver } from '@hookform/resolvers/zod';
import { Store } from '@prisma/client'
import axios from 'axios';
import { Trash } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import * as z from "zod";

interface SettingsFormProps {
  initialData: Store;
}
const formSchema=z.object({
  name:z.string().min(1),
});
type SettingsFormValues = z.infer<typeof formSchema>;
function SettingsForm({ initialData }: SettingsFormProps) {

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const params= useParams();
  const form=useForm<SettingsFormValues>({
    resolver:zodResolver(formSchema),
    defaultValues:initialData
  });

  const router = useRouter();
  const onSubmit= async (data:SettingsFormValues)=>{
    try {
      setLoading(true);
      await axios.patch(`/api/stores/${params.storeId}`,data)
      router.refresh();
      toast({
        variant:"success",
        title:"Success",
        description:"Changes updated successfully"
      })
    } catch (error) {
        toast({
          variant:"destructive",
          title:"Something went wrong",
          description:"Could not complete your request"
        })
      }
      finally{
        setLoading(false);
      }
  }
  async function onDelete() {
    try {
      setLoading(true);
      await axios.delete(`/api/stores/${params.storeId}`);
      router.refresh();
      router.push("/");
      toast({
        variant:"success",
        title:"Success",
        description:"Store Deleted Successfully"
      })
        
    } catch (error) {
      toast({
          variant:"destructive",
          title:"Something went wrong",
          description:"Could not delete the store. Make sure you delete all products and categories"
        })
    }
    finally{
      setLoading(false);
    }

  
  }
  const origin=useOrigin();
  return (
    <>
    <AlertModal isOpen={open}
    onClose={()=>{setOpen(false)}}
    loading={loading}
    onConfirm={onDelete}
    />
      <div className='flex items-center justify-between'>
        <Heading
          title='Settings'
          description='Manage store preferences'
        />
        <Button disabled={loading} variant="destructive" size="sm"
          onClick={() => {setOpen(true) }}
        >
          <Trash />
        </Button>

      </div>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 w-full'>
          <div className='grid grid-cols-3 gap-8'>
              <FormField 
              control={form.control}
              name="name"
              render={({field})=>{
                return <FormItem>
                  <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input  disabled={loading} placeholder='Store name' {...field} />
                    </FormControl>
                    <FormMessage />
                  
                </FormItem>
              }}
               />
          </div>
            <Button disabled={loading} className='ml-auto' type='submit'>
                  Save Changes
            </Button>
        </form>

      </Form>
      <Separator/>
      <ApiAlert title='NEXT_PUBLIC_API_URL' description={`${origin}/api/${params.storeId}`} variant='public'/>
    </>
  )
}

export default SettingsForm