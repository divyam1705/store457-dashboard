"use client"
import React, { useEffect, useState } from 'react'
import { Button } from './button';
import { Size } from '@prisma/client';
import { Input } from '@/components/ui/input';

interface StockUploadProps {
    sizes: Size[]
    disabled?: boolean;
    onChange: (stock: { sizeId: string, stockValue: number, sizeValue: string }) => void;
    value: { sizeId: string, stockValue: number, sizeValue: string }[];
    onInitialize: (arr: { sizeId: string, stockValue: number, sizeValue: string }[]) => void;
}
function StockUpload({ disabled, onChange, value, sizes, onInitialize }: StockUploadProps) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
        // console.log(value);
    }, []);

    const onChangeLocal = ({ sizeId, stockValue, sizeValue }: { sizeId: string, stockValue: number, sizeValue: string }) => {
        // console.log("changecheck ", sizeValue);
        // console.log("stockValue ", stockValue);
        onChange({ sizeId, stockValue, sizeValue });
    }
    if (!isMounted) {
        return null;
    }
    if (value.length === 0) {
        const formattedStocks = sizes.map((size) => {
            return ({
                sizeId: size.id,
                sizeValue: size.value,
                stockValue: 0
            })

        })
        onInitialize(formattedStocks);
    }

    return (
        <div>
            <div className='grid grid-cols-3 gap-4'>
                {value.map(({ sizeId, stockValue, sizeValue }) => {
                    return (
                        <div key={sizeId} className=' border-2 flex rounded-lg p-4 space-x-2 items-center '>
                            <div className='p-1 '>{sizeValue}</div>
                            <Input className="border-none p-1 overflow-hidden" onChange={(e) => onChangeLocal({ sizeId, sizeValue, stockValue: Number(e.target.value) })} type="number" placeholder='10' value={stockValue} />
                        </div>
                    )
                })}
            </div>

        </div>
    )
}

export default StockUpload