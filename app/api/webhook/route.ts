import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Errors: ${error.message}`, {
      status: 400,
    });
  }
  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;
  const email= session?.customer_details?.email;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];
  const addressString = addressComponents.filter((c) => c !== null).join(", ");
  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
        where:{
            id:session?.metadata?.orderId,
        },
        data:{
            isPaid: true,
            address: addressString,
            phone: session?.customer_details?.phone || "",
            // email:email||""
        },
        include:{
            orderItems:true
        }
    });
    const sizes = await prismadb.size.findMany({});
    const paidProducts = order.orderItems.map((orderItem)=>(
      {
      id:orderItem.productId,
      sizeId:sizes.find(size=>size.value===orderItem.sizeValue)?.id
    }
    ));
      // console.log(paidProducts);
    paidProducts.forEach(async(prod) => {

      const currentStock = await prismadb.stock.findMany({
        where: {
            productId: prod.id,
            sizeId: prod.sizeId
        }
    });
    console.log(currentStock);
      await prismadb.stock.updateMany({
        where:{
          productId:prod.id,
          sizeId:prod.sizeId
        },
        data:{
          stockValue:currentStock[0].stockValue-1
        }
      })
    });
    // out of stock

    // await prismadb.product.updateMany({
    //     where:{
    //         id:{
    //             in:[...productIds]
    //         }
    //     },
    //     data:{
    //         isArchived: true
    //     }
    // });
  }
  return new NextResponse(null,{status:200})
}
