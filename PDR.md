# **TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD) \- HỆ THỐNG QUẢN LÝ KHÁCH HÀNG (CRM) CÔNG TY SỮA VĨNH HƯNG**

## **1\. Bối cảnh và mục tiêu sản phẩm**

### **1.1. Bối cảnh của Công ty Sữa Vĩnh Hưng**

Công ty Sữa Vĩnh Hưng là đơn vị sản xuất và phân phối các sản phẩm từ sữa với ba ngành hàng cốt lõi: Sữa tươi, Sữa chua và Sữa bột. Hiện tại, công ty đang vận hành mô hình kinh doanh đa kênh: cung cấp trực tiếp cho người tiêu dùng nhỏ lẻ, phân phối số lượng lớn qua hệ thống Đại lý/Cửa hàng tạp hóa, và cung ứng định kỳ cho nhóm Khách hàng đặc biệt (VIP) như trường học, chuỗi siêu thị, doanh nghiệp.  
Toàn bộ việc lưu trữ dữ liệu đối tác và theo dõi quá trình mua bán hàng trước đây đều thực hiện thủ công qua file bảng tính dùng chung, các ứng dụng trò chuyện hoặc sổ tay riêng của nhân viên kinh doanh. Cách làm này mang lại nhiều bất cập lớn, trực tiếp ảnh hưởng đến hiệu quả vận hành:

* **Thất thoát dữ liệu:** Thông tin khách hàng bị phân tán, không có tính kế thừa công việc khi nhân viên nghỉ việc hoặc chuyển đổi khu vực thị trường.  
* **Mất dấu tiến độ:** Cấp quản lý không nắm được nhân viên đi thị trường đang tiếp cận đại lý mới đến giai đoạn nào, có gặp khó khăn gì không để hỗ trợ kịp thời.  
* **Sai lệch kế hoạch:** Việc tổng hợp nhu cầu mua sắm và mức độ quan tâm của thị trường đối với từng loại sữa (Sữa tươi, Sữa chua, Sữa bột) bị chậm trễ, khiến bộ phận sản xuất tại nhà máy không chủ động được lịch đóng gói và nhập nguyên liệu thô.

### **1.2. Mục tiêu sản phẩm**

Hệ thống quản lý khách hàng (CRM) được xây dựng nhằm giải quyết triệt để các tồn tại trên, hướng tới việc tối ưu hóa quy trình bán hàng và giúp ban giám đốc đưa ra các quyết định kinh doanh chính xác:

* **Lưu trữ tập trung, an toàn:** Gom toàn bộ dữ liệu của Khách lẻ, Đại lý và Khách VIP vào một hệ thống duy nhất, chuẩn bị sẵn sàng hạ tầng để lưu trữ dữ liệu thật lâu dài bằng nền tảng Supabase.  
* **Minh bạch tiến độ bán hàng:** Chuyển đổi cách theo dõi sang dạng bảng công việc trực quan, giúp nhìn rõ hành trình từ lúc tiếp cận một đại lý mới cho đến khi ký hợp đồng giao sữa thành công.  
* **Hỗ trợ ra quyết định nhanh:** Cung cấp các số liệu và biểu đồ hiển thị tức thời về tình hình kinh doanh, doanh thu và xu hướng quan tâm sản phẩm để ban giám đốc điều phối lượng hàng sản xuất tại nhà máy ngay trong ngày.

## **2\. Chân dung người dùng**

Để phần mềm vận hành thực tế hiệu quả, mọi chức năng và giao diện hiển thị được thiết kế dựa trên thói quen làm việc của 3 nhóm nhân sự chính tại Sữa Vĩnh Hưng:

### **2.1. Nhân viên Kinh doanh thị trường (Sales)**

* **Đặc điểm làm việc:** Thường xuyên di chuyển ngoài đường để tìm kiếm các cửa hàng tạp hóa, đại lý sữa mới. Họ cần thao tác rất nhanh trên điện thoại hoặc máy tính bảng, giao diện đơn giản, không tốn thời gian nhập liệu phức tạp.  
* **Mục đích sử dụng:** Thêm nhanh một cửa hàng vừa tiếp cận, chuyển trạng thái khi đại lý đồng ý nhận sữa dùng thử, xem hôm nay có những lịch hẹn chăm sóc hay nhắc nợ nào.  
* **Khó khăn hiện tại:** Cuối ngày mất nhiều thời gian làm báo cáo giấy, hay quên lịch hẹn quay lại đại lý cũ khiến đối thủ cạnh tranh giành mất điểm bán.

### **2.2. Trưởng nhóm Kinh doanh (Manager)**

* **Đặc điểm làm việc:** Quản lý một đội ngũ nhân viên kinh doanh theo khu vực, chịu trách nhiệm về chỉ tiêu doanh số tổng của nhóm và phê duyệt các chính sách chiết khấu, khuyến mãi sữa.  
* **Mục đích sử dụng:** Theo dõi tiến độ công việc của từng nhân viên dưới quyền, xem tỷ lệ tiếp cận đại lý thành công hay thất bại, hỗ trợ nhân viên chốt các hợp đồng phân phối lớn.  
* **Khó khăn hiện tại:** Số liệu từ nhân viên báo lên thường bị chậm hoặc không chính xác, không biết rõ lý do tại sao một đại lý từ chối nhập sữa Vĩnh Hưng.

