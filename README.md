# medical-knowledge
1. FLOW
   ![Main flow](/process.jpg)

+ LUỒNG TÌM KIẾM:
  +  Đầu tiên, người dùng nhập từ khóa trên giao diện tìm kiếm rồi thực hiện truy vấn. 
    + Hệ thống sẽ ghi nhận từ khóa và đưa vào bước tiền xử lý trước khi đưa vào đánh chỉ mục cụ thể là tách từ, chuyển sang chữ thường, loại bỏ dấu câu, và loại bỏ đi những từ không ảnh hưởng nhiều đến kết quả trả về. => Tiếp theo sẽ thực hiện đánh chỉ mục lên các từ.
    + Sau đó, hệ thống sẽ tìm kiếm các chỉ mục truy vấn với danh sách chỉ mục lưu trữ trong elasticsearch rồi ánh xạ qua các document được lưu trữ trong db rồi sắp xếp và trả ra danh sách audio cần tìm với thứ tự nhất định.
+ LUỒNG THÊM DỮ LIỆU:
  + Người dùng cần thực hiện đăng nhập để có quyền thêm csdl.
  + Người dùng nhập các thông tin về chuyên gia bác sĩ bao gồm tên, vị trí, tiêu đề audio và đăng tải đoạn audio. 
  + Đoạn audio sau khi upload thì sẽ được gửi lưu trữ lên Firebase và lấy địa chỉ tham chiếu về lưu trữ tại MySQL cùng các thông tin khác của audio.
  + Đoạn âm thanh đó tiếp tục được xử lý chuyển đổi sang dạng vân bản bởi mô hình nhận dạng giọng nói ASR. 
  + Dữ liệu text được trích xuất từ audio sẽ được qua các bước tiền xử lý, đánh chỉ mục và lưu trữ các chỉ mục trong index files.
 + Bên cạnh đó, để dữ liệu giữa csdl elastic và MySQL được đồng bộ thì hệ thống được lập lịch và chạy query ánh xạ dữ liệu từ MySQL tới Elastic.


2. SET UP
1. yarn run build
2. sudo systemctl reload nginx
3. sudo service nginx start
4. sudo service nginx restart
5. systemctl reload nginx
6. service nginx restart
7. nginx
8. systemctl status nginx.service
9. nano /etc/systemd/system/medicalknowledge.service
10. systemctl daemon-reload
11. systemctl start medicalknowledge.service
12. systemctl status medicalknowledge.service
