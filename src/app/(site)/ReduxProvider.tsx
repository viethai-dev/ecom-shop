"use client";

import { store } from "../../lib/store";
import { Provider } from "react-redux";
import React, { useEffect } from "react";
import { hydrateFromStorage } from "@/lib/features/auth/authSlice";

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize auth state from localStorage on client
    store.dispatch(hydrateFromStorage());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
