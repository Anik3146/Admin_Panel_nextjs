'use client';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import TableOne from '@/components/Tables/TableOne';
import TableThree from '@/components/Tables/TableThree';
import TableTwo from '@/components/Tables/TableTwo';

import { Metadata } from 'next';
import DefaultLayout from '@/components/Layouts/DefaultLaout';
import ProductTable from '@/components/Tables/productTable';

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Products" />

      <div className="flex flex-col gap-10">
        <ProductTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
