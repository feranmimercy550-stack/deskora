'use client';

import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { LockedFeature } from '@/components/LockedFeature';
import { useAuth } from '@/hooks/useAuth';
import { Plus, AlertTriangle, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import { isFeatureEnabled } from '@/lib/feature-gates';

export default function InventoryPage() {
  const { userPlan = 'free' } = useAuth();
  const hasFeature = isFeatureEnabled(userPlan as any, 'inventory');

  const [products] = useState([
    { id: 1, name: 'Premium Consulting Hours', sku: 'CONS-001', quantity: 120, reorder: 50, value: 600000 },
    { id: 2, name: 'Website Design Package', sku: 'WEB-001', quantity: 8, reorder: 10, value: 200000 },
    { id: 3, name: 'Mobile App Development', sku: 'APP-001', quantity: 15, reorder: 5, value: 450000 },
    { id: 4, name: 'Branding Kit', sku: 'BRAND-001', quantity: 3, reorder: 15, value: 75000 },
  ]);

  if (!hasFeature) {
    return (
      <AppLayout title="Inventory" subtitle="Manage products and stock levels">
        <LockedFeature
          feature="Inventory Management"
          description="Track stock levels, manage suppliers, and get low stock alerts."
          currentPlan={userPlan}
          requiredPlan="Business"
          benefits={[
            'Product Tracking',
            'Stock Level Management',
            'Low Stock Alerts',
            'Supplier Management',
            'Purchase Orders'
          ]}
        />
      </AppLayout>
    );
  }

  const lowStockCount = products.filter(p => p.quantity <= p.reorder).length;

  return (
    <AppLayout
      title="Inventory"
      subtitle="Manage your products and stock levels"
      action={
        <Link
          href="/inventory/new-product"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" />
          Add Product
        </Link>
      }
    >
      <div className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Products</p>
            <p className="text-2xl font-bold">{products.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Value</p>
            <p className="text-2xl font-bold">₦{(products.reduce((sum, p) => sum + p.value, 0) / 1000).toFixed(0)}K</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Quantity</p>
            <p className="text-2xl font-bold">{products.reduce((sum, p) => sum + p.quantity, 0)}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4 border-orange-200 bg-orange-50">
            <p className="text-sm text-orange-700 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Low Stock
            </p>
            <p className="text-2xl font-bold text-orange-700">{lowStockCount}</p>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-accent/50">
                <th className="text-left p-4 font-semibold">Product</th>
                <th className="text-left p-4 font-semibold">SKU</th>
                <th className="text-left p-4 font-semibold">Quantity</th>
                <th className="text-left p-4 font-semibold">Reorder Level</th>
                <th className="text-left p-4 font-semibold">Value</th>
                <th className="text-left p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const isLowStock = product.quantity <= product.reorder;
                return (
                  <tr key={product.id} className="border-b border-border hover:bg-accent/50 transition">
                    <td className="p-4 font-medium">{product.name}</td>
                    <td className="p-4 text-sm text-muted-foreground">{product.sku}</td>
                    <td className="p-4 font-medium">{product.quantity}</td>
                    <td className="p-4 text-sm text-muted-foreground">{product.reorder}</td>
                    <td className="p-4 font-medium">₦{product.value.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        isLowStock ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {isLowStock ? 'Low Stock' : 'In Stock'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
