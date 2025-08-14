// app.js
/* =========================================================
   ARICO Shop — Vanilla JS + Bootstrap 5 (CDN)
   - Hash Router (Home/Catalog/Product/Cart/Checkout)
   - Cart state (localStorage)
   - Lọc/tìm kiếm/sort (debounce)
   - Render UI via templates + event delegation
   - Utils: formatCurrency, debounce, sanitize
   - Bootstrap JS API: Toast, Offcanvas, Modal
   ========================================================= */

// -------------------- Utils --------------------
const formatCurrency = (v) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(v);
const sanitize = (str='') => String(str)
  .replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')
  .replaceAll('"','&quot;').replaceAll("'",'&#039;');

const debounce = (fn, delay=300) => {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn.apply(null, args), delay); };
};

// -------------------- Storage (Cart) --------------------
const STORAGE_KEY = 'arico_cart_v1';
const COUPON_KEY = 'arico_coupon_v1';

const Cart = {
  _data: { items: [], coupon: null }, // items: [{id, qty}]
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const coupon = localStorage.getItem(COUPON_KEY);
      this._data.items = raw ? JSON.parse(raw) : [];
      this._data.coupon = coupon ? JSON.parse(coupon) : null;
    } catch { this._data = { items: [], coupon: null }; }
    this.syncBadge();
  },
  save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._data.items));
    localStorage.setItem(COUPON_KEY, JSON.stringify(this._data.coupon));
    this.syncBadge();
  },
  syncBadge() {
    const count = this._data.items.reduce((a, it) => a + it.qty, 0);
    const badge = document.getElementById('cartCountBadge');
    if (badge) badge.textContent = count;
  },
  add(productId, qty=1) {
    qty = Math.max(1, Number(qty) || 1);
    const found = this._data.items.find(i => i.id === productId);
    if (found) found.qty += qty; else this._data.items.push({ id: productId, qty });
    this.save();
    toast(`Đã thêm vào giỏ hàng`, 'success');
  },
  update(productId, qty) {
    qty = Math.max(1, Number(qty) || 1);
    const it = this._data.items.find(i => i.id === productId);
    if (it) { it.qty = qty; this.save(); }
  },
  remove(productId) {
    this._data.items = this._data.items.filter(i => i.id !== productId);
    this.save();
  },
  clear() {
    this._data.items = [];
    this._data.coupon = null;
    this.save();
  },
  applyCoupon(code) {
    const normalized = String(code || '').trim().toUpperCase();
    // Mã giảm giá mock: ARI10 => -10%
    if (normalized === 'ARI10') {
      this._data.coupon = { code: 'ARI10', type: 'percent', value: 10 };
      this.save();
      toast(`Áp dụng mã ARI10 -10% thành công`, 'success');
      return true;
    }
    toast(`Mã không hợp lệ`, 'danger');
    return false;
  },
  totals() {
    const items = this._data.items.map(it => {
      const p = PRODUCTS.find(p => p.id === it.id);
      const discount = p.discountPercent ? Math.round(p.price * (p.discountPercent/100)) : 0;
      const priceAfter = p.price - discount;
      const line = priceAfter * it.qty;
      return { ...p, qty: it.qty, priceAfter, line, discount };
    });
    const subtotal = items.reduce((a, i) => a + i.line, 0);
    let discountCoupon = 0;
    if (this._data.coupon?.type === 'percent') discountCoupon = Math.round(subtotal * (this._data.coupon.value/100));
    const total = Math.max(0, subtotal - discountCoupon);
    return { items, subtotal, discountCoupon, total, coupon: this._data.coupon };
  }
};