### **2.3. Ban Giám đốc và Quản trị hệ thống (Admin)**

* **Đặc điểm làm việc:** Làm việc tại văn phòng điều hành, cần cái nhìn toàn cảnh về tình hình kinh doanh của toàn công ty để định hướng sản xuất và bảo mật thông tin ở mức cao nhất.  
* **Mục đích sử dụng:** Xem các biểu đồ doanh thu và cơ cấu sản phẩm được ưa chuộng, cấp tài khoản và phân chia quyền hạn làm việc cho các nhân viên mới.  
* **Khó khăn hiện tại:** Thiếu báo cáo tổng hợp tức thời để điều tiết lượng sữa tươi, sữa chua sản xuất trong ngày; lo ngại nhân viên tự ý mang danh sách đại lý sang công ty khác khi nghỉ việc.

## **3\. Danh sách các khu vực chức năng (Modules)**

Giao diện hệ thống được chia thành 6 khu vực chức năng rõ ràng, hiển thị nhất quán trên thanh công cụ điều hướng bên cạnh màn hình để người dùng dễ dàng chuyển đổi:

| Tên Khu vực | Chức năng cốt lõi | Ý nghĩa đối với việc ra quyết định |
| :---- | :---- | :---- |
| **1\. Tổng quan** | Hiển thị các bảng số liệu tổng hợp và biểu đồ trực quan về doanh thu, nhóm khách hàng và loại sữa được quan tâm. | Giúp Ban Giám đốc nhìn nhanh tình hình tài chính và sức tiêu thụ để điều phối lịch sản xuất của nhà máy sữa. |
| **2\. Cơ hội bán hàng** | Giao diện bảng tiến độ kéo thả để theo dõi các bước làm việc với một đối tác (từ lúc tiếp cận đến lúc ký hợp đồng). | Giúp Trưởng nhóm đánh giá được hiệu suất làm việc của nhân viên và dự báo doanh số thực tế của tuần tiếp theo. |
| **3\. Công việc** | Quản lý danh sách các đầu việc cần thực hiện (gọi điện, đi gặp khách, giao sữa mẫu, nhắc nợ tiền sữa). | Giúp kiểm soát tần suất chăm sóc khách hàng của nhân viên, đảm bảo không bỏ sót các đại lý cốt lõi. |
| **4\. Danh sách khách hàng** | Nơi lưu trữ thông tin chi tiết của đối tác; phân chia nhóm khách; gắn loại sữa họ muốn mua; xuất nhập file dữ liệu. | Bảo mật toàn bộ tài sản thông tin của công ty, phục vụ việc phân tích thói quen tiêu dùng theo phân khúc. |
| **5\. Thanh toán** | Theo dõi các hóa đơn giao sữa, số tiền đã thu, số tiền còn nợ và tình trạng nợ của từng đại lý. | Giúp kiểm soát dòng tiền mặt, phát hiện sớm các đại lý nợ quá hạn để tạm dừng giao các lô hàng sữa mới. |
| **6\. Cài đặt** | Nơi chỉnh sửa thông tin cá nhân, phân chia quyền hạn cho nhân viên và cấu hình các phương thức vào hệ thống. | Đảm bảo an toàn thông tin, phân định rõ ràng trách nhiệm làm việc của từng cấp bậc nhân sự. |

## **4\. Quy trình xử lý của người dùng (User Flow)**

### **4.1. Quy trình Đăng nhập và Tự động liên kết tài khoản**

Đây là quy trình bắt buộc hoàn thiện ở giai đoạn 1, giúp hệ thống luôn nhận diện đúng một người dùng duy nhất dù họ vào phần mềm bằng nhiều cách khác nhau, không tạo ra các tài khoản trùng lặp làm sai lệch dữ liệu nhân sự.

* **Bước 1:** Người dùng truy cập vào phần mềm CRM Sữa Vĩnh Hưng. Màn hình hiển thị hai lựa chọn song song: Gõ Email \+ Mật khẩu hoặc Bấm nút "Đăng nhập bằng tài khoản Google".  
* **Bước 2:** Người dùng lựa chọn một trong hai phương thức để vào hệ thống.  
* **Bước 3:** Hệ thống tiếp nhận thông tin và kiểm tra địa chỉ Email trên kho lưu trữ dữ liệu tập trung:  
  * *Nếu Email chưa tồn tại:* Hệ thống tạo một hồ sơ nhân viên mới, gán vào nhóm quyền mặc định là Nhân viên Kinh doanh (Sales) và cho phép đăng nhập.  
  * *Nếu Email đã tồn tại (Ví dụ: Tài khoản được tạo trước đó bằng mật khẩu, nay người dùng chọn bấm nút Google với cùng Email này):* Hệ thống sẽ tự động gộp chung hai cách đăng nhập này vào hồ sơ cũ duy nhất. Không sinh ra tài khoản mới, giữ nguyên mã định danh cũ của người dùng.  
* **Bước 4:** Hệ thống giữ nguyên vẹn chức vụ, vai trò và quyền truy cập dữ liệu đã phân chia trước đó của người này (ví dụ: đang là Trưởng nhóm thì vẫn giữ quyền xem dữ liệu của Trưởng nhóm), tiến hành điều hướng người dùng vào màn hình Tổng quan.

### **4.2. Quy trình làm việc với một Cơ hội bán hàng mới**

