'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/app/context/useAuth';
import { baseUrl } from '@/utils/constant';
import { toast } from 'react-toastify';

const ProfileBox = () => {
  const { user } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');

  // Handle password change
  const handlePasswordChange = async (e: any) => {
    e.preventDefault();

    const response = await fetch(`${baseUrl}/api/admin/change-password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: user?.email,
        oldPass: oldPassword,
        newPass: newPassword,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage('Password changed successfully!');
      toast.success('Password changed successfully!');
    } else {
      setMessage(data.message || 'Failed to change password');
      toast.error(data.message || 'Failed to change password');
    }
  };

  return (
    <div className="overflow-hidden rounded-[10px] bg-white shadow-1 dark:bg-gray-dark dark:shadow-card">
      {/* Profile Header and Image Section */}
      <div className="relative z-20 h-35 md:h-65">
        <Image
          src="/images/cover/cover-01.png"
          alt="profile cover"
          className="h-full w-full rounded-tl-[10px] rounded-tr-[10px] object-cover object-center"
          width={970}
          height={260}
          style={{
            width: 'auto',
            height: 'auto',
          }}
        />
      </div>
      <div className="px-4 pb-6 text-center lg:pb-8 xl:pb-11.5">
        <div className="relative z-30 mx-auto -mt-22 h-30 w-full max-w-30 rounded-full bg-white/20 p-1 backdrop-blur sm:h-44 sm:max-w-[176px] sm:p-3">
          <div className="relative drop-shadow-2">
            <Image
              src="/images/splendid_logo.png"
              width={160}
              height={160}
              className="overflow-hidden rounded-full"
              alt="profile"
            />
          </div>
        </div>
        <div className="mt-4">
          <h3 className="mb-1 text-heading-6 font-bold text-dark dark:text-white">
            {user?.name}
          </h3>
          <p className="font-medium text-dark dark:text-white">{user?.role}</p>

          {/* User Info Section */}
          <div className="mt-4 text-left">
            <p className="text-sm font-medium text-dark dark:text-white">
              <strong>Username:</strong> {user?.name}
            </p>
            <p className="text-sm font-medium text-dark dark:text-white">
              <strong>Email:</strong> {user?.email}
            </p>
            <p className="text-sm font-medium text-dark dark:text-white">
              <strong>Role:</strong> {user?.role}
            </p>
          </div>

          {/* Password Change Form */}
          <div className="mt-6">
            <h4 className="font-medium text-dark dark:text-white">
              Change Password
            </h4>
            <form onSubmit={handlePasswordChange} className="mt-4">
              <div className="mb-4">
                <label
                  htmlFor="oldPassword"
                  className="block text-sm font-medium text-dark dark:text-white"
                >
                  Old Password
                </label>
                <input
                  type="password"
                  id="oldPassword"
                  name="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="mt-2 w-full rounded-md border p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-dark dark:text-white"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-2 w-full rounded-md border p-2"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 w-full rounded-md bg-primary py-2 text-white"
              >
                Change Password
              </button>
            </form>
            {message && <p className="mt-4 text-center text-sm">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBox;
