'use client';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import DefaultLayout from '@/components/Layouts/DefaultLaout';
import CategoriesTable from '@/components/Tables/categoriesTable';

const ProductsPage = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Categories" />

      <div className="flex flex-col gap-10">
        <CategoriesTable />
      </div>
    </DefaultLayout>
  );
};

export default ProductsPage;
