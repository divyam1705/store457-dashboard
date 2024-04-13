"use client";
import { Modal } from "@/components/ui/modal";
import useStoreModal from "@/hooks/use-store-modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { redirect } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1),
})

export const StoreModal = () => {
    const {toast}=useToast();
    const [loading, setloading] = useState(false)
    const { storeModal, closeStoreModal } = useStoreModal();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: ""
        }
    });
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setloading(true);
            const response = await axios.post("/api/stores",values);
            // console.log(response.data);
            toast({
                title:"Success",
                variant:"success",
                description:"Store "+values.name+" successfully created"
            });
            console.log(response.data.id);
            window.location.assign(`/${response.data.id}`)
        } catch (error) {
            console.log(error);
            
            toast({
                title:"Error",
                variant:"destructive",
                description:"something went wrong"
            });
        } finally{
            setloading(false);
        }
    }
    return (
        <Modal
            {...storeModal}
            onClose={closeStoreModal}>
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={loading} placeholder="E commerce" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button disabled={loading}  variant="outline" onClick={()=>{closeStoreModal()}}>Cancel</Button>
                                <Button disabled={loading} type="submit">Continue</Button>
                            </div>

                        </form>
                    </Form>

                </div>
            </div>
        </Modal>);
}