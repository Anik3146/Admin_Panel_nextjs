'use client';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableOne from '@/components/Tables/TableOne';
import TableThree from '@/components/Tables/TableThree';
import TableTwo from '@/components/Tables/TableTwo';

import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLaout';
import CommonTable from '@/components/Tables/productTable';
import CloudinaryTable from '@/components/Tables/cloudinaryTable';

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Cloudinary" />

      <div className="flex flex-col gap-10">
        <CloudinaryTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
