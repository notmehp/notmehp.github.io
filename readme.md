# Ứng dụng web Thương mại điện tử 18+ với GitHub Pages & Google Sheets

Dự án này là một ứng dụng web thương mại điện tử tĩnh, được triển khai trên **GitHub Pages** (HTML/CSS/JS thuần). Nó sử dụng **Google Sheets** làm cơ sở dữ liệu và **Google Apps Script (GAS)** làm backend API để quản lý các chức năng động như:
* Lưu đơn hàng
* Hiển thị danh sách sản phẩm
* Quản lý đơn hàng (admin panel)
* Hiển thị blog

## ⚠️ Cảnh báo pháp lý & Nội dung 18+

Ứng dụng này được thiết kế để xử lý các sản phẩm và nội dung dành cho người trên 18 tuổi. Người triển khai ứng dụng này phải tuân thủ mọi luật pháp và quy định hiện hành liên quan đến việc bán và phân phối các mặt hàng này tại khu vực của họ.

**Miễn trừ trách nhiệm:** Dự án này chỉ nhằm mục đích giáo dục và demo kỹ thuật. Chúng tôi không chịu trách nhiệm về bất kỳ việc sử dụng nào của ứng dụng này cho mục đích thương mại hoặc bất hợp pháp.

## Hướng dẫn triển khai chi tiết

Thực hiện theo các bước sau để khởi chạy ứng dụng của bạn.

### Bước 1: Thiết lập kho lưu trữ GitHub (GitHub Repository)

1.  Tạo một kho lưu trữ (repository) công khai mới trên GitHub.
2.  Tải toàn bộ mã nguồn frontend (các file `index.html`, `product.html`, thư mục `css`, `js`, `assets`, etc.) lên kho lưu trữ này.
3.  Sử dụng các lệnh Git cơ bản:
    ```bash
    git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
    cd your-repo-name
    # Copy all files into this folder
    git add .
    git commit -m "Initial commit for e-commerce site"
    git push -u origin main
    ```

### Bước 2: Kích hoạt GitHub Pages

1.  Trên GitHub, vào **Settings** của kho lưu trữ.
2.  Chọn **Pages** từ thanh bên.
3.  Trong phần **Source**, chọn nhánh `main` và thư mục `/ (root)`.
4.  Nhấn **Save**. GitHub Pages sẽ bắt đầu xây dựng và cung cấp trang web của bạn.
5.  Bạn sẽ thấy URL của trang web, ví dụ: `https://your-username.github.io/your-repo-name/`.

**Cấu hình Custom Domain (VD: `https://www.aricovn.com`)**

1.  Tạo một file tên là `CNAME` (không có đuôi) trong thư mục gốc của dự án.
2.  Nội dung file `CNAME` chỉ chứa tên miền của bạn: `www.aricovn.com`.
3.  Thêm và đẩy file này lên GitHub.
4.  Tại nhà cung cấp tên miền của bạn (ví dụ: GoDaddy, Namecheap), tạo các bản ghi DNS sau:
    * **ALIAS/ANAME** hoặc **A Record** trỏ đến địa chỉ IP của GitHub Pages. Bạn có thể tìm thấy các địa chỉ IP này trong tài liệu của GitHub. Ví dụ: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`.
    * **CNAME Record** cho `www.aricovn.com` trỏ tới `your-username.github.io`.
5.  Sau khi cấu hình, quay lại phần **Pages** trong GitHub Settings và bật **Enforce HTTPS**.

### Bước 3: Thiết lập Google Sheets và Apps Script (Backend API)

1.  Tạo một Google Sheet mới.
2.  Tạo ba sheet với tên chính xác: `Products`, `Orders`, `Posts`.
3.  Trong mỗi sheet, đặt các tiêu đề cột như sau:
    * **Products**: `id`, `name`, `description`, `price`, `imageUrl`, `category`
    * **Orders**: `orderId`, `createdAt`, `items`, `total`, `name`, `email`, `phone`, `address`, `status`, `ageConfirmed`
    * **Posts**: `postId`, `title`, `content`, `createdAt`
4.  Vào **Extensions** -> **Apps Script** để tạo một dự án mới.
5.  Sao chép và dán toàn bộ mã từ file `Code.gs` được cung cấp ở trên.
6.  **Thay thế `YOUR_GOOGLE_SHEET_ID`** bằng ID của Google Sheet của bạn (chuỗi trong URL của Sheet, ví dụ: `1aBcD...`).
7.  Trong Apps Script, vào **Project settings** (biểu tượng bánh răng) -> **Script properties**.
8.  Thêm một thuộc tính mới:
    * `ADMIN_TOKEN`: `một-chuỗi-mạnh-bí-mật-của-bạn` (ví dụ: `gT7jK9pL2qR5sT8yU3vW6xZ`)
    * **Lưu ý:** TOKEN này chỉ được lưu trong Script Properties và **KHÔNG** được commit vào git.
9.  **Triển khai Web App:**
    * Click vào **Deploy** -> **New deployment**.
    * Chọn loại là **Web app**.
    * **Execute as:** `Me`
    * **Who has access:** `Anyone, even anonymous` (cho frontend truy cập)
    * Nhấn **Deploy**. Google sẽ yêu cầu bạn cấp quyền truy cập vào Google Sheet.
10. Sau khi triển khai, bạn sẽ nhận được một **Web app URL**. Sao chép URL này.
11. Thay thế `YOUR_GAS_WEB_APP_URL` trong các file `js/app.js`, `js/cart.js`, và `js/admin.js` bằng URL vừa copy.

### Bước 4: Test chức năng End-to-End

1.  **Tạo sản phẩm demo:** Thêm một vài dòng dữ liệu vào sheet `Products`.
2.  **Thử đặt hàng:** Truy cập trang web của bạn, xác nhận tuổi, thêm sản phẩm vào giỏ hàng và gửi đơn.
3.  **Kiểm tra đơn hàng:** Mở Google Sheet `Orders` và kiểm tra xem đơn hàng mới đã được thêm chưa.
4.  **Quản trị đơn hàng:** Truy cập trang `admin.html`, đăng nhập bằng `ADMIN_TOKEN` của bạn. Xem danh sách đơn hàng và thử cập nhật trạng thái. Kiểm tra lại trong Google Sheet để đảm bảo thay đổi đã được ghi nhận.

---

### `assets/` placeholder

* **assets/logo.png**: Placeholder logo.
* **assets/favicon.ico**: Placeholder favicon.

Bạn có thể thay thế các tệp này bằng logo và favicon của riêng mình.

---

### `.well-known/security.txt` (khuyến nghị)

Tạo file `.well-known/security.txt` trong thư mục gốc của dự án với nội dung sau:
