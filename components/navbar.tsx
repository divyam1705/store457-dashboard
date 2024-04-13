import React from 'react'
import UserProfile from '@/components/ui/userProfile'
import MainNav from '@/components/main-nav'
import StoreSwitcher from './store-switcher'
import prismadb from '@/lib/prismadb'
import { createClient } from '@/utils/supabase/server'

async function Navbar() {
  const {
    data: { user },
    error,
  }= await createClient().auth.getUser();

    const stores=await prismadb.store.findMany({});
  return (
    <div className='border-b'>
        <div className='flex h-16 items-center px-4 '>
            <StoreSwitcher items={stores}/>
            <MainNav className='mx-6'/>
            <div className='ml-auto flex items-center space-x-4'>
                <UserProfile email={user?.email}/>
            </div>
        </div>

    </div>
  )
}

export default Navbar