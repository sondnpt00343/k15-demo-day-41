/**
 * FILE: utils/httpRequest.js
 * 
 * Đây là file tạo axios instance đã được cấu hình sẵn cho toàn bộ ứng dụng.
 * Axios instance giúp tái sử dụng cấu hình (baseURL, interceptors...) cho tất cả API calls.
 * 
 * AXIOS INSTANCE LÀ GÌ?
 * - Axios instance là một axios object đã được cấu hình sẵn
 * - Thay vì cấu hình mỗi lần gọi API, cấu hình một lần và dùng lại
 * - Giúp code DRY (Don't Repeat Yourself) và nhất quán
 * 
 * TẠI SAO CẦN AXIOS INSTANCE?
 * - Tất cả API calls đều dùng chung baseURL
 * - Có thể thêm interceptors để xử lý chung (authentication, error handling...)
 * - Dễ maintain: đổi baseURL chỉ cần sửa ở đây
 * - Có thể thêm headers, timeout, và các cấu hình khác
 * 
 * INTERCEPTOR LÀ GÌ?
 * - Interceptor là function chạy trước/sau mỗi request/response
 * - Request interceptor: chạy trước khi gửi request (thêm token, log...)
 * - Response interceptor: chạy sau khi nhận response (xử lý data, error...)
 * - Giúp xử lý logic chung mà không cần lặp lại ở mỗi API call
 */

// Import axios - thư viện HTTP client phổ biến cho JavaScript
// Axios giúp gọi API dễ dàng hơn so với fetch API
import axios from "axios";

/**
 * TẠO AXIOS INSTANCE
 * 
 * axios.create() tạo một axios instance mới với cấu hình riêng
 * Instance này độc lập với axios mặc định, có thể cấu hình riêng
 * 
 * baseURL: "https://api01.f8team.dev/api"
 *   - URL gốc cho tất cả API calls
 *   - Khi gọi httpRequest.get("/products"), URL đầy đủ sẽ là:
 *     baseURL + "/products" = "https://api01.f8team.dev/api/products"
 *   - LỢI ÍCH: Không cần viết full URL mỗi lần, chỉ cần viết path
 *   - Dễ đổi môi trường: dev/staging/production chỉ cần đổi baseURL
 */
const httpRequest = axios.create({
    baseURL: "https://api01.f8team.dev/api",
});

/**
 * RESPONSE INTERCEPTOR
 * 
 * interceptors.response.use() thêm interceptor cho response
 * Interceptor này chạy sau khi nhận response từ server
 * 
 * CÁCH HOẠT ĐỘNG:
 * - Khi API trả về response, interceptor này được gọi
 * - Nhận vào response object từ axios (có cấu trúc: { data: {...}, status, headers... })
 * - Axios tự động unwrap response.data từ HTTP response
 * - API endpoint cũng trả về { data: {...} } trong body
 * - Nên cấu trúc thực tế là: response.data.data
 * - Interceptor này trả về response.data.data để loại bỏ lớp "data" thừa
 * 
 * TẠI SAO TRẢ VỀ response.data.data?
 * - Axios tự động unwrap HTTP response body vào response.data
 * - API endpoint trả về { data: {...} } trong body
 * - Nên thực tế phải truy cập response.data.data để lấy data thực sự
 * - Interceptor xử lý để code chỉ cần viết response.data thay vì response.data.data
 * - Giúp response structure khớp với API endpoint (như khi test trực tiếp API)
 * 
 * VÍ DỤ:
 * - API endpoint trả về: { data: { items: [...] } }
 * - Axios nhận được: { data: { data: { items: [...] } }, status: 200, ... }
 * - Trước interceptor: const response = await httpRequest.get("/products")
 *                     const products = response.data.data.items  // Phải viết data.data
 * - Sau interceptor:  const response = await httpRequest.get("/products")
 *                     const products = response.data.items  // Chỉ cần data.items
 * 
 * LỢI ÍCH:
 * - Code ngắn gọn: không cần viết response.data.data.items
 * - Response structure khớp với API endpoint (như test trực tiếp)
 * - Nhất quán trong toàn bộ ứng dụng
 * - Có thể thêm logic xử lý error ở đây
 */
httpRequest.interceptors.response.use((response) => {
    // Axios tự động unwrap HTTP response body vào response.data
    // API endpoint trả về { data: {...} } trong body
    // Nên cấu trúc thực tế là: response.data.data
    // Trả về response.data để code chỉ cần viết response.data thay vì response.data.data
    // Giúp response structure khớp với API endpoint (như khi test trực tiếp API)
    return response.data;
});

// Export axios instance để các service files import và sử dụng
export default httpRequest;
