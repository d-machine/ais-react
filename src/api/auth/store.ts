import { create } from "zustand";
import { TAuthStore } from "@/types";
import { persist } from "zustand/middleware";

const authStore = create<TAuthStore>()(
  persist(() => ({}), {
    name: "auth",
  })
);

export default authStore;
