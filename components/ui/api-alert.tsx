'use client'
import React from 'react'
import { Alert, AlertDescription, AlertTitle } from './alert';
import { CopyIcon, ServerIcon } from 'lucide-react';
import { Badge, BadgeProps } from './badge';
import { Button } from './button';
import { toast } from './use-toast';


interface ApiAlertProps{
    title:string;
    description:string;
    variant: "public"|"admin";
}

const textMap: Record<ApiAlertProps["variant"],string>={
    public:"Public",
    admin:"Admin"
};
const variantMap: Record<ApiAlertProps["variant"],BadgeProps["variant"]>={
    public:"secondary",
    admin:"destructive"
};


function ApiAlert({
    title,
    description,
    variant="public"
}:ApiAlertProps) {

    const onCopy=()=>{
        navigator.clipboard.writeText(description);
        toast({
            variant:"success",
            title:"Copied",
            description:"API route copied to Clipboard"
          })
    }
  return (
    <Alert>
        <ServerIcon className='h-4 w-4'/>
        <AlertTitle className='flex items-center gap-x-2'>
            {title}
            <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
        </AlertTitle>
        <AlertDescription className='mt-4 flex items-center justify-between'>
            <code className='relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold'>
                {description}
            </code>
            <Button className='outline' size="icon" onClick={onCopy}>
                <CopyIcon className='h-4 w-4'/>
            </Button>
        </AlertDescription>
    </Alert>
  )
}

export default ApiAlert