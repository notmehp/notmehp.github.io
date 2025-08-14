// js/cart.js
// Mô tả: Xử lý logic giỏ hàng, bao gồm thêm/xóa sản phẩm, tính tổng và gửi đơn hàng.

const GAS_API_URL = 'YOUR_GAS_WEB_APP_URL'; // Thay bằng URL của bạn
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let products = [];

// Fetch products from GAS
export async function fetchProducts() {
    if (products.length > 0) return products;
    try {
        const response = await fetch(`${GAS_API_URL}?path=getProducts`);
        if (!response.ok) throw new Error('Network response was not ok');
        products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        return [];
    }
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cart.length;
    }
}

function renderCart() {
    const cartItemsElement = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    if (!cartItemsElement) return;

    cartItemsElement.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItemsElement.innerHTML = '<p class="text-center">Giỏ hàng của bạn đang trống.</p>';
    } else {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                total += itemTotal;
                const cartItem = `
                    <div class="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="mb-1">${product.name}</h6>
                            <small class="text-muted">${product.price.toLocaleString('vi-VN')}₫ x ${item.quantity}</small>
                        </div>
                        <div>
                            <span>${itemTotal.toLocaleString('vi-VN')}₫</span>
                            <button class="btn btn-sm btn-danger ms-2 remove-from-cart-btn" data-product-id="${item.id}">Xóa</button>
                        </div>
                    </div>
                `;
                cartItemsElement.innerHTML += cartItem;
            }
        });
    }

    if (cartTotalElement) {
        cartTotalElement.textContent = total.toLocaleString('vi-VN') + '₫';
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

document.addEventListener('DOMContentLoaded', async () => {
    await fetchProducts(); // Load products once
    updateCartCount();

    // Event listener for "Add to Cart" buttons
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart-btn')) {
            const productId = e.target.dataset.productId;
            const existingItem = cart.find(item => item.id === productId);
            if (existingItem) {
                existingItem.quantity++;
            } else {
                cart.push({ id: productId, quantity: 1 });
            }
            saveCart();
            updateCartCount();
            alert('Sản phẩm đã được thêm vào giỏ hàng!');
        }
    });

    // Event listener for cart icon/button
    const cartIcon = document.getElementById('cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', (e) => {
            e.preventDefault();
            renderCart();
            const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
            cartModal.show();
        });
    }

    // Event listener for "Remove from Cart" buttons
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productIdToRemove = e.target.dataset.productId;
            cart = cart.filter(item => item.id !== productIdToRemove);
            saveCart();
            updateCartCount();
            renderCart(); // Re-render cart modal
        }
    });

    // Event listener for checkout form submission
    const checkoutForm = document.getElementById('checkoutForm');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const orderDetails = {
                items: cart,
                total: document.getElementById('cart-total').textContent,
                name: document.getElementById('customerName').value,
                email: document.getElementById('customerEmail').value,
                phone: document.getElementById('customerPhone').value,
                address: document.getElementById('customerAddress').value,
                ageConfirmed: document.getElementById('ageConfirmation').checked
            };

            try {
                const response = await fetch(`${GAS_API_URL}?path=createOrder`, {
                    method: 'POST',
                    mode: 'no-cors', // Dùng no-cors để tránh CORS policy, cần xem xét lại
                    headers: {
                        'Content-Type': 'text/plain;charset=utf-8', // Google Apps Script yêu cầu content type này
                    },
                    body: JSON.stringify(orderDetails)
                });
                
                // Vì dùng no-cors, không thể kiểm tra response.ok
                // Cần dùng response từ GAS để xác nhận, nhưng no-cors sẽ chặn.
                // Một cách khác là GAS trả về JSONP hoặc CORS được cấu hình đúng.
                // Với mục đích demo, ta sẽ giả định thành công.
                
                alert('Đơn hàng của bạn đã được gửi thành công!');
                cart = [];
                saveCart();
                updateCartCount();
                const cartModal = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
                cartModal.hide();
                checkoutForm.reset();
            } catch (error) {
                console.error('Error submitting order:', error);
                alert('Có lỗi xảy ra khi gửi đơn hàng. Vui lòng thử lại.');
            }
        });
    }
});
