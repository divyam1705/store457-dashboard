'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
interface Creds{
  email:string;
  password:string;
}
export async function login(values:Creds) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: values.email as string,
    password: values.password as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return error.message;
  }

  revalidatePath('/', 'layout')
  redirect('/');
  return "";
}

export async function signup(values:Creds) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: values.email as string,
    password: values.password as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return error.message;
  }

  revalidatePath('/', 'layout')
  redirect('/')
  return "";
}