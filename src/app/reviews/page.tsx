'use client';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLaout';
import ReviewTable from '@/components/Tables/reviewTable';

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Reviews" />

      <div className="flex flex-col gap-10">
        <ReviewTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
