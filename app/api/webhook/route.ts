// import Stripe from "stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.json();
  // console.log(body);
  // console.log(body.content.order.order_id);
  if (body.event_name !== "ORDER_SUCCEEDED") {
    return;
    new NextResponse(`Order Not Succeeded`, {
      status: 400,
    });
  }
  // const signature = headers().get("Stripe-Signature") as string;

  // let event: Stripe.Event;

  // try {
  //   event = stripe.webhooks.constructEvent(
  //     body,
  //     signature,
  //     process.env.STRIPE_WEBHOOK_SECRET!
  //   );
  // } catch (error: any) {
  //   return new NextResponse(`Webhook Errors: ${error.message}`, {
  //     status: 400,
  //   });
  // }
  // const session = event.data.object as Stripe.Checkout.Session;
  // const address = session?.customer_details?.address;
  // const email= session?.customer_details?.email;

  // const addressComponents = [
  //   address?.line1,
  //   address?.line2,
  //   address?.city,
  //   address?.state,
  //   address?.postal_code,
  //   address?.country,
  // ];
  // const addressString = addressComponents.filter((c) => c !== null).join(", ");
  // if (event.type === "checkout.session.completed") {
  const order = await prismadb.order.update({
    where: {
      id: body.content.order.order_id,
    },
    data: {
      isPaid: true,
    },
    include: {
      orderItems: true,
    },
  });
  const sizes = await prismadb.size.findMany({});
  const paidProducts = order.orderItems.map((orderItem) => ({
    id: orderItem.productId,
    sizeId: sizes.find((size) => size.value === orderItem.sizeValue)?.id,
  }));
  console.log(paidProducts);
  async function updateStock() {
    paidProducts.forEach(async (prod) => {
      const currentStock = await prismadb.stock.findMany({
        where: {
          productId: prod.id,
          sizeId: prod.sizeId,
        },
      });
      console.log("old",currentStock[0].stockValue);
      const updatedStock = await prismadb.stock.updateMany({
        where: {
          productId: prod.id,
          sizeId: prod.sizeId,
        },
        data: {
          stockValue: currentStock[0].stockValue - 1,
        },
      });
      console.log("new",updatedStock);
    });
    console.log("done update");
  }
  await updateStock();
  console.log("after update");
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
  // }
  return new NextResponse(null, { status: 200 });
}
