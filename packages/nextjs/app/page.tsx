"use client";

import React from "react";
import { AddContent, GetContent, PurchaseContent } from "~~/components/YourComponents";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center space-y-6">
      <AddContent />
      <PurchaseContent />
      <GetContent />
    </div>
  );
};

export default Home;
