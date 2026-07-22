import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { MainLayout } from '@/components/layout/MainLayout';
import { CatalogPage } from '@/pages/CatalogPage';
import { DashboardPage } from '@/pages/customer/DashboardPage';
import { AdminLayout } from '@/components/layout/admin/AdminLayout';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { CategoriesPage } from '@/pages/admin/categories/CategoriesPage';

import { BrandsPage } from '@/pages/admin/brands/BrandsPage';
import { ModelsPage } from '@/pages/admin/models/ModelsPage';
import { VariantsPage } from '@/pages/admin/variants/VariantsPage';
import { ProductsPage } from '@/pages/admin/products/ProductsPage';
import { CampaignsPage } from '@/pages/admin/campaigns/CampaignsPage';

// Temporary placeholder components for admin routes we haven't built yet
const Placeholder = ({ title }: { title: string }) => (
  <div className="flex h-64 items-center justify-center border border-dashed rounded-xl bg-card text-muted-foreground">
    <h1 className="text-xl font-medium">{title} Coming Soon</h1>
  </div>
);

const IndexRoute = () => {
  const { isAdmin } = useAuth();
  if (isAdmin) {
    return <Navigate to="/admin/brands" replace />;
  }
  return <CatalogPage />;
};

const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <IndexRoute />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          {
            path: '/admin',
            element: <AdminDashboard />,
          },
          {
            path: '/admin/categories',
            element: <CategoriesPage />,
          },
          {
            path: '/admin/brands',
            element: <BrandsPage />,
          },
          {
            path: '/admin/models',
            element: <ModelsPage />,
          },
          {
            path: '/admin/variants',
            element: <VariantsPage />,
          },
          {
            path: '/admin/products',
            element: <ProductsPage />,
          },
          {
            path: '/admin/campaigns',
            element: <CampaignsPage />,
          },
        ]
      }
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
