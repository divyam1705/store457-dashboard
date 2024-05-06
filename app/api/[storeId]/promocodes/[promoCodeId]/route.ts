import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { promoCodeId: string } }
  ) {
    try {
  
      if (!params.promoCodeId) {
          return new NextResponse("Promocode Id is required", { status: 400 });
        }
    
      const promocode = await prismadb.promoCode.findUnique({
        where: {
          id: params.promoCodeId
        },
      });
      return NextResponse.json(promocode);
    } catch (error) {
      console.log("[PROMOCODE_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }

export async function PATCH(
  req: Request,
  { params }: { params: { promoCodeId: string; storeId: string } }
) {
  try {
    const superbase = createClient();
    const body = await req.json();
    const { name, value } = body;
    const user = await superbase.auth.getUser();
    const userId = user.data.user?.id;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    if (!value) {
      return new NextResponse("value is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }
    if (!params.promoCodeId) {
      return new NextResponse("promocode Id is required", { status: 400 });
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
    const promocode = await prismadb.promoCode.updateMany({
      where: {
        id: params.promoCodeId,
      },
      data: {
        name,
        value,
      },
    });
    return NextResponse.json(promocode);
  } catch (error) {
    console.log("[PROMOCODE_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string ,promoCodeId: string } }
) {
  try {
    const superbase = createClient();
    const user = await superbase.auth.getUser();
    const userId = user.data.user?.id;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!params.storeId) {
      return new NextResponse("Storeid is required", { status: 400 });
    }
    if (!params.promoCodeId) {
        return new NextResponse("PromoCode Id is required", { status: 400 });
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
    const promoCode = await prismadb.promoCode.deleteMany({
      where:{
        id: params.promoCodeId
      },
    });
    return NextResponse.json(promoCode);
  } catch (error) {
    console.log("[PROMOCODE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
