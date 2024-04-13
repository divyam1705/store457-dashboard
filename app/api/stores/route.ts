import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(req:Request) 
{
    try {
        const superbase=createClient();
        const user= await superbase.auth.getUser();
        const userId=user.data.user?.id;
        const body=await req.json();
        const {name}=body;
        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!name){
            return new NextResponse("Name is Required",{status:400});

        }

        const store=await prismadb.store.create({
            data:{
                name,
                userId
            }
        });
        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORES_POST]",error);
        return new NextResponse("Internal error",{status:500});
    }
}