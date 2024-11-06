'use client';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLaout';
import OrderTable from '@/components/Tables/orderTable';

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Orders" />

      <div className="flex flex-col gap-10">
        <OrderTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
