"use client";
import ECommerce from "@/components/Dashboard/E-commerce";
import DefaultLayout from "@/components/Layouts/DefaultLaout";
import React from "react";
import SignIn from "@/components/SignIn/SignIn";
import { useAuth } from "@/app/context/useAuth";

export default function Home() {
  const { user } = useAuth();

  return (
    <>
      <div>
        {!user ? (
          <SignIn />
        ) : user === "admin" ? (
          <DefaultLayout>Dashboard</DefaultLayout>
        ) : (
          <div>You do not have access to this section.</div>
        )}
      </div>
    </>
  );
}
