const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");

const DIRECTORY = "./hls_png";
const M3U8_FILE = path.join(DIRECTORY, "playlist.m3u8"); // Đổi tên file m3u8 nếu cần
const AAVID = '7485018665679945744';
const MS_TOKEN = 'hEUI0YObJ1q3pQXNkOqvuhuWxu2GtBWGQJL0QRFdNEbXCIvB3MKoPgLClEHS7xRMAE0ffHbQcQ4mLF8uOyc5mXm0pYLNls6ZiOch-GrccIxEaaYZxkH0zZ6bahkzxkjuN7fykzVDaP0bqw==';
const XBogus = 'DFSzswSLX1XANygLth27Wt9WcBri';
const UPLOAD_URL = `https://ads.tiktok.com/api/v2/i18n/material/image/upload/?aadvid=${AAVID}&msToken=${MS_TOKEN}&X-Bogus=${XBogus}`;
const a = "tt_csrf_token=asFnGCyM-ugRo_pOp5dBYhIJWwh8r-xD7NfE; tt_chain_token=F1bWxXMCftmFf7k0MH+NRg==; from_way=paid; tta_attr_id_mirror=0.1742741599.7485018172899704848; _gcl_aw=GCL.1742741602.Cj0KCQjw4v6-BhDuARIsALprm31qyJM70syChMFxHBJDtShXMFfqlDfbv86DiNX5fLRbKMwd5MyS5t8aAhr6EALw_wcB; _gcl_gs=2.1.k1$i1742741598$u160176683; _ga=GA1.1.1942867465.1742741602; FPID=FPID2.2.AjZe8PrpnA01hWAGNk4olNGV8%2B2fsWzKxaeSz3gbdR4%3D.1742741602; FPGCLGS=2.1.k1$i1742741598$u160176683; FPAU=1.2.941244924.1742741602; _fbp=fb.1.1742741601798.1728350501; _yjsu_yjad=1742741601.19992b2b-ab74-4865-bdee-c9dea897bcfa; _tt_enable_cookie=1; _ttp=2qiE7JPwDkC2MaI1iZOU36KXmpz.tt.1; passport_csrf_token=5aabb6ad14a63738eb235a4747f4b401; passport_csrf_token_default=5aabb6ad14a63738eb235a4747f4b401; _gtmeec=e30%3D; s_v_web_id=verify_m8lrd38o_hdxOzJmM_YBjI_41gB_BB9K_Yrspkt9wAUWL; multi_sids=7077956706597307393%3A187629e18a0d1cd7a0a0404dae94fb6c; cmpl_token=AgQQAPOFF-RO0rIHGrhIYV04_a_w751LP4MOYNirSQ; passport_auth_status=ae6cede5e8c51681b73d0d826720d2aa%2C; passport_auth_status_ss=ae6cede5e8c51681b73d0d826720d2aa%2C; uid_tt=5408713c223d7d991f7d4eb8437cab3fd529690a66bdf9efe28aa36d4909baed; uid_tt_ss=5408713c223d7d991f7d4eb8437cab3fd529690a66bdf9efe28aa36d4909baed; sid_tt=187629e18a0d1cd7a0a0404dae94fb6c; sessionid=187629e18a0d1cd7a0a0404dae94fb6c; sessionid_ss=187629e18a0d1cd7a0a0404dae94fb6c; store-idc=alisg; store-country-code=vn; store-country-code-src=uid; tt-target-idc=alisg; tt-target-idc-sign=QR4fdqh2ehzkeo4krtSDQ9-MRFBE3z_XyxrXenHDgj7NrgCI1b5ioUAQV9OSUbUZmn7tNZx5DbA-AfDiH_PiE44Q4dWuhcARJ-muR11wNZ8SqE2mWapKV6zXSNehgomi5DN0LzNFf-sEsfQQnHxQ5aGYv6RIsrALES3wbv0YnJp4B0riiGSd83gtUOuJrCsMh02EIUWwlgu1fiWqj7nI6UiKce9xo_wmGmj9etE26ds16ufNTVOUrTO7x3SWhYBSYVJEUXC-qtknAKrDyMXRvdysmIzcm40mhTIzvG1x6mhNExP34GezBP2MAeY6NL80QMeUubt95EjPG8gugjI4FOOaqrVoLXqF3Fp_rGifqveA6BAYKa1UmFIsYX4kARSzk7pYs3XQ0L3-gzuI0B1FHWY5RaOTrkoLuGaZ6M-Cgm3ObE-UjTd-rikFQtAUtv4i5FaiBCytmmirJtG0-be18rQYr5FSUVAuwFhDrYFHauPhfxqGqm0zp5AcPlTwC2x9; d_ticket_ads=b1a254e162972fcfd6ba62ad0a31f400e8506; passport_auth_status_ads=410a74a9bdc2d2cd9f0961010ba88654%2C; passport_auth_status_ss_ads=410a74a9bdc2d2cd9f0961010ba88654%2C; sso_uid_tt_ads=16add0e83169192c4b1335e952e6f52eb4c9aaacba4b3e18132e40415a442fb8; sso_uid_tt_ss_ads=16add0e83169192c4b1335e952e6f52eb4c9aaacba4b3e18132e40415a442fb8; sso_user_ads=892b8d88c9797be1fae81960c65a1219; sso_user_ss_ads=892b8d88c9797be1fae81960c65a1219; sid_ucp_sso_v1_ads=1.0.0-KGI5M2JmNzEwNDMxOWFhYzIwMzBhMjg3NDYwZGY5YWYyZTRjZjA1M2EKFwiGiMTQg_nGiGcQr8GAvwYYrww4CEApEAMaA215MiIgODkyYjhkODhjOTc5N2JlMWZhZTgxOTYwYzY1YTEyMTk; ssid_ucp_sso_v1_ads=1.0.0-KGI5M2JmNzEwNDMxOWFhYzIwMzBhMjg3NDYwZGY5YWYyZTRjZjA1M2EKFwiGiMTQg_nGiGcQr8GAvwYYrww4CEApEAMaA215MiIgODkyYjhkODhjOTc5N2JlMWZhZTgxOTYwYzY1YTEyMTk; sid_guard_ads=b29f0aca3d03f9d124aaada6acf6e5f7%7C1742741680%7C863999%7CWed%2C+02-Apr-2025+14%3A54%3A39+GMT; uid_tt_ads=bfab273f569e78c9ca6118d19c9d08f8c3ea99724920e69737befa371adbe617; uid_tt_ss_ads=bfab273f569e78c9ca6118d19c9d08f8c3ea99724920e69737befa371adbe617; sid_tt_ads=b29f0aca3d03f9d124aaada6acf6e5f7; sessionid_ads=b29f0aca3d03f9d124aaada6acf6e5f7; sessionid_ss_ads=b29f0aca3d03f9d124aaada6acf6e5f7; sid_ucp_v1_ads=1.0.0-KDJhYTA5OTcxMzhlMjk0M2Q3OGU2ZWYyZmU0MmI0YzUwOGExM2RkNTYKGQiGiMTQg_nGiGcQsMGAvwYYrwwgDDgIQCkQAxoDbXkyIiBiMjlmMGFjYTNkMDNmOWQxMjRhYWFkYTZhY2Y2ZTVmNw; ssid_ucp_v1_ads=1.0.0-KDJhYTA5OTcxMzhlMjk0M2Q3OGU2ZWYyZmU0MmI0YzUwOGExM2RkNTYKGQiGiMTQg_nGiGcQsMGAvwYYrwwgDDgIQCkQAxoDbXkyIiBiMjlmMGFjYTNkMDNmOWQxMjRhYWFkYTZhY2Y2ZTVmNw; part=stable; FPGCLAW=2.1.kCj0KCQjw4v6-BhDuARIsALprm31qyJM70syChMFxHBJDtShXMFfqlDfbv86DiNX5fLRbKMwd5MyS5t8aAhr6EALw_wcB$i1742741685; pre_country=VN; csrftoken=TFa7etJT4O6RFCUr0NZsA91V3SCxBUUa; _ga_R5EYE54KWQ=GS1.1.1742741601.1.1.1742741730.0.0.967024120; pre_country=VN; ks_theme=1; sid_guard=187629e18a0d1cd7a0a0404dae94fb6c%7C1742742474%7C15551147%7CFri%2C+19-Sep-2025+14%3A53%3A41+GMT; sid_ucp_v1=1.0.0-KGM0ODEyOTdmOGEwNjEyYjQzNWVhZThmNWNmODM0NTUxMTE1Zjc2YjQKGQiBiM6C_IP9nGIQyseAvwYYsws4CEASSAQQAxoCbXkiIDE4NzYyOWUxOGEwZDFjZDdhMGEwNDA0ZGFlOTRmYjZj; ssid_ucp_v1=1.0.0-KGM0ODEyOTdmOGEwNjEyYjQzNWVhZThmNWNmODM0NTUxMTE1Zjc2YjQKGQiBiM6C_IP9nGIQyseAvwYYsws4CEASSAQQAxoCbXkiIDE4NzYyOWUxOGEwZDFjZDdhMGEwNDA0ZGFlOTRmYjZj; tta_attr_id=0.1742825464.7485378306737963015; webapp_tiktok_lang=vi-VN; lang_type=vi; ac_csrftoken=b600b12ff97f4e559a93c30ab5b1bd63; FPLC=IKhkB6ixd%2FMD5GUlJxP9IfIf4i73SmSGauiavHSFGJMt9jwwu2a299Ut5rKuxuJV2VI8b59rbYfugn7CqLk0KWvySQb3qJpB6%2BNVe8YLq3N8PINOYtpP%2FgSwMqbD8g%3D%3D; i18next=vi; msToken=hEUI0YObJ1q3pQXNkOqvuhuWxu2GtBWGQJL0QRFdNEbXCIvB3MKoPgLClEHS7xRMAE0ffHbQcQ4mLF8uOyc5mXm0pYLNls6ZiOch-GrccIxEaaYZxkH0zZ6bahkzxkjuN7fykzVDaP0bqw==; _ga_HV1FL86553=GS1.1.1742905910.3.1.1742905951.0.0.317471986; _ga_Y2RSHPPW88=GS1.1.1742905910.3.1.1742905951.0.0.83042543; lang_type_ttp=vi; store-country-sign=MEIEDL_Skv6ooJq504RA8QQgXm4FIVPGZN2xpRleXxdokYftApDKTLCU_URLl-EcARMEEAhpZC0JTs_sLTmIzGNsu08; msToken=TyTP_vuFw8MrKFWgZP4BEB9i4idOc2eA3vSbR5u-PVWJMwIoOigoG57NEm4vJRUUxxqabKFTV-lK-zqJwGJxzFDUO1dSRZgV7qAbfM3qMonm7Yde4EokWx4jPLsp; odin_tt=20873d1481b24c0dfd2fc575d1bc1a8df562fc6f6af5a86e27241796b7180227c65658c6fb72432f475e66c839127cf9; ttwid=1%7C2N37e-v-Ui9c0gFjTYmKRm9AmqjhFMvIwXga2bCbhm4%7C1742907436%7C103cfa83b31d1b581ba68fd19c3c50099d562c17131a886bc4ac20ceddd1a666";
const HEADERS = {
  // "X-Csrftoken": "q7iRydFdSpHK6dyvfSLs6poyBgbBIh2j",
  "X-Csrftoken": "TFa7etJT4O6RFCUr0NZsA91V3SCxBUUa",
  "Cookie": a
};
console.log('Start uploading:')

