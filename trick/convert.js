const fs = require("fs");
const path = require("path");
const { PNG } = require("pngjs");

const INPUT_FOLDER = "hls";
const OUTPUT_FOLDER = "hls_png";
const M3U8_FILE = path.join(INPUT_FOLDER, "playlist.m3u8");
const OUTPUT_M3U8_FILE = path.join(OUTPUT_FOLDER, "playlist.m3u8");

// Tạo thư mục output nếu chưa có
if (!fs.existsSync(OUTPUT_FOLDER)) {
  fs.mkdirSync(OUTPUT_FOLDER, { recursive: true });
}

function createPngFromTs(tsPath, pngPath) {
  const tsData = fs.readFileSync(tsPath); // Đọc file .ts

  // Tạo ảnh PNG 1x1 pixel
  const png = new PNG({
    width: 1,
    height: 1,
    filterType: 4,
  });

  png.data[0] = 255; // Red
  png.data[1] = 255; // Green
  png.data[2] = 255; // Blue
  png.data[3] = 255; // Alpha

  // Ghi file PNG và nhúng dữ liệu TS vào
  const writeStream = fs.createWriteStream(pngPath);
  png.pack().pipe(writeStream);

  writeStream.on("finish", () => {
    fs.appendFileSync(pngPath, tsData); // Nhúng dữ liệu TS vào PNG
    console.log(`✅ Đã chuyển ${path.basename(tsPath)} -> ${path.basename(pngPath)}`);
  });
}

function updateM3U8() {
  if (!fs.existsSync(M3U8_FILE)) {
    console.warn(`⚠️ Không tìm thấy ${M3U8_FILE}, bỏ qua bước cập nhật m3u8.`);
    return;
  }

  const lines = fs.readFileSync(M3U8_FILE, "utf8").split("\n");
  const newLines = lines.map(line => {
    if (line.endsWith(".ts")) {
      return line.replace(".ts", ".png");
    }
    return line;
  });

  fs.writeFileSync(OUTPUT_M3U8_FILE, newLines.join("\n"));
  console.log(`✅ Đã cập nhật ${OUTPUT_M3U8_FILE}`);
}

// Duyệt qua thư mục input và chuyển đổi file
fs.readdirSync(INPUT_FOLDER).forEach(file => {
  if (file.endsWith(".ts")) {
    const tsPath = path.join(INPUT_FOLDER, file);
    const pngPath = path.join(OUTPUT_FOLDER, file.replace(".ts", ".png"));
    createPngFromTs(tsPath, pngPath);
  }
});

// Cập nhật file M3U8
updateM3U8();
console.log("🎉 Hoàn tất chuyển đổi!");
