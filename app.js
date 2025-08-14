// ====== ARICO STORE - REACT SPA APPLICATION ======
const { useState, useEffect, useCallback, useMemo, useRef } = React;

// ====== UTILITIES ======

// Format tiền tệ VND
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Debounce function cho search
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// LocalStorage utilities
const LocalStorageKeys = {
  CART: 'arico_cart',
  WISHLIST: 'arico_wishlist',
  USER_PREFERENCES: 'arico_preferences'
};

const getFromLocalStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${key}`, error);
    return defaultValue;
  }
};

const setToLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage: ${key}`, error);
  }
};

// Toast notifications
const showToast = (message, type = 'success') => {
  const toastContainer = document.getElementById('toast-container');
  if (!toastContainer) return;

  const toastId = `toast-${Date.now()}`;
  const toastClass = type === 'success' ? 'bg-success' : 'bg-danger';
  
  const toastHTML = `
    <div class="toast ${toastClass} text-white" role="alert" id="${toastId}">
      <div class="d-flex">
        <div class="toast-body">
          <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  
  toastContainer.insertAdjacentHTML('beforeend', toastHTML);
  
  const toastElement = document.getElementById(toastId);
  const toast = new bootstrap.Toast(toastElement, { delay: 3000 });
  toast.show();
  
  // Auto remove after hide
  toastElement.addEventListener('hidden.bs.toast', () => {
    toastElement.remove();
  });
};

// ====== CUSTOM HOOKS ======

// Cart management hook
const useCart = () => {
  const [cartItems, setCartItems] = useState(() => 
    getFromLocalStorage(LocalStorageKeys.CART, [])
  );

  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Coupons mock data
  const coupons = {
    'ARI10': { discount: 10, type: 'percentage', description: 'Giảm 10%' },
    'WELCOME': { discount: 50000, type: 'fixed', description: 'Giảm 50.000đ' },
    'FREESHIP': { discount: 30000, type: 'fixed', description: 'Miễn phí ship' }
  };

  // Save to localStorage whenever cart changes
  useEffect(() => {
    setToLocalStorage(LocalStorageKeys.CART, cartItems);
  }, [cartItems]);

  // Add item to cart
  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
    
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
  }, []);

  // Remove item from cart
  const removeFromCart = useCallback((productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    showToast('Đã xóa sản phẩm khỏi giỏ hàng', 'success');
  }, []);

  // Update quantity
  const updateQuantity = useCallback((productId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  }, [removeFromCart]);

  // Clear cart
  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
    showToast('Đã xóa toàn bộ giỏ hàng', 'success');
  }, []);

  // Apply coupon
  const applyCoupon = useCallback((couponCode) => {
    const coupon = coupons[couponCode.toUpperCase()];
    if (coupon) {
      setAppliedCoupon({ code: couponCode.toUpperCase(), ...coupon });
      showToast(`Áp dụng mã giảm giá thành công: ${coupon.description}`, 'success');
      return true;
    } else {
      showToast('Mã giảm giá không hợp lệ', 'error');
      return false;
    }
  }, [coupons]);

  // Remove coupon
  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
    showToast('Đã hủy mã giảm giá', 'success');
  }, []);

  // Calculate totals
  const calculations = useMemo(() => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    let discount = 0;
    if (appliedCoupon) {
      if (appliedCoupon.type === 'percentage') {
        discount = Math.round(subtotal * appliedCoupon.discount / 100);
      } else {
        discount = appliedCoupon.discount;
      }
    }
    
    const shipping = subtotal > 500000 ? 0 : 30000; // Free shipping over 500k
    const total = Math.max(0, subtotal - discount + shipping);

    return {
      subtotal,
      discount,
      shipping,
      total,
      itemCount,
      isEmpty: cartItems.length === 0
    };
  }, [cartItems, appliedCoupon]);

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyCoupon,
    removeCoupon,
    appliedCoupon,
    ...calculations
  };
};

// ====== COMPONENTS ======

// Loading Spinner Component
const LoadingSpinner = ({ size = 'md', text = 'Đang tải...' }) => (
  <div className="d-flex flex-column align-items-center justify-content-center p-4">
    <div className={`spinner-border text-primary ${size === 'sm' ? 'spinner-border-sm' : ''}`} role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
    {text && <small className="text-muted mt-2">{text}</small>}
  </div>
);

// Product Card Component
const ProductCard = ({ product, onAddToCart, onViewDetails }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    onAddToCart(product, 1);
  };

  const discountPrice = product.originalPrice > 0 ? product.originalPrice : null;
  const savings = discountPrice ? discountPrice - product.price : 0;

  return (
    <div className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
      <div className="card product-card h-100 shadow-sm" onClick={() => onViewDetails(product)}>
        <div className="product-img-container position-relative">
          {product.discountPercent > 0 && (
            <div className="badge-discount">
              -{product.discountPercent}%
            </div>
          )}
          
          {!imageLoaded && !imageError && (
            <div className="position-absolute top-50 start-50 translate-middle">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          
          <img
            src={imageError ? 'https://via.placeholder.com/400x400?text=No+Image' : product.image}
            alt={product.name}
            className={`card-img-top ${imageLoaded ? 'fade-in' : 'd-none'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
          />
        </div>
        
        <div className="card-body d-flex flex-column">
          <h6 className="card-title text-truncate" title={product.name}>
            {product.name}
          </h6>
          
          <div className="mb-2">
            <span className="text-muted small">SKU: {product.sku}</span>
          </div>
          
          <div className="mb-2">
            {discountPrice && (
              <small className="price-original me-2">
                {formatCurrency(discountPrice)}
              </small>
            )}
            <span className="price-current">
              {formatCurrency(product.price)}
            </span>
            {savings > 0 && (
              <small className="text-success ms-2">
                Tiết kiệm {formatCurrency(savings)}
              </small>
            )}
          </div>
          
          <div className="mb-2">
            <div className="d-flex align-items-center">
              <div className="text-warning me-1">
                {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
              </div>
              <small className="text-muted">
                ({product.reviewCount})
              </small>
            </div>
          </div>
          
          <p className="card-text small text-muted flex-grow-1">
            {product.description.substring(0, 80)}...
          </p>
          
          <div className="mt-auto">
            {product.inStock ? (
              <button 
                className="btn btn-brand w-100"
                onClick={handleAddToCart}
                aria-label={`Thêm ${product.name} vào giỏ hàng`}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Thêm vào giỏ
              </button>
            ) : (
              <button className="btn btn-outline-secondary w-100" disabled>
                <i className="bi bi-x-circle me-2"></i>
                Hết hàng
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Filters Component
const Filters = ({ 
  categories, 
  selectedCategory, 
  onCategoryChange,
  priceRange, 
  onPriceRangeChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  onClearFilters
}) => {
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  useEffect(() => {
    onSearchChange(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchChange]);

  return (
    <div className="filters-sidebar">
      {/* Search */}
      <div className="filter-group">
        <label className="filter-title" htmlFor="search-input">
          <i className="bi bi-search me-2"></i>
          Tìm kiếm
        </label>
        <input
          id="search-input"
          type="text"
          className="form-control"
          placeholder="Tìm theo tên hoặc mã sản phẩm..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Categories */}
      <div className="filter-group">
        <label className="filter-title">
          <i className="bi bi-grid me-2"></i>
          Danh mục
        </label>
        <select 
          className="form-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Chọn danh mục"
        >
          <option value="">Tất cả danh mục</option>
          {categories.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="filter-group">
        <label className="filter-title">
          <i className="bi bi-cash-coin me-2"></i>
          Khoảng giá
        </label>
        <div className="mb-3">
          <label htmlFor="minPrice" className="form-label small">
            Từ: {formatCurrency(priceRange.min)}
          </label>
          <input
            id="minPrice"
            type="range"
            className="form-range"
            min="0"
            max="50000000"
            step="100000"
            value={priceRange.min}
            onChange={(e) => onPriceRangeChange({...priceRange, min: parseInt(e.target.value)})}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="maxPrice" className="form-label small">
            Đến: {formatCurrency(priceRange.max)}
          </label>
          <input
            id="maxPrice"
            type="range"
            className="form-range"
            min="0"
            max="50000000"
            step="100000"
            value={priceRange.max}
            onChange={(e) => onPriceRangeChange({...priceRange, max: parseInt(e.target.value)})}
          />
        </div>
      </div>

      {/* Sort */}
      <div className="filter-group">
        <label className="filter-title">
          <i className="bi bi-sort-down me-2"></i>
          Sắp xếp
        </label>
        <select 
          className="form-select"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sắp xếp theo"
        >
          <option value="">Mặc định</option>
          <option value="price-asc">Giá: Thấp đến cao</option>
          <option value="price-desc">Giá: Cao đến thấp</option>
          <option value="name-asc">Tên: A-Z</option>
          <option value="rating">Đánh giá cao</option>
          <option value="newest">Mới nhất</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button 
        className="btn btn-outline-secondary w-100"
        onClick={onClearFilters}
      >
        <i className="bi bi-arrow-clockwise me-2"></i>
        Xóa bộ lọc
      </button>
    </div>
  );
};

// Product Detail Modal Component
const ProductDetailModal = ({ product, show, onHide, onAddToCart }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (product) {
      setSelectedImage(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onHide();
  };

  const discountPrice = product.originalPrice > 0 ? product.originalPrice : null;
  const savings = discountPrice ? discountPrice - product.price : 0;

  return (
    <div className={`modal fade ${show ? 'show d-block' : ''}`} tabIndex="-1" style={{backgroundColor: show ? 'rgba(0,0,0,0.5)' : 'transparent'}}>
      <div className="modal-dialog modal-lg modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{product.name}</h5>
            <button type="button" className="btn-close" onClick={onHide}></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              {/* Images */}
              <div className="col-md-6">
                <div className="mb-3">
                  <img
                    src={product.images ? product.images[selectedImage] : product.image}
                    alt={product.name}
                    className="img-fluid rounded"
                    style={{width: '100%', height: '400px', objectFit: 'cover'}}
                  />
                </div>
                
                {product.images && product.images.length > 1 && (
                  <div className="d-flex gap-2 justify-content-center">
                    {product.images.map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className={`img-thumbnail cursor-pointer ${selectedImage === index ? 'border-primary' : ''}`}
                        style={{width: '80px', height: '80px', objectFit: 'cover'}}
                        onClick={() => setSelectedImage(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="col-md-6">
                <div className="mb-3">
                  <span className="badge bg-secondary me-2">{product.category}</span>
                  <small className="text-muted">SKU: {product.sku}</small>
                </div>
                
                <div className="mb-3">
                  {discountPrice && (
                    <>
                      <span className="price-original me-2 h6">
                        {formatCurrency(discountPrice)}
                      </span>
                      <span className="badge bg-danger me-2">
                        -{product.discountPercent}%
                      </span>
                      <br />
                    </>
                  )}
                  <span className="price-current h4">
                    {formatCurrency(product.price)}
                  </span>
                  {savings > 0 && (
                    <div className="text-success small">
                      Tiết kiệm {formatCurrency(savings)}
                    </div>
                  )}
                </div>
                
                <div className="mb-3">
                  <div className="d-flex align-items-center">
                    <div className="text-warning me-2">
                      {'★'.repeat(Math.floor(product.rating))}{'☆'.repeat(5 - Math.floor(product.rating))}
                    </div>
                    <span>{product.rating}/5</span>
                    <small className="text-muted ms-2">
                      ({product.reviewCount} đánh giá)
                    </small>
                  </div>
                </div>
                
                <p className="mb-3">{product.description}</p>
                
                {product.features && (
                  <div className="mb-3">
                    <h6>Tính năng nổi bật:</h6>
                    <ul className="list-unstyled">
                      {product.features.map((feature, index) => (
                        <li key={index} className="small">
                          <i className="bi bi-check-circle text-success me-2"></i>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {product.inStock ? (
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Số lượng:</label>
                    <div className="quantity-controls">
                      <button 
                        className="quantity-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                      >
                        <i className="bi bi-dash"></i>
                      </button>
                      <input
                        type="number"
                        className="quantity-input"
                        value={quantity}
                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        max="99"
                      />
                      <button 
                        className="quantity-btn"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <i className="bi bi-plus"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="alert alert-warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Sản phẩm hiện đang hết hàng
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onHide}>
              Đóng
            </button>
            {product.inStock && (
              <button 
                type="button" 
                className="btn btn-brand"
                onClick={handleAddToCart}
              >
                <i className="bi bi-cart-plus me-2"></i>
                Thêm vào giỏ ({quantity})
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Cart Drawer Component
const CartDrawer = ({ show, onHide, cart }) => {
  const [couponCode, setCouponCode] = useState('');

  const handleCouponSubmit = (e) => {
    e.preventDefault();
    if (couponCode.trim()) {
      cart.applyCoupon(couponCode.trim());
      setCouponCode('');
    }
  };

  return (
    <>
      {/* Backdrop */}
      {show && (
        <div 
          className="offcanvas-backdrop fade show" 
          onClick={onHide}
        ></div>
      )}
      
      {/* Offcanvas */}
      <div className={`offcanvas offcanvas-end ${show ? 'show' : ''}`} tabIndex="-1">
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">
            <i className="bi bi-cart me-2"></i>
            Giỏ hàng ({cart.itemCount})
          </h5>
          <button 
            type="button" 
            className="btn-close"
            onClick={onHide}
          ></button>
        </div>
        
        <div className="offcanvas-body p-0">
          {cart.isEmpty ? (
            <div className="text-center p-4">
              <i className="bi bi-cart-x display-4 text-muted"></i>
              <h6 className="mt-3">Giỏ hàng trống</h6>
              <p className="text-muted small">Thêm sản phẩm để bắt đầu mua sắm</p>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="p-3" style={{maxHeight: '60vh', overflowY: 'auto'}}>
                {cart.cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="row g-2">
                      <div className="col-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-img"
                        />
                      </div>
                      <div className="col-9">
                        <h6 className="mb-1 text-truncate" title={item.name}>
                          {item.name}
                        </h6>
                        <div className="text-muted small mb-2">
                          {formatCurrency(item.price)}
                        </div>
                        
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={() => cart.updateQuantity(item.id, item.quantity - 1)}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <span className="mx-2">{item.quantity}</span>
                            <button
                              className="quantity-btn"
                              onClick={() => cart.updateQuantity(item.id, item.quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                          
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => cart.removeFromCart(item.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                        
                        <div className="text-end mt-2">
                          <strong>{formatCurrency(item.price * item.quantity)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Coupon Section */}
              <div className="p-3 bg-light border-top border-bottom">
                <form onSubmit={handleCouponSubmit} className="mb-3">
                  <div className="input-group input-group-sm">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập mã giảm giá..."
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button type="submit" className="btn btn-outline-primary">
                      <i className="bi bi-tag"></i>
                    </button>
                  </div>
                </form>
                
                {cart.appliedCoupon && (
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-success">
                      <i className="bi bi-tag-fill me-1"></i>
                      {cart.appliedCoupon.code}: {cart.appliedCoupon.description}
                    </small>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={cart.removeCoupon}
                    >
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                )}
              </div>
              
              {/* Cart Summary */}
              <div className="p-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Tạm tính:</span>
                  <span>{formatCurrency(cart.subtotal)}</span>
                </div>
                
                {cart.discount > 0 && (
                  <div className="d-flex justify-content-between text-success mb-2">
                    <span>Giảm giá:</span>
                    <span>-{formatCurrency(cart.discount)}</span>
                  </div>
                )}
                
                <div className="d-flex justify-content-between mb-2">
                  <span>Phí ship:</span>
                  <span>
                    {cart.shipping === 0 ? (
                      <span className="text-success">Miễn phí</span>
                    ) : (
                      formatCurrency(cart.shipping)
                    )}
                  </span>
                </div>
                
                <hr />
                
                <div className="d-flex justify-content-between mb-3">
                  <strong>Tổng cộng:</strong>
                  <strong className="text-brand">{formatCurrency(cart.total)}</strong>
                </div>
                
                <div className="d-grid gap-2">
                  <button 
                    className="btn btn-brand"
                    onClick={() => {
                      window.location.hash = '#checkout';
                      onHide();
                    }}
                  >
                    <i className="bi bi-credit-card me-2"></i>
                    Thanh toán
                  </button>
                  
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={cart.clearCart}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Xóa giỏ hàng
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Header Component
const Header = ({ cart, onCartToggle, currentRoute }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        {/* Brand */}
        <a className="navbar-brand text-brand fw-bold" href="#home">
          <i className="bi bi-shop me-2"></i>
          ARICO Store
        </a>
        
        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        {/* Navigation */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <a 
                className={`nav-link ${currentRoute === 'home' ? 'active' : ''}`}
                href="#home"
              >
                <i className="bi bi-house me-1"></i>
                Trang chủ
              </a>
            </li>
            <li className="nav-item">
              <a 
                className={`nav-link ${currentRoute === 'catalog' ? 'active' : ''}`}
                href="#catalog"
              >
                <i className="bi bi-grid me-1"></i>
                Sản phẩm
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#about">
                <i className="bi bi-info-circle me-1"></i>
                Giới thiệu
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#contact">
                <i className="bi bi-telephone me-1"></i>
                Liên hệ
              </a>
            </li>
          </ul>
          
          {/* Cart Button */}
          <button 
            className="btn btn-outline-primary position-relative me-2"
            onClick={onCartToggle}
            aria-label="Mở giỏ hàng"
          >
            <i className="bi bi-cart2"></i>
            {cart.itemCount > 0 && (
              <span className="cart-badge">
                {cart.itemCount > 99 ? '99+' : cart.itemCount}
              </span>
            )}
          </button>
          
          {/* User Menu */}
          <div className="dropdown">
            <button 
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-person"></i>
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="#profile">Tài khoản</a></li>
              <li><a className="dropdown-item" href="#orders">Đơn hàng</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#login">Đăng nhập</a></li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Footer Component
const Footer = () => (
  <footer className="bg-dark text-light py-5 mt-5">
    <div className="container">
      <div className="row">
        <div className="col-lg-4 mb-4">
          <h5 className="text-brand-accent mb-3">
            <i className="bi bi-shop me-2"></i>
            ARICO Store
          </h5>
          <p>
            Nền tảng thương mại điện tử hiện đại, mang đến trải nghiệm 
            mua sắm tuyệt vời với đa dạng sản phẩm chất lượng cao.
          </p>
          <div className="d-flex gap-3">
            <a href="#" className="text-light">
              <i className="bi bi-facebook"></i>
            </a>
            <a href="#" className="text-light">
              <i className="bi bi-instagram"></i>
            </a>
            <a href="#" className="text-light">
              <i className="bi bi-youtube"></i>
            </a>
            <a href="#" className="text-light">
              <i className="bi bi-tiktok"></i>
            </a>
          </div>
        </div>
        
        <div className="col-lg-2 col-6 mb-4">
          <h6>Sản phẩm</h6>
          <ul className="list-unstyled">
            <li><a href="#" className="text-light-emphasis">Electronics</a></li>
            <li><a href="#" className="text-light-emphasis">Fashion</a></li>
            <li><a href="#" className="text-light-emphasis">Home & Living</a></li>
            <li><a href="#" className="text-light-emphasis">Books</a></li>
          </ul>
        </div>
        
        <div className="col-lg-2 col-6 mb-4">
          <h6>Hỗ trợ</h6>
          <ul className="list-unstyled">
            <li><a href="#" className="text-light-emphasis">Trung tâm trợ giúp</a></li>
            <li><a href="#" className="text-light-emphasis">Chính sách đổi trả</a></li>
            <li><a href="#" className="text-light-emphasis">Phương thức thanh toán</a></li>
            <li><a href="#" className="text-light-emphasis">Vận chuyển</a></li>
          </ul>
        </div>
        
        <div className="col-lg-4 mb-4">
          <h6>Liên hệ</h6>
          <p className="mb-2">
            <i className="bi bi-geo-alt me-2"></i>
            123 Đường ABC, Quận 1, TP.HCM
          </p>
          <p className="mb-2">
            <i className="bi bi-telephone me-2"></i>
            1900 1234
          </p>
          <p className="mb-2">
            <i className="bi bi-envelope me-2"></i>
            support@arico.com
          </p>
          
          <div className="mt-3">
            <h6>Đăng ký nhận tin</h6>
            <div className="input-group">
              <input 
                type="email" 
                className="form-control"
                placeholder="Email của bạn..."
              />
              <button className="btn btn-brand" type="button">
                <i className="bi bi-send"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <hr className="my-4" />
      
      <div className="row align-items-center">
        <div className="col-md-6">
          <p className="mb-0">
            © 2024 ARICO Store. All rights reserved.
          </p>
        </div>
        <div className="col-md-6 text-md-end">
          <span className="text-muted small">
            Made with ❤️ using React & Bootstrap
          </span>
        </div>
      </div>
    </div>
  </footer>
);

// Hero Section Component
const HeroSection = () => (
  <div className="hero-section">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <h1 className="hero-title">
            Chào mừng đến với
            <span className="text-warning"> ARICO Store</span>
          </h1>
          <p className="hero-subtitle">
            Khám phá hàng ngàn sản phẩm chất lượng cao với giá tốt nhất. 
            Trải nghiệm mua sắm hiện đại, giao hàng nhanh chóng.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <a href="#catalog" className="btn btn-light btn-lg">
              <i className="bi bi-shop me-2"></i>
              Khám phá ngay
            </a>
            <a href="#about" className="btn btn-outline-light btn-lg">
              <i className="bi bi-info-circle me-2"></i>
              Tìm hiểu thêm
            </a>
          </div>
        </div>
        <div className="col-lg-6 text-center">
          <img
            src="https://picsum.photos/600/400?random=hero"
            alt="ARICO Store Hero"
            className="img-fluid rounded-3 shadow-lg"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  </div>
);

// Home Page Component
const HomePage = ({ cart, onProductView }) => {
  const featuredProducts = useMemo(() => 
    window.PRODUCTS.filter(p => p.discountPercent > 0).slice(0, 8)
  , []);

  const newProducts = useMemo(() => 
    window.PRODUCTS.slice(-4)
  , []);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Featured Products */}
      <section className="container py-5">
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="display-6 fw-bold text-brand">
              <i className="bi bi-fire me-2"></i>
              Sản phẩm nổi bật
            </h2>
            <p className="text-muted">Những sản phẩm đang được giảm giá sốc</p>
          </div>
        </div>
        
        <div className="row">
          {featuredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={cart.addToCart}
              onViewDetails={onProductView}
            />
          ))}
        </div>
        
        <div className="text-center mt-4">
          <a href="#catalog" className="btn btn-brand-outline btn-lg">
            <i className="bi bi-grid me-2"></i>
            Xem tất cả sản phẩm
          </a>
        </div>
      </section>
      
      {/* New Products */}
      <section className="bg-light py-5">
        <div className="container">
          <div className="row mb-4">
            <div className="col-12 text-center">
              <h2 className="display-6 fw-bold text-brand">
                <i className="bi bi-stars me-2"></i>
                Sản phẩm mới
              </h2>
              <p className="text-muted">Những sản phẩm vừa được cập nhật</p>
            </div>
          </div>
          
          <div className="row">
            {newProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={cart.addToCart}
                onViewDetails={onProductView}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="container py-5">
        <div className="row text-center">
          <div className="col-6 col-lg-3 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-box-seam display-4 text-brand mb-3"></i>
                <h4 className="card-title">{window.PRODUCTS.length}+</h4>
                <p className="card-text text-muted">Sản phẩm</p>
              </div>
            </div>
          </div>
          
          <div className="col-6 col-lg-3 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-truck display-4 text-success mb-3"></i>
                <h4 className="card-title">24h</h4>
                <p className="card-text text-muted">Giao hàng</p>
              </div>
            </div>
          </div>
          
          <div className="col-6 col-lg-3 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-shield-check display-4 text-warning mb-3"></i>
                <h4 className="card-title">100%</h4>
                <p className="card-text text-muted">Bảo hành</p>
              </div>
            </div>
          </div>
          
          <div className="col-6 col-lg-3 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <i className="bi bi-headset display-4 text-danger mb-3"></i>
                <h4 className="card-title">24/7</h4>
                <p className="card-text text-muted">Hỗ trợ</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

// Catalog Page Component
const CatalogPage = ({ cart, onProductView }) => {
  const [filteredProducts, setFilteredProducts] = useState(window.PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50000000 });
  const [sortBy, setSortBy] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = useMemo(() => window.ProductUtils.getCategories(), []);

  // Apply filters effect
  useEffect(() => {
    setLoading(true);
    
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      let result = window.PRODUCTS;

      // Search filter
      if (searchQuery.trim()) {
        result = window.ProductUtils.searchProducts(searchQuery.trim());
      }

      // Category filter
      if (selectedCategory) {
        result = result.filter(product => product.category === selectedCategory);
      }

      // Price range filter
      result = window.ProductUtils.filterProductsByPrice(result, priceRange.min, priceRange.max);

      // Sort
      if (sortBy) {
        result = window.ProductUtils.sortProducts(result, sortBy);
      }

      setFilteredProducts(result);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setPriceRange({ min: 0, max: 50000000 });
    setSortBy('');
  };

  return (
    <div className="container py-4 fade-in">
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#home">Trang chủ</a>
              </li>
              <li className="breadcrumb-item active">
                Sản phẩm
              </li>
            </ol>
          </nav>
          
          <h1 className="display-6 fw-bold text-brand mb-2">
            <i className="bi bi-grid me-2"></i>
            Danh mục sản phẩm
          </h1>
          <p className="text-muted">
            Tìm thấy {filteredProducts.length} sản phẩm
            {selectedCategory && ` trong danh mục "${selectedCategory}"`}
            {searchQuery && ` cho từ khóa "${searchQuery}"`}
          </p>
        </div>
      </div>

      <div className="row">
        {/* Filters Sidebar */}
        <div className="col-lg-3 col-xl-2 mb-4">
          <Filters
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearFilters={handleClearFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="col-lg-9 col-xl-10">
          {loading ? (
            <div className="row">
              {[...Array(8)].map((_, index) => (
                <div key={index} className="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
                  <div className="card h-100">
                    <div className="card-img-top bg-light" style={{height: '250px'}}>
                      <LoadingSpinner size="sm" text="" />
                    </div>
                    <div className="card-body">
                      <div className="placeholder-glow">
                        <span className="placeholder col-8"></span>
                        <span className="placeholder col-6"></span>
                        <span className="placeholder col-4"></span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="row">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={cart.addToCart}
                  onViewDetails={onProductView}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-search display-1 text-muted mb-4"></i>
              <h4>Không tìm thấy sản phẩm</h4>
              <p className="text-muted mb-4">
                Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
              </p>
              <button 
                className="btn btn-brand"
                onClick={handleClearFilters}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>
                Xóa bộ lọc
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Checkout Page Component
const CheckoutPage = ({ cart }) => {
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    district: '',
    note: ''
  });
  
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleInputChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!customerInfo.fullName || !customerInfo.phone || !customerInfo.address) {
      showToast('Vui lòng điền đầy đủ thông tin bắt buộc', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate order processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order summary
      const order = {
        id: `ARO${Date.now()}`,
        customerInfo,
        items: cart.cartItems,
        summary: {
          subtotal: cart.subtotal,
          discount: cart.discount,
          shipping: cart.shipping,
          total: cart.total
        },
        paymentMethod,
        appliedCoupon: cart.appliedCoupon,
        createdAt: new Date().toISOString()
      };

      // Save order to localStorage (in real app, send to server)
      const orders = getFromLocalStorage('arico_orders', []);
      orders.push(order);
      setToLocalStorage('arico_orders', orders);

      // Clear cart
      cart.clearCart();
      
      showToast('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.', 'success');
      
      // Redirect to success page or home
      setTimeout(() => {
        window.location.hash = '#order-success';
      }, 2000);
      
    } catch (error) {
      showToast('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.isEmpty) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="bi bi-cart-x display-1 text-muted mb-4"></i>
          <h3>Giỏ hàng trống</h3>
          <p className="text-muted mb-4">
            Bạn cần thêm sản phẩm vào giỏ hàng trước khi thanh toán
          </p>
          <a href="#catalog" className="btn btn-brand">
            <i className="bi bi-arrow-left me-2"></i>
            Tiếp tục mua sắm
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 fade-in">
      <div className="row mb-4">
        <div className="col-12">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="#home">Trang chủ</a>
              </li>
              <li className="breadcrumb-item">
                <a href="#catalog">Sản phẩm</a>
              </li>
              <li className="breadcrumb-item active">
                Thanh toán
              </li>
            </ol>
          </nav>
          
          <h1 className="display-6 fw-bold text-brand mb-2">
            <i className="bi bi-credit-card me-2"></i>
            Thanh toán đơn hàng
          </h1>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row">
          {/* Customer Information */}
          <div className="col-lg-8">
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-brand text-white">
                <h5 className="mb-0">
                  <i className="bi bi-person me-2"></i>
                  Thông tin khách hàng
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Họ và tên <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={customerInfo.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Nhập họ và tên"
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Số điện thoại <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      value={customerInfo.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="Nhập số điện thoại"
                      required
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      value={customerInfo.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Nhập email (tùy chọn)"
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">
                      Địa chỉ <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      value={customerInfo.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Số nhà, tên đường"
                      required
                    />
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Thành phố</label>
                    <select
                      className="form-select"
                      value={customerInfo.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                    >
                      <option value="">Chọn thành phố</option>
                      <option value="ho-chi-minh">TP. Hồ Chí Minh</option>
                      <option value="ha-noi">Hà Nội</option>
                      <option value="da-nang">Đà Nẵng</option>
                      <option value="hai-phong">Hải Phòng</option>
                      <option value="can-tho">Cần Thơ</option>
                    </select>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Quận/Huyện</label>
                    <input
                      type="text"
                      className="form-control"
                      value={customerInfo.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="Nhập quận/huyện"
                    />
                  </div>
                  
                  <div className="col-12 mb-3">
                    <label className="form-label">Ghi chú đơn hàng</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={customerInfo.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      placeholder="Ghi chú cho người giao hàng (tùy chọn)"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="card shadow-sm mb-4">
              <div className="card-header bg-brand text-white">
                <h5 className="mb-0">
                  <i className="bi bi-wallet2 me-2"></i>
                  Phương thức thanh toán
                </h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="cod"
                        value="cod"
                        checked={paymentMethod === 'cod'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="cod">
                        <i className="bi bi-cash me-2"></i>
                        Thanh toán khi nhận hàng (COD)
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="bank-transfer"
                        value="bank-transfer"
                        checked={paymentMethod === 'bank-transfer'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="bank-transfer">
                        <i className="bi bi-bank me-2"></i>
                        Chuyển khoản ngân hàng
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="momo"
                        value="momo"
                        checked={paymentMethod === 'momo'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="momo">
                        <i className="bi bi-phone me-2"></i>
                        Ví MoMo
                      </label>
                    </div>
                  </div>
                  
                  <div className="col-md-6 mb-3">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="credit-card"
                        value="credit-card"
                        checked={paymentMethod === 'credit-card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                      />
                      <label className="form-check-label" htmlFor="credit-card">
                        <i className="bi bi-credit-card me-2"></i>
                        Thẻ tín dụng/Ghi nợ
                      </label>
                    </div>
                  </div>
                </div>
                
                {paymentMethod !== 'cod' && (
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Bạn sẽ được chuyển đến trang thanh toán sau khi xác nhận đơn hàng.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-lg-4">
            <div className="card shadow-sm sticky-top" style={{top: '100px'}}>
              <div className="card-header bg-brand text-white">
                <h5 className="mb-0">
                  <i className="bi bi-receipt me-2"></i>
                  Tóm tắt đơn hàng
                </h5>
              </div>
              <div className="card-body">
                {/* Order Items */}
                <div className="mb-3" style={{maxHeight: '300px', overflowY: 'auto'}}>
                  {cart.cartItems.map((item) => (
                    <div key={item.id} className="d-flex align-items-center mb-3 pb-3 border-bottom">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="me-3 rounded"
                        style={{width: '50px', height: '50px', objectFit: 'cover'}}
                      />
                      <div className="flex-grow-1">
                        <h6 className="mb-1 small">{item.name}</h6>
                        <div className="text-muted small">
                          {formatCurrency(item.price)} × {item.quantity}
                        </div>
                      </div>
                      <div className="text-end">
                        <strong className="small">
                          {formatCurrency(item.price * item.quantity)}
                        </strong>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Applied Coupon */}
                {cart.appliedCoupon && (
                  <div className="alert alert-success py-2">
                    <small>
                      <i className="bi bi-tag-fill me-1"></i>
                      Mã giảm giá: <strong>{cart.appliedCoupon.code}</strong>
                      <br />
                      {cart.appliedCoupon.description}
                    </small>
                  </div>
                )}

                {/* Summary */}
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tạm tính:</span>
                    <span>{formatCurrency(cart.subtotal)}</span>
                  </div>
                  
                  {cart.discount > 0 && (
                    <div className="d-flex justify-content-between text-success mb-2">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(cart.discount)}</span>
                    </div>
                  )}
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span>
                      {cart.shipping === 0 ? (
                        <span className="text-success">Miễn phí</span>
                      ) : (
                        formatCurrency(cart.shipping)
                      )}
                    </span>
                  </div>
                  
                  <hr />
                  
                  <div className="d-flex justify-content-between">
                    <strong>Tổng cộng:</strong>
                    <strong className="text-brand h5">
                      {formatCurrency(cart.total)}
                    </strong>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="btn btn-brand w-100 mb-2"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </span>
                      Đang xử lý...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Xác nhận đặt hàng
                    </>
                  )}
                </button>
                
                <a href="#catalog" className="btn btn-outline-secondary w-100">
                  <i className="bi bi-arrow-left me-2"></i>
                  Tiếp tục mua sắm
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Order Success Page Component
const OrderSuccessPage = () => (
  <div className="container py-5">
    <div className="text-center">
      <div className="mb-4">
        <i className="bi bi-check-circle-fill text-success" style={{fontSize: '4rem'}}></i>
      </div>
      
      <h1 className="display-6 fw-bold text-success mb-3">
        Đặt hàng thành công!
      </h1>
      
      <p className="text-muted mb-4">
        Cảm ơn bạn đã mua hàng tại ARICO Store. 
        Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
      </p>
      
      <div className="d-flex justify-content-center gap-3 flex-wrap">
        <a href="#home" className="btn btn-brand">
          <i className="bi bi-house me-2"></i>
          Về trang chủ
        </a>
        
        <a href="#catalog" className="btn btn-outline-primary">
          <i className="bi bi-shop me-2"></i>
          Tiếp tục mua sắm
        </a>
      </div>
      
      <div className="mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card border-0 bg-light">
              <div className="card-body">
                <h6 className="card-title">
                  <i className="bi bi-info-circle me-2"></i>
                  Thông tin hữu ích
                </h6>
                <ul className="list-unstyled mb-0">
                  <li><i className="bi bi-check me-2 text-success"></i>
                    Đơn hàng sẽ được xử lý trong 24h
                  </li>
                  <li><i className="bi bi-check me-2 text-success"></i>
                    Thời gian giao hàng: 1-3 ngày làm việc
                  </li>
                  <li><i className="bi bi-check me-2 text-success"></i>
                    Bạn có thể theo dõi đơn hàng qua hotline: 1900 1234
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// 404 Page Component
const NotFoundPage = () => (
  <div className="container py-5">
    <div className="text-center">
      <div className="mb-4">
        <i className="bi bi-exclamation-triangle display-1 text-warning"></i>
      </div>
      
      <h1 className="display-6 fw-bold mb-3">
        Trang không tìm thấy
      </h1>
      
      <p className="text-muted mb-4">
        Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
      </p>
      
      <a href="#home" className="btn btn-brand">
        <i className="bi bi-house me-2"></i>
        Về trang chủ
      </a>
    </div>
  </div>
);

// Main App Component
const App = () => {
  const [currentRoute, setCurrentRoute] = useState('home');
  const [showCartDrawer, setShowCartDrawer] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  
  const cart = useCart();

  // Router effect
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || 'home';
      setCurrentRoute(hash);
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle product view
  const handleProductView = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Render current page
  const renderCurrentPage = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage cart={cart} onProductView={handleProductView} />;
      case 'catalog':
        return <CatalogPage cart={cart} onProductView={handleProductView} />;
      case 'checkout':
        return <CheckoutPage cart={cart} />;
      case 'order-success':
        return <OrderSuccessPage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div className="App">
      {/* Skip Link for Accessibility */}
      <a className="skip-link" href="#main-content">
        Bỏ qua đến nội dung chính
      </a>
      
      {/* Header */}
      <Header 
        cart={cart}
        onCartToggle={() => setShowCartDrawer(true)}
        currentRoute={currentRoute}
      />
      
      {/* Main Content */}
      <main id="main-content">
        {renderCurrentPage()}
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Cart Drawer */}
      <CartDrawer
        show={showCartDrawer}
        onHide={() => setShowCartDrawer(false)}
        cart={cart}
      />
      
      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        show={showProductModal}
        onHide={() => setShowProductModal(false)}
        onAddToCart={cart.addToCart}
      />
    </div>
  );
};

// ====== APP INITIALIZATION ======

// Wait for DOM and dependencies to load
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement && window.React && window.ReactDOM && window.PRODUCTS) {
    // Create React root and render app
    const root = ReactDOM.createRoot(rootElement);
    root.render(React.createElement(App));
    
    console.log('🚀 ARICO Store loaded successfully!');
    console.log(`📦 ${window.PRODUCTS.length} products available`);
  } else {
    console.error('❌ Failed to initialize ARICO Store - missing dependencies');
  }
});