const fs = require('fs');
const path = require('path');

// Định nghĩa đường dẫn folder và file
const folderPath = 'hls';
const outputFile = 'example_data/example.ts';

// Đọc 32 byte đầu tiên của output.ts
const header = fs.readFileSync(outputFile).slice(0, 32);

// Duyệt qua tất cả file trong thư mục hls
fs.readdirSync(folderPath).forEach((fileName) => {
    if (fileName.endsWith('.ts')) { // Chỉ xử lý file .ts
        const filePath = path.join(folderPath, fileName);
        
        // Đọc nội dung file
        const fileBuffer = fs.readFileSync(filePath);
        
        // Ghi đè 32 byte đầu tiên bằng header
        const newBuffer = Buffer.concat([header, fileBuffer.slice(32)]);
        fs.writeFileSync(filePath, newBuffer);
        
        console.log(`Đã cập nhật ${fileName}`);
    }
});

console.log('Hoàn thành thay thế header cho tất cả file .ts trong thư mục hls!');
