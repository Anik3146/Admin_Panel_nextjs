'use client';

import DefaultLayout from '@/components/Layouts/DefaultLaout';
import React, { useEffect } from 'react';
import SignIn from '@/components/SignIn/SignIn';
import { useAuth } from '@/app/context/useAuth';

import dynamic from 'next/dynamic';
const ECommerce = dynamic(() => import('@/components/Dashboard/E-commerce'), {
  ssr: false,
});

const BasicChart = dynamic(() => import('@/components/Charts/BasicChart'), {
  ssr: false,
});

export default function Home() {
  const { user } = useAuth();

  useEffect(() => {
    console.log(user);
  }, [user]);
  return (
    <>
      <div>
        {!user ? (
          <SignIn />
        ) : user.role === 'Admin' ? (
          <DefaultLayout>
            <ECommerce />
            <BasicChart />
          </DefaultLayout>
        ) : (
          <div>You do not have access to this section.</div>
        )}
      </div>
    </>
  );
}
