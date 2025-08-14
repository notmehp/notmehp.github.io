# ✅ Checklist kiểm thử ARICO Store

## 🏠 **Trang chủ**
- [ ] **Hero section** hiển thị đẹp với background gradient
- [ ] **Featured products** (8 sản phẩm có giảm giá) load và hiển thị badge discount
- [ ] **Navigation links** trong header hoạt động (Home, Catalog, About, Contact)
- [ ] **Stats section** hiển thị số liệu (12+ sản phẩm, 24h giao hàng...)
- [ ] **Responsive** trên mobile - hero title và layout adapt
- [ ] **Footer** hiển thị đầy đủ thông tin và social links

## 🛍️ **Catalog & Tìm kiếm**  
- [ ] Truy cập `/catalog` hoặc click "Sản phẩm" trong menu
- [ ] **Search** sản phẩm (thử tìm "iPhone" hoặc "Áo") - có debounce 300ms
- [ ] **Filter theo category** (Electronics, Fashion, Home & Living, Books)
- [ ] **Price range slider** điều chỉnh được từ 0-50M VND
- [ ] **Sort options**: Giá thấp→cao, cao→thấp, A-Z, rating, newest
- [ ] **Product cards** hiển thị đủ: ảnh, tên, giá, rating, description
- [ ] **Badge giảm giá** hiển thị đúng % cho các sản phẩm sale
- [ ] **Hover effects** trên cards (shadow + transform)
- [ ] **Loading states** khi apply filters

## 🛒 **Giỏ hàng & Cart**
- [ ] **Add to cart** → Toast notification hiện "Đã thêm... vào giỏ hàng"
- [ ] **Cart badge** ở header update số lượng items
- [ ] **Mở cart drawer** từ cart button → offcanvas slide từ phải
- [ ] **Hiển thị items** trong cart với thumbnail, tên, giá, quantity
- [ ] **Tăng/giảm quantity** bằng +/- buttons
- [ ] **Remove item** bằng trash icon
- [ ] **Apply coupon codes**:
  - [ ] "ARI10" → giảm 10% 
  - [ ] "WELCOME" → giảm 50,000đ
  - [ ] "FREESHIP" → miễn phí ship
- [ ] **Calculate totals** chính xác: subtotal, discount, shipping, total
- [ ] **Free shipping** khi đơn hàng > 500k
- [ ] **Clear cart** xóa toàn bộ

## 🛍️ **Product Detail Modal**
- [ ] **Click product card** → modal hiển thị
- [ ] **Image gallery** với thumbnails (nếu có nhiều ảnh)
- [ ] **Product info**: tên, SKU, category, giá, rating, mô tả
- [ ] **Features list** hiển thị bullet points
- [ ] **Quantity selector** với validation min=1
- [ ] **Add to cart** từ modal → đóng modal + toast notification
- [ ] **Stock status** hiển thị "Hết hàng" nếu inStock=false

## 💳 **Checkout Process**
- [ ] Từ cart drawer → click "Thanh toán" chuyển đến checkout
- [ ] **Customer form** validation:
  - [ ] Họ tên (*) required
  - [ ] Điện thoại (*) required  
  - [ ] Email optional
  - [ ] Địa chỉ (*) required
- [ ] **Payment methods**: COD, Bank transfer, MoMo, Credit card
- [ ] **Order summary** bên phải hiển thị:
  - [ ] List items với thumbnails
  - [ ] Applied coupon (nếu có)
  - [ ] Breakdown: subtotal, discount, shipping, total
- [ ] **Submit order** → processing spinner → success page
- [ ] **Cart cleared** sau khi order thành công

## 📱 **Mobile Responsiveness**
- [ ] **Header** collapse được trên mobile với hamburger menu
- [ ] **Hero section** text size adapt (3rem → 2rem → 1.75rem)
- [ ] **Product grid** responsive: 4 cols desktop → 2 cols tablet → 1 col mobile
- [ ] **Filters sidebar** stack trên mobile
- [ ] **Cart drawer** full-width trên mobile
- [ ] **Touch interactions** hoạt động mượt
- [ ] **Readable text** sizes trên tất cả breakpoints

