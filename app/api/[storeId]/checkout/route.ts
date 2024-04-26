import Stripe from "stripe";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";
import { connect } from "http2";
import { Product } from "@prisma/client";

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
  const { orderedProducts } = await req.json();//changed product id with size
  // console.log(orderedProducts);
  const productIds= orderedProducts.map((prod:{productId:string,sizeValue:string})=>prod.productId);
  // console.log(productIds);

  if (!productIds || productIds.length === 0) {
    return NextResponse.json("Product Ids are required", { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where:{
        id:{
            in:productIds
        }
    }
  });
  const line_items:Stripe.Checkout.SessionCreateParams.LineItem[]=[];
  orderedProducts.forEach((product:{productId:string,sizeValue:string})=>{
    const cur_prod=products.find(prod=>prod.id===product.productId);
    if(!cur_prod){return;}
    // console.log(cur_prod.price);
    line_items.push({
        quantity:1,
        price_data:{
            currency:"INR",
            product_data:{
                name:cur_prod.name+" "+product.sizeValue,
            },
            unit_amount:cur_prod.price.toNumber()*100
        }
    })
  });


  const order = await prismadb.order.create({
    data:{
        storeId:params.storeId,
        isPaid:false,
        orderItems:{
            create: orderedProducts.map((prod:{productId:string,sizeValue:string})=>({
                product:{
                    connect:{
                        id:prod.productId
                    }
                },
                sizeValue:prod.sizeValue
            }))
        }
    }
  });

  const session= await stripe.checkout.sessions.create({
    line_items,
    mode:"payment",
    billing_address_collection:"required",
    phone_number_collection:{
        enabled:true
    },
    success_url:`${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url:`${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata:{
        orderId:order.id
    }
  });

  return NextResponse.json({url:session.url},{
    headers:corsHeaders
  })
}
