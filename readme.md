# 🛒 ARICO Store - E-commerce SPA

Ứng dụng thương mại điện tử Single Page Application (SPA) được xây dựng với React thuần, Bootstrap 5, và triển khai hoàn toàn tĩnh trên GitHub Pages.

![ARICO Store](https://img.shields.io/badge/ARICO-Store-blue?style=for-the-badge&logo=react)
![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-green?style=for-the-badge&logo=github)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-purple?style=for-the-badge&logo=bootstrap)

## ✨ Tính năng chính

### 🏪 Trang chủ
- Hero section với banner thu hút
- Danh sách sản phẩm nổi bật (có giảm giá)
- Sản phẩm mới nhất
- Thống kê tổng quan

### 🛍️ Catalog sản phẩm
- **Bộ lọc thông minh**: Theo danh mục, khoảng giá
- **Tìm kiếm**: Theo tên sản phẩm, SKU với debounce
- **Sắp xếp**: Theo giá, tên, đánh giá, mới nhất
- **Responsive grid**: Tối ưu cho mọi thiết bị
- **Lazy loading**: Tải ảnh khi cần thiết

### 🛒 Giỏ hàng
- **Offcanvas drawer**: Trượt từ bên phải
- **Quản lý số lượng**: Tăng/giảm/xóa sản phẩm
- **Mã giảm giá**: Hỗ trợ nhiều loại coupon
  - `ARI10`: Giảm 10%
  - `WELCOME`: Giảm 50.000đ
  - `FREESHIP`: Miễn phí ship
- **Tính toán tự động**: Tạm tính, giảm giá, phí ship, tổng tiền
- **LocalStorage**: Lưu trạng thái qua sessions

### 💳 Thanh toán
- **Form thông tin**: Validation đầy đủ
- **Nhiều phương thức**: COD, chuyển khoản, MoMo, thẻ
- **Tóm tắt đơn hàng**: Chi tiết và rõ ràng
- **Xử lý mock**: Simulate real checkout flow

### 🎨 UI/UX
- **Mobile-first**: Responsive hoàn toàn
- **Bootstrap 5**: Component system hiện đại
- **Toast notifications**: Thông báo thân thiện
- **Loading states**: Skeleton & spinner
- **Accessibility**: ARIA labels, focus states
- **Theme system**: Dễ dàng tùy chỉnh màu sắc

## 🚀 Hướng dẫn triển khai GitHub Pages

### Bước 1: Tạo Repository
1. Đăng nhập GitHub và tạo repository mới
2. Đặt tên: `your-ecommerce-site` (hoặc tên bạn muốn)
3. Đánh dấu **Public** (bắt buộc cho GitHub Pages miễn phí)
4. Không cần tạo README.md (đã có sẵn)

### Bước 2: Upload Files
Tải lên **TẤT CẢ** các file sau:

```
├── index.html          # File chính
├── styles.css          # CSS tùy chỉnh  
├── app.js              # React application
├── products.js         # Dữ liệu sản phẩm
├── 404.html            # Fallback cho SPA routing
├── README.md           # File này
└── assets/             # (Tùy chọn) 
    ├── favicon.ico
    └── logo.png
```

**Cách upload:**
- **Option 1**: Drag & drop trực tiếp lên GitHub web interface
- **Option 2**: Sử dụng Git commands:
  ```bash
  git clone https://github.com/USERNAME/REPOSITORY_NAME.git
  cd REPOSITORY_NAME
  # Copy all files to this folder
  git add .
  git commit -m "Initial commit: ARICO Store"
  git push origin main
  ```

### Bước 3: Kích hoạt GitHub Pages
1. Vào repository → **Settings**
2. Scroll xuống mục **Pages** (sidebar trái)
3. Trong **Source**:
   - Chọn: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/ (root)**
4. Click **Save**

### Bước 4: Đợi Build & Deploy
- GitHub sẽ build site trong 1-5 phút
- URL sẽ hiển thị: `https://USERNAME.github.io/REPOSITORY_NAME`
- Check **Actions** tab để xem tiến trình

### Bước 5: Kiểm tra
Truy cập URL được tạo và test các tính năng:
- ✅ Trang chủ load được
- ✅ Navigation working
- ✅ Search & filter
- ✅ Add to cart
- ✅ Checkout flow
- ✅ Responsive trên mobile

## 🛠️ Chạy Local (Development)

### Yêu cầu
- **Web browser** hiện đại (Chrome, Firefox, Safari, Edge)
- **HTTP server** (không bắt buộc nhưng khuyến nghị)

