const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const { PNG } = require("pngjs");

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // TikTok Ads Credentials - Lấy từ upload.js hoặc DevTools TikTok Ads
  CREDENTIALS: {
    AAVID: '7485018665679945744',
    MS_TOKEN: 's6jyj4XgwgBuRix8MJIu1xoqOCwB1pNc-mmerSQtA89o31E-UiSIUhS31JE_BE_6oTxkjsYEB2DWYudY_IvLvZPIJoumowISlmwwt3PPbRz3tpvw_haYhse2TYglDRmxY67w2XEIVZ9mJdYpzClA6Q==',
    X_BOGUS: 'DFSzswcuVDMsHPv/Cum2lbhGbwj3',
    X_GNARLY: 'MC9fLPlMKAv74W6cADXFIGBGuFkT6NVbU57TO8BeU959Wi2pnXYtFMYmYcenwsJ1OhKNIpMJLfz6iyCLFQ5qwlEWd/xM75RrxzRibf9R6dpngxsErcb38cIlpnFNokjt/cuS9dhsiDvKfDrz/cciQqQsAXeSzbMqvDS4OCK8kJsvYns03CX5s0URw8h9Mg-1Clx6qdT2eoKOEacJWbJtP2sldVFJx1Kjyi/j2jhQMN3zcTNrcYtYAGKZ1nGHvtWU3tWvSqnSiNQulnzGCkmtmpyinI5gOQVvdUYIexNkHZUM',
    CSRF_TOKEN: 'uXNscrCRNITSzuRxy33AOhpEcSogCihE',
    COOKIE: "ttam-target-idc=alisg; uid_tt=ed41363d4373bbd2775ff996e79037b14427ec609f8acad346a650674bba72de; uid_tt_ss=ed41363d4373bbd2775ff996e79037b14427ec609f8acad346a650674bba72de; sid_tt=b7925f8201448387889484ae66fda8ee; sessionid=b7925f8201448387889484ae66fda8ee; sessionid_ss=b7925f8201448387889484ae66fda8ee; store-idc=alisg; store-country-code=vn; store-country-code-src=uid; tt-target-idc=alisg; tt-target-idc-sign=IywqWMg99NKvl7CMLLbm-Dhe5BG3LSyjZgU3OMy6u_K1J2f5_AseE_XcQchgIsHSoZPNEBcfXr35sJzvgwFB2RH-0RiWRvyGIxbFFWIO2q4GsgnSj07RAVRQX-HWW6lqCMaAndB9WyEHRMOSUcgSTBHIsAZelkd43oTtYSwlVXA8bshOP2ZHzeQji_stX4xeemm6QSCNxeLzcUUZc7Mz3FH28fEh9zyThcFEIm_06ycvzLf3A6vWw_4ucH0k-qYQao6YP7UkLtgxGzOZ7KNW2sIals2r2qxrjGz5w1pfBYDgZbtguezd-dFl_edU4wZLEbqosTGXO0HiYQgpo1y9otI_ggHVLTYOulTCQo3dtHd6R2NEcgSKC7khQYuLNR4ACqaiNcSzO4K-kOtL1FbGACHU_jgjyfAoOj4-xPqHd44PHtfWReDEYvXG7nu6wGrwzFfzqr8MNdyYM11jyt48Ktwne0DqJHIE1pq7-WPMtn9q1MiXQhH3_fcXp37G69JE; tta_attr_id_mirror=0.1760864300.7562854580787101703; csrftoken=uXNscrCRNITSzuRxy33AOhpEcSogCihE; _ga=GA1.1.430297226.1760864305; _tt_enable_cookie=1; _fbp=fb.1.1760864304808.1283049616; _hjSessionUser_6487441=eyJpZCI6Ijc0YjExZDkyLWU1YTctNTEyMC05YjY2LTZkYjk5ZDIzZmFhMyIsImNyZWF0ZWQiOjE3NjMyODYzMzEzMTcsImV4aXN0aW5nIjp0cnVlfQ==; d_ticket_ads=e088e74dcf6497d2d5cf1da3c9c0a2832aaa3; from_way=paid; passport_csrf_token=fc91cc76454fbcf5ca94f16ab6b8c32a; passport_csrf_token_default=fc91cc76454fbcf5ca94f16ab6b8c32a; FPID=FPID2.2.hfyGUCPfj5PoTT5aY%2Fcjs5Fyd1cO0y%2B4NhQ1uS1GKjw%3D.1760864305; tt_ticket_guard_client_web_domain=2; sid_guard=b7925f8201448387889484ae66fda8ee%7C1766841427%7C15552000%7CThu%2C+25-Jun-2026+13%3A17%3A07+GMT; tt_session_tlb_tag=sttt%7C5%7Ct5JfggFEg4eIlISuZv2o7v_________ihsI0RSnj8jA4EhEqX4frB1_VlLH_W7l8knZYW0p6szM%3D; sid_ucp_v1=1.0.1-KDJhNmQ0OWI3NjRkNjI3OGVlZGFlYjJkNzU0MTQ3Y2M2ZGNiNjhkZjYKGQiCgKrWge7zi1wQ07i_ygYYsws4CEAKSAQQAxoDbXkyIiBiNzkyNWY4MjAxNDQ4Mzg3ODg5NDg0YWU2NmZkYThlZTJOCiA54tI1gFMe1Bu90Fv74vLrAC0So8ngLNTaSnV5tCjEDRIgXq1CrmtS7bqaeUzFObD-wyveRZTEwS4JbbVo8aBSRKgYAyIGdGlrdG9r; ssid_ucp_v1=1.0.1-KDJhNmQ0OWI3NjRkNjI3OGVlZGFlYjJkNzU0MTQ3Y2M2ZGNiNjhkZjYKGQiCgKrWge7zi1wQ07i_ygYYsws4CEAKSAQQAxoDbXkyIiBiNzkyNWY4MjAxNDQ4Mzg3ODg5NDg0YWU2NmZkYThlZTJOCiA54tI1gFMe1Bu90Fv74vLrAC0So8ngLNTaSnV5tCjEDRIgXq1CrmtS7bqaeUzFObD-wyveRZTEwS4JbbVo8aBSRKgYAyIGdGlrdG9r; tt_chain_token=Ra0idtrYiE4/FPcKZzBwJg==; store-country-sign=MEIEDMjVTH7uEHXopxJcvAQgcUc_nqLB9Q0cIYlbLD9mnBUZgXPBLc9eAvAlBVvcxvwEEFde46iEfxoZFRE_XLcWlVM; webapp_tiktok_lang=vi-VN; lang_type=vi; pre_country=VN; _gcl_gs=2.1.k1$i1769953852$u176156530; FPGCLAW=2.1.kCj0KCQiAkPzLBhD4ARIsAGfah8gEVBYdVss1whWf1wlZIBNrv0FN_jyrRxvPcr408KmwK2ihB-hpU1AaAp1hEALw_wcB$i1769953868; FPGCLGS=2.1.k1$i1769953852$u176156530; _hjSession_6487441=eyJpZCI6ImI5OWJiN2YwLTVkMWMtNGIxNy1iNTIxLTdiNmY0OTI5Y2I2MyIsImMiOjE3Njk5NTM4NjgzNzYsInMiOjEsInIiOjEsInNiIjowLCJzciI6MCwic2UiOjAsImZzIjowLCJzcCI6MH0=; _ttp=37OBZhjw5Y65u2zKeb4W4uWn1li.tt.1; FPLC=UFa2%2FQxXDkSUGujtk%2BGtLI87ndFCJx7VXq44fBNXYRZr5sUw2ZSWuTWEcJUCflXNQaqWRyLqcoVvS3uajCgaivizMwHYVjr0LSYDMvtQ898LbmdBuKhHQkaWKUTILg%3D%3D; FPAU=1.2.846420906.1769953868; _gcl_au=1.1.88556972.1769953869; part=stable; _gcl_aw=GCL.1769953937.Cj0KCQiAkPzLBhD4ARIsAGfah8gEVBYdVss1whWf1wlZIBNrv0FN_jyrRxvPcr408KmwK2ihB-hpU1AaAp1hEALw_wcB; s_v_web_id=verify_ml3svjja_jRUKrCzF_Ucln_4BhW_Ah8V_Iy90aidt7Q46; sso_uid_tt_ads=ccb1b1c1484c0d5600e274307a4186928259e57942e545276fbb0a5591057f8c; sso_uid_tt_ss_ads=ccb1b1c1484c0d5600e274307a4186928259e57942e545276fbb0a5591057f8c; sso_user_ads=49ede2a5be1d7d294f2404ec8ec14fb8; sso_user_ss_ads=49ede2a5be1d7d294f2404ec8ec14fb8; sid_ucp_sso_v1_ads=1.0.1-KDQ2YTZiZjM0ZmE2YTNlNzdhZTE4ODI0NmE0OWExNDFjMzI4ZjllZTUKIAiGiMTQg_nGiGcQqLX9ywYYrwwgDDDjuMS4BjgBQOsHEAMaA215MiIgNDllZGUyYTViZTFkN2QyOTRmMjQwNGVjOGVjMTRmYjgyTQofrlV2WcqU2AW_vFrY6HgTMOGgt_hm1VLwHodYoJL8XRIgYvs1JYqEczefqiP2mYgB9RVi6K0GyS691INYSCWB39EYASIGdGlrdG9r; ssid_ucp_sso_v1_ads=1.0.1-KDQ2YTZiZjM0ZmE2YTNlNzdhZTE4ODI0NmE0OWExNDFjMzI4ZjllZTUKIAiGiMTQg_nGiGcQqLX9ywYYrwwgDDDjuMS4BjgBQOsHEAMaA215MiIgNDllZGUyYTViZTFkN2QyOTRmMjQwNGVjOGVjMTRmYjgyTQofrlV2WcqU2AW_vFrY6HgTMOGgt_hm1VLwHodYoJL8XRIgYvs1JYqEczefqiP2mYgB9RVi6K0GyS691INYSCWB39EYASIGdGlrdG9r; sid_guard_ads=0eaa05b200deadd2a72922ad205e12ad%7C1769953960%7C259200%7CWed%2C+04-Feb-2026+13%3A52%3A40+GMT; uid_tt_ads=e192a17d2866def33862c61fcabd30d3c7a8c4dbad5d8a0e367163caf4c03bf6; uid_tt_ss_ads=e192a17d2866def33862c61fcabd30d3c7a8c4dbad5d8a0e367163caf4c03bf6; sid_tt_ads=0eaa05b200deadd2a72922ad205e12ad; sessionid_ads=0eaa05b200deadd2a72922ad205e12ad; sessionid_ss_ads=0eaa05b200deadd2a72922ad205e12ad; tt_session_tlb_tag_ads=sttt%7C4%7CDqoFsgDerdKnKSKtIF4Srf_________LdajiIJ1OAt6hFTQLmmyefCoP0swYblmvGj3zJFD3Q2k%3D; sid_ucp_v1_ads=1.0.1-KGI3YzkwZmNlODk2NDYzZDkyMWJjMGE4NzZlZWE2NzYwNjhjMTQ1NDQKHAiGiMTQg_nGiGcQqLX9ywYYrwwgDDgBQOsHSAQQAxoDbXkyIiAwZWFhMDViMjAwZGVhZGQyYTcyOTIyYWQyMDVlMTJhZDJOCiDUGRUUiyakLWxZdW2AdtNBofJq2aReSRGAxrjFPNr2ThIgP9Nszy5ogbMfNMcLNWf88LY3ZT1FPopwic2fQkEJjqQYASIGdGlrdG9r; ssid_ucp_v1_ads=1.0.1-KGI3YzkwZmNlODk2NDYzZDkyMWJjMGE4NzZlZWE2NzYwNjhjMTQ1NDQKHAiGiMTQg_nGiGcQqLX9ywYYrwwgDDgBQOsHSAQQAxoDbXkyIiAwZWFhMDViMjAwZGVhZGQyYTcyOTIyYWQyMDVlMTJhZDJOCiDUGRUUiyakLWxZdW2AdtNBofJq2aReSRGAxrjFPNr2ThIgP9Nszy5ogbMfNMcLNWf88LY3ZT1FPopwic2fQkEJjqQYASIGdGlrdG9r; ac_csrftoken=8100172adfe149458a5783e074e5360e; ttcsid_C97F14JC77U63IDI7U40=1769953868544::E3asUPzW6ejD4hfvZxHV.4.1769953961229.1; ttcsid=1769953868544::-XzZgkH0TYFuVbYypMUs.4.1769953961229.0; _tt_ticket_crypt_doamin=2; i18next=vi; pre_country=VN; lang_type_ttp=vi; _ga_Y2RSHPPW88=GS2.1.s1769953867$o4$g1$t1769954036$j60$l0$h505344062; i18n_redirected=en; _ga_ER02CH5NW5=GS1.1.1769954212.1.0.1769954212.0.0.1210454406; _ga_HV1FL86553=GS1.1.1769954212.1.0.1769954212.0.0.676110668; odin_tt=6ab045dd01406648334bf480a1b3d50a1aa90f5f9fba46830721c23c02097d6edd4996da66af5de86cb16ba8c8cdb5ae; tt_ticket_guard_client_data=eyJ0dC10aWNrZXQtZ3VhcmQtdmVyc2lvbiI6MiwidHQtdGlja2V0LWd1YXJkLWl0ZXJhdGlvbi12ZXJzaW9uIjoxLCJ0dC10aWNrZXQtZ3VhcmQtc2NlbmUiOiJ0dDRiX2FkcyIsInR0LXRpY2tldC1ndWFyZC1vcmlnaW4tY3J5cHQiOiJ7XCJlY19wcml2YXRlS2V5XCI6XCItLS0tLUJFR0lOIFBSSVZBVEUgS0VZLS0tLS1cXG5NSUdIQWdFQU1CTUdCeXFHU000OUFnRUdDQ3FHU000OUF3RUhCRzB3YXdJQkFRUWdidnJuZmZEODBURWNDeTM3d21UUnRKQ2FxeGRPdUtoRFRNcVg2RDd3WUdpaFJBTkNBQVNjWURpeXJXZmRsNFg0UlRIN29raFY0ZC9LdjRaV0dGa3UrWFExTkRudUpPbVVEdks5YzFJdTlEenZoQXlWOEI1YWk0enkwQU5TT01SdDNmZFFxWk8yXFxuLS0tLS1FTkQgUFJJVkFURSBLRVktLS0tLVwiLFwiZWNfcHVibGljS2V5XCI6XCItLS0tLUJFR0lOIFBVQkxJQyBLRVktLS0tLVxcbk1Ga3dFd1lIS29aSXpqMENBUVlJS29aSXpqMERBUWNEUWdBRW5HQTRzcTFuM1plRitFVXgrNkpJVmVIZnlyK0dWaGhaTHZsME5UUTU3aVRwbEE3eXZYTlNMdlE4NzRRTWxmQWVXb3VNOHRBRFVqakViZDMzVUttVHRnPT1cXG4tLS0tLUVORCBQVUJMSUMgS0VZLS0tLS1cIixcImVjX2NzclwiOlwiXCJ9IiwidHQtdGlja2V0LWd1YXJkLXB1YmxpYy1rZXkiOiJCSnhnT0xLdFo5MlhoZmhGTWZ1aVNGWGgzOHEvaGxZWVdTNzVkRFUwT2U0azZaUU84cjF6VWk3MFBPK0VESlh3SGxxTGpQTFFBMUk0eEczZDkxQ3BrN1k9IiwidHQtdGlja2V0LWd1YXJkLXdlYi12ZXJzaW9uIjoxfQ%3D%3D; ttwid=1%7CzfndGJBFBob8AhbHNyMnVBs5J_LpZLkdo4PRif6nGHc%7C1769954524%7C0d5cb79dcadd7bf9374dab431edbe571c100ed44a2c531217183a7267ab9b14b; msToken=s6jyj4XgwgBuRix8MJIu1xoqOCwB1pNc-mmerSQtA89o31E-UiSIUhS31JE_BE_6oTxkjsYEB2DWYudY_IvLvZPIJoumowISlmwwt3PPbRz3tpvw_haYhse2TYglDRmxY67w2XEIVZ9mJdYpzClA6Q==; msToken=41DyZSywudy5HEoo39dKqtMo1kM35G1FRVA694w7Qw6wkNwe6PMXH1UAydupRCpRTwdWPQx16ZwfSjDr8zbWR4k6O3jjjSeCsIeeU_nAM_xfXe1_3jvglfPF0OBKfDdvB1dM7jExJ5AG960O-LyYlg=="
  },

  TEMP_DIR: "./temp",
  OUTPUT_DIR: "./output",
  REFERENCE_TS: "example_data/example.ts", // File mẫu để lấy header 32 byte (clean.js)
  FIX_HEADERS: true, // Tự động sửa header 32 byte nếu tìm thấy REFERENCE_TS
};

