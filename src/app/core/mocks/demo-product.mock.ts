import { StorefrontProductDetailReadModel, StorefrontProductVariantReadModel } from '../models';

export const DEMO_SNEAKER: StorefrontProductDetailReadModel = {
  id: 'mock-sneaker-001',
  name: 'AirStride Pro Max',
  slug: 'demo-sneaker',
  shortDescription: 'Men\'s Lifestyle Sneakers',
  longDescription: 'Crafted from premium materials, the AirStride Pro Max delivers unparalleled comfort and standout street style. Featuring our signature responsive cushioning, these sneakers are designed to keep you moving effortlessly throughout the day.',
  price: 119.99,
  currencyCode: 'USD',
  rating: 4.8,
  reviewCount: 342,
  isInStock: true,
  badge: 'Just In',
  brandName: 'Puma',
  images: [
    {
      id: 'img1',
      url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
      altText: 'Red Sneaker',
      sortOrder: 1,
      isPrimary: true
    },
    {
      id: 'img2',
      url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80',
      altText: 'White Sneaker',
      sortOrder: 2,
      isPrimary: false
    },
    {
      id: 'img3',
      url: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80',
      altText: 'Air Jordan',
      sortOrder: 3,
      isPrimary: false
    },
    {
      id: 'img4',
      url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
      altText: 'Sneaker Detail',
      sortOrder: 4,
      isPrimary: false
    }
  ],
  options: [
    {
      optionName: 'Color',
      values: [
        { id: 'c-red', name: 'Red/Black', displayName: 'Red/Black', colorHex: '#e11d48', sortOrder: 1 },
        { id: 'c-white', name: 'White/Orange', displayName: 'White/Orange', colorHex: '#ffffff', sortOrder: 2 },
        { id: 'c-black', name: 'Core Black', displayName: 'Core Black', colorHex: '#000000', sortOrder: 3 }
      ]
    },
    {
      optionName: 'Size',
      values: [
        { id: 's-7', name: '7', displayName: 'US 7', sortOrder: 1 },
        { id: 's-8', name: '8', displayName: 'US 8', sortOrder: 2 },
        { id: 's-9', name: '9', displayName: 'US 9', sortOrder: 3 },
        { id: 's-10', name: '10', displayName: 'US 10', sortOrder: 4 },
        { id: 's-11', name: '11', displayName: 'US 11', sortOrder: 5 },
        { id: 's-12', name: '12', displayName: 'US 12', sortOrder: 6 }
      ]
    }
  ],
  variants: [],
  highlights: [
    'Responsive AirStride™ cushioning',
    'Breathable mesh upper',
    'Durable rubber traction outsole',
    'Padded collar for secure fit'
  ],
  deliveryInfo: 'Free standard shipping on orders over $150. Estimated delivery in 3-5 business days.',
  returnInfo: 'Free returns within 30 days. Items must be unworn and in original packaging.'
};

// Generate variants dynamically
const sizes = [
  { id: 's-7', price: 119.99 },
  { id: 's-8', price: 119.99 },
  { id: 's-9', price: 129.99 },
  { id: 's-10', price: 129.99 },
  { id: 's-11', price: 139.99 },
  { id: 's-12', price: 139.99 }
];
const colors = ['c-red', 'c-white', 'c-black'];

let variantIdCounter = 1;
colors.forEach(colorId => {
  sizes.forEach(size => {
    DEMO_SNEAKER.variants.push({
      id: `v-mock-${variantIdCounter++}`,
      sku: `AS-PRO-${colorId}-${size.id}`.toUpperCase(),
      variantName: `${colorId} - Size ${size.id}`,
      optionValues: {
        'Color': colorId,
        'Size': size.id
      },
      price: size.price,
      currencyCode: 'USD',
      isDefault: colorId === 'c-red' && size.id === 's-9',
      isInStock: true // Mock all as in stock for easier testing
    });
  });
});

import { ProductReviewsPageReadModel } from '../models';

export const DEMO_REVIEWS: ProductReviewsPageReadModel = {
  productId: 'mock-sneaker-001',
  canWriteReview: true, // Mock the verified buyer capability
  page: 1,
  pageSize: 10,
  totalCount: 342,
  summary: {
    averageRating: 4.8,
    totalReviews: 342,
    fiveStarCount: 282,
    fourStarCount: 41,
    threeStarCount: 11,
    twoStarCount: 5,
    oneStarCount: 3
  },
  items: [
    {
      id: 'rev-001',
      productId: 'mock-sneaker-001',
      ratingValue: 5,
      reviewTitle: 'Super Comfortable!',
      reviewText: 'Absolutely love these sneakers. The cushioning is top-notch and perfect for daily runs.',
      customerDisplayName: 'Rahul Verma',
      isVerifiedPurchase: false, // Per request, omitting verified badge
      status: 'Approved',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'rev-002',
      productId: 'mock-sneaker-001',
      ratingValue: 5,
      reviewTitle: 'Great for Long Runs',
      reviewText: 'Lightweight, breathable and super stylish. My feet feel fresh even after long runs.',
      customerDisplayName: 'Ankit Sharma',
      isVerifiedPurchase: false,
      status: 'Approved',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'rev-003',
      productId: 'mock-sneaker-001',
      ratingValue: 5,
      reviewTitle: 'Exceeded Expectations',
      reviewText: 'Amazing grip and support. Highly recommended for marathon training!',
      customerDisplayName: 'Priya Nair',
      isVerifiedPurchase: false,
      status: 'Approved',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ]
};
