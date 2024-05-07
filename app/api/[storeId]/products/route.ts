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
    const {
      name,
      categoryId,
      price,
      colorId,
      images,
      stocks,
      description,
      details,
      isFeatured,
      isArchived,
    } = body;
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

    if (!colorId) {
      return new NextResponse("Color Id is Required", { status: 400 });
    }
    if (!images || !images.length) {
      return new NextResponse("Images are Required", { status: 400 });
    }
    if (!description) {
      return new NextResponse("Description is Required", { status: 400 });
    }
    if (!details) {
      return new NextResponse("Details are Required", { status: 400 });
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
    const product = await prismadb.product.create({
      data: {
        name,
        price,
        colorId,
        categoryId,
        isFeatured,
        description,
        details,
        isArchived,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
        stocks: {
          createMany: {
            data: [
              ...stocks.map(
                (stock: {
                  stockValue: Number;
                  sizeId: string;
                  sizeValue: String;
                }) => stock
              ),
            ],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.log("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    //filters
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId) {
      return new NextResponse("store id is Required", { status: 400 });
    }
    //when passed undefined it ignores the filters
    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        stocks: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.log("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
