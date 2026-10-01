import React, { useState } from 'react';
import { Package, X, ShoppingCart } from 'lucide-react';

interface ProductImage {
  id: number;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  category_name?: string;
  image_url?: string;
  images?: ProductImage[];
}

const ProductDetailModal: React.FC<{ product: Product; onClose: () => void }> = ({ product, onClose }) => {
  const imageUrl =
    product.images?.[0]?.imageUrl ||
    product.image_url ||
    null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-card w-full max-w-2xl rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200 my-8"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-border">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <button onClick={onClose} className="p-1 rounded-md text-muted-foreground hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 p-6">
          {/* Single image display */}
          <div className="aspect-square rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-contain p-4"
              />
            ) : (
              <Package className="h-20 w-20 text-muted-foreground/30" />
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col gap-4">
            {product.category_name && (
              <span className="inline-flex w-fit items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                {product.category_name}
              </span>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
            <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
              <span className="text-2xl font-bold">${parseFloat(product.price).toFixed(2)}</span>
              <button className="inline-flex items-center gap-2 h-10 px-5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                <ShoppingCart className="h-4 w-4" /> Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProductCard: React.FC<{ product: Product }> = ({ product }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const imageUrl =
    product.images?.[0]?.imageUrl ||
    product.image_url ||
    null;

  return (
    <>
      <div
        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted/30 flex items-center justify-center p-4">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <Package className="h-12 w-12 text-muted-foreground/30" />
          )}

          {product.category_name && (
            <div className="absolute top-3 left-3 rounded-md bg-background/90 px-2 py-1 text-xs font-medium text-foreground backdrop-blur-sm border border-border/50">
              {product.category_name}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="font-semibold leading-none tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="font-bold text-lg text-foreground">
              ${parseFloat(product.price).toFixed(2)}
            </span>
            <button
              onClick={e => { e.stopPropagation(); setIsModalOpen(true); }}
              className="h-8 px-3 inline-flex items-center gap-1.5 justify-center whitespace-nowrap rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="h-3.5 w-3.5" /> View
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && <ProductDetailModal product={product} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};
