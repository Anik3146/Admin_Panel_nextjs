'use client';
import Link from 'next/link';
import React from 'react';
import GoogleSigninButton from '../GoogleSigninButton';
import SigninWithPassword from '../SigninWithPassword';
import SingUpWithPassword from '../SignUpWithPassword';

export default function SignUp({ setIsSignIn }: any) {
  return (
    <>
      <GoogleSigninButton text="Sign in" />
      <div className="my-6 flex items-center justify-center">
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
        <div className="block w-full min-w-fit bg-white px-3 text-center font-medium dark:bg-gray-dark">
          Or sign in with email
        </div>
        <span className="block h-px w-full bg-stroke dark:bg-dark-3"></span>
      </div>

      <div>
        <SingUpWithPassword />
      </div>

      <div className="mt-6 text-center">
        <p>
          Already have an account?{' '}
          <button
            onClick={() => {
              setIsSignIn(true);
            }}
            className="text-primary"
          >
            Sign In
          </button>
        </p>
      </div>
    </>
  );
}