// ============================================
// UTILITIES
// ============================================
function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function cleanupDir(dir) {
  if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true, force: true });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================
// LOGIC: CLEAN/FIX HEADERS
// ============================================
function fixTsHeader(filePath, header32) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const newBuffer = Buffer.concat([header32, fileBuffer.slice(32)]);
    fs.writeFileSync(filePath, newBuffer);
    return true;
  } catch (e) {
    console.error(`   ❌ Failed to fix header for ${path.basename(filePath)}`);
    return false;
  }
}

// ============================================
// LOGIC: DOWNLOAD & PROCESS M3U8
// ============================================
async function downloadFile(url, outputPath) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  fs.writeFileSync(outputPath, response.data);
}

async function processInput(m3u8Input, tempDir, isTest = false) {
  console.log(`📥 Processing Input: ${m3u8Input}`);

  let m3u8Content;
  let baseUrl;
  let isRemote = m3u8Input.startsWith('http');

  if (isRemote) {
    const response = await axios.get(m3u8Input);
    m3u8Content = response.data;
    baseUrl = m3u8Input.substring(0, m3u8Input.lastIndexOf('/') + 1);
  } else {
    m3u8Content = fs.readFileSync(m3u8Input, 'utf8');
    baseUrl = path.dirname(path.resolve(m3u8Input)) + '/';
  }

  let lines = m3u8Content.split('\n');
  const isMasterPlaylist = lines.some(line => line.includes('#EXT-X-STREAM-INF'));

  if (isMasterPlaylist) {
    console.log(`📋 Detected master playlist, fetching first media playlist...`);
    let mediaUrl = lines.find(line => line.trim() && !line.startsWith('#')).trim();
    if (!mediaUrl.startsWith('http')) mediaUrl = baseUrl + mediaUrl;

    console.log(`   → Media Playlist: ${mediaUrl}`);
    const mediaResponse = await axios.get(mediaUrl);
    m3u8Content = mediaResponse.data;
    lines = m3u8Content.split('\n');
    baseUrl = mediaUrl.substring(0, mediaUrl.lastIndexOf('/') + 1);
  }

  let tsLinks = [];
  lines.forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && (trimmed.endsWith('.ts') || trimmed.includes('.ts?'))) {
      tsLinks.push(trimmed);
    }
  });

  console.log(`📦 Found ${tsLinks.length} TS segments`);
  if (tsLinks.length === 0) throw new Error('No .ts segments found');

  if (isTest && tsLinks.length > 5) {
    console.log(`⚠️  TEST MODE: Only processing first 5 segments.`);
    tsLinks = tsLinks.slice(0, 5);
  }

  // Lấy header mẫu nếu cần sửa
  let header32 = null;
  if (CONFIG.FIX_HEADERS && fs.existsSync(CONFIG.REFERENCE_TS)) {
    header32 = fs.readFileSync(CONFIG.REFERENCE_TS).slice(0, 32);
    console.log(`🛠️  Using header from ${CONFIG.REFERENCE_TS} to fix segments.`);
  }

  const tsFiles = [];
  for (let i = 0; i < tsLinks.length; i++) {
    const link = tsLinks[i];
    const tsUrl = link.startsWith('http') ? link : baseUrl + link;
    const filename = `segment_${i}.ts`;
    const outputPath = path.join(tempDir, filename);

    try {
      if (isRemote || !fs.existsSync(path.join(path.dirname(m3u8Input), link))) {
        await downloadFile(tsUrl, outputPath);
      } else {
        fs.copyFileSync(path.join(path.dirname(m3u8Input), link), outputPath);
      }

      if (header32) fixTsHeader(outputPath, header32);

      tsFiles.push({ path: outputPath, originalName: link, index: i });
      console.log(`   ✅ [${i + 1}/${tsLinks.length}] Processed: ${filename}`);
    } catch (e) {
      console.error(`   ❌ [${i + 1}/${tsLinks.length}] Failed: ${link}`, e.message);
    }
    if (isRemote) await sleep(100);
  }

  return { tsFiles, m3u8Content };
}

