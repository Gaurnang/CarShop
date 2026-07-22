import React, { useState } from 'react';
import { Package, X, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';

interface ProductImage {
  id: number;
  imageUrl: string;
  displayOrder: number;
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
  const images = product.images && product.images.length > 0 ? product.images : [];
  const [activeIdx, setActiveIdx] = useState(0);

  const prev = () => setActiveIdx(i => (i === 0 ? images.length - 1 : i - 1));
  const next = () => setActiveIdx(i => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto" onClick={onClose}>
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
          {/* Image gallery */}
          <div className="flex flex-col gap-3">
            <div className="relative aspect-square rounded-xl overflow-hidden bg-muted/30 flex items-center justify-center">
              {images.length > 0 ? (
                <>
                  <img
                    src={images[activeIdx]?.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-contain p-4"
                  />
                  {images.length > 1 && (
                    <>
                      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-background/80 rounded-full border border-border hover:bg-background transition-colors shadow-sm">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-background/80 rounded-full border border-border hover:bg-background transition-colors shadow-sm">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <Package className="h-20 w-20 text-muted-foreground/30" />
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveIdx(idx)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${idx === activeIdx ? 'border-primary' : 'border-border hover:border-muted-foreground'}`}
                  >
                    <img src={img.imageUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
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
  const images = product.images && product.images.length > 0 ? product.images : [];
  const firstImage = images[0]?.imageUrl || product.image_url;

  return (
    <>
      <div
        className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative aspect-square overflow-hidden bg-muted/30 flex items-center justify-center p-4">
          {firstImage ? (
            <img
              src={firstImage}
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

          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium border border-border/50 text-muted-foreground">
              +{images.length - 1} photos
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

