with open("hls_png/segment_1.png", "rb") as f:
    data = f.read()

# Tìm vị trí chunk IEND trong file PNG
iend_index = data.rfind(b"IEND")
if iend_index != -1:
    trailer_data = data[iend_index + 8:]  # Lấy dữ liệu sau IEND

    # Lưu dữ liệu thành file .ts
    with open("video.ts", "wb") as f:
        f.write(trailer_data)
    
    print("✅ Đã trích xuất dữ liệu TS thành công! File: video.ts")
else:
    print("⚠️ Không tìm thấy chunk IEND, không thể trích xuất dữ liệu TS.")