### Cách 1: Mở trực tiếp
```bash
# Chỉ cần mở file
open index.html
# hoặc double-click vào index.html
```

### Cách 2: HTTP Server (Khuyến nghị)
```bash
# Python 3
python -m http.server 8000

# Python 2  
python -m SimpleHTTPServer 8000

# Node.js (npx)
npx serve .

# VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Sau đó truy cập: `http://localhost:8000`

## 🎨 Tùy chỉnh Theme

### Thay đổi màu sắc thương hiệu
Mở `styles.css` và sửa đổi CSS variables trong `:root`:

```css
:root {
  /* Thay đổi màu chủ đạo */
  --brand-primary: #0052CC;    /* Xanh ARICO */
  --brand-secondary: #36B37E;  /* Xanh lá */
  --brand-accent: #FFAB00;     /* Vàng cam */
  --brand-danger: #E13D3D;     /* Đỏ */
  --brand-dark: #0B132B;       /* Xám đậm */
  --brand-light: #F4F6F8;      /* Xám nhạt */
}
```

### Ví dụ themes khác:

**🔵 Tech Blue**
```css
--brand-primary: #007ACC;
--brand-secondary: #17A2B8;
--brand-accent: #FFC107;
```

**🟢 Nature Green**
```css
--brand-primary: #28A745;
--brand-secondary: #20C997;
--brand-accent: #FD7E14;
```

**🟡 Sunshine Yellow**
```css
--brand-primary: #FFC107;
--brand-secondary: #28A745;
--brand-accent: #DC3545;
```

### Logo & Branding
1. Thay đổi tên thương hiệu trong `index.html`:
   ```html
   <title>YOUR BRAND - Thương mại điện tử</title>
   ```

2. Cập nhật navbar brand trong `app.js`:
   ```javascript
   <a className="navbar-brand text-brand fw-bold" href="#home">
     <i className="bi bi-shop me-2"></i>
     YOUR BRAND
   </a>
   ```

3. Thêm logo vào thư mục `assets/` và cập nhật:
   ```html
   <link rel="icon" type="image/x-icon" href="./assets/favicon.ico">
   ```

## 📊 Dữ liệu sản phẩm

### Cấu trúc sản phẩm
File `products.js` chứa mảng `PRODUCTS` với cấu trúc:

```javascript
{
  id: 1,                           // ID duy nhất
  name: 'iPhone 15 Pro Max',       // Tên sản phẩm
  sku: 'IP15PM-256-TB',           // Mã SKU
  category: 'Electronics',         // Danh mục
  price: 34990000,                // Giá hiện tại (VND)
  originalPrice: 36990000,        // Giá gốc (optional)
  discountPercent: 5,             // % giảm giá
  image: 'https://picsum.photos/400/400?random=1',
  images: ['url1', 'url2', 'url3'], // Gallery ảnh
  description: 'Mô tả chi tiết...',
  features: ['Tính năng 1', '...'], // Điểm nổi bật
  inStock: true,                   // Tình trạng kho
  rating: 4.8,                     // Đánh giá (1-5)
  reviewCount: 1247                // Số lượt đánh giá
}
```

### Thêm sản phẩm mới
1. Mở `products.js`
2. Thêm object mới vào mảng `PRODUCTS`
3. Đảm bảo `id` là duy nhất
4. Test trên local trước khi deploy

### Categories hiện có
- **Electronics**: Điện tử, công nghệ
- **Fashion**: Thời trang, phụ kiện  
- **Home & Living**: Nội thất, gia dụng
- **Books**: Sách, văn phòng phẩm

## 🛡️ Bảo mật & Hiệu năng

### Các tính năng bảo mật
✅ **Input Sanitization**: Làm sạch dữ liệu search  
✅ **XSS Protection**: Escape HTML trong content  
✅ **CSRF Prevention**: Không có server-side forms  
✅ **No API Keys**: Không có keys nhạy cảm trong code  

### Tối ưu hiệu năng  
✅ **Lazy Loading**: Ảnh load khi cần  
✅ **Debounce Search**: Giảm requests không cần thiết  
✅ **Local Storage**: Cache cart data  
✅ **CDN Assets**: Bootstrap & React từ CDN  
✅ **Minification**: Sử dụng minified libraries  

## 🎯 SEO & Accessibility

### SEO Features
- ✅ Meta tags đầy đủ
- ✅ Open Graph tags  
- ✅ Structured markup
- ✅ Semantic HTML
- ✅ Alt tags cho images
- ✅ Proper heading hierarchy

