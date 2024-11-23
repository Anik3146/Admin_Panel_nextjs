'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { baseUrl } from '@/utils/constant';
import { toast } from 'react-toastify';

const VerifyEmailPage = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        const res = await fetch(`${baseUrl}/api/admin/verify-email/${token}`, {
          method: 'GET',
        });

        const data = await res.json();

        if (res.ok) {
          setMessage('Your account has been successfully verified!');
          toast.success('Your account has been successfully verified!');
        } else {
          setMessage(data.message || 'Verification failed. Please try again.');
        }
      } catch (error) {
        setMessage('Network error. Please try again.');
        toast.error('Network error. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Email Verification
        </h1>
        {isLoading ? (
          <p className="text-lg font-bold text-gray-600">Loading...</p>
        ) : (
          <p className="text-lg font-bold text-gray-600">{message}</p>
        )}
      </div>
    </div>
  );
};

export default VerifyEmailPage;
