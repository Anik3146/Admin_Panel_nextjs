'use client';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLaout';
import BrandTable from '@/components/Tables/brandTable';

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Brands" />

      <div className="flex flex-col gap-10">
        <BrandTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
