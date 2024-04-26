import prismadb from "@/lib/prismadb";


export const getStockCount = async (storeId:string)=>{
    const stockCount= await prismadb.stock.findMany({});
    const count = stockCount.reduce((total,stock)=>{
        return total+stock.stockValue;
    },0)

    return count;
}