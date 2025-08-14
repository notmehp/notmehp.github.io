// ====== MOCK PRODUCTS DATA ======
// Dữ liệu sản phẩm mẫu cho ARICO Store
// Bao gồm: 12 sản phẩm, 4 categories, giá đa dạng, có discount

const PRODUCTS = [
  // === ELECTRONICS ===
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    sku: 'IP15PM-256-TB',
    category: 'Electronics',
    price: 34990000,
    originalPrice: 36990000,
    discountPercent: 5,
    image: 'https://picsum.photos/400/400?random=1',
    images: [
      'https://picsum.photos/400/400?random=1',
      'https://picsum.photos/400/400?random=11',
      'https://picsum.photos/400/400?random=21'
    ],
    description: 'iPhone 15 Pro Max với chip A17 Pro mạnh mẽ, hệ thống camera tiên tiến và thiết kế titan cao cấp. Màn hình Super Retina XDR 6.7 inch, hỗ trợ 5G và sạc MagSafe.',
    features: ['Chip A17 Pro', 'Camera 48MP', '5G', 'MagSafe', 'Face ID'],
    inStock: true,
    rating: 4.8,
    reviewCount: 1247
  },
  {
    id: 2,
    name: 'MacBook Air M3',
    sku: 'MBA-M3-13-SG',
    category: 'Electronics', 
    price: 32990000,
    originalPrice: 34990000,
    discountPercent: 6,
    image: 'https://picsum.photos/400/400?random=2',
    images: [
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=12',
      'https://picsum.photos/400/400?random=22'
    ],
    description: 'MacBook Air với chip M3 8 nhân, màn hình Liquid Retina 13.6 inch. Thiết kế mỏng nhẹ, thời lượng pin lên đến 18 giờ, webcam 1080p FaceTime HD.',
    features: ['Chip M3', 'RAM 8GB', 'SSD 256GB', 'Webcam 1080p', 'MagSafe 3'],
    inStock: true,
    rating: 4.9,
    reviewCount: 892
  },
  {
    id: 3,
    name: 'Samsung Galaxy S24 Ultra',
    sku: 'SGS24U-512-BK',
    category: 'Electronics',
    price: 31990000,
    originalPrice: 33990000, 
    discountPercent: 6,
    image: 'https://picsum.photos/400/400?random=3',
    images: [
      'https://picsum.photos/400/400?random=3',
      'https://picsum.photos/400/400?random=13',
      'https://picsum.photos/400/400?random=23'
    ],
    description: 'Galaxy S24 Ultra với S Pen tích hợp, camera zoom 100x, màn hình Dynamic AMOLED 2X 6.8 inch. Tích hợp AI Galaxy AI và khả năng chống nước IP68.',
    features: ['S Pen', 'Camera 200MP', 'Zoom 100x', 'AI Galaxy AI', 'IP68'],
    inStock: true,
    rating: 4.7,
    reviewCount: 1056
  },

  // === FASHION ===
  {
    id: 4,
    name: 'Áo Sweater Unisex',
    sku: 'SW-UNI-GRY-L',
    category: 'Fashion',
    price: 299000,
    originalPrice: 399000,
    discountPercent: 25,
    image: 'https://picsum.photos/400/400?random=4',
    images: [
      'https://picsum.photos/400/400?random=4',
      'https://picsum.photos/400/400?random=14',
      'https://picsum.photos/400/400?random=24'
    ],
    description: 'Áo sweater unisex chất liệu cotton organic, thiết kế basic phù hợp mọi phong cách. Form áo rộng thoải mái, có đủ size từ S-XXL.',
    features: ['Cotton organic', 'Unisex', 'Form rộng', 'Đủ size', 'Màu trung tính'],
    inStock: true,
    rating: 4.5,
    reviewCount: 234
  },
  {
    id: 5,
    name: 'Quần Jeans Slim Fit',
    sku: 'JN-SF-BL-32',
    category: 'Fashion',
    price: 599000,
    originalPrice: 799000,
    discountPercent: 25,
    image: 'https://picsum.photos/400/400?random=5',
    images: [
      'https://picsum.photos/400/400?random=5', 
      'https://picsum.photos/400/400?random=15',
      'https://picsum.photos/400/400?random=25'
    ],
    description: 'Quần jeans nam nữ dáng slim fit, chất denim cao cấp co giãn tốt. Thiết kế hiện đại với chi tiết rách nhẹ, phù hợp đi làm và dạo phố.',
    features: ['Denim co giãn', 'Slim fit', 'Unisex', 'Thiết kế trẻ trung', 'Bền đẹp'],
    inStock: true,
    rating: 4.6,
    reviewCount: 189
  },
  {
    id: 6,
    name: 'Sneakers Canvas Cổ Điển',
    sku: 'SNK-CVS-WH-42',
    category: 'Fashion',
    price: 450000,
    originalPrice: 0,
    discountPercent: 0,
    image: 'https://picsum.photos/400/400?random=6',
    images: [
      'https://picsum.photos/400/400?random=6',
      'https://picsum.photos/400/400?random=16', 
      'https://picsum.photos/400/400?random=26'
    ],
    description: 'Giày sneakers canvas phong cách vintage, đế cao su chống trượt. Thiết kế cổ điển nhưng không lỗi mốt, phù hợp với mọi trang phục.',
    features: ['Canvas chất lượng', 'Đế chống trượt', 'Phong cách vintage', 'Thoáng khí', 'Dễ phối đồ'],
    inStock: true,
    rating: 4.4,
    reviewCount: 167
  },

  // === HOME & LIVING ===
  {
    id: 7,
    name: 'Bàn Làm Việc Gỗ Sồi',
    sku: 'DSK-OAK-120-BRN',
    category: 'Home & Living', 
    price: 2890000,
    originalPrice: 3290000,
    discountPercent: 12,
    image: 'https://picsum.photos/400/400?random=7',
    images: [
      'https://picsum.photos/400/400?random=7',
      'https://picsum.photos/400/400?random=17',
      'https://picsum.photos/400/400?random=27'
    ],
    description: 'Bàn làm việc gỗ sồi tự nhiên kích thước 120x60cm, thiết kế tối giản hiện đại. Bề mặt chống trầy xước, có ngăn kéo tiện dụng.',
    features: ['Gỗ sồi tự nhiên', 'Kích thước 120x60cm', 'Chống trầy xước', 'Có ngăn kéo', 'Lắp ráp dễ dàng'],
    inStock: true,
    rating: 4.7,
    reviewCount: 89
  },
  {
    id: 8,
    name: 'Ghế Gaming Ergonomic',
    sku: 'GC-ERG-BK-ADJ',
    category: 'Home & Living',
    price: 1790000,
    originalPrice: 2190000,
    discountPercent: 18,
    image: 'https://picsum.photos/400/400?random=8',
    images: [
      'https://picsum.photos/400/400?random=8',
      'https://picsum.photos/400/400?random=18',
      'https://picsum.photos/400/400?random=28'
    ],
    description: 'Ghế gaming ergonomic với tựa lưng cong theo đường cong cột sống, có massage điểm, tay vịn 4D điều chỉnh. Chất liệu PU cao cấp.',
    features: ['Thiết kế ergonomic', 'Massage điểm', 'Tay vịn 4D', 'PU cao cấp', 'Điều chỉnh độ cao'],
    inStock: true,
    rating: 4.6,
    reviewCount: 145
  },
  {
    id: 9,
    name: 'Đèn LED Thông Minh',
    sku: 'LED-SMT-RGB-E27',
    category: 'Home & Living',
    price: 189000,
    originalPrice: 0,
    discountPercent: 0,
    image: 'https://picsum.photos/400/400?random=9',
    images: [
      'https://picsum.photos/400/400?random=9',
      'https://picsum.photos/400/400?random=19',
      'https://picsum.photos/400/400?random=29'
    ],
    description: 'Đèn LED thông minh RGB E27 9W, điều khiển qua app smartphone. Có thể thay đổi 16 triệu màu, hẹn giờ bật tắt và điều chỉnh độ sáng.',
    features: ['RGB 16 triệu màu', 'Điều khiển app', 'Hẹn giờ', '9W tiết kiệm', 'Tuổi thọ 25.000h'],
    inStock: true,
    rating: 4.3,
    reviewCount: 312
  },

  // === BOOKS & STATIONERY ===
  {
    id: 10,
    name: 'Sách "Đắc Nhân Tâm"',
    sku: 'BK-DNT-VN-2024',
    category: 'Books',
    price: 89000,
    originalPrice: 119000,
    discountPercent: 25,
    image: 'https://picsum.photos/400/400?random=10',
    images: [
      'https://picsum.photos/400/400?random=10',
      'https://picsum.photos/400/400?random=20',
      'https://picsum.photos/400/400?random=30'
    ],
    description: 'Cuốn sách kinh điển về nghệ thuật giao tiếp và ứng xử của Dale Carnegie. Phiên bản tiếng Việt mới nhất 2024 với bìa cứng cao cấp.',
    features: ['Bìa cứng', 'Tiếng Việt', 'Tái bản 2024', '320 trang', 'Giấy cao cấp'],
    inStock: true,
    rating: 4.8,
    reviewCount: 2156
  },
  {
    id: 11,
    name: 'Bộ Bút Gel Colorful',
    sku: 'PEN-GEL-12C-SET',
    category: 'Books',
    price: 129000,
    originalPrice: 169000,
    discountPercent: 24,
    image: 'https://picsum.photos/400/400?random=31',
    images: [
      'https://picsum.photos/400/400?random=31',
      'https://picsum.photos/400/400?random=32',
      'https://picsum.photos/400/400?random=33'
    ],
    description: 'Bộ 12 cây bút gel màu cao cấp, mực gel mịn không lem, viết êm mượt. Thân bút ergonomic chống mỏi tay, có clip tiện dụng.',
    features: ['12 màu sắc', 'Mực gel cao cấp', 'Thân ergonomic', 'Không lem', 'Có clip'],
    inStock: true,
    rating: 4.5,
    reviewCount: 178
  },
  {
    id: 12,
    name: 'Notebook Da Cao Cấp',
    sku: 'NB-LTHR-A5-BLK',
    category: 'Books',
    price: 249000,
    originalPrice: 0,
    discountPercent: 0,
    image: 'https://picsum.photos/400/400?random=34',
    images: [
      'https://picsum.photos/400/400?random=34',
      'https://picsum.photos/400/400?random=35',
      'https://picsum.photos/400/400?random=36'
    ],
    description: 'Sổ tay da thật cao cấp kích thước A5, 200 trang giấy ivory mịn. Thiết kế tinh tế với dây bookmark và túi đựng card bên trong.',
    features: ['Da thật cao cấp', 'Giấy ivory 200 trang', 'Kích thước A5', 'Dây bookmark', 'Túi đựng card'],
    inStock: true,
    rating: 4.7,
    reviewCount: 89
  }
];

