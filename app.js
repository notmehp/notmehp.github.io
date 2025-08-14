// js/app.js
// Mô tả: Xử lý logic chung cho trang chủ và sản phẩm, bao gồm age gate và giao tiếp với Google Apps Script API.
import { fetchProducts } from './cart.js'; // Import function to fetch products

const GAS_API_URL = 'YOUR_GAS_WEB_APP_URL'; // Thay bằng URL của bạn

document.addEventListener('DOMContentLoaded', () => {
    // Age Gate Logic
    const hasConfirmedAge = localStorage.getItem('ageConfirmed');
    if (!hasConfirmedAge && window.location.pathname.endsWith('index.html')) {
        const ageGateModal = new bootstrap.Modal(document.getElementById('ageGateModal'));
        ageGateModal.show();

        document.getElementById('ageGateForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const birthYear = document.getElementById('birthYearInput').value;
            const currentYear = new Date().getFullYear();
            if (currentYear - birthYear >= 18) {
                localStorage.setItem('ageConfirmed', 'true');
                ageGateModal.hide();
                document.getElementById('mainContent').classList.remove('d-none');
                loadContent(); // Tải nội dung sau khi xác nhận tuổi
            } else {
                alert('Bạn chưa đủ 18 tuổi. Không thể truy cập.');
                window.location.href = 'https://www.google.com'; // Redirect
            }
        });
    } else if (hasConfirmedAge) {
        if (document.getElementById('mainContent')) {
            document.getElementById('mainContent').classList.remove('d-none');
            loadContent(); // Tải nội dung nếu đã xác nhận tuổi
        }
    } else if (!hasConfirmedAge && !window.location.pathname.endsWith('index.html')) {
        // Redirect if not on index.html and age not confirmed
        alert('Vui lòng xác nhận tuổi trên trang chủ.');
        window.location.href = 'index.html';
    }

    // Function to load products (for index and product pages)
    async function loadContent() {
        if (document.getElementById('featured-products-list')) {
            const products = await fetchProducts();
            const featuredProducts = products.slice(0, 3); // Lấy 3 sản phẩm nổi bật
            renderProducts(featuredProducts, 'featured-products-list');
        }

        if (document.getElementById('product-list')) {
            const products = await fetchProducts();
            renderProducts(products, 'product-list');

            // Handle product search and filter
            document.getElementById('searchForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                const searchTerm = document.getElementById('searchInput').value.toLowerCase();
                const allProducts = await fetchProducts();
                const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(searchTerm));
                renderProducts(filteredProducts, 'product-list');
            });
        }
    }

    // Function to render products
    function renderProducts(products, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        products.forEach(product => {
            const productCard = `
                <div class="col">
                    <div class="card h-100">
                        <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">${product.description.substring(0, 50)}...</p>
                            <span class="badge bg-danger">18+</span>
                        </div>
                        <div class="card-footer d-flex justify-content-between align-items-center">
                            <span class="fs-5 text-primary fw-bold">${product.price.toLocaleString('vi-VN')}₫</span>
                            <button class="btn btn-sm btn-primary add-to-cart-btn" data-product-id="${product.id}">Thêm vào giỏ</button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productCard;
        });
    }
});
