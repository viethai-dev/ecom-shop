import React from "react";
import Shop from "@/components/Shop";

import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Shop Page | NextCommerce Nextjs E-commerce template",
  description: "This is Shop Page for NextCommerce Template",
  // other metadata
};

const ShopPage = () => {
  return (
    <main>
      <Shop />
    </main>
  );
};

export default ShopPage;
