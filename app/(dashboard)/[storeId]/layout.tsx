
import Navbar from "@/components/navbar";
import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout(
    {
        children,
        params
    }:
        {
            children: React.ReactNode;
            params: { storeId: string }
        }
) {
    const {
        data: { user },
        error,
      }= await createClient().auth.getUser();
    // console.log("user",user);
    if (!user) {
        
        redirect("/sign-up");
    }
    const store = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
            }
        });
        // console.log(user);
        // console.log(store);
        if(!store){
            redirect("/");
        }
        return (
            <>
            <Navbar/>
            {children}
            </>
        )
}