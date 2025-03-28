import os
import struct
import zlib
import base64

# Thư mục đầu vào và đầu ra
INPUT_FOLDER = "hls"
OUTPUT_FOLDER = "hls_png"
M3U8_FILE = os.path.join(INPUT_FOLDER, "playlist.m3u8")  # File m3u8 gốc
OUTPUT_M3U8_FILE = os.path.join(OUTPUT_FOLDER, "playlist.m3u8")  # File m3u8 mới

# Tạo thư mục đầu ra nếu chưa tồn tại
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

def create_png_from_ts(ts_path, png_path):
    """Nhúng file TS vào file PNG"""
    png_header = b"\x89PNG\r\n\x1a\n"
    ihdr_data = b"\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00"
    ihdr_crc = struct.pack(">I", zlib.crc32(b"IHDR" + ihdr_data))
    ihdr_chunk = b"\x00\x00\x00\x0D" + b"IHDR" + ihdr_data + ihdr_crc
    idat_data = b"\x78\x9C\x63\x00\x01\x00\x00\x05\x00\x01"
    idat_crc = struct.pack(">I", zlib.crc32(b"IDAT" + idat_data))
    idat_chunk = struct.pack(">I", len(idat_data)) + b"IDAT" + idat_data + idat_crc
    iend_chunk = b"\x00\x00\x00\x00IEND\xAE\x42\x60\x82"
    
    with open(ts_path, "rb") as f:
        ts_data = f.read()
    
    with open(png_path, "wb") as f:
        f.write(png_header + ihdr_chunk + idat_chunk + iend_chunk + ts_data)

def update_m3u8():
    """Cập nhật file m3u8, thay thế .ts bằng .png"""
    if not os.path.exists(M3U8_FILE):
        print(f"⚠️ Không tìm thấy {M3U8_FILE}, bỏ qua bước cập nhật m3u8.")
        return
    
    with open(M3U8_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    new_lines = []
    for line in lines:
        line = line.strip()
        if line.endswith(".ts"):
            png_name = os.path.splitext(os.path.basename(line))[0] + ".png"
            new_lines.append(png_name)
        else:
            new_lines.append(line)
    
    with open(OUTPUT_M3U8_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(new_lines) + "\n")
    print(f"✅ Đã cập nhật {OUTPUT_M3U8_FILE}")

# Duyệt qua folder hls
for file in os.listdir(INPUT_FOLDER):
    if file.endswith(".ts"):
        ts_path = os.path.join(INPUT_FOLDER, file)
        png_path = os.path.join(OUTPUT_FOLDER, os.path.splitext(file)[0] + ".png")
        create_png_from_ts(ts_path, png_path)
        print(f"✅ Đã chuyển {file} -> {os.path.basename(png_path)}")

# Cập nhật file m3u8
update_m3u8()
print("🎉 Hoàn tất chuyển đổi!")