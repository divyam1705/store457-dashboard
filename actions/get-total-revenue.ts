import prismadb from "@/lib/prismadb";


export const getTotalRevenue = async (storeId:string)=>{
    const paidOrders= await prismadb.order.findMany({
        where:{
            storeId,
            isPaid:true
        },
        include:{
            orderItems:{
                include:{
                    product:true
                }
            },
            promoCode:true
        }
    });

    const totalRevenue = paidOrders.reduce((total,order)=>{
        const orderTotal = order.orderItems.reduce((orderSum,item)=>{
                return orderSum + Math.floor(item.product.price.toNumber() - Number(order.promoCode.value)*item.product.price.toNumber()/100);
        },0);
        return total+orderTotal;
    },0);
    return totalRevenue;
}