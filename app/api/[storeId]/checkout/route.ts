// import Stripe from "stripe";
import { NextResponse } from "next/server";
// import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { connect } from "http2";
import { Product } from "@prisma/client";
import { Phone } from "lucide-react";
import axios from "axios";

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
  const { orderedProducts, promoCodeId, userEmail, userPhone, userAddress } =
    await req.json(); //changed product id with size
  // console.log(orderedProducts);
  if (!promoCodeId) {
    return NextResponse.json("Promo Code Id Required", { status: 400 });
  }
  if (!userEmail) {
    return NextResponse.json("Email Required", { status: 400 });
  }
  if (!userPhone) {
    return NextResponse.json("Phone Number Required", { status: 400 });
  }
  if (!userAddress) {
    return NextResponse.json("Address Required", { status: 400 });
  }
  const productIds = orderedProducts.map(
    (prod: { productId: string; sizeValue: string }) => prod.productId
  );
  // console.log(productIds);

  if (!productIds || productIds.length === 0) {
    return NextResponse.json("Product Ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      color: true,
    },
  });
  const promocode = await prismadb.promoCode.findUnique({
    where: {
      id: promoCodeId,
    },
  });
  if (!promocode) {
    return NextResponse.json("Valid Promo Code  Required", { status: 400 });
  }
  //this should be changed for hdfc
  // const line_items:Stripe.Checkout.SessionCreateParams.LineItem[]=[];
  let description = "";
  let amount = 0;
  orderedProducts.forEach(
    (product: { productId: string; sizeValue: string }) => {
      const cur_prod = products.find((prod) => prod.id === product.productId);
      if (!cur_prod) {
        return;
      }
      description += cur_prod.name + " " + product.sizeValue + " " + cur_prod.color.name + " ";
      amount += Math.floor(
        cur_prod.price.toNumber() * 100 -
          Number(promocode?.value) * cur_prod.price.toNumber()
      );
    }
  );
  function generateAlphanumericId(length:number) {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * chars.length);
      result += chars[randomIndex];
    }
    return result;
  }
  
  // Example usage
  const id = generateAlphanumericId(20); // Generate an ID with length 20
  //TODO REmove console log
  // console.log(id);
  
  const order = await prismadb.order.create({
    data: {
      id:id,
      email: userEmail,
      promoCodeId: promoCodeId,
      storeId: params.storeId,
      isPaid: false,
      phone: userPhone,
      address: userAddress,
      orderItems: {
        create: orderedProducts.map(
          (prod: { productId: string; sizeValue: string }) => ({
            product: {
              connect: {
                id: prod.productId,
              },
            },
            sizeValue: prod.sizeValue,
          })
        ),
      },
    },
  });

  // const session = await stripe.checkout.sessions.create({
  //   line_items,
  //   mode: "payment",
  //   billing_address_collection: "required",
  //   phone_number_collection: {
  //     enabled: true,
  //   },
  //   success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
  //   cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
  //   metadata: {
  //     orderId: order.id,
  //   },
  // });
  // console.log("total price", amount);
  const hdfcOrderData = {
    orderId: order.id,
    email: userEmail,
    phone: userPhone,
    amount: Math.floor(amount / 100),
    description: description,
  };
  // console.log(hdfcOrderData);
  const session = await axios.post(
    `${process.env.HDFCBACKENDURL}/initiateJuspayPayment`,
    hdfcOrderData
  );
  return NextResponse.json(
    { url: session.data?.payment_links?.web },
    {
      headers: corsHeaders,
    }
  );
}