## ⚡ **Performance & UX**
- [ ] **Page load** < 3 giây (check Network tab)
- [ ] **Images lazy loading** - scroll down để test
- [ ] **Smooth animations**: hover effects, transitions, fade-ins
- [ ] **No console errors** (F12 → Console tab)
- [ ] **Loading spinners** hiển thị khi cần (filter, add to cart...)
- [ ] **Error handling** cho broken images (fallback placeholder)

## 🎯 **SEO & Accessibility**
- [ ] **Meta tags** trong `<head>`: title, description, OG tags
- [ ] **Alt attributes** cho tất cả images
- [ ] **ARIA labels** trên buttons và form controls
- [ ] **Focus states** visible khi tab navigation
- [ ] **Skip link** hoạt động (Tab đầu tiên)
- [ ] **Semantic HTML**: headings, nav, main, footer structure
- [ ] **Color contrast** đủ cao để đọc được

## 🧪 **Edge Cases Testing**
- [ ] **Empty cart** → hiển thị "Giỏ hàng trống" với icon
- [ ] **No search results** → "Không tìm thấy sản phẩm" với clear filters
- [ ] **Invalid coupon** → Toast error "Mã giảm giá không hợp lệ"  
- [ ] **Out of stock** products → button disabled "Hết hàng"
- [ ] **Quantity = 0** → auto remove from cart
- [ ] **Long product names** → text-truncate with tooltips
- [ ] **Large numbers** → format currency correctly

## 🌐 **Browser Compatibility**
Test trên các browsers:
- [ ] **Chrome** (latest)
- [ ] **Firefox** (latest)  
- [ ] **Safari** (macOS/iOS)
- [ ] **Edge** (Windows)
- [ ] **Mobile browsers** (Chrome Mobile, Safari iOS)

## 📊 **Data Persistence**
- [ ] **Add items to cart** → reload page → items still there (localStorage)
- [ ] **Apply coupon** → refresh → coupon still applied
- [ ] **Close browser** → reopen → cart state preserved
- [ ] **Clear cart** → localStorage updated
- [ ] **Order submission** → cart cleared from storage

## 🔧 **GitHub Pages Specific**
- [ ] **URL routing** hoạt động: domain.github.io/repo-name
- [ ] **Hash navigation** (#home, #catalog, #checkout) 
- [ ] **404.html** redirect về index.html
- [ ] **Static assets** load được (CSS, JS, images)
- [ ] **CDN resources** accessible (Bootstrap, React)

---

## 🎯 **Quick Test Scenario**

**Luồng mua hàng hoàn chỉnh (5 phút):**

1. **Landing** → Vào trang chủ, check hero + featured products
2. **Browse** → Vào Catalog, search "iPhone", filter Electronics  
3. **Select** → Click sản phẩm iPhone → xem detail modal
4. **Add** → Thêm vào cart với quantity=2 → check toast
5. **Cart** → Mở cart drawer, thấy 2 items
6. **Coupon** → Apply "ARI10" → thấy giảm 10%
7. **Checkout** → Fill form thông tin, chọn COD
8. **Submit** → Đặt hàng thành công → cart cleared
9. **Mobile** → Test lại trên mobile device

**✅ Tất cả steps pass → ARICO Store ready to go live! 🚀**

---

## 🆘 **Common Issues & Fixes**

**❌ Products không load:**  
→ Check `products.js` loaded trước `app.js`

**❌ Cart không lưu:**  
→ Check localStorage permissions trong browser

**❌ Images 404:**  
→ Thay placeholder URLs khác hoặc upload ảnh lên repo

**❌ Routing không hoạt động:**  
→ Check `404.html` exists và hash-based navigation

**❌ Bootstrap styles lỗi:**  
→ Verify CDN links còn active

**❌ Mobile layout vỡ:**  
→ Check viewport meta tag và responsive classes