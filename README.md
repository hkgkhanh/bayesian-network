# bayesian-network
Đồ án môn Project 1 (GVHD: Vũ Thị Hương Giang)
Tính toán xác suất có điều kiện trong mạng Bayes

Hướng dẫn sử dụng
-----------------

Việc xây dựng và tính toán xác suất có điều kiện trong mạng Bayes được chia thành 3 bước:

#### Bước 1: Xây dựng mạng Bayes

Ứng dụng web cho phép người dùng khai báo các thông tin của Node, bao gồm:

*   **Tên Node**
*   **Các trạng thái có thể có của Node** (người dùng nhập vào các trạng thái ngăn cách nhau bởi dấu phẩy, các khoảng trắng và tab ở đầu và cuối mỗi trạng thái nếu có sẽ được tự động loại bỏ)
*   **Node tĩnh hay động** (Trạng thái hiện tại của Node có phụ thuộc vào trạng thái trước đó của chính nó hay không)
*   **Các Node cha của Node** (những Node mà trạng thái của chúng ảnh hưởng đến trạng thái của Node)

Mỗi Node được tạo sẽ được hiển thị trên canvas, người dùng có thể kéo thả để mạng dễ nhìn hơn và có thể sửa lại thông tin của từng Node bằng cách click vào Node đó.

#### Bước 2: Nhập dữ liệu

Sau khi đã định nghĩa xong mạng Bayes, người dùng click vào nút Nhập dữ liệu. Tại đây người dùng tải lên file .csv, với dòng đầu tiên là tên các Node (không cần theo một thứ tự nhất định), các dòng tiếp theo là trạng thái của từng Node tương ứng.

2 trường hợp báo lỗi:

*   Có tên Node tồn tại trong dữ liệu không tồn tại trong mạng Bayes đã định nghĩa.
*   Có trạng thái của Node trong dữ liệu không tồn tại trong danh sách các trạng thái đã được định nghĩa của Node đó.

#### Bước 3: Tính toán các bảng phân phối xác suất có điều kiện và xác suất cho một sự kiện cụ thể

Sau khi đã nhập dữ liệu hợp lệ, người dùng click Xác nhận và hệ thống tự động tính toán các bảng phân phối xác suất có điều kiện (Conditional Probabilities Distribution table). Ngoài ra, người dùng có thể tùy chọn tính xác suất của một trạng thái của Node biết trạng thái của các Node cha của nó.