import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
//this route is to create a new category


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
    const { name, billboardId } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }
    if (!billboardId) {
      return new NextResponse("Billboard Id is Required", { status: 400 });
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
    const category = await prismadb.category.create({
      data: {
        name,
        billboardId,
        storeId: params.storeId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log("[CATEGORY_POST]", error);
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
    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
      include: {
        billboard: true,
        
      },
    });
    return NextResponse.json(categories,{
      headers:corsHeaders
    });
  } catch (error) {
    console.log("[CATEGORIES_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
