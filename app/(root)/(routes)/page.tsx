"use client"
import { Button } from "@/components/ui/button";
import useStoreModal from "@/hooks/use-store-modal";
export default function Home() {
  const {storeModal,openStoreModal}=useStoreModal();


  return (
    <div className=" w-[100%] h-[100%] flex items-center justify-center">
      <Button onClick={openStoreModal}>Open Store</Button>

    </div>
  );
}
