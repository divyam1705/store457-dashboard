"use client"
import { atom } from "recoil";

export const storeModalState = atom({
  key: "storeModalState",
  default: {
    title: "Create Store",
    description: "Add a new store to manage products and categories",
    isOpen: false,
    onClose: () => {},
  },
});
