// js/admin.js
// Mô tả: Xử lý logic đăng nhập admin, hiển thị danh sách và cập nhật đơn hàng.

const GAS_API_URL = 'YOUR_GAS_WEB_APP_URL'; // Thay bằng URL của bạn
let adminToken = '';
let allOrders = [];

document.addEventListener('DOMContentLoaded', () => {
    const adminLoginModal = new bootstrap.Modal(document.getElementById('adminLoginModal'));
    adminLoginModal.show();

    document.getElementById('adminLoginForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const tokenInput = document.getElementById('adminTokenInput').value;
        // Simple token check, in a real app, this would be more secure
        if (tokenInput.length > 0) {
            adminToken = tokenInput;
            adminLoginModal.hide();
            document.getElementById('adminPanelContent').classList.remove('d-none');
            await fetchOrders();
        } else {
            alert('Vui lòng nhập token.');
        }
    });

    // Fetch and render orders
    async function fetchOrders() {
        try {
            const response = await fetch(`${GAS_API_URL}?path=getOrders&token=${adminToken}`);
            if (!response.ok) throw new Error('Invalid token or network error');
            allOrders = await response.json();
            renderOrders(allOrders);
        } catch (error) {
            console.error('Error fetching orders:', error);
            alert('Lỗi: ' + error.message);
        }
    }

    function renderOrders(orders) {
        const tableBody = document.getElementById('orders-table-body');
        tableBody.innerHTML = '';
        orders.forEach(order => {
            const row = `
                <tr>
                    <td>${order.orderId}</td>
                    <td>${new Date(order.createdAt).toLocaleString()}</td>
                    <td>${order.email}</td>
                    <td>${order.total}</td>
                    <td><span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-info view-order-btn" data-order-id="${order.orderId}">Xem</button>
                    </td>
                </tr>
            `;
            tableBody.innerHTML += row;
        });
    }

    function getStatusBadgeClass(status) {
        switch(status) {
            case 'Pending': return 'bg-warning';
            case 'Shipped': return 'bg-primary';
            case 'Delivered': return 'bg-success';
            case 'Cancelled': return 'bg-danger';
            default: return 'bg-secondary';
        }
    }

    // Filter orders by status
    document.getElementById('orderStatusFilter').addEventListener('change', (e) => {
        const status = e.target.value;
        if (status === 'all') {
            renderOrders(allOrders);
        } else {
            const filteredOrders = allOrders.filter(order => order.status === status);
            renderOrders(filteredOrders);
        }
    });

    // View order detail
    document.body.addEventListener('click', (e) => {
        if (e.target.classList.contains('view-order-btn')) {
            const orderId = e.target.dataset.orderId;
            const order = allOrders.find(o => o.orderId === orderId);
            if (order) {
                showOrderDetail(order);
            }
        }
    });

    function showOrderDetail(order) {
        const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
        const detailContent = document.getElementById('order-detail-content');
        detailContent.innerHTML = `
            <p><strong>ID Đơn:</strong> ${order.orderId}</p>
            <p><strong>Ngày tạo:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Khách hàng:</strong> ${order.name} (${order.email})</p>
            <p><strong>Điện thoại:</strong> ${order.phone}</p>
            <p><strong>Địa chỉ:</strong> ${order.address}</p>
            <h6>Sản phẩm:</h6>
            <ul>
                ${JSON.parse(order.items).map(item => `<li>ID: ${item.id} - SL: ${item.quantity}</li>`).join('')}
            </ul>
            <p><strong>Tổng cộng:</strong> ${order.total}</p>
            <p><strong>Trạng thái:</strong> <span class="badge ${getStatusBadgeClass(order.status)}">${order.status}</span></p>
        `;
        document.getElementById('updateOrderId').value = order.orderId;
        document.getElementById('newOrderStatus').value = order.status;
        modal.show();
    }

    // Update order status
    document.getElementById('updateOrderForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const orderId = document.getElementById('updateOrderId').value;
        const newStatus = document.getElementById('newOrderStatus').value;

        try {
            const response = await fetch(`${GAS_API_URL}?path=updateOrder&token=${adminToken}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            const result = await response.json();
            if (result.success) {
                alert('Cập nhật trạng thái đơn hàng thành công!');
                const modal = bootstrap.Modal.getInstance(document.getElementById('orderDetailModal'));
                modal.hide();
                await fetchOrders(); // Reload orders
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error updating order:', error);
            alert('Lỗi khi cập nhật đơn hàng: ' + error.message);
        }
    });

    // Export CSV
    document.getElementById('exportCSV').addEventListener('click', () => {
        if (allOrders.length === 0) {
            alert('Không có dữ liệu để xuất.');
            return;
        }

        const headers = ['orderId', 'createdAt', 'items', 'total', 'name', 'email', 'phone', 'address', 'status', 'ageConfirmed'];
        const csvRows = [
            headers.join(','),
            ...allOrders.map(order =>
                headers.map(header => {
                    const value = order[header];
                    // Handle complex JSON data
                    if (typeof value === 'object' && value !== null) {
                        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
                    }
                    return `"${String(value).replace(/"/g, '""')}"`;
                }).join(',')
            )
        ];
        const csvString = csvRows.join('\n');
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', 'orders.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
});
