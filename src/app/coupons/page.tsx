'use client';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLaout';
import CouponTable from '@/components/Tables/couponTable';

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Coupons" />

      <div className="flex flex-col gap-10">
        <CouponTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