// ============================================
// LOGIC: CONVERT & UPLOAD
// ============================================
async function createPngFromTs(tsPath, pngPath) {
  const tsData = fs.readFileSync(tsPath);
  const png = new PNG({ width: 1, height: 1, filterType: 4 });
  png.data.fill(255); // White pixel

  const pngBuffer = PNG.sync.write(png);
  const pngSize = pngBuffer.length;
  const tsSize = tsData.length;

  fs.writeFileSync(pngPath, Buffer.concat([pngBuffer, tsData]));
  return { pngSize, tsSize };
}

async function uploadToTikTok(filePath) {
  const formData = new FormData();
  formData.append("Filedata", fs.createReadStream(filePath));
  const url = `https://ads.tiktok.com/api/v2/i18n/material/image/upload/?aadvid=${CONFIG.CREDENTIALS.AAVID}&msToken=${CONFIG.CREDENTIALS.MS_TOKEN}&X-Bogus=${CONFIG.CREDENTIALS.X_BOGUS}&X-Gnarly=${CONFIG.CREDENTIALS.X_GNARLY}&req_src=ad_creation`;

  const response = await axios.post(url, formData, {
    headers: {
      "X-Csrftoken": CONFIG.CREDENTIALS.CSRF_TOKEN,
      // "X-Gnarly": CONFIG.CREDENTIALS.X_GNARLY,
      "Cookie": CONFIG.CREDENTIALS.COOKIE,
      ...formData.getHeaders(),
    },
    timeout: 30000,
  });

  if (response.data.code === 0) return response.data.data.url;

  // Xử lý lỗi permission cụ thể
  if (response.data.code === 40102) {
    throw new Error("PERMISSION_DENIED: Credentials (Cookie/MS_TOKEN/X-Bogus) đã hết hạn hoặc không có quyền.");
  }

  throw new Error(JSON.stringify(response.data));
}

