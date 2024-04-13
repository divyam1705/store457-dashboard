"use client"
import { useRecoilState } from 'recoil';
import { storeModalState } from '@/states/use-store-modal-state';

 const useStoreModal=()=>{
    const [storeModal, setStoreModal]= useRecoilState(storeModalState);

    const openStoreModal = () => {
        setStoreModal((prevModal) => ({
          ...prevModal,
          isOpen: true,
        }));
      };
  
    const closeStoreModal = () => {
      setStoreModal((prevModal) => ({
        ...prevModal,
        isOpen: false,
      }));
    };
  
    return {
        openStoreModal,
      closeStoreModal,
      storeModal,
 }
}
export default useStoreModal;