// -------------------- Toast helper --------------------
const toast = (msg, variant='primary') => {
  const box = document.getElementById('toastContainer');
  const id = `t${Date.now()}`;
  const t = document.createElement('div');
  t.className = `toast align-items-center text-bg-${variant} border-0`;
  t.id = id;
  t.setAttribute('role','status');
  t.setAttribute('aria-live','polite');
  t.setAttribute('aria-atomic','true');
  t.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">${sanitize(msg)}</div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Đóng"></button>
    </div>`;
  box.appendChild(t);
  const inst = new bootstrap.Toast(t, { delay: 2200 });
  inst.show();
  t.addEventListener('hidden.bs.toast', () => t.remove());
};

// -------------------- Router --------------------
/* Router đơn giản dùng hash (#): 
   - #/               -> Home
   - #/catalog        -> Catalog
   - #/product/:id    -> Product detail (modal + route)
   - #/checkout       -> Checkout
*/
const Router = {
  routes: {},
  init() {
    window.addEventListener('hashchange', () => this.resolve());
    window.addEventListener('load', () => this.resolve());
  },
  add(path, handler) { this.routes[path] = handler; },
  resolve() {
    const hash = location.hash || '#/';
    const app = document.getElementById('app');
    app.setAttribute('aria-busy', 'true');

    // Product detail route detection
    const m = hash.match(/^#\/product\/(\d+)/);
    if (m) {
      renderCatalog(); // backfill catalog context
      openProductModal(Number(m[1]));
      app.setAttribute('aria-busy', 'false');
      return;
    }

    switch (hash) {
      case '#/':
        renderHome();
        break;
      case '#/catalog':
        renderCatalog();
        break;
      case '#/checkout':
        renderCheckout();
        break;
      default:
        renderNotFound();
    }
    app.setAttribute('aria-busy', 'false');
  }
};

// -------------------- Rendering --------------------

// Home
function renderHome() {
  const app = document.getElementById('app');
  const featured = PRODUCTS.slice(0, 6);
  app.innerHTML = `
    <section class="hero rounded-4 p-4 p-md-5 mb-4 border">
      <div class="row align-items-center g-3">
        <div class="col-md-7">
          <h1 class="display-6 fw-bold text-brand">ARICO Shop</h1>
          <p class="lead">Cửa hàng thương mại điện tử client-side (SPA) xây dựng bằng Vanilla JS + Bootstrap 5.</p>
          <a href="#/catalog" class="btn btn-brand btn-lg" aria-label="Mở danh mục sản phẩm">Mua sắm ngay</a>
        </div>
        <div class="col-md-5 text-center">
          <img src="https://picsum.photos/seed/arico-hero/520/320" loading="lazy" class="img-fluid rounded-3" alt="Minh hoạ sản phẩm nổi bật">
        </div>
      </div>
    </section>

    <section>
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h2 class="h4 m-0">Sản phẩm nổi bật</h2>
        <a class="btn btn-outline-secondary btn-sm" href="#/catalog" aria-label="Xem tất cả sản phẩm">Xem tất cả</a>
      </div>
      <div class="row g-3">
        ${featured.map(cardTemplate).join('')}
      </div>
    </section>
  `;
}

// Catalog
let catalogState = {
  q: '', category: 'Tất cả', priceMin: 0, priceMax: 1_000_000, sort: 'newest'
};

function renderCatalog() {
  const app = document.getElementById('app');
  const cats = ['Tất cả', ...Array.from(new Set(PRODUCTS.map(p => p.category)))];

  app.innerHTML = `
    <section class="mb-3">
      <div class="d-flex flex-column flex-md-row gap-2 align-items-md-end">
        <div class="flex-fill">
          <label for="searchInput" class="form-label mb-1">Tìm kiếm</label>
          <input id="searchInput" type="search" class="form-control" placeholder="Tên hoặc SKU..." value="${sanitize(catalogState.q)}" aria-label="Tìm theo tên hoặc mã SKU">
        </div>
        <div>
          <label for="categorySelect" class="form-label mb-1">Danh mục</label>
          <select id="categorySelect" class="form-select" aria-label="Chọn danh mục">
            ${cats.map(c => `<option value="${sanitize(c)}"${c===catalogState.category?' selected':''}>${sanitize(c)}</option>`).join('')}
          </select>
        </div>
        <div class="d-flex gap-2">
          <div>
            <label for="priceMin" class="form-label mb-1">Giá từ</label>
            <input id="priceMin" type="number" class="form-control" min="0" step="1000" value="${catalogState.priceMin}">
          </div>
          <div>
            <label for="priceMax" class="form-label mb-1">đến</label>
            <input id="priceMax" type="number" class="form-control" min="0" step="1000" value="${catalogState.priceMax}">
          </div>
        </div>
        <div>
          <label for="sortSelect" class="form-label mb-1">Sắp xếp</label>
          <select id="sortSelect" class="form-select" aria-label="Chọn cách sắp xếp">
            <option value="newest"${catalogState.sort==='newest'?' selected':''}>Mới nhất</option>
            <option value="priceAsc"${catalogState.sort==='priceAsc'?' selected':''}>Giá tăng dần</option>
            <option value="priceDesc"${catalogState.sort==='priceDesc'?' selected':''}>Giá giảm dần</option>
          </select>
        </div>
      </div>
      <div class="mt-2">
        <small class="text-muted"><i class="bi bi-info-circle me-1"></i>Tìm kiếm có debounce để tối ưu hiệu năng.</small>
      </div>
    </section>

    <section>
      <div class="row g-3" id="catalogGrid" aria-live="polite"></div>
    </section>
  `;

  // render grid
  renderCatalogGrid();

  // Bind events (delegation where possible)
  const debouncedSearch = debounce((e) => {
    catalogState.q = e.target.value;
    renderCatalogGrid();
  }, 300);
  document.getElementById('searchInput').addEventListener('input', debouncedSearch);
  document.getElementById('categorySelect').addEventListener('change', (e) => { catalogState.category = e.target.value; renderCatalogGrid(); });
  document.getElementById('priceMin').addEventListener('change', (e) => {
    const v = Math.max(0, Number(e.target.value)||0);
    catalogState.priceMin = v; renderCatalogGrid();
  });
  document.getElementById('priceMax').addEventListener('change', (e) => {
    const v = Math.max(0, Number(e.target.value)||0);
    catalogState.priceMax = v; renderCatalogGrid();
  });
  document.getElementById('sortSelect').addEventListener('change', (e) => { catalogState.sort = e.target.value; renderCatalogGrid(); });

  // Navbar quick search -> sync to catalog input
  const navSearch = document.getElementById('navSearch');
  if (navSearch && navSearch.value) {
    catalogState.q = navSearch.value;
    document.getElementById('searchInput').value = navSearch.value;
    renderCatalogGrid();
  }
}

function renderCatalogGrid() {
  let results = PRODUCTS.slice();

  // filter by category
  if (catalogState.category !== 'Tất cả') {
    results = results.filter(p => p.category === catalogState.category);
  }
  // price range
  results = results.filter(p => {
    const discount = p.discountPercent ? Math.round(p.price * (p.discountPercent/100)) : 0;
    const priceAfter = p.price - discount;
    return priceAfter >= catalogState.priceMin && priceAfter <= catalogState.priceMax;
  });
  // search name/sku
  const q = catalogState.q.trim().toLowerCase();
  if (q) {
    results = results.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }
  // sort
  if (catalogState.sort === 'priceAsc') {
    results.sort((a,b)=> (a.price - (a.discountPercent? a.price*a.discountPercent/100:0)) - (b.price - (b.discountPercent? b.price*b.discountPercent/100:0)));
  } else if (catalogState.sort === 'priceDesc') {
    results.sort((a,b)=> (b.price - (b.discountPercent? b.price*b.discountPercent/100:0)) - (a.price - (a.discountPercent? a.price*a.discountPercent/100:0)));
  } else { // newest (giả định id lớn hơn là mới hơn)
    results.sort((a,b)=> b.id - a.id);
  }

  const grid = document.getElementById('catalogGrid');
  grid.innerHTML = results.length ? results.map(cardTemplate).join('') :
    `<div class="col-12"><div class="alert alert-warning" role="status">Không tìm thấy sản phẩm phù hợp.</div></div>`;
}

function cardTemplate(p) {
  const discount = p.discountPercent ? Math.round(p.price * (p.discountPercent/100)) : 0;
  const priceAfter = p.price - discount;
  return `
  <div class="col-12 col-sm-6 col-md-4 col-lg-3">
    <div class="card h-100 shadow-sm">
      <img src="${sanitize(p.image)}" class="card-img-top" alt="${sanitize(p.name)}" loading="lazy" width="600" height="400">
      <div class="card-body d-flex flex-column">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <h3 class="h6 card-title mb-0">${sanitize(p.name)}</h3>
          ${p.discountPercent ? `<span class="badge text-bg-danger">-${p.discountPercent}%</span>` : ``}
        </div>
        <div class="mb-1"><span class="badge badge-sku">SKU: ${sanitize(p.sku)}</span></div>
        <div class="mb-2">
          ${p.discountPercent ? `<span class="price-old me-2">${formatCurrency(p.price)}</span>` : ``}
          <strong class="text-brand">${formatCurrency(priceAfter)}</strong>
        </div>
        <div class="mt-auto d-flex gap-2">
          <button class="btn btn-outline-secondary flex-fill btn-view" data-id="${p.id}" aria-label="Xem nhanh ${sanitize(p.name)}">
            <i class="bi bi-eye"></i> Xem
          </button>
          <button class="btn btn-brand flex-fill btn-add" data-id="${p.id}" aria-label="Thêm ${sanitize(p.name)} vào giỏ">
            <i class="bi bi-cart-plus"></i> Thêm
          </button>
        </div>
      </div>
      <a href="#/product/${p.id}" class="stretched-link" aria-label="Mở trang chi tiết sản phẩm ${sanitize(p.name)}"></a>
    </div>
  </div>`;
}

// Product detail (Modal)
function openProductModal(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p) return;
  const discount = p.discountPercent ? Math.round(p.price * (p.discountPercent/100)) : 0;
  const priceAfter = p.price - discount;
  const el = document.getElementById('productModalContent');
  el.innerHTML = `
    <div class="modal-header">
      <h5 id="productModalLabel" class="modal-title">${sanitize(p.name)}</h5>
      <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Đóng"></button>
    </div>
    <div class="modal-body">
      <div class="row g-3">
        <div class="col-md-6">
          <img src="${sanitize(p.image)}" class="img-fluid rounded" alt="${sanitize(p.name)} ảnh lớn" loading="lazy">
        </div>
        <div class="col-md-6">
          <div class="mb-2"><span class="badge badge-sku">SKU: ${sanitize(p.sku)}</span></div>
          <p id="productModalDesc">${sanitize(p.description)}</p>
          <p>
            ${p.discountPercent ? `<span class="price-old me-2">${formatCurrency(p.price)}</span>` : ``}
            <span class="h5 text-brand">${formatCurrency(priceAfter)}</span>
            ${p.discountPercent ? `<span class="ms-2 badge text-bg-danger">-${p.discountPercent}%</span>` : ``}
          </p>
          <div class="input-group mb-3" style="max-width:200px">
            <label class="input-group-text" for="qtyInput">SL</label>
            <input id="qtyInput" type="number" class="form-control" value="1" min="1" step="1" aria-label="Số lượng">
          </div>
          <div class="d-flex gap-2">
            <button class="btn btn-brand btn-add" data-id="${p.id}" aria-label="Thêm vào giỏ hàng">
              <i class="bi bi-cart-plus"></i> Thêm vào giỏ
            </button>
            <a href="#/checkout" class="btn btn-outline-secondary" aria-label="Đi đến thanh toán">Mua ngay</a>
          </div>
        </div>
      </div>
    </div>
  `;
  const modal = new bootstrap.Modal('#productModal');
  modal.show();
}

// Cart (Offcanvas)
function renderCartOffcanvas() {
  const dest = document.getElementById('cartBody');
  const { items, subtotal, discountCoupon, total, coupon } = Cart.totals();

  if (!items.length) {
    dest.innerHTML = `<div class="alert alert-info" role="status">Giỏ hàng trống. Hãy thêm vài sản phẩm nhé!</div>`;
    return;
  }

  dest.innerHTML = `
    <div class="vstack gap-3">
      ${items.map(i => `
        <div class="d-flex gap-2 align-items-center">
          <img class="cart-item-img" src="${sanitize(i.image)}" alt="${sanitize(i.name)}" loading="lazy" width="60" height="60">
          <div class="flex-fill">
            <div class="d-flex justify-content-between">
              <strong>${sanitize(i.name)}</strong>
              <button class="btn btn-sm btn-link text-danger p-0 btn-remove" data-id="${i.id}" aria-label="Xoá khỏi giỏ">
                <i class="bi bi-trash"></i>
              </button>
            </div>
            <div class="small mb-1">SKU: ${sanitize(i.sku)}</div>
            <div class="d-flex align-items-center gap-2">
              <div class="input-group input-group-sm" style="max-width:140px">
                <span class="input-group-text">SL</span>
                <input type="number" class="form-control input-qty" data-id="${i.id}" value="${i.qty}" min="1" step="1" aria-label="Số lượng sản phẩm">
              </div>
              <div class="ms-auto">
                <div class="small ${i.discount ? 'price-old':''}">${formatCurrency(i.price)}</div>
                <strong>${formatCurrency(i.priceAfter)}</strong>
              </div>
            </div>
          </div>
        </div>
      `).join('')}
      <hr>
      <form id="couponForm" class="input-group">
        <span class="input-group-text"><i class="bi bi-ticket-perforated"></i></span>
        <input id="couponInput" type="text" class="form-control" placeholder="Nhập mã (vd: ARI10)" value="${coupon?.code||''}" aria-label="Nhập mã giảm giá">
        <button class="btn btn-outline-secondary" type="submit">Áp dụng</button>
      </form>
      <div class="d-flex justify-content-between">
        <span>Tạm tính</span><strong>${formatCurrency(subtotal)}</strong>
      </div>
      <div class="d-flex justify-content-between">
        <span>Giảm giá mã ${coupon?.code ? `<span class="badge text-bg-success">${sanitize(coupon.code)}</span>` : ''}</span>
        <strong class="${discountCoupon? 'text-success':''}">-${formatCurrency(discountCoupon)}</strong>
      </div>
      <div class="d-flex justify-content-between fs-5">
        <span>Tổng cộng</span><strong class="text-brand">${formatCurrency(total)}</strong>
      </div>
      <div class="d-grid">
        <a href="#/checkout" class="btn btn-brand" data-bs-dismiss="offcanvas" aria-label="Đi đến trang thanh toán">Tiến hành thanh toán</a>
      </div>
    </div>
  `;
}

// Checkout
function renderCheckout() {
  const app = document.getElementById('app');
  const { items, subtotal, discountCoupon, total, coupon } = Cart.totals();

  if (!items.length) {
    app.innerHTML = `
      <div class="alert alert-warning" role="status">
        Chưa có sản phẩm trong giỏ. <a href="#/catalog" class="alert-link">Tiếp tục mua sắm</a>.
      </div>
    `;
    return;
  }

  app.innerHTML = `
    <h2 class="h4 mb-3">Checkout</h2>
    <div class="row g-3">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-body">
            <h3 class="h6 mb-3">Thông tin liên hệ (mock)</h3>
            <form id="checkoutForm" novalidate>
              <div class="row g-3">
                <div class="col-md-6">
                  <label class="form-label" for="fullName">Họ tên</label>
                  <input class="form-control" id="fullName" required placeholder="VD: Nguyen Van A" aria-required="true">
                  <div class="invalid-feedback">Vui lòng nhập họ tên.</div>
                </div>
                <div class="col-md-6">
                  <label class="form-label" for="phone">Số điện thoại</label>
                  <input class="form-control" id="phone" type="tel" pattern="[0-9]{9,12}" required placeholder="09xxxxxxxx" aria-required="true">
                  <div class="invalid-feedback">Nhập số điện thoại hợp lệ (9–12 số).</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="address">Địa chỉ</label>
                  <input class="form-control" id="address" required placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành" aria-required="true">
                  <div class="invalid-feedback">Vui lòng nhập địa chỉ.</div>
                </div>
                <div class="col-12">
                  <label class="form-label" for="note">Ghi chú (tuỳ chọn)</label>
                  <textarea class="form-control" id="note" rows="2"></textarea>
                </div>
              </div>
              <div class="form-text mt-2">* Đây chỉ là checkout mô phỏng (mock), không thu thập dữ liệu thực.</div>
            </form>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <div class="card">
          <div class="card-body">
            <h3 class="h6 mb-3">Tóm tắt đơn hàng</h3>
            <ul class="list-group mb-3">
              ${items.map(i => `
                <li class="list-group-item d-flex justify-content-between align-items-start">
                  <div class="me-2">
                    <div class="fw-semibold">${sanitize(i.name)}</div>
                    <div class="small text-muted">SL: ${i.qty}</div>
                  </div>
                  <span>${formatCurrency(i.line)}</span>
                </li>
              `).join('')}
              <li class="list-group-item d-flex justify-content-between">
                <span>Tạm tính</span><strong>${formatCurrency(subtotal)}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Giảm giá ${coupon?.code ? `(<span class="badge text-bg-success">${sanitize(coupon.code)}</span>)` : ''}</span>
                <strong class="${discountCoupon? 'text-success':''}">-${formatCurrency(discountCoupon)}</strong>
              </li>
              <li class="list-group-item d-flex justify-content-between">
                <span>Tổng cộng</span><strong class="text-brand">${formatCurrency(total)}</strong>
              </li>
            </ul>
            <a href="https://example.com/payment-link" target="_blank" rel="noopener" class="btn btn-brand w-100 mb-2" aria-label="Thanh toán qua Payment Link (giả lập)">
              <i class="bi bi-credit-card"></i> Thanh toán qua Payment Link
            </a>
            <button id="btnPlaceOrder" class="btn btn-outline-secondary w-100" aria-label="Hoàn tất đơn (mock)">Hoàn tất (mock)</button>
          </div>
        </div>
      </div>
    </div>
  `;

  // simple form validation on click Place Order
  document.getElementById('btnPlaceOrder').addEventListener('click', () => {
    const form = document.getElementById('checkoutForm');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      toast('Vui lòng kiểm tra thông tin hợp lệ.', 'danger');
      return;
    }
    toast('Đặt hàng (mock) thành công! Cảm ơn bạn ❤️', 'success');
  }, { once: true });
}

// Not Found
function renderNotFound() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="text-center py-5">
      <h2 class="h4">Không tìm thấy trang</h2>
      <p>Hãy quay về <a href="#/">Home</a> hoặc xem <a href="#/catalog">Catalog</a>.</p>
    </div>
  `;
}

