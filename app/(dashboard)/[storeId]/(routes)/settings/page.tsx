import prismadb from '@/lib/prismadb';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import React from 'react'
import SettingsForm from './components/settings-form';


interface SettingsPageProps{
  params:{
    storeId:string;
  }
}
async function SettingsPage({params}:SettingsPageProps) {
//   const {
//     data: { user },
//     error,
//   }= await createClient().auth.getUser();

//   if (!user) { 
//     redirect("/sign-up");
// }
const store = await prismadb.store.findFirst({
  where:{
    id:params.storeId
  }
});
if(!store){
  redirect("/");
}
  return (
    <div className='flex-col'>
      <div className='flex-1 space-y-4 p-8 pt-6'>
          <SettingsForm initialData={store}/>
      </div>
      
      </div>
  )
}

export default SettingsPage