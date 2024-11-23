'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { baseUrl } from '@/utils/constant';
import { toast } from 'react-toastify';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleEmailChange = (e: any) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/api/admin/forget-password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Please check your email for password reset instructions.');
        toast.success(
          'Please check your email for password reset instructions.'
        );
      } else {
        const data = await response.json();
        setMessage(data.message || 'Something went wrong.');
        toast.error(data.message);
      }
    } catch (error) {
      setMessage('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block font-medium text-dark">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="mt-2 w-full rounded-lg border border-stroke bg-transparent px-4 py-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-primary py-2 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>
        {message && <p className="mt-4 text-gray-700">{message}</p>}
      </div>
    </div>
  );
}
