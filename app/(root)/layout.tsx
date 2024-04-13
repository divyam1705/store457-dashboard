import prismadb from '@/lib/prismadb';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'


async function SetupLayout({children}:{children:React.ReactNode}) {
    const {
        data: { user },
        error,
      } = await createClient().auth.getUser();
    // console.log(user);
    if (!user) {
        redirect("/sign-up");
    }
    
    const store= await prismadb.store.findFirst({});
    if(store){
        // console.log(user);
        redirect(`/${store.id}`);
    }
  return (
    <>
        {children}
    </>
  )
}

export default SetupLayout