async function uploadImage(filePath) {
  const formData = new FormData();
  formData.append("Filedata", fs.createReadStream(filePath));

  try {
    const response = await axios.post(UPLOAD_URL, formData, {
      headers: { ...HEADERS },
    });

    if (response.data.code === 0) {
      console.log('upload success', filePath, response.data.data.url)
      return response.data.data.url; // URL của ảnh đã upload
    } else {
      console.error("Upload failed:", response.data);
      return null;
    }
  } catch (error) {
    console.error("Error uploading file:", filePath, error);
    return null;
  }
}

async function processImages() {
  const files = fs.readdirSync(DIRECTORY).filter(file => file.endsWith(".png"));
  const urlMap = {};

  for (const file of files) {
    const filePath = path.join(DIRECTORY, file);
    const uploadedUrl = await uploadImage(filePath);
    if (uploadedUrl) {
      urlMap[file] = uploadedUrl;
    }
  }

  if (fs.existsSync(M3U8_FILE)) {
    let m3u8Content = fs.readFileSync(M3U8_FILE, "utf8");
    Object.entries(urlMap).forEach(([fileName, url]) => {
      m3u8Content = m3u8Content.replace(fileName, url);
    });
    fs.writeFileSync(M3U8_FILE, m3u8Content, "utf8");
    console.log("Updated M3U8 file with new URLs.");
  } else {
    console.warn("M3U8 file not found, skipping update.");
  }
}

processImages();
