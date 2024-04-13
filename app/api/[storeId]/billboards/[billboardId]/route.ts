import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { billboardId: string } }
  ) {
    try {
  
      if (!params.billboardId) {
          return new NextResponse("Billboard Id is required", { status: 400 });
        }
    
      const billboard = await prismadb.billboard.findUnique({
        where: {
          id: params.billboardId
        },
      });
      return NextResponse.json(billboard);
    } catch (error) {
      console.log("[BILLBOARD_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const superbase = createClient();
    const body = await req.json();
    const { label, imageUrl } = body;
    const user = await superbase.auth.getUser();
    const userId = user.data.user?.id;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!label) {
      return new NextResponse("Label is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("image url is required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("Store Id is required", { status: 400 });
    }
    if (!params.billboardId) {
      return new NextResponse("Billboard Id is required", { status: 400 });
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
    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string ,billboardId: string } }
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
    if (!params.billboardId) {
        return new NextResponse("Billboard Id is required", { status: 400 });
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
    const billboard = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId
      },
    });
    return NextResponse.json(billboard);
  } catch (error) {
    console.log("[BILLBOARD_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
