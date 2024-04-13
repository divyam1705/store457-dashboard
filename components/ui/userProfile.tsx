"use client"
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { Button } from './button'
import { CircleUser } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { Separator } from './separator'

const UserProfile: React.FC<{email?:String}> = ({email}) => {
  const handleSignOut = () => {
    const supabase=createClient();
    supabase.auth.signOut().then(() => {
      window.location.reload();
    });
  };
  
  return (
    <>
    <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Account</DropdownMenuLabel>
            <Separator/>
              <DropdownMenuLabel className='text-muted-foreground text-sm font-semibold'>{email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Settings</DropdownMenuItem> */}
              {/* <DropdownMenuSeparator /> */}
              <DropdownMenuItem onClick={handleSignOut} >Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          </>
  )
}

export default UserProfile