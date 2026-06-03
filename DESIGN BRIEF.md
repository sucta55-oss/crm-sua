# **BẢN YÊU CẦU THIẾT KẾ ĐỒ HỌA (DESIGN BRIEF) \- HỆ THỐNG CRM SỮA VĨNH HƯNG**

## **1\. Định hướng phong cách thiết kế tổng thể (Design Direction)**

Giao diện hệ thống CRM của Công ty Sữa Vĩnh Hưng được định hướng theo phong cách **Tối giản hiện đại (Minimalism)** kết hợp xu hướng **Kính mờ kỹ thuật số (Glassmorphism nhẹ)**. Thiết kế này loại bỏ hoàn toàn các chi tiết trang trí thừa, tập trung vào việc xử lý bố cục đổ bóng và sử dụng độ mờ đục để tạo ra các lớp không gian chiều sâu, giúp người quản lý nhìn rõ số liệu và ra quyết định kinh doanh nhanh chóng mà không bị rối mắt.

### **1.1. Nguyên tắc cốt lõi của phong cách thiết kế**

* **Tối giản và Tinh khiết:** Giao diện sử dụng các đường nét mảnh, dứt khoát. Các khu vực bao bọc dữ liệu sử dụng màu nền đồng nhất hoặc đổ bóng đổ rất nhẹ thay vì kẻ khung viền thô cứng.  
* **Hiệu ứng kính mờ nhẹ (Subtle Glassmorphism):** Áp dụng độ mờ đục vừa phải kết hợp bộ lọc làm nhòe nền sau cho thanh công cụ điều hướng và các cửa sổ bật lên, tạo cảm giác bề mặt mịn màng như những tấm kính mờ cao cấp.  
* **Nhiều khoảng trắng (Generous White Space):** Khoảng cách giữa các khối thông tin, các dòng trong bảng dữ liệu được mở rộng tối đa. Khoảng trắng này đóng vai trò điều hướng thị giác, giúp người đọc không bị ngợp trước các số liệu tài chính lớn của ngành sữa.  
* **Chữ viết hiện đại:** Sử dụng các phông chữ có nét mảnh, thanh lịch, ưu tiên độ dày phông chữ ở mức mỏng hoặc vừa để làm nổi bật tính công nghệ và sự tinh tế.

## **2\. Hệ thống màu sắc quy chuẩn (Color Palette)**

Hệ thống màu sắc được lấy cảm hứng trọn vẹn từ các sản phẩm sữa tự nhiên (trắng kem, be ấm) kết hợp với một màu nhấn duy nhất để điều hướng hành động của người dùng.

┌────────────────────────────────────────────────────────────────────────┐  
│                                                                        │  
│  MÀU NỀN SÁNG TỐI GIẢN (90% Diện tích hiển thị)                        │  
│                                                                        │  
│  \[Trắng Sữa Nguyên Chất\]   \[Be Ấm Kem Sữa\]     \[Xám Tro Mịn\]           │  
│  \#FDFDFB                  \#F7F5F0             \#EFEFEA                 │  
│                                                                        │  
├────────────────────────────────────────────────────────────────────────┤  
│                                                                        │  
│  MÀU CHỮ & ĐƯỜNG NÉT (Thanh lịch, rõ ràng)                            │  
│                                                                        │  
│  \[Đen Than Sẫm\]           \[Xám Khói Mờ\]                               │  
│  \#1A1A17                  \#7C7C75                                     │  
│                                                                        │  
├────────────────────────────────────────────────────────────────────────┤  
│                                                                        │  
│  MÀU NHẤN CHÍNH (1% Tổng thể \- Dùng cho Nút bấm chính & Mục đang chọn) │  
│                                                                        │  
│  \[Xanh Lá Đồng Cỏ Vĩnh Hưng\]                                          │  
│  \#1E5E3A                                                              |  
│                                                                        │  
└────────────────────────────────────────────────────────────────────────┘

### **2.1. Chi tiết mã màu và mục đích áp dụng**