* **Bước 1:** Nhân viên kinh doanh đi thị trường tìm được một cửa hàng tạp hóa muốn nhập sữa. Nhân viên mở phần mềm, vào khu vực Danh sách khách hàng để thêm thông tin cửa hàng này.  
* **Bước 2:** Nhân viên vào khu vực Cơ hội bán hàng, tạo một đợt bán hàng mới gắn liền với cửa hàng đó. Đợt bán hàng này tự động xuất hiện ở cột đầu tiên là "Tiếp cận".  
* **Bước 3:** Nhân viên mang các lốc sữa chua uống và sữa tươi đến cho chủ đại lý dùng thử để đánh giá hương vị. Nhân viên dùng chuột giữ và kéo thẻ thông tin của đại lý này sang cột thứ hai là "Tư vấn mẫu thử".  
* **Bước 4:** Nhân viên đàm phán với chủ đại lý về tỷ lệ chiết khấu thương mại và số lượng thùng sữa tối thiểu phải nhập mỗi tuần. Nhân viên kéo thẻ thông tin sang cột "Đàm phán".  
* **Bước 5:** Kết thúc quá trình thương lượng:  
  * *Nếu thành công:* Nhân viên kéo thẻ vào cột "Thành công". Hệ thống tự động chuyển nhóm của cửa hàng này thành "Đại lý" và báo cho bộ phận kế toán tạo đơn hàng giao sữa.  
  * *Nếu thất bại:* Nhân viên kéo thẻ vào cột "Thất bại". Một cửa sổ nhỏ hiện lên bắt buộc nhân viên phải bấm chọn một lý do thất bại (Ví dụ: Chê giá cao, hoặc Không thích vị sữa chua nha đam) mới cho phép lưu lại trạng thái.

## **5\. Danh sách các trường thông tin chính (Data Fields)**

Để phục vụ cho việc lưu trữ dữ liệu thật bằng nền tảng Supabase, cấu trúc dữ liệu của các bảng thông tin cốt lõi được quy định rõ ràng bằng ngôn từ phổ thông dưới đây:

### **5.1. Bảng thông tin Nhân viên (Người dùng hệ thống)**

Lưu trữ thông tin của toàn bộ cán bộ công nhân viên được quyền vào phần mềm CRM.

* **Mã định danh nhân viên:** Chuỗi ký tự số và chữ duy nhất do hệ thống tự sinh ra để phân biệt từng người.  
* **Địa chỉ Email:** Địa chỉ thư điện tử cá nhân hoặc công ty cấp (Dùng làm tên đăng nhập).  
* **Họ và tên:** Tên đầy đủ của nhân viên.  
* **Chức vụ hệ thống:** Quyền hạn của người này trên phần mềm, chia làm 3 lớp bắt buộc (Admin, Trưởng nhóm, Sales).  
* **Các phương thức đăng nhập đã dùng:** Ghi lại danh sách các cách người này đã bấm vào hệ thống (Mật khẩu hoặc Google) để phục vụ việc gộp tài khoản.  
* **Ngày tạo tài khoản:** Ngày nhân viên bắt đầu được cấp quyền vào phần mềm.

### **5.2. Bảng thông tin Khách hàng**

Lưu trữ toàn bộ thông tin của đối tác, đại lý và người tiêu dùng sản phẩm sữa Vĩnh Hưng.

* **Mã khách hàng:** Chuỗi ký tự riêng biệt để quản lý từng khách hàng.  
* **Tên khách hàng:** Tên của Đại lý, Tên trường học, Tên công ty hoặc Tên khách mua lẻ.  
* **Người liên hệ trực tiếp:** Tên chủ cửa hàng tạp hóa hoặc người đại diện mua hàng (Rất quan trọng với nhóm Đại lý và VIP).  
* **Số điện thoại:** Số điện thoại dùng để liên hệ giao sữa, nhắc lịch đặt hàng hoặc thu hồi nợ tiền sữa.  
* **Địa chỉ:** Địa chỉ giao hàng cụ thể để nhân viên thị trường đến chăm sóc định kỳ.  
* **Nhóm khách hàng (Phân khúc):** Được phân chia rõ ràng thành 3 nhóm bắt buộc: Khách lẻ, Đại lý, VIP.  
* **Loại sữa quan tâm:** Ghi nhận loại mặt hàng khách muốn mua, cho phép chọn một hoặc nhiều loại cùng lúc: Sữa tươi, Sữa chua, Sữa bột.  
* **Nhân viên phụ trách:** Tên của nhân viên kinh doanh được giao chịu trách nhiệm chăm sóc khách hàng này.

### **5.3. Bảng thông tin Tiến độ bán hàng (Cơ hội bán hàng)**

Theo dõi quá trình mời chào và đàm phán hợp đồng cung cấp sữa với các đối tác.

* **Mã hồ sơ bán hàng:** Ký tự riêng để quản lý từng vụ mua bán.  
* **Khách hàng liên quan:** Tên đối tác mua sữa lấy dữ liệu kết nối từ bảng thông tin khách hàng.  
* **Tên đợt bán hàng:** Tiêu đề công việc (Ví dụ: Cung cấp sữa tươi cho trường mầm non Hoa Hồng đợt hè).  
* **Giai đoạn tiến độ:** Vị trí của thẻ thông tin trên bảng kéo thả (Tiếp cận, Tư vấn mẫu thử, Đàm phán, Thành công, Thất bại).  
* **Số tiền dự kiến:** Giá trị ước tính bằng tiền của đơn hàng sữa này nếu chốt hợp đồng thành công.  
* **Lý do thất bại:** Ghi chú lý do tại sao khách không mua sữa của Vĩnh Hưng nữa (Chỉ bắt buộc điền khi tiến độ ở mức Thất bại).

