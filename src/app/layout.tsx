'use client';
import 'jsvectormap/dist/css/jsvectormap.css';
import 'flatpickr/dist/flatpickr.min.css';
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles
import '@/css/satoshi.css';
import '@/css/style.css';
import React, { useEffect, useState } from 'react';
import Loader from '@/components/common/Loader';
import { AuthProvider } from '@/app/context/useAuth';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <AuthProvider>{loading ? <Loader /> : children}</AuthProvider>

        {/* ToastContainer added here to handle global toast notifications */}
        <ToastContainer
          position="top-right" // Position of the toast
          autoClose={4000} // Duration of the toast visibility (in ms)
          hideProgressBar={false} // Show or hide the progress bar
          newestOnTop={true} // Newest toast on top
          closeOnClick={true} // Close on clicking the toast
          rtl={false} // Right to left support
          pauseOnFocusLoss={false} // Pause on tab switch
          draggable={true} // Allow dragging the toast
          pauseOnHover={true} // Pause the toast on hover
        />
      </body>
    </html>
  );
}