// ============================================
// MAIN EXECUTION
// ============================================
async function run(m3u8Input, isTest = false) {
  console.log(`\n🚀 STARTING ALL-IN-ONE HLS TO TIKTOK TRICK ${isTest ? "(TEST MODE)" : ""}`);
  const runId = Date.now().toString();
  const tempDir = path.join(CONFIG.TEMP_DIR, runId);
  ensureDir(tempDir);
  ensureDir(CONFIG.OUTPUT_DIR);

  try {
    // 1. Download/Collect TS
    const { tsFiles, m3u8Content } = await processInput(m3u8Input, tempDir, isTest);

    // 2. Convert & Upload
    console.log(`\n☁️  Converting & Uploading ${tsFiles.length} segments...`);
    const urlMap = {};
    for (let i = 0; i < tsFiles.length; i++) {
      const { path: tsPath, index } = tsFiles[i];
      const pngPath = tsPath.replace('.ts', '.png');
      const filename = path.basename(pngPath);

      try {
        const { pngSize, tsSize } = await createPngFromTs(tsPath, pngPath);
        let uploadedUrl = null;
        // Retry logic
        for (let attempt = 1; attempt <= 3; attempt++) {
          try {
            uploadedUrl = await uploadToTikTok(pngPath);
            if (uploadedUrl) break;
          } catch (e) {
            if (e.message.includes("PERMISSION_DENIED")) {
              throw e; // Ném ra ngoài để dừng vòng lặp lớn
            }
            if (attempt === 3) throw e;
            console.log(`      ⚠️  Retry ${filename} (${attempt + 1})...`);
            await sleep(2000);
          }
        }
        urlMap[index] = {
          url: uploadedUrl,
          byteRange: `${tsSize}@${pngSize}`
        };
        console.log(`   ✅ [${i + 1}/${tsFiles.length}] Uploaded: ${uploadedUrl}`);
      } catch (e) {
        console.error(`   ❌ [${i + 1}/${tsFiles.length}] Error: ${filename}`, e.message);
        if (e.message.includes("PERMISSION_DENIED")) {
          console.log("\n🚨 Dừng quá trình upload do lỗi quyền truy cập. Vui lòng cập nhật MS_TOKEN, Cookie và X-Bogus trong main.js.");
          break; // Dừng vòng lặp for
        }
      }
      await sleep(500);
    }

    // 3. Generate new M3U8
    const outputName = m3u8Input.startsWith('http') ? 'tiktok_video.m3u8' : `tiktok_${path.basename(m3u8Input)}`;
    const outputPath = path.join(CONFIG.OUTPUT_DIR, outputName);

    let lines = m3u8Content.split('\n');
    let tsCounter = 0;
    const finalLines = [];

    for (let line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#') && (trimmed.endsWith('.ts') || trimmed.includes('.ts?'))) {
        const item = urlMap[tsCounter];
        if (item && item.url) {
          // Add ByteRange tag before the URL
          finalLines.push(`#EXT-X-BYTERANGE:${item.byteRange}`);
          finalLines.push(item.url);
        } else {
          finalLines.push(trimmed); // Keep original if upload failed
        }
        tsCounter++;
      } else {
        finalLines.push(line);
      }
    }

    fs.writeFileSync(outputPath, finalLines.join('\n'));
    console.log(`\n${'='.repeat(50)}`);
    console.log(`✅ SUCCESS!`);
    console.log(`📄 New Playlist: ${outputPath}`);
    console.log(`${'='.repeat(50)}\n`);

  } catch (error) {
    console.error(`\n🚨 FATAL ERROR: ${error.message}`);
  } finally {
    cleanupDir(tempDir);
  }
}

// Entry point
const args = process.argv.slice(2);
const isTest = args.includes("test");
const input = args.find(arg => arg !== "test") || "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

run(input, isTest);
