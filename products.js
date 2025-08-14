// products.js
// DỮ LIỆU SẢN PHẨM MẪU (10–12 items, nhiều category, có discountPercent ở vài item)
const PRODUCTS = [
  {
    id: 101, sku: "ARI-TSHIRT-01", name: "Áo thun ARI Basic",
    price: 199000, category: "Thời trang",
    description: "Áo thun cotton 100% thoáng mát, form unisex.",
    image: "https://picsum.photos/seed/ari-tshirt01/600/400",
    discountPercent: 10
  },
  {
    id: 102, sku: "ARI-TSHIRT-02", name: "Áo thun ARI Logo",
    price: 249000, category: "Thời trang",
    description: "Thiết kế tối giản với logo ARI trước ngực.",
    image: "https://picsum.photos/seed/ari-tshirt02/600/400"
  },
  {
    id: 201, sku: "ARI-MUG-01", name: "Ly sứ ARI 350ml",
    price: 149000, category: "Gia dụng",
    description: "Ly sứ trắng in logo, an toàn máy rửa chén.",
    image: "https://picsum.photos/seed/ari-mug01/600/400",
    discountPercent: 15
  },
  {
    id: 202, sku: "ARI-BOTTLE-01", name: "Bình nước Inox 500ml",
    price: 299000, category: "Gia dụng",
    description: "Giữ nhiệt 8–12h, nắp kín chống rò.",
    image: "https://picsum.photos/seed/ari-bottle01/600/400"
  },
  {
    id: 301, sku: "ARI-BAG-01", name: "Túi tote canvas",
    price: 179000, category: "Phụ kiện",
    description: "Canvas dày dặn, chịu tải ~10kg, giặt máy.",
    image: "https://picsum.photos/seed/ari-bag01/600/400",
    discountPercent: 5
  },
  {
    id: 302, sku: "ARI-CAP-01", name: "Mũ lưỡi trai ARI",
    price: 159000, category: "Phụ kiện",
    description: "Vải twill thoáng khí, khoá gài kim loại.",
    image: "https://picsum.photos/seed/ari-cap01/600/400"
  },
  {
    id: 401, sku: "ARI-NOTE-01", name: "Sổ tay ARI A5",
    price: 99000, category: "Văn phòng",
    description: "Giấy dày 100gsm, 120 trang kẻ dòng.",
    image: "https://picsum.photos/seed/ari-note01/600/400"
  },
  {
    id: 402, sku: "ARI-PEN-01", name: "Bút bi ARI",
    price: 49000, category: "Văn phòng",
    description: "Ngòi 0.5mm, mực chống lem, êm tay.",
    image: "https://picsum.photos/seed/ari-pen01/600/400",
    discountPercent: 20
  },
  {
    id: 501, sku: "ARI-EAR-01", name: "Tai nghe ARI Lite",
    price: 399000, category: "Điện tử",
    description: "Bluetooth 5.3, pin 24h, chống ồn chủ động.",
    image: "https://picsum.photos/seed/ari-ear01/600/400"
  },
  {
    id: 502, sku: "ARI-PB-01", name: "Pin sạc dự phòng 10,000mAh",
    price: 459000, category: "Điện tử",
    description: "Sạc nhanh PD 20W, 2 cổng USB + 1 Type-C.",
    image: "https://picsum.photos/seed/ari-pb01/600/400",
    discountPercent: 12
  },
  {
    id: 601, sku: "ARI-LAMP-01", name: "Đèn bàn LED",
    price: 329000, category: "Gia dụng",
    description: "3 mức sáng, cổ linh hoạt, tiết kiệm điện.",
    image: "https://picsum.photos/seed/ari-lamp01/600/400"
  },
  {
    id: 701, sku: "ARI-BK-01", name: "Sách tay ARI Logistics",
    price: 189000, category: "Sách",
    description: "Kinh nghiệm logistics thực chiến cho người mới.",
    image: "https://picsum.photos/seed/ari-book01/600/400"
  }
];