// ====== PRODUCT UTILITIES ======

// Lấy danh sách categories duy nhất
const getCategories = () => {
  return [...new Set(PRODUCTS.map(product => product.category))];
};

// Lọc sản phẩm theo category
const getProductsByCategory = (category) => {
  if (!category || category === 'all') return PRODUCTS;
  return PRODUCTS.filter(product => product.category === category);
};

// Tìm kiếm sản phẩm theo tên hoặc SKU
const searchProducts = (query) => {
  if (!query) return PRODUCTS;
  const lowercaseQuery = query.toLowerCase();
  return PRODUCTS.filter(product => 
    product.name.toLowerCase().includes(lowercaseQuery) ||
    product.sku.toLowerCase().includes(lowercaseQuery) ||
    product.description.toLowerCase().includes(lowercaseQuery)
  );
};

// Lọc sản phẩm theo khoảng giá
const filterProductsByPrice = (products, minPrice, maxPrice) => {
  return products.filter(product => 
    product.price >= minPrice && product.price <= maxPrice
  );
};

// Sắp xếp sản phẩm
const sortProducts = (products, sortBy) => {
  const sorted = [...products];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'newest':
      return sorted.sort((a, b) => b.id - a.id);
    default:
      return sorted;
  }
};

// Tìm sản phẩm theo ID
const getProductById = (id) => {
  return PRODUCTS.find(product => product.id === parseInt(id));
};

// Lấy sản phẩm liên quan (cùng category, trừ sản phẩm hiện tại)
const getRelatedProducts = (productId, category, limit = 4) => {
  return PRODUCTS
    .filter(product => product.category === category && product.id !== productId)
    .slice(0, limit);
};

// Thống kê
const getProductStats = () => {
  const totalProducts = PRODUCTS.length;
  const categories = getCategories();
  const averagePrice = PRODUCTS.reduce((sum, product) => sum + product.price, 0) / totalProducts;
  const productsOnSale = PRODUCTS.filter(product => product.discountPercent > 0).length;
  
  return {
    totalProducts,
    categories: categories.length,
    averagePrice: Math.round(averagePrice),
    productsOnSale,
    inStock: PRODUCTS.filter(product => product.inStock).length
  };
};

// Export cho browser environment
if (typeof window !== 'undefined') {
  window.PRODUCTS = PRODUCTS;
  window.ProductUtils = {
    getCategories,
    getProductsByCategory,
    searchProducts,
    filterProductsByPrice,
    sortProducts,
    getProductById,
    getRelatedProducts,
    getProductStats
  };
}