* **Màu nền chính (Primary Background):** \#FDFDFB (Trắng sữa nguyên chất). Đây là màu nền chủ đạo cho toàn bộ ứng dụng, mang lại cảm giác sạch sẽ, cao cấp và tràn ngập ánh sáng.  
* **Màu nền phụ (Secondary Background):** \#F7F5F0 (Be ấm kem sữa). Dùng cho khu vực menu điều hướng bên cạnh hoặc nền của các thẻ thông tin, tạo sự phân lớp không gian nhẹ nhàng.  
* **Màu phân cách lớp (Layer Border/Shadow Color):** \#EFEFEA (Xám tro mịn). Dùng để làm màu nền cho các cột trong bảng tiến độ Kanban hoặc đổ bóng mờ cho các thành phần giao diện.  
* **Màu chữ chính (Primary Text):** \#1A1A17 (Đen than sẫm). Đạt độ tương phản tuyệt đối trên nền trắng kem, đảm bảo nhân viên đi thị trường nhìn rõ thông tin dưới mọi điều kiện ánh sáng.  
* **Màu chữ phụ (Secondary Text):** \#7C7C75 (Xám khói mờ). Dùng cho các thông tin phụ như ngày tháng, ghi chú nhỏ, mã định danh hóa đơn.  
* **Màu nhấn duy nhất (Single Accent Color):** \#1E5E3A (Xanh lá đồng cỏ Vĩnh Hưng). Dùng cực kỳ tiết kiệm, chỉ xuất hiện ở các vị trí có tính chất kích thích hành động như nút Lưu dữ liệu, nút Thêm khách hàng, hoặc thanh vạch dấu chỉ vị trí trang người dùng đang xem.

## **3\. Hệ thống chữ viết (Typography)**

Hệ thống chữ viết sử dụng bộ phông chữ quốc tế **Inter** hoặc **Roboto** dạng không chân (Sans-serif) để đảm bảo tính hiển thị hoàn hảo trên cả máy tính văn phòng và thiết bị di động của nhân viên đi thị trường.

