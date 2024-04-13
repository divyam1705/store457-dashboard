import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try {
        const superbase=createClient();
        const body=await req.json();
        const {name} = body;
        const user= await superbase.auth.getUser();
        const userId=user.data.user?.id;
        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }
        if(!params.storeId){
            return new NextResponse("Storeid is required",{status:400});
        }
        const store = await prismadb.store.updateMany({
            where:{
                id:params.storeId
            },
            data:{
                name
            }
        });
        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORE_PATCH]",error);
        return new NextResponse("Internal error",{status:500})
    }
}

export async function DELETE(
    req:Request,
    {params}:{params:{storeId:string}}
){
    try {
        const superbase=createClient();
        const user= await superbase.auth.getUser();
        const userId=user.data.user?.id;

        if(!userId){
            return new NextResponse("Unauthorized",{status:401});
        }
        if(!params.storeId){
            return new NextResponse("Storeid is required",{status:400});
        }
        const store = await prismadb.store.deleteMany({
            where:{
                id:params.storeId
            }
        });
        return NextResponse.json(store);
    } catch (error) {
        console.log("[STORE_DELETE]",error);
        return new NextResponse("Internal error",{status:500})
    }
}