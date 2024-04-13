"use client"
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from 'recoil';
import { ModalProvider } from "@/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster"
const inter = Inter({ subsets: ["latin"] });

const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // const setNewView = async ()=>{
  //   const newrow=await prismadb.store.create({
  //     data:{
  //       userId:"lol",
  //       name:"SHoes",

  //     }
  //   })
   
  // }
  // setNewView();
  return (
    <RecoilRoot>
    <html lang="en">
      <body className={inter.className}>
        <ModalProvider/>
        {children}
        <Toaster/>
        </body>
    </html>
    </RecoilRoot>
  );
}