### Accessibility (A11y)
- ✅ ARIA labels & roles
- ✅ Keyboard navigation
- ✅ Focus management  
- ✅ Screen reader support
- ✅ Color contrast compliance
- ✅ Skip links

## 🔧 Customization Guide

### Thêm tính năng mới
1. **Wishlist**: Thêm hook `useWishlist()` tương tự `useCart()`
2. **Product Reviews**: Component đánh giá sản phẩm
3. **User Authentication**: Fake login/register forms
4. **Order History**: Lưu orders trong localStorage
5. **Multi-language**: i18n support

### Tích hợp APIs
Để tích hợp API thật, thay thế:
- `products.js` → API calls
- `useCart()` localStorage → API endpoints  
- Mock checkout → Payment gateway integration

### Styling Framework
Có thể thay Bootstrap bằng:
- **Tailwind CSS**: Utility-first approach
- **Chakra UI**: Component library for React  
- **Material-UI**: Google Material Design
- **Ant Design**: Enterprise design language

## 📱 PWA Support (Optional)

Để biến thành Progressive Web App:

1. **Service Worker** (`sw.js`):
```javascript
const CACHE_NAME = 'arico-store-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/app.js',
  '/products.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});
```

2. **Web App Manifest** (`manifest.json`):
```json
{
  "name": "ARICO Store",
  "short_name": "ARICO",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#0052CC",
  "icons": [
    {
      "src": "assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    }
  ]
}
```

## 🔍 Troubleshooting

### GitHub Pages không load
- ✅ Check repository là **Public**  
- ✅ Đảm bảo có file `index.html` ở root
- ✅ Wait 5-10 phút sau khi enable Pages
- ✅ Check Actions tab để xem build errors

### SPA routing không hoạt động  
- ✅ Đảm bảo có file `404.html`
- ✅ Links phải dùng hash: `#home`, `#catalog`
- ✅ Không dùng `window.history.pushState()`

### Images không hiển thị
- ✅ Check CORS policy của image host
- ✅ Thay bằng placeholder images khác
- ✅ Upload ảnh lên GitHub repository

### JavaScript errors
- ✅ Check browser console (F12)
- ✅ Đảm bảo load đúng thứ tự: React → ReactDOM → Babel → App
- ✅ Verify CDN links còn hoạt động

## 📞 Support & Contributing

### Report Issues
Nếu gặp bug hoặc có feature request:
1. Check existing issues trước
2. Tạo detailed bug report
3. Include browser info & steps to reproduce

### Contributing  
Pull requests welcome! Các areas cần help:
- 🎨 UI/UX improvements
- ♿ Accessibility enhancements  
- 🌐 Internationalization
- 📱 Mobile optimizations
- 🔧 New features

## 📄 License

MIT License - Free to use for personal and commercial projects.

---

## ✅ Checklist kiểm thử nhanh

Sau khi deploy, test các chức năng sau:

### 🏠 Trang chủ
- [ ] Hero section hiển thị đẹp
- [ ] Featured products load được
- [ ] Navigation links hoạt động
- [ ] Responsive trên mobile

### 🛍️ Catalog  
- [ ] Search sản phẩm (thử "iPhone")
- [ ] Filter theo category
- [ ] Adjust price range
- [ ] Sort by price/name
- [ ] Product cards clickable

### 🛒 Giỏ hàng
- [ ] Add product to cart → toast hiện
- [ ] Cart badge update số lượng
- [ ] Mở cart drawer từ header
- [ ] Tăng/giảm quantity
- [ ] Remove sản phẩm
- [ ] Apply coupon "ARI10" → giảm 10%

### 💳 Checkout
- [ ] Cart không rỗng → có thể vào checkout  
- [ ] Fill thông tin customer
- [ ] Select payment method
- [ ] Order summary chính xác
- [ ] Submit → success page
- [ ] Cart cleared sau order

### 📱 Mobile Testing
- [ ] Responsive breakpoints
- [ ] Touch interactions
- [ ] Readable text sizes
- [ ] Navigation usable

### ⚡ Performance
- [ ] Page load < 3 seconds
- [ ] Images lazy load
- [ ] Smooth interactions
- [ ] No console errors

---

**🎉 Chúc mừng! ARICO Store đã sẵn sàng phục vụ khách hàng!**

Nếu cần hỗ trợ thêm, feel free to reach out. Happy coding! 🚀
   