// -------------------- Global Event Delegation --------------------
document.addEventListener('click', (e) => {
  const viewBtn = e.target.closest('.btn-view');
  const addBtn  = e.target.closest('.btn-add');
  const removeBtn = e.target.closest('.btn-remove');
  const offcanvasEl = document.getElementById('offcanvasCart');

  if (viewBtn) {
    const id = Number(viewBtn.dataset.id);
    openProductModal(id);
  }

  if (addBtn) {
    const id = Number(addBtn.dataset.id);
    const qtyInput = document.getElementById('qtyInput');
    const qty = qtyInput ? Math.max(1, Number(qtyInput.value)||1) : 1;
    Cart.add(id, qty);
    renderCartOffcanvas();
  }

  if (removeBtn) {
    const id = Number(removeBtn.dataset.id);
    Cart.remove(id);
    renderCartOffcanvas();
  }

  // When user opens offcanvas via button, (re)render cart
  const cartBtn = e.target.closest('#btnCart');
  if (cartBtn) {
    renderCartOffcanvas();
  }
});

document.addEventListener('input', (e) => {
  const qtyInp = e.target.closest('.input-qty');
  if (qtyInp) {
    const id = Number(qtyInp.dataset.id);
    let qty = Math.max(1, Number(qtyInp.value) || 1);
    qtyInp.value = qty;
    Cart.update(id, qty);
    renderCartOffcanvas();
  }
});

document.addEventListener('submit', (e) => {
  const form = e.target.closest('#couponForm');
  if (form) {
    e.preventDefault();
    const input = document.getElementById('couponInput');
    const code = String(input.value||'').toUpperCase();
    if (!code) { toast('Vui lòng nhập mã.', 'warning'); return; }
    Cart.applyCoupon(code);
    renderCartOffcanvas();
  }
});

// Nav quick search -> go catalog route with keyword (debounced in Catalog)
document.getElementById('navSearch').addEventListener('input', debounce((e) => {
  const val = e.target.value;
  if (!location.hash.startsWith('#/catalog')) location.hash = '#/catalog';
  catalogState.q = val;
  const inp = document.getElementById('searchInput');
  if (inp) { inp.value = val; renderCatalogGrid(); }
}, 300));

// -------------------- Boot --------------------
document.getElementById('year').textContent = new Date().getFullYear();
Cart.load();
Router.init();

// Render cart content when offcanvas shows (in case open without click)
document.getElementById('offcanvasCart').addEventListener('show.bs.offcanvas', renderCartOffcanvas);
