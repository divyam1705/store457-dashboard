import prismadb from "@/lib/prismadb";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { productId: string } }
  ) {
    try {
  
      if (!params.productId) {
          return new NextResponse("Product Id is required", { status: 400 });
        }
    
      const product = await prismadb.product.findUnique({
        where: {
          id: params.productId
        },
        include:{
          images:true,
          category:true,
          size:true,
          color:true
        }
      });
      return NextResponse.json(product);
    } catch (error) {
      console.log("[PRODUCT_GET]", error);
      return new NextResponse("Internal error", { status: 500 });
    }
  }

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const superbase = createClient();
    const body = await req.json();
    const user = await superbase.auth.getUser();
    const userId = user.data.user?.id;
    const { name,
      categoryId
      , price
      , colorId
      , images
      , sizeId
      , isFeatured
      , isArchived } = body;
    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 401 });
    }
    if (!name) {
      return new NextResponse("Name is Required", { status: 400 });
    }
    if (!price) {
      return new NextResponse("Price is Required", { status: 400 });
    }
    if (!categoryId) {
      return new NextResponse("Category Id is Required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size Id is Required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color Id is Required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images are Required", { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse("store id is Required", { status: 400 });
    }
    if(!params.productId){
      return new NextResponse("Product Id is Required", { status: 400 });
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
    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        colorId,
        sizeId,
        categoryId,
        isFeatured,
        isArchived,
        storeId: params.storeId,
        images:{
          deleteMany:{}
        }
      },
    });
    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images:{
          createMany:{
            data:[
              ...images.map((image:{url:string})=>image)
            ]
          }
        }
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string ,productId: string } }
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
    if (!params.productId) {
        return new NextResponse("Product Id is required", { status: 400 });
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
    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId
      },
    });
    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCT_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
