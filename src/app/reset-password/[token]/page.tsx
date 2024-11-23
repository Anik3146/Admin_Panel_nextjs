'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Importing useParams correctly
import { baseUrl } from '@/utils/constant';
import { toast } from 'react-toastify';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { token } = useParams(); // Extract the token directly from params
  const router = useRouter();

  const handlePasswordChange = (e: any) => {
    const { name, value } = e.target;
    if (name === 'newPassword') {
      setNewPassword(value);
    } else {
      setConfirmPassword(value);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage("Passwords don't match.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        `${baseUrl}/api/admin/confirm-forget-password`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: token, password: newPassword }), // Token should be passed as a string here
        }
      );

      if (response.ok) {
        setMessage('Password reset successfully!');
        toast.success('Password reset successfully!');
        router.push('/');
      } else {
        const data = await response.json();
        setMessage(
          data.message ||
            'Your reset link is expired. Try again using forget password'
        );

        toast.error(
          data.message ||
            'Your reset link is expired. Try again using forget password'
        );
      }
    } catch (error) {
      setMessage('Network error. Please try again later.');
      toast.error('Network error. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-lg bg-white p-8 text-center shadow-lg">
        <h1 className="mb-4 text-3xl font-bold text-gray-800">
          Reset Your Password
        </h1>
        {message && <p className="text-red-600">{message}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block font-medium text-dark"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={newPassword}
              onChange={handlePasswordChange}
              placeholder="Enter your new password"
              className="mt-2 w-full rounded-lg border border-stroke bg-transparent px-4 py-2"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block font-medium text-dark"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handlePasswordChange}
              placeholder="Confirm your new password"
              className="mt-2 w-full rounded-lg border border-stroke bg-transparent px-4 py-2"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full rounded-lg bg-primary py-2 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
