import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
//this route is to create a new billboard
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
    const color = await prismadb.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });
    
    return NextResponse.json(color);
  } catch (error) {
    console.log("[COLORS_POST]", error);
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
    const colors = await prismadb.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });
    return NextResponse.json(colors);
  } catch (error) {
    console.log("[COLORS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