### **5.4. Bảng thông tin Đầu việc (Công việc)**

Lịch làm việc và nhắc nhở các hành động cụ thể của từng nhân viên.

* **Mã đầu việc:** Ký tự phân biệt từng đầu việc được tạo ra.  
* **Tên đầu việc:** Tên hành động cụ thể (Ví dụ: Mang sữa chua mẫu vị mới qua đại lý Bình Minh, Gọi điện nhắc lịch đặt sữa bột).  
* **Nội dung chi tiết:** Mô tả kỹ hơn về các yêu cầu cụ thể của công việc cần làm.  
* **Khách hàng liên quan:** Tên khách hàng hoặc đại lý cần đến gặp hoặc cần gọi điện chăm sóc.  
* **Người thực hiện:** Tên nhân viên kinh doanh được giao việc.  
* **Hạn chót hoàn thành:** Ngày và giờ bắt buộc nhân viên phải làm xong công việc này.  
* **Trạng thái việc:** Tình trạng thực hiện công việc (Chưa hoàn thành, Đang làm, Đã hoàn thành).

### **5.5. Bảng thông tin Thanh toán và Hóa đơn**

Theo dõi tiền nong, doanh thu và tình trạng nợ tiền sữa của các đại lý.

* **Mã hóa đơn:** Mã số riêng biệt của từng đơn hàng sữa xuất kho.  
* **Khách hàng thanh toán:** Tên đại lý hoặc đối tác VIP nhập hàng.  
* **Số tiền trên hóa đơn:** Tổng số tiền bằng Việt Nam Đồng khách phải trả cho lô hàng sữa đó.  
* **Cách thức trả tiền:** Khách lựa chọn trả bằng Chuyển khoản hoặc Tiền mặt.  
* **Tình trạng tiền nong:** Được phân chia rõ ràng thành 4 trạng thái bắt buộc: Chờ thanh toán, Đã thanh toán một phần, Đã thanh toán, Quá hạn.  
* **Ngày trả tiền:** Ngày thực tế bộ phận kế toán xác nhận đã nhận được tiền từ khách hàng.

## **6\. Quy tắc phân quyền 3 lớp bắt buộc**

Để đảm bảo an toàn tuyệt đối cho tệp khách hàng của công ty Sữa Vĩnh Hưng, hệ thống áp dụng quy tắc phân chia quyền hạn xem và chỉnh sửa dữ liệu thành 3 lớp riêng biệt. Quyền hạn này gắn liền với từng nhân sự cụ thể, không bị thay đổi hay ảnh hưởng dù người dùng đổi cách đăng nhập bằng mật khẩu hay bằng tài khoản Google.

### **6.1. Lớp quyền hạn Nhân viên Kinh doanh (Sales)**

Đây là lớp quyền hạn cơ bản dành cho đội ngũ nhân viên đi thị trường hàng ngày:

* **Quyền xem dữ liệu:** Chỉ được quyền xem danh sách khách hàng, các công việc và các hóa đơn do chính mình tạo ra hoặc được cấp trên giao cho mình phụ trách chăm sóc. Tuyệt đối không nhìn thấy khách hàng của đồng nghiệp khác để tránh tình trạng tranh chấp địa bàn bán hàng.  
* **Quyền chỉnh sửa:** Được phép thêm mới khách hàng, cập nhật tiến độ kéo thả trên bảng bán hàng, tự tạo công việc cá nhân.  
* **Quyền xóa và xuất dữ liệu:** Tuyệt đối không được quyền xóa hồ sơ khách hàng khỏi hệ thống. Không được quyền xuất danh sách khách hàng ra file máy tính cá nhân để tránh việc mang dữ liệu công ty ra ngoài.

### **6.2. Lớp quyền hạn Trưởng nhóm Kinh doanh (Manager)**

Đây là lớp quyền quản lý tầm trung dành cho các giám sát khu vực hoặc trưởng bộ phận kinh doanh:

* **Quyền xem dữ liệu:** Được xem toàn bộ thông tin khách hàng, tiến độ bán hàng, công việc và hóa đơn thanh toán của tất cả các nhân viên thuộc nhóm do mình quản lý. Xem được biểu đồ báo cáo kết quả tổng hợp của cả nhóm.  
* **Quyền chỉnh sửa:** Được quyền chuyển giao một đại lý từ nhân viên A sang cho nhân viên B chăm sóc nếu có sự thay đổi nhân sự. Được quyền phê duyệt các mức chiết khấu sữa trong phạm vi quyền hạn được cấp.  
* **Quyền xóa và xuất dữ liệu:** Được quyền xuất dữ liệu khách hàng thuộc nhóm mình quản lý ra file máy tính phục vụ cho việc làm báo cáo định kỳ. Không được quyền xóa vĩnh viễn hồ sơ khách hàng khỏi phần mềm.

### **6.3. Lớp quyền hạn Ban Giám đốc và Quản trị viên (Admin)**

Đây là lớp quyền hạn tối cao kiểm soát toàn bộ hệ thống phần mềm của Sữa Vĩnh Hưng:

