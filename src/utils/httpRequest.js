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
 * REQUEST INTERCEPTOR - THÊM TOKEN VÀO MỖI REQUEST
 *
 * CÁCH HOẠT ĐỘNG:
 * - Chạy TRƯỚC khi mỗi request được gửi đi
 * - Tự động lấy accessToken từ localStorage
 * - Thêm token vào header Authorization
 * - Server sẽ dùng token này để xác thực user
 *
 * TƯỞNG TƯỢNG:
 * - Giống như nhân viên bưu điện kiểm tra thư trước khi gửi
 * - Tự động dán tem (token) vào thư nếu có
 * - Không có tem thì vẫn gửi, nhưng có thể bị từ chối ở đích
 *
 * VÍ DỤ:
 * - Ban đầu: config = { url: '/products', method: 'GET' }
 * - Sau interceptor: config = {
 *     url: '/products',
 *     method: 'GET',
 *     headers: { Authorization: 'Bearer abc123xyz' }
 *   }
 */
httpRequest.interceptors.request.use((config) => {
    // Lấy accessToken từ localStorage (nơi lưu trữ token sau khi đăng nhập)
    const accessToken = localStorage.getItem("accessToken");

    // Nếu có token thì thêm vào header Authorization
    // Format: "Bearer <token>" là chuẩn JWT authentication
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    // Trả về config đã được chỉnh sửa để axios gửi request
    return config;
});

/**
 * RESPONSE INTERCEPTOR ĐƠN GIẢN (KHÔNG DÙNG - CHỈ ĐỂ MINH HỌA)
 *
 * Đoạn code này KHÔNG được sử dụng vì:
 * - Nó dùng axios.interceptors thay vì httpRequest.interceptors
 * - Đã có interceptor phức tạp hơn ở dưới để xử lý refresh token
 *
 * MỤC ĐÍCH CỦA ĐOẠN NÀY (nếu dùng):
 * - Unwrap data từ response để code gọn hơn
 * - Thay vì viết response.data.data, chỉ cần response.data
 */
axios.interceptors.response.use((response) => {
    // Axios tự động unwrap HTTP response body vào response.data
    // API endpoint trả về { data: {...} } trong body
    // Nên cấu trúc thực tế là: response.data.data
    // Trả về response.data để code chỉ cần viết response.data thay vì response.data.data
    // Giúp response structure khớp với API endpoint (như khi test trực tiếp API)
    return response.data;
});

/**
 * GIẢI QUYẾT VẤN ĐỀ: REFRESH TOKEN ĐỒNG THỜI
 *
 * CASE 1 - VẤN ĐỀ KHI KHÔNG CÓ QUEUE:
 * Tình huống: 2 API "me" và "devices" gọi cùng lúc khi access token hết hạn
 *
 * Bước 1: Cả 2 đều nhận lỗi 401 (Unauthorized)
 * Bước 2: Cả 2 đều gọi API /auth/refresh-token với cùng refresh_token
 * Bước 3: Request đầu tiên => Thành công, nhận token mới
 *         Request thứ hai => Thất bại 401 (vì refresh_token cũ đã dùng rồi)
 *
 * KẾT QUẢ: 1 request thành công, 1 request thất bại ❌
 *
 * CASE 2 - GIẢI PHÁP VỚI QUEUE:
 * Bước 1: Cả 2 đều nhận lỗi 401
 * Bước 2: Request đầu tiên gọi /auth/refresh-token
 *         Request thứ hai được đưa vào QUEUE (hàng đợi)
 * Bước 3: Request đầu tiên thành công => Lưu token mới
 *         Thông báo cho request trong queue
 * Bước 4: Request trong queue dùng token mới để thử lại
 *
 * KẾT QUẢ: Cả 2 request đều thành công ✅
 */

// BIẾN QUẢN LÝ TRẠNG THÁI REFRESH TOKEN
// isRefreshing: Cờ đánh dấu có đang refresh token không
// - true: Đang gọi API refresh, các request khác phải đợi
// - false: Không refresh, request có thể gọi refresh mới
let isRefreshing = false;

// queueJobs: Mảng chứa các request đang đợi refresh token hoàn thành
// - Mỗi phần tử là object { resolve, reject }
// - resolve: Function gọi khi refresh thành công
// - reject: Function gọi khi refresh thất bại
let queueJobs = [];

/**
 * HÀM GỬI REQUEST REFRESH TOKEN
 *
 * NHIỆM VỤ:
 * - Gọi API /auth/refresh-token để lấy token mới
 * - Lưu access_token và refresh_token mới vào localStorage
 * - Đánh dấu đang refresh (isRefreshing = true)
 *
 * THAM SỐ:
 * @param {Object} config - Cấu hình axios (chứa baseURL)
 * @param {String} refreshToken - Refresh token hiện tại
 *
 * CÁCH HOẠT ĐỘNG:
 * 1. Đánh dấu đang refresh
 * 2. Gọi API refresh với refresh_token cũ
 * 3. Nhận access_token và refresh_token mới
 * 4. Lưu vào localStorage để dùng cho các request sau
 */
