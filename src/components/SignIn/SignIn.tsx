import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Signin from '@/components/Auth/Signin';
import SignUp from '../Auth/Register';

const SignIn: React.FC = ({ isToken }: any) => {
  const [isSignIn, setIsSignIn] = useState(true);

  useEffect(() => {}, [isSignIn]);

  return (
    <div className="rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      <div className="flex flex-wrap items-center">
        <div className="w-full xl:w-1/2">
          <div className="w-full p-4 sm:p-12.5 xl:p-15">
            {isSignIn && <Signin setIsSignIn={setIsSignIn} />}
            {!isSignIn && <SignUp setIsSignIn={setIsSignIn} />}
          </div>
        </div>

        <div className="hidden w-full p-7.5 xl:block xl:w-1/2">
          <div className="custom-gradient-1 overflow-hidden rounded-2xl px-12.5 pt-12.5 dark:!bg-dark-2 dark:bg-none">
            <Link className="mb-10 inline-block" href="/">
              {/* Mobile Logo */}
              <Image
                width={50}
                height={50}
                src="/images/splendid_logo.png"
                alt="Logo"
                priority
                className="block md:hidden" // Show on mobile, hide on desktop
                style={{ width: 'auto', height: 'auto' }}
              />

              {/* Desktop Logo */}
              <Image
                width={50}
                height={50}
                src="/images/splendid_logo.png"
                alt="Logo"
                priority
                className="hidden md:block" // Hide on mobile, show on desktop
                style={{ width: 'auto', height: 'auto' }}
              />
            </Link>
            <p className="mb-3 text-xl font-medium text-dark dark:text-white">
              Sign in / sign up to your account
            </p>

            <h1 className="mb-4 text-2xl font-bold text-dark dark:text-white sm:text-heading-3">
              Welcome Back!
            </h1>

            <p className="w-full max-w-[375px] font-medium text-dark-4 dark:text-dark-6">
              Please sign in / sign up to your account by completing the
              necessary fields below
            </p>

            <div className="mt-31">
              <Image
                src={'/images/grids/grid-02.svg'}
                alt="Logo"
                width={405}
                height={325}
                className="mx-auto dark:opacity-30"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