* **Quyền xem dữ liệu:** Xem được toàn bộ dữ liệu kinh doanh, công nợ, tiến độ bán hàng của toàn công ty không bị giới hạn bởi khu vực địa lý hay phòng ban. Xem toàn bộ các biểu đồ doanh thu tổng thể của cả ba ngành hàng sữa tươi, sữa chua, sữa bột.  
* **Quyền chỉnh sửa:** Tạo tài khoản mới cho nhân viên mới vào làm, thay đổi chức vụ của nhân viên từ Nhân viên lên Trưởng nhóm, thay đổi cấu hình chung của phần mềm.  
* **Quyền xóa và xuất dữ liệu:** Là lớp quyền duy nhất có quyền xóa hồ sơ khách hàng khi cần thiết và có quyền xuất toàn bộ dữ liệu khách hàng của toàn công ty ra file bất kỳ lúc nào để lưu trữ nội bộ.

## **7\. Yêu cầu giao diện và phong cách thiết kế**

Thiết kế giao diện của phần mềm CRM Sữa Vĩnh Hưng tập trung tối đa vào sự rõ ràng, dễ hiểu, giúp những người không am hiểu về máy tính cũng có thể sử dụng thành thạo ngay lập tức, hỗ trợ việc nhìn số liệu và ra quyết định cực nhanh.

### **7.1. Bảng màu sắc quy chuẩn**

* **Màu sắc chủ đạo:** Sử dụng màu Xanh lá cây tự nhiên làm màu sắc chính cho các nút bấm hành động quan trọng (như nút Thêm mới, nút Lưu), các menu đang chọn và các tiêu đề lớn. Màu xanh này thể hiện tinh thần của ngành sữa sạch, nguồn dinh dưỡng tự nhiên và cam kết chất lượng của Vĩnh Hưng.  
* **Màu sắc bổ trợ:** Sử dụng màu Trắng sữa và Xám nhạt làm nền cho toàn bộ giao diện phần mềm. Nền trắng kết hợp với chữ màu đen giúp thông tin hiển thị vô cùng nổi bật. Nhân viên đi ngoài đường nắng hoặc làm việc văn phòng ban đêm đều đọc rõ chữ mà không bị mỏi mắt.  
* **Màu sắc hiển thị trạng thái:**  
  * Màu đỏ: Dành cho các cảnh báo nghiêm trọng, hóa đơn tiền sữa đã "Quá hạn", hoặc đợt bán hàng bị "Thất bại".  
  * Màu vàng cam: Dành cho các trạng thái đang chờ xử lý như "Chờ thanh toán", đợt bán hàng "Đang đàm phán".  
  * Màu xanh lục: Dành cho các trạng thái hoàn thành tốt như hóa đơn "Đã thanh toán" hoặc bán hàng "Thành công".

### **7.2. Bố cục hiển thị và Chữ viết giúp ra quyết định nhanh**

* **Cấu trúc màn hình ổn định:** Menu điều hướng chứa 6 khu vực chức năng (Tổng quan, Cơ hội bán hàng, Công việc, Danh sách khách hàng, Thanh toán, Cài đặt) được đặt cố định thành một hàng dọc ở cạnh trái màn hình. Khi bấm vào mục nào, nội dung chi tiết hiển thị ở không gian lớn bên phải, giúp người dùng không bị lẫn lộn giữa các khu vực.  
* **Chữ viết to rõ, không dùng ký hiệu viết tắt:** Toàn bộ chữ viết dùng phông chữ phổ thông, nét chữ dày dặn, rõ ràng. Kích thước chữ được thiết kế lớn hơn thông thường để các chủ đại lý tạp hóa lớn tuổi khi nhìn vào màn hình của nhân viên vẫn đọc được chính xác các số liệu.  
* **Bảng dữ liệu thông minh:** Các bảng danh sách khách hàng và hóa đơn có đường kẻ phân chia các dòng rõ ràng. Khi người dùng di chuyển con trỏ chuột đến dòng nào, dòng đó tự động đổi màu nền nhẹ để người dùng không nhìn lệch dòng. Tiêu đề của bảng luôn cố định ở trên đầu khi cuộn trang xuống dưới.

## **8\. Yêu cầu kỹ thuật mức cao**

Phần mềm được xây dựng trên nền tảng công nghệ hiện đại nhưng được tối ưu hóa để chạy nhẹ nhàng, mượt mà trên cả máy tính văn phòng lẫn điện thoại di động thông thường.

### **8.1. Khả năng vận hành và An toàn dữ liệu**

* **Tốc độ hiển thị tức thì:** Các thao tác bấm chuyển đổi giữa các khu vực chức năng hoặc tải file dữ liệu lên hệ thống phải diễn ra nhanh chóng, thời gian chờ không quá 2 giây để nhân viên không bị ức chế khi làm việc ngoài thị trường.  
* **Chạy tốt trên mọi thiết bị:** Phần mềm chạy trực tiếp trên các trình duyệt web phổ biến như Google Chrome, Safari, Microsoft Edge mà không cần cài đặt ứng dụng phức tạp. Giao diện tự động co giãn vừa vặn khi mở bằng máy tính bàn lẫn màn hình điện thoại di động.  
* **Lưu trữ dữ liệu thật an toàn:** Sử dụng nền tảng lưu trữ tập trung Supabase để ghi nhận toàn bộ thông tin khách hàng, hóa đơn tiền sữa và lịch sử làm việc của nhân viên. Hệ thống tự động sao lưu dữ liệu mỗi ngày để đề phòng mọi sự cố mất mát thông tin.