async function sendRefreshToken(config, refreshToken) {
    // Đánh dấu đang refresh để các request khác biết phải đợi
    isRefreshing = true;

    // Gọi API refresh token bằng axios thuần (không dùng httpRequest để tránh loop)
    // API này không cần access token, chỉ cần refresh token
    const response = await axios.post(`${config.baseURL}/auth/refresh-token`, {
        refresh_token: refreshToken,
    });

    // Lấy token mới từ response
    const { access_token, refresh_token } = response.data;

    // Lưu token mới vào localStorage
    // Các request sau sẽ tự động dùng token mới nhờ request interceptor
    localStorage.setItem("accessToken", access_token);
    localStorage.setItem("refreshToken", refresh_token);
}

/**
 * RESPONSE INTERCEPTOR CHÍNH - XỬ LÝ LỖI 401 VÀ REFRESH TOKEN
 *
 * INTERCEPTOR CÓ 2 FUNCTION:
 * 1. Function đầu tiên: Xử lý khi response thành công
 * 2. Function thứ hai: Xử lý khi response lỗi
 *
 * CÁCH HOẠT ĐỘNG:
 *
 * TRƯỜNG HỢP 1 - RESPONSE THÀNH CÔNG:
 * - Trả về response.data để unwrap data
 * - Code chỉ cần viết response.data thay vì response.data.data
 *
 * TRƯỜNG HỢP 2 - RESPONSE LỖI 401 (Unauthorized):
 * Step 1: Kiểm tra có lỗi 401 và có refresh token không
 * Step 2a: Nếu ĐANG refresh (isRefreshing = true)
 *          => Đưa request vào queue, đợi refresh xong
 * Step 2b: Nếu CHƯA refresh (isRefreshing = false)
 *          => Gọi sendRefreshToken(), thông báo cho queue
 * Step 3: Sau khi có token mới, retry request ban đầu
 * Step 4: Nếu refresh thất bại => Reject tất cả request trong queue
 *
 * FLOW CHI TIẾT:
 * ┌─────────────────────────────────────────────────────────┐
 * │ Request A gặp lỗi 401                                   │
 * │ isRefreshing = false                                    │
 * │ => Gọi sendRefreshToken()                               │
 * │ => isRefreshing = true                                  │
 * └─────────────────────────────────────────────────────────┘
 *                      ↓
 * ┌─────────────────────────────────────────────────────────┐
 * │ Request B gặp lỗi 401 (cùng lúc với A)                 │
 * │ isRefreshing = true                                     │
 * │ => Tạo Promise đưa vào queueJobs                        │
 * │ => Đợi...                                               │
 * └─────────────────────────────────────────────────────────┘
 *                      ↓
 * ┌─────────────────────────────────────────────────────────┐
 * │ Request A refresh thành công                            │
 * │ => Gọi resolve() cho tất cả job trong queue             │
 * │ => Request B được "đánh thức"                           │
 * │ => Request B retry với token mới                        │
 * └─────────────────────────────────────────────────────────┘
 */
httpRequest.interceptors.response.use(
    // FUNCTION 1: Xử lý response thành công
    (response) => response.data, // Unwrap data như đã giải thích ở trên

    // FUNCTION 2: Xử lý response lỗi
    async (error) => {
        // Lấy refresh token từ localStorage
        const refreshToken = localStorage.getItem("refreshToken");

        // Chỉ xử lý nếu:
        // - Lỗi 401 (Unauthorized - token hết hạn)
        // - Có refresh token (user đã đăng nhập)
        if (error.status === 401 && refreshToken) {
            // Lưu lại config của request bị lỗi để retry sau
            const original = error.config;

            try {
                // TRƯỜNG HỢP 1: CHƯA CÓ AI REFRESH, REQUEST NÀY SẼ REFRESH
                if (!isRefreshing) {
                    // Gọi API refresh token
                    await sendRefreshToken(original, refreshToken);

                    // Refresh thành công => "Đánh thức" tất cả request đang đợi
                    // Gọi resolve() cho từng job trong queue
                    queueJobs.forEach((job) => job.resolve());
                }
                // TRƯỜNG HỢP 2: ĐANG CÓ REQUEST KHÁC REFRESH TOKEN
                else {
                    // Tạo Promise mới và đưa vào queue
                    // Promise này sẽ đợi cho đến khi refresh xong
                    await new Promise((resolve, reject) => {
                        // Đưa resolve và reject vào queue
                        // Khi refresh xong, sẽ gọi resolve() để "đánh thức" Promise này
                        queueJobs.push({ resolve, reject });
                    });
                    // Khi thoát khỏi Promise => refresh đã xong => có token mới
                }

                // Sau khi có token mới (dù đợi hay tự refresh)
                // Retry request ban đầu với token mới
                // httpRequest.request() sẽ tự động thêm token mới vào header
                return await httpRequest.request(original);
            } catch (error) {
                // Nếu refresh thất bại (refresh token cũng hết hạn)
                // Reject tất cả request đang đợi trong queue
                queueJobs.forEach((job) => job.reject());

                // Trả về lỗi để code gọi API xử lý (thường là redirect về trang login)
                return Promise.reject(error);
            }
        }
        // Nếu không phải lỗi 401 hoặc không có refresh token
        // Trả về lỗi như bình thường
        return Promise.reject(error);
    }
);

// Export axios instance để các file khác import và sử dụng
// VD: import httpRequest from './utils/httpRequest'
//     httpRequest.get('/products')
export default httpRequest;
