/**
 * FILE: vite.config.js
 * 
 * Đây là file cấu hình cho Vite - công cụ build và dev server cho React.
 * Vite giúp phát triển ứng dụng nhanh hơn với Hot Module Replacement (HMR).
 * 
 * TẠI SAO CẦN FILE NÀY?
 * - Cấu hình cách Vite xử lý và build project
 * - Thiết lập alias (tên viết tắt) cho đường dẫn import
 * - Cấu hình các plugin cần thiết cho React
 */

/* eslint-disable no-undef */
// Tắt cảnh báo eslint về biến global (như __dirname)

// Import defineConfig từ Vite - function để định nghĩa cấu hình
import { defineConfig } from "vite";

// Import plugin React cho Vite - plugin này cho phép Vite hiểu và xử lý file .jsx
// @vitejs/plugin-react-swc sử dụng SWC (Speedy Web Compiler) để compile nhanh hơn
import react from "@vitejs/plugin-react-swc";

// Import path module từ Node.js - dùng để xử lý đường dẫn file
import path from "path";

// https://vite.dev/config/
/**
 * EXPORT CẤU HÌNH VITE
 * 
 * defineConfig() - function định nghĩa cấu hình Vite
 * 
 * plugins: [react()]
 *   - Khai báo các plugin cần sử dụng
 *   - Plugin react() cho phép Vite compile JSX và hỗ trợ React Fast Refresh
 *   - Fast Refresh: khi sửa code, chỉ component đó được reload, không mất state
 * 
 * resolve.alias
 *   - Định nghĩa các alias (tên viết tắt) cho đường dẫn import
 *   - "@": path.resolve(__dirname, "src")
 *     + "@" sẽ trỏ đến thư mục "src"
 *     + Thay vì viết: import App from "../../../App"
 *     + Có thể viết: import App from "@/App"
 *   - LỢI ÍCH:
 *     + Code ngắn gọn, dễ đọc hơn
 *     + Không cần đếm "../" khi import
 *     + Dễ refactor khi di chuyển file
 *     + Tránh lỗi đường dẫn khi thay đổi cấu trúc thư mục
 */
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
});
