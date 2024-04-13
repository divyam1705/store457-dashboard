"use client"
import React, { useEffect, useState } from 'react'
import { Button } from './button';
import { ImagePlus, Trash } from 'lucide-react';
import Image from 'next/image';
import { CldUploadWidget } from "next-cloudinary"

interface ImageUploadProps {
    disabled?: boolean;
    onChange: (value: string) => void;
    onRemove: (value: string) => void;
    value: string[];
}
function ImageUpload({ disabled, onChange, onRemove, value }: ImageUploadProps) {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const onUpload = (result: any) => {
        onChange(result.info.secure_url);
    }
    if (!isMounted) {
        return null;
    }
    return (
        <div>
            <div className='mb-4 flex items-center gap-4'>

                {value.map((url) => (
                    <div key={url} className='relative w-[200px] h-[200px] rounded-md overflow-hidden'>
                        <div className='z-10 absolute top-2 right-2'>
                            <Button type='button' onClick={() => { onRemove(url) }} variant="destructive" size="icon">
                                <Trash />
                            </Button>
                        </div>
                        <Image
                            fill
                            className='object-cover'
                            alt="Image"
                            src={url} />
                    </div>
                ))}
            </div>
            <CldUploadWidget onSuccess={onUpload} uploadPreset='kbq7qci7'>
                {({ open }) => {
                    const onClick = () => {
                        open();
                    }
                    return (
                        <Button type='button' disabled={disabled} variant="secondary" onClick={onClick}>
                            <ImagePlus className='h-4 w-4 mr-2' />
                            Upload Image
                        </Button>
                    )
                }}
            </CldUploadWidget>
        </div>
    )
}

export default ImageUpload