import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
//this route is to create a new billboard

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const superbase = createClient();
    const user = await superbase.auth.getUser();
    const userId = user.data.user?.id;
    const body = await req.json();
    const { name, value } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("name is Required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("value is Required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("store id is Required", { status: 400 });
    }
    const storebyUserId = prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storebyUserId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }
    const promocode = await prismadb.promoCode.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    
    return NextResponse.json(promocode);
  } catch (error) {
    console.log("[PROMOCODES_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new NextResponse("store id is Required", { status: 400 });
    }
    const promocodes = await prismadb.promoCode.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(promocodes,{
      headers:corsHeaders
    });
  } catch (error) {
    console.log("[PROMOCODES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}