### **8.2. Kiến trúc gộp tài khoản thông minh**

Để giải quyết triệt để yêu cầu không tạo trùng hồ sơ người dùng khi đăng nhập bằng nhiều cách khác nhau, hệ thống tự động vận hành bộ quy tắc kiểm tra ngầm từ phía kho lưu trữ dữ liệu:

* Mỗi khi có thao tác bấm "Đăng nhập bằng tài khoản Google", phần mềm sẽ lấy địa chỉ Email của tài khoản Google đó đối chiếu với danh sách Email nhân viên hiện có trong hệ thống.  
* Nếu tìm thấy một Email hoàn toàn trùng khớp, phần mềm sẽ chặn hành động tạo tài khoản mới, giữ nguyên mã định danh cũ duy nhất, đồng thời cho phép người dùng vào làm việc với đúng chức vụ (Admin, Trưởng nhóm hoặc Sales) và đúng quyền hạn xem dữ liệu được cấp từ trước.

## **9\. Chi tiết tính năng Giai đoạn 1 bắt buộc và Tiêu chí nghiệm thu**

Giai đoạn 1 là giai đoạn nền móng, tập trung hoàn thiện các tính năng cốt lõi nhất để ban giám đốc kiểm tra chất lượng, nghiệm thu sản phẩm và đưa vào sử dụng ngay cho công ty Sữa Vĩnh Hưng.

### **9.1. Danh sách tính năng Giai đoạn 1 bắt buộc**

#### **Chức năng Xác thực tài khoản toàn diện**

* **Tính năng 1: Đăng ký và Đăng nhập bằng Email \+ Mật khẩu:** Cho phép nhân viên tự tạo tài khoản bằng email hoặc được Admin cấp tài khoản để đăng nhập theo cách truyền thống bằng cách gõ mật khẩu.  
* **Tính năng 2: Đăng nhập bằng tài khoản Google (Google OAuth):** Cho phép bấm một chạm để đăng nhập nhanh bằng tài khoản Google cá nhân hoặc công việc mà không cần gõ mật khẩu hệ thống.  
* **Tính năng 3: Quên mật khẩu và đặt lại mật khẩu:** Khi nhân viên quên mật khẩu đăng nhập bằng email, họ có thể bấm nút "Quên mật khẩu", hệ thống sẽ tự động gửi một liên kết xác minh về email cá nhân để họ tự điền mật khẩu mới một cách an toàn.  
* **Tính năng 4: Tự động gộp tài khoản tránh trùng lặp:** Đảm bảo một nhân viên dù đăng nhập bằng mật khẩu hay bằng tài khoản Google thì vẫn chỉ vào duy nhất một hồ sơ chính chủ, giữ nguyên chức vụ và quyền xem dữ liệu, không sinh tài khoản rác.

#### **Chức năng Quản lý danh sách khách hàng ngành sữa**

* **Tính năng 5: Thêm, sửa, xóa thông tin khách hàng:** Nhân viên nhập tay thông tin các cửa hàng, đại lý sữa mới gặp ngoài thị trường hoặc sửa lại số điện thoại khi họ thay đổi. Tính năng xóa thực chất là ẩn đi để Admin kiểm tra lại, tránh nhân viên tự ý xóa dữ liệu công ty.  
* **Tính năng 6: Gắn nhãn phân chia nhóm khách hàng:** Khi tạo mới hoặc sửa thông tin khách hàng, bắt buộc phải chọn một trong ba nhóm phân khúc: Khách lẻ, Đại lý, VIP. Không được để trống ô lựa chọn này.  
* **Tính năng 7: Gắn loại sữa khách hàng quan tâm:** Nhân viên tích chọn các dòng sản phẩm mà đối tác đang muốn nhập hoặc quan tâm bao gồm: Sữa tươi, Sữa chua, Sữa bột. Cho phép tích chọn một loại hoặc chọn nhiều loại sữa cùng lúc.  
* **Tính năng 8: Đưa danh sách từ file vào phần mềm (Upload CSV):** Thay vì gõ tay từng cửa hàng, người dùng có thể đưa một file danh sách hàng trăm đại lý có sẵn vào phần mềm chỉ bằng một lần bấm chuột.  
* **Tính năng 9: Xuất danh sách từ phần mềm ra file (Export CSV):** Cho phép những người có quyền hạn tải toàn bộ danh sách khách hàng từ phần mềm về máy tính dưới dạng file để lưu trữ nội bộ hoặc xem khi không có mạng internet.

#### **Chức năng Theo dõi tiến độ và Số liệu kinh doanh**

* **Tính năng 10: Bảng tiến độ kéo thả (Kanban):** Hiển thị các hồ sơ đợt bán hàng dưới dạng các thẻ thông tin xếp thành 5 cột tiến độ tương ứng ngành sữa: Tiếp cận, Tư vấn mẫu thử, Đàm phán, Thành công, Thất bại. Cho phép dùng chuột giữ và kéo các thẻ này chuyển qua lại giữa các cột để cập nhật tình hình bán sữa.  
* **Tính năng 11: Màn hình số liệu tổng hợp (Dashboard):** Hiển thị các con số tổng doanh thu trong tháng, số lượng đại lý mới mở và các biểu đồ hình cột, hình tròn trực quan thể hiện loại sữa nào đang bán chạy nhất và tỷ lệ phần trăm các nhóm khách hàng để ban giám đốc ra quyết định điều phối hàng.