* **Tiêu đề trang lớn (H1 \- Ví dụ: Tên khu vực chức năng):**  
  * Kích thước: 24px  
  * Độ dày nét chữ: Mỏng (Light \- 300\) hoặc Vừa (Regular \- 400\)  
  * Khoảng cách giãn chữ: \+0.5px  
  * Màu sắc: Đen than sẫm (\#1A1A17)  
* **Tiêu đề khối thông tin (H2 \- Ví dụ: Tên thẻ khách hàng, Tiêu đề cột):**  
  * Kích thước: 18px  
  * Độ dày nét chữ: Vừa (Regular \- 400\) hoặc Thơi đậm (Medium \- 500\)  
  * Màu sắc: Đen than sẫm (\#1A1A17)  
* **Chữ nội dung bảng biểu và văn bản thường (Body Text):**  
  * Kích thước: 14px  
  * Độ dày nét chữ: Mỏng (Light \- 300\) hoặc Vừa (Regular \- 400\)  
  * Khoảng cách dòng: 1.6 (Tạo khoảng trống lớn giữa các dòng chữ để người đọc không mỏi mắt)  
  * Màu sắc: Đen than sẫm (\#1A1A17) cho thông tin chính và Xám khói mờ (\#7C7C75) cho thông tin phụ.

## **4\. Định hình kiểu dáng cấu trúc thành phần (Component Style)**

Mọi thành phần trong CRM Sữa Vĩnh Hưng đều tuân thủ nguyên tắc bo tròn góc mượt mà, đổ bóng mịn diện rộng để mô phỏng một thực thể vật lý cao cấp trôi nổi nhẹ nhàng trên nền trắng kem.

### **4.1. Thanh menu điều hướng bên cạnh (Sidebar)**

* Kiểu dáng: Chiều rộng cố định 260px. Sử dụng màu nền Be ấm kem sữa (\#F7F5F0).  
* Hiệu ứng: Áp dụng vệt mờ nhẹ che phủ nền sau khi cuộn trang.  
* Trạng thái đang chọn: Mục thực đơn đang được chọn sẽ không dùng mảng màu đậm bao bọc, mà chỉ hiển thị một vạch dọc mảnh màu Xanh lá đồng cỏ (\#1E5E3A) dày 3px ở cạnh trái, chữ chuyển sang màu Đen than sẫm. Các mục chưa chọn có chữ màu Xám khói mờ.

### **4.2. Thẻ thông tin tổng hợp (Card)**

* Kiểu dáng: Nền màu Trắng sữa nguyên chất (\#FDFDFB). Các góc được bo tròn mềm mại với bán kính góc bo là 12px.  
* Đổ bóng: Sử dụng bóng đổ siêu mờ và mịn diện rộng (Bóng đổ: trục dọc hạ xuống 4px, độ nhòe bóng 20px, màu bóng là màu xám tro mịn với độ trong suốt 30%). Không kẻ đường viền xung quanh thẻ.

### **4.3. Thẻ tiến độ trên bảng Kanban (Kanban Card)**

* Kiểu dáng: Nền màu Trắng sữa nguyên chất (\#FDFDFB), bo góc 8px.  
* Bố cục bên trong: Tên đại lý nằm trên cùng bằng chữ Vừa 14px, số tiền dự kiến nằm góc dưới bên phải bằng chữ đậm nét hơn một chút. Gần cạnh dưới có một nhãn chữ mỏng ghi tên loại sữa quan tâm. Khoảng cách lề trong thẻ rộng 16px tạo sự thoáng đãng.

### **4.4. Nút bấm hành động (Button)**

* **Nút bấm chính (Primary Button \- Ví dụ: Thêm khách hàng, Lưu dữ liệu):** Sử dụng toàn bộ mảng màu Xanh lá đồng cỏ Vĩnh Hưng (\#1E5E3A), chữ bên trong màu trắng hoàn toàn, bo góc 6px. Khi di chuột qua, nút tăng nhẹ độ mờ đục hoặc đổ bóng sâu hơn một chút, tuyệt đối không đổi màu khác.  
* **Nút bấm phụ (Secondary Button \- Ví dụ: Hủy bỏ, Xuất file):** Nền màu Trắng sữa nguyên chất, đường viền cực mảnh màu Xám tro mịn (\#EFEFEA), chữ màu Đen than sẫm. Tạo cảm giác nút chìm xuống nền.

### **4.5. Ô nhập liệu thông tin (Input Field)**

* Kiểu dáng: Nền màu Trắng sữa nguyên chất, đường viền mảnh 1px màu Xám tro mịn (\#EFEFEA), bo góc 6px. Chiều cao tiêu chuẩn 40px.  
* Trạng thái khi bấm vào gõ chữ (Focus): Đường viền mảnh chuyển sang màu Xanh lá đồng cỏ Vĩnh Hưng (\#1E5E3A). Chữ gợi ý ẩn phía dưới (Placeholder) sử dụng màu Xám khói mờ.

### **4.6. Nhãn phân loại trạng thái (Badge)**

* Kiểu dáng: Thiết kế theo lối tối giản hóa. Nhãn không sử dụng các màu xanh đỏ vàng sặc sỡ phủ kín nền.  
* Cấu trúc nhãn: Nền nhãn có màu xám cực nhạt hoặc trắng kem, chữ bên trong sử dụng màu Xám khói mờ để thể hiện thông tin thông thường. Đối với các trạng thái khẩn cấp như "Quá hạn" hoặc "Thất bại", chữ trên nhãn sẽ đổi sang tông màu sẫm tương ứng (Ví dụ: Chữ đỏ rượu sẫm trên nền hồng pastel cực nhạt), kích thước chữ nhỏ 12px, bo tròn hoàn toàn hai đầu nhãn.

## **5\. Cấu trúc bố cục các khu vực chức năng (Layout Structure)**

### **5.1. Khu vực 1: Tổng quan (Dashboard)**

* **Hàng trên cùng:** Khu vực tiêu đề trang lớn "Tổng quan hệ thống" đặt bên trái; bộ lọc thời gian dạng menu thả gọn gàng đặt bên phải.  
* **Hàng thứ hai:** Khối chỉ số gồm 4 thẻ thông tin dạng chữ nằm ngang (Doanh thu tháng, Số đại lý mới, Số cơ hội đang chạy, Công nợ chờ thu). Mỗi chỉ số là một con số lớn, thanh mảnh, phía dưới là dòng chữ giải thích nhỏ màu xám khói.  
* **Khu vực trung tâm:** Chia làm hai cột không cân xứng với khoảng cách trống lớn giữa hai cột (Cột trái chiếm 65% diện tích hiển thị biểu đồ hình cột về sản lượng Sữa tươi, Sữa chua, Sữa bột; Cột phải chiếm 35% hiển thị danh sách 5 đầu việc khẩn cấp cần làm trong ngày).

### **5.2. Khu vực 2: Cơ hội bán hàng (Kanban Pipeline)**

* **Bố cục chung:** Không gian hiển thị trải rộng theo chiều ngang màn hình, thanh cuộn ngang ẩn mịn.  
* **Cấu trúc cột tiến độ:** Chia làm 5 cột đứng song song với khoảng cách giữa các cột là 16px. Nền của mỗi cột sử dụng màu Be ấm kem sữa (\#F7F5F0) để làm nổi bật các thẻ cơ hội màu trắng nằm phía trên. Tiêu đề cột đặt chữ in hoa nhẹ kèm con số tổng số lượng thẻ ở đầu cột (Ví dụ: TIẾP CẬN (2)).  
* **Hành động tương tác:** Khi dùng chuột kéo thả thẻ khách hàng, các cột còn lại tự động áp dụng hiệu ứng mờ nhẹ để người dùng tập trung vào điểm thả thẻ.

### **5.3. Khu vực 3: Công việc (Tasks)**

* **Thanh công cụ trên cùng:** Chứa bộ lọc trạng thái việc (Chưa làm, Đang làm, Đã xong) và nút bấm chính "Thêm công việc mới" màu xanh lá cây đặt ở góc phải ngoài cùng.  
* **Cấu trúc danh sách đầu việc:** Hiển thị theo dạng các dòng nằm ngang thoáng đãng. Mỗi dòng việc là một khối độc lập, cách nhau 8px. Phía bên trái dòng là ô tích chọn hoàn thành hình tròn mảnh; ở giữa là tên đầu việc và tên khách hàng liên quan; phía bên phải hiển thị hạn chót và nhãn độ ưu tiên công việc.

### **5.4. Khu vực 4: Danh sách khách hàng (Customers)**

* **Khu vực điều khiển nhanh:** Thanh tìm kiếm khách hàng bằng ô nhập liệu mỏng kéo dài; bên cạnh là nút "Tải file lên (Upload CSV)" và nút "Xuất file (Export CSV)" nằm gọn gàng.  
* **Bố cục bảng dữ liệu lớn (Datatable):** Tiêu đề các cột trong bảng dùng chữ màu Xám khói mờ, cố định trên cùng khi cuộn danh sách. Các dòng thông tin khách hàng hiển thị tối giản, phân chia nhãn phân khúc (Đại lý, VIP) và nhãn loại sữa bằng phong cách nhãn chữ mỏng, không kẻ khung ô rườm rà.

### **5.5. Khu vực 5: Thanh toán (Payments)**

* **Bố cục hiển thị:** Dạng bảng danh sách hóa đơn tương tự trang khách hàng nhưng tập trung vào các con số tài chính.  
* **Cấu trúc cột dữ liệu:** Mã số hóa đơn đặt bên trái; số tiền phải thanh toán được căn lề phải rõ ràng bằng phông chữ thanh mảnh; trạng thái tiền nong (Chờ thanh toán, Quá hạn) nằm ở cột ngoài cùng bên phải để người quản lý lướt mắt qua là thấy ngay các khoản nợ cần xử lý.

### **5.6. Khu vực 6: Cài đặt (Settings)**

* **Bố cục chia hai phân vùng rõ rệt:**  
  * Phân vùng trái (chiếm 30%): Danh mục các mục cài đặt nhỏ (Thông tin cá nhân, Quản lý nhân viên, Liên kết tài khoản).  
  * Phân vùng phải (chiếm 70%): Không gian hiển thị form chỉnh sửa chi tiết. Các ô nhập liệu thông tin cá nhân và ô cấu hình phân quyền được xếp hàng dọc ngăn nắp, bao quanh bởi rất nhiều khoảng trống màu trắng tạo sự dễ chịu khi thực hiện các thao tác quản trị hệ thống quan trọng.

## **6\. Kho dữ liệu mẫu chuẩn hóa phục vụ thiết kế (Mockup Data)**

Nhà thiết kế bắt buộc phải sử dụng chính xác hệ thống dữ liệu mẫu mang đậm bối cảnh ngành kinh doanh sữa của công ty Vĩnh Hưng dưới đây vào các bản vẽ thiết kế (Mockup) để ban giám đốc duyệt giao diện một cách thực tế nhất.

### **6.1. Dữ liệu mẫu cho 6 Khách hàng tiềm năng (Màn hình Kanban và Danh sách)**

| Tên người đại diện | Tên Đơn vị / Công ty thật tại Việt Nam | Nhóm khách hàng | Loại sữa quan tâm | Số tiền dự kiến (VND) | Giai đoạn Kanban |
| :---- | :---- | :---- | :---- | :---- | :---- |
| Bà Nguyễn Thục Anh | Chuỗi siêu thị Co.opmart Nguyễn Đình Chiểu | VIP | Sữa tươi, Sữa chua | 120,000,000 | Đàm phán |
| Ông Phạm Minh Tuấn | Công ty Cổ phần Thực phẩm và Nước giải khát Green Foods | VIP | Sữa bột | 350,000,000 | Tiếp cận |
| Bà Lê Thị Mai | Đại lý Sữa và Bỉm Mai Linh (Hà Nội) | Đại lý | Sữa tươi, Sữa bột | 45,000,000 | Tư vấn mẫu thử |
| Ông Hoàng Văn Nam | Nhà phân phối Tiêu dùng nhanh Nam Phát (Hải Phòng) | Đại lý | Sữa chua | 65,000,000 | Đàm phán |
| Bà Vũ Thu Hương | Trường Mầm non Tư thục Bình Minh Montessori | VIP | Sữa tươi | 85,000,000 | Thành công |
| Ông Trần Thanh Hải | Cửa hàng Tạp hóa bình ổn Thanh Hải (Quận 7\) | Khách lẻ | Sữa tươi, Sữa chua | 12,000,000 | Thất bại |

### **6.2. Dữ liệu mẫu cho 5 Công việc thực tế (Màn hình Công việc và Lịch hẹn)**

* **Đầu việc 1:**  
  * Tên công việc: Chuyển giao 3 thùng sữa chua mẫu vị dâu mới cho Đại lý Mai Linh kiểm tra hương vị.  
  * Khách hàng liên quan: Đại lý Sữa và Bỉm Mai Linh.  
  * Độ khẩn cấp (Priority): Cao (High).  
  * Hạn chót hoàn thành (Deadline): 17:00 ngày hôm nay.  
* **Đầu việc 2:**  
  * Tên công việc: Gọi điện thương thảo lại tỷ lệ chiết khấu đơn hàng sữa tươi học đường cho mầm non Bình Minh.  
  * Khách hàng liên quan: Trường Mầm non Tư thục Bình Minh Montessori.  
  * Độ khẩn cấp (Priority): Cao (High).  
  * Hạn chót hoàn thành (Deadline): 11:30 ngày mai.  
* **Đầu việc 3:**  
  * Tên công việc: Kiểm tra thời hạn sử dụng của lô sữa bột tồn kho tại Nhà phân phối Nam Phát.  
  * Khách hàng liên quan: Nhà phân phối Tiêu dùng nhanh Nam Phát.  
  * Độ khẩn cấp (Priority): Trung bình (Medium).  
  * Hạn chót hoàn thành (Deadline): 16:00 ngày mốt.  
* **Đầu việc 4:**  
  * Tên công việc: Gửi email bảng báo giá chi tiết sản phẩm sữa bột nguyên kem cho đối tác Green Foods.  
  * Khách hàng liên quan: Công ty Cổ phần Thực phẩm và Nước giải khát Green Foods.  
  * Độ khẩn cấp (Priority): Thấp (Low).  
  * Hạn chót hoàn thành (Deadline): 17:00 thứ Sáu tuần này.  
* **Đầu việc 5:**  
  * Tên công việc: Gặp trực tiếp đại diện Co.opmart để thu hồi biên bản ký kết hợp đồng phân phối sữa tươi năm 2026\.  
  * Khách hàng liên quan: Chuỗi siêu thị Co.opmart Nguyễn Đình Chiểu.  
  * Độ khẩn cấp (Priority): Cao (High).  
  * Hạn chót hoàn thành (Deadline): 10:00 thứ Hai tuần sau.

### **6.3. Dữ liệu mẫu cho 3 Danh sách khách hàng (Hệ thống phân nhóm hiển thị)**

Nhà thiết kế sử dụng 3 tên danh sách bộ lọc này đặt lên thanh công cụ hoặc tab chuyển đổi nhanh của màn hình quản lý khách hàng để người điều hành ra quyết định lọc tệp nhanh chóng:

* **Danh sách 1:** "Hệ thống Đại lý phân phối miền Bắc" (Gồm tập hợp các cửa hàng tạp hóa, đại lý bán sỉ dòng sản phẩm sữa tươi và sữa chua khu vực phía Bắc).  
* **Danh sách 2:** "Đối tác VIP Học đường và Siêu thị" (Danh sách lưu trữ riêng các tài khoản tổ chức lớn, trường học bán trú nhập sữa tươi hộp khối lượng lớn định kỳ hàng tháng).  
* **Danh sách 3:** "Khách mua lẻ trực tiếp kênh trải nghiệm" (Nhóm lưu thông tin người tiêu dùng nhỏ lẻ mua sữa bột hoặc đăng ký giao sữa định kỳ tại nhà qua hệ thống cửa hàng giới thiệu sản phẩm của Vĩnh Hưng).