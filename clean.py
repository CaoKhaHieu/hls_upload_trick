import os

# Định nghĩa đường dẫn folder và file
folder_path = "hls"
output_file = "example_data/example.ts"

# Đọc 32 byte đầu tiên của output.ts
with open(output_file, "rb") as f:
    header = f.read(32)  # Lấy 32 byte đầu tiên

# Duyệt qua tất cả file trong thư mục hls
for file_name in os.listdir(folder_path):
    if file_name.endswith(".ts"):  # Chỉ xử lý file .ts
        file_path = os.path.join(folder_path, file_name)
        
        # Ghi đè phần đầu tiên bằng header từ output.ts
        with open(file_path, "r+b") as f:
            f.seek(0)  # Đưa con trỏ về đầu file
            f.write(header)  # Ghi đè 32 byte đầu tiên
        
        print(f"Đã cập nhật {file_name}")

print("Hoàn thành thay thế header cho tất cả file .ts trong thư mục hls!")
