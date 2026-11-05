import React, { useState } from 'react';
import { Package, X, Eye } from 'lucide-react';

interface ProductImage {
  id: number;
  imageUrl: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price?: string | number;
  category_name?: string;
  image_url?: string;
  images?: ProductImage[];
}

const ADMIN_WHATSAPP = '917037869583'; // country code 91 + number

function buildWhatsAppLink(product: Product): string {
  const productUrl = window.location.origin + window.location.pathname;
  const message =
    `Hi! I'm interested in the following product from CarShop:\n\n` +
    `🛒 *${product.name}*\n` +
    (product.category_name ? `📂 Category: ${product.category_name}\n` : '') +
    `\n🔗 Page: ${productUrl}\n\n` +
    `Could you please provide more details?`;
  return `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
}

// WhatsApp SVG icon
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

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
          {/* Image */}
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
            <div className="mt-auto pt-4 border-t border-border">
              {/* WhatsApp Enquiry */}
              <a
                href={buildWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full h-11 rounded-md bg-[#25D366] text-white text-sm font-semibold hover:bg-[#1ebe5d] transition-colors shadow-sm"
              >
                <WhatsAppIcon />
                Enquire on WhatsApp
              </a>
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

          <div className="mt-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {/* WhatsApp quick-link */}
              <a
                href={buildWhatsAppLink(product)}
                target="_blank"
                rel="noopener noreferrer"
                onClick={e => e.stopPropagation()}
                title="Enquire on WhatsApp"
                className="h-8 w-8 inline-flex items-center justify-center rounded-md bg-[#25D366] text-white hover:bg-[#1ebe5d] transition-colors"
              >
                <WhatsAppIcon />
              </a>
              {/* View details */}
              <button
                onClick={e => { e.stopPropagation(); setIsModalOpen(true); }}
                title="View details"
                className="h-8 px-3 inline-flex items-center gap-1.5 justify-center whitespace-nowrap rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Eye className="h-3.5 w-3.5" /> View
              </button>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && <ProductDetailModal product={product} onClose={() => setIsModalOpen(false)} />}
    </>
  );
};
