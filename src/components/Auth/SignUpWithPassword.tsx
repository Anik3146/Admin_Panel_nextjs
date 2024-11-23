'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/useAuth';
import { baseUrl } from '@/utils/constant';

export default function SingUpWithPassword() {
  const { user, login } = useAuth();
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Admin',
  });

  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    console.log(data);
    e.preventDefault();
    try {
      const response = await fetch(`${baseUrl}/api/admin/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log(result);
    } catch (err) {
      console.log('error signup');
    }
  };

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="name"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Name
        </label>
        <div className="relative">
          <input
            type="text"
            name="name"
            value={data.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            {/* SVG icon here */}
          </span>
        </div>
      </div>

      {/* Role Dropdown */}
      <div className="mb-4">
        <label
          htmlFor="role"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Role
        </label>
        <div className="relative">
          <select
            name="role"
            value={data.role}
            onChange={handleChange}
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          >
            <option value="Admin">Admin</option>
            <option value="Super Admin">Super Admin</option>
            <option value="Manager">Manager</option>
            <option value="CEO">CEO</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label
          htmlFor="email"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Email
        </label>
        <div className="relative">
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
          <span className="absolute right-4.5 top-1/2 -translate-y-1/2">
            {/* SVG icon here */}
          </span>
        </div>
      </div>

      {/* Password Field with Toggle */}
      <div className="mb-5">
        <label
          htmlFor="password"
          className="mb-2.5 block font-medium text-dark dark:text-white"
        >
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} // Toggle the input type
            name="password"
            value={data.password}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="password"
            className="w-full rounded-lg border border-stroke bg-transparent py-[15px] pl-6 pr-11 font-medium text-dark outline-none focus:border-primary focus-visible:shadow-none dark:border-dark-3 dark:bg-dark-2 dark:text-white dark:focus:border-primary"
          />
          <span
            className="absolute right-4.5 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)} // Toggle the password visibility
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-dark dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12c0 1.75-2.25 3-4 3s-4-1.25-4-3 2.25-3 4-3 4 1.25 4 3z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.93 12.93a9.95 9.95 0 001.12 2.16l1.44-1.44C6.44 13.08 7.93 13 9 13s2.56.08 3.47.65l1.44 1.44a9.96 9.96 0 002.16-1.12l-.93-1.41C14.42 12.1 12.73 12 11 12s-3.42.1-4.68.53l-.93 1.41z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6 text-dark dark:text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.93 12.93a9.95 9.95 0 001.12 2.16l1.44-1.44C6.44 13.08 7.93 13 9 13s2.56.08 3.47.65l1.44 1.44a9.96 9.96 0 002.16-1.12l-.93-1.41C14.42 12.1 12.73 12 11 12s-3.42.1-4.68.53l-.93 1.41z"
                />
              </svg>
            )}
          </span>
        </div>
      </div>
      <div className="mb-4.5">
        <button
          type="submit"
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          Register
        </button>
      </div>
    </form>
  );
}