### **9.2. Tiêu chí nghiệm thu cụ thể cho từng tính năng (Bảng kiểm tra đánh giá)**

Để kiểm tra phần mềm đã làm xong và đạt chất lượng hay chưa, người kiểm tra dựa vào bảng tiêu chí nghiệm thu rõ ràng dưới đây:

| Mã kiểm tra | Thao tác thực hiện của người dùng | Kết quả phần mềm phải đạt được (Tiêu chí đạt) | Cấp nhân sự quyết định duyệt |
| :---- | :---- | :---- | :---- |
| **THỬ NGHIỆM ĐĂNG NHẬP** |  |  |  |
| NT 1.1 | Gõ một Email mới chưa có trên hệ thống kèm mật khẩu để đăng ký. Sau đó dùng chính Email này để đăng nhập lại. | Đăng nhập vào phần mềm thành công. Màn hình đầu tiên hiện ra là trang Tổng quan trống. Hồ sơ nhân viên tự động được xếp vào nhóm quyền Nhân viên Kinh doanh (Sales). | Trưởng phòng kỹ thuật |
| NT 1.2 | Đăng xuất ra ngoài, bấm chọn nút "Đăng nhập bằng tài khoản Google" có địa chỉ email trùng với email vừa đăng ký ở bước trên. | Đăng nhập thành công vào đúng tài khoản cũ. Không sinh ra thêm bất kỳ nhân viên mới nào trong danh sách nhân sự công ty. | Trưởng phòng kỹ thuật / Ban Giám đốc |
| NT 1.3 | Tại màn hình đăng nhập, bấm vào chữ "Quên mật khẩu", gõ địa chỉ email của mình vào và bấm gửi. | Hệ thống gửi ngay một thư điện tử về hộp thư cá nhân của người dùng, trong thư có đường dẫn an toàn để người dùng tự gõ mật khẩu mới. | Trưởng phòng kỹ thuật |
| **THỬ NGHIỆM QUYỀN HẠN** |  |  |  |
| NT 2.1 | Đăng nhập bằng tài khoản của một Nhân viên kinh doanh (Sales). Vào xem danh sách khách hàng và cố gắng tìm nút "Xuất file dữ liệu". | Nhân viên chỉ thấy danh sách những đại lý do chính mình tạo ra hoặc được giao phụ trách. Không nhìn thấy nút "Xuất file dữ liệu" (Export CSV) trên màn hình. | Trưởng nhóm Kinh doanh |
| NT 2.2 | Đăng nhập bằng tài khoản của Trưởng nhóm Kinh doanh (Manager). Vào xem danh sách khách hàng và tiến độ bán hàng. | Nhìn thấy đầy đủ tất cả khách hàng và các thẻ tiến độ của toàn bộ nhân viên trong nhóm của mình phụ trách, nhưng không thấy nút cài đặt hệ thống của Admin. | Ban Giám đốc |
| **THỬ NGHIỆM KHÁCH HÀNG** |  |  |  |
| NT 3.1 | Bấm nút thêm khách hàng mới, điền tên đại lý nhưng cố tình bỏ trống ô chọn nhóm khách hàng và ô sản phẩm sữa quan tâm rồi bấm lưu. | Phần mềm không cho lưu, hiển thị dòng chữ thông báo màu đỏ nhắc nhở: "Vui lòng chọn nhóm khách hàng và loại sữa quan tâm". | Trưởng nhóm Kinh doanh |
| NT 3.2 | Chuẩn bị một file danh sách mẫu gồm 10 cửa hàng tạp hóa, bấm nút "Tải file lên hệ thống" (Upload CSV). | Phần mềm xử lý dưới 2 giây, hiển thị thông báo "Đã đưa thành công 10 khách hàng vào hệ thống". Toàn bộ 10 cửa hàng xuất hiện đầy đủ trong bảng danh sách với thông tin tiếng Việt không bị lỗi chữ. | Trưởng nhóm Kinh doanh |
| **THỬ NGHIỆM BẢNG TIẾN ĐỘ** |  |  |  |
| NT 4.1 | Tại bảng kéo thả, dùng chuột kéo một thẻ cửa hàng từ cột "Tư vấn mẫu thử" sang cột "Đàm phán". Sau đó bấm phím F5 để tải lại trang web. | Thẻ cửa hàng phải nằm yên ở vị trí mới là cột "Đàm phán", số tiền dự kiến và thông tin loại sữa trên thẻ không bị mất hay thay đổi. | Trưởng nhóm Kinh doanh |
| NT 4.2 | Kéo một thẻ cửa hàng vào cột "Thất bại". | Phần mềm hiện lên một ô cửa sổ nhỏ yêu cầu chọn lý do tại sao đại lý từ chối mua sữa. Nếu người dùng không chọn lý do mà bấm tắt đi, thẻ cửa hàng phải tự động trả về vị trí cũ trước đó. | Trưởng nhóm Kinh doanh |
| **THỬ NGHIỆM SỐ LIỆU** |  |  |  |
| NT 5.1 | Vào mục Thanh toán, cập nhật một hóa đơn tiền sữa từ "Chờ thanh toán" sang "Đã thanh toán" với số tiền 50 triệu đồng. Sau đó quay lại mục Tổng quan. | Biểu đồ doanh thu hình cột tại mục Tổng quan phải lập tức tự động cộng thêm số tiền 50 triệu đồng vào cột doanh thu của tháng hiện tại. | Ban Giám đốc |

## **10\. Kế hoạch triển khai và Đánh giá rủi ro để ra quyết định nhanh**

Để ban giám đốc có đầy đủ thông tin và đưa ra quyết định phê duyệt triển khai dự án phần mềm CRM ngay lập tức, dưới đây là lịch trình thực hiện cụ thể và các phương án xử lý tình huống phát sinh trong thực tế.

### **10.1. Lịch trình triển khai cuốn chiếu (Gói gọn trong vòng 4 tuần)**

Dự án được thiết kế để hoàn thành dứt điểm trong vòng 1 tháng với các cột mốc bàn giao sản phẩm rõ ràng, không kéo dài thời gian:

* **Tuần 1: Thiết lập hạ tầng lưu trữ và bảo mật dữ liệu.** Xây dựng kho lưu trữ dữ liệu tập trung trên hệ thống Supabase, cài đặt sẵn bộ quy tắc phân quyền 3 lớp (Admin, Trưởng nhóm, Sales) để bảo mật tệp khách hàng của công ty ngay từ ngày đầu tiên.  
* **Tuần 2: Hoàn thiện chức năng đăng nhập và quản lý hồ sơ khách hàng.** Xây dựng xong tính năng đăng nhập song song bằng mật khẩu và tài tài khoản Google, chức năng đặt lại mật khẩu khi quên. Hoàn thành giao diện trang danh sách khách hàng, tính năng gắn nhãn phân khúc, loại sữa quan tâm và tính năng xuất nhập file CSV.  
* **Tuần 3: Hoàn thiện bảng kéo thả tiến độ và màn hình số liệu tổng hợp.** Xây dựng giao diện bảng tiến độ kéo thả Kanban cho việc kinh doanh sữa, hoàn thành các ô nhập lý do thất bại bắt buộc. Tạo màn hình Tổng quan với các biểu đồ hình cột, hình tròn tự động cập nhật số liệu kinh doanh.  
* **Tuần 4: Kiểm tra chất lượng, nghiệm thu và bàn giao sử dụng.** Chạy thử nghiệm toàn bộ phần mềm dựa trên bảng tiêu chí nghiệm thu tại Mục 9\. Đưa dữ liệu các đại lý sữa hiện có từ file bảng tính cũ của công ty vào hệ thống mới. Tổ chức một buổi hướng dẫn ngắn cho đội ngũ nhân viên kinh doanh thị trường và chính thức đưa phần mềm vào vận hành thực tế.

### **10.2. Rủi ro thực tế và Biện pháp xử lý đơn giản để vận hành thành công**

Trong quá trình áp dụng phần mềm quản lý mới vào hoạt động kinh doanh ngành sữa, công ty có thể gặp phải 2 tình huống rủi ro thực tế sau:

* **Rủi ro 1: Nhân viên kinh doanh ngại sử dụng phần mềm mới.** Nhân viên đi thị trường đã quen với việc ghi chép sổ tay hoặc nhắn tin trao đổi riêng, họ có thể cảm thấy phiền phức khi phải vào phần mềm cập nhật tiến độ kéo thả hoặc tích chọn loại sữa cho từng đại lý.  
  * *Biện pháp xử lý để ra quyết định nhanh:* Giao diện phần mềm được tối giản tối đa, các nút bấm to rõ để nhân viên có thể thao tác bằng điện thoại khi đang đứng ở cửa hàng tạp hóa chỉ mất chưa đầy 1 phút. Ban giám đốc sẽ ban hành quy định gắn liền việc sử dụng phần mềm vào việc tính thưởng doanh số cuối tháng. Nhân viên kinh doanh chỉ được tính doanh số cho những đại lý được tạo và cập nhật đầy đủ thông tin trên phần mềm CRM mới.  
* **Rủi ro 2: Nhân viên chuẩn bị file dữ liệu bị sai cấu trúc khi tải lên hệ thống.** Khi nhân viên tự tổng hợp danh sách đại lý cũ để đưa vào phần mềm (Upload CSV), họ có thể gõ sai các từ ngữ quy định (Ví dụ hệ thống quy định ghi là Đại lý nhưng nhân viên gõ nhầm thành Khách sỉ hoặc Cửa hàng đại lý), dẫn đến việc phần mềm bị lỗi không nhận diện được thông tin.  
  * *Biện pháp xử lý để ra quyết định nhanh:* Phần mềm được tích hợp sẵn một bộ lọc thông minh. Khi nhân viên tải file lên, nếu phát hiện ra dòng chữ nào sai quy định, phần mềm sẽ dừng việc tải và hiển thị thông báo bằng tiếng Việt rất dễ hiểu: "Dòng số 5 bị sai chữ, vui lòng sửa chữ Khách sỉ thành chữ Đại lý". Đồng thời, công ty sẽ cung cấp sẵn một file mẫu chuẩn đã được khóa sẵn các ô lựa chọn để nhân viên chỉ cần điền đúng thông tin vào các cột trước khi đưa vào phần mềm.