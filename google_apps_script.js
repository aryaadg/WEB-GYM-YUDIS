/**
 * YUDIS GYM — Google Apps Script untuk menerima booking
 * 
 * CARA DEPLOY:
 * 1. Buka https://script.google.com
 * 2. Buat project baru
 * 3. Paste seluruh kode ini
 * 4. Ganti SPREADSHEET_ID dengan ID spreadsheet Anda
 *    (dari URL: https://docs.google.com/spreadsheets/d/[INI_ID_NYA]/edit)
 * 5. Klik Deploy > New Deployment
 * 6. Pilih type: Web App
 * 7. Execute as: Me
 * 8. Who has access: Anyone
 * 9. Deploy, lalu copy URL-nya
 * 10. Paste URL di Admin Panel > Pengaturan > Kontak > Google Sheets Webhook URL
 */

const SPREADSHEET_ID = "GANTI_DENGAN_ID_SPREADSHEET_ANDA";
const SHEET_NAME = "Bookings YUDIS GYM";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName(SHEET_NAME);
    
    // Buat sheet jika belum ada
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      // Header
      sheet.appendRow([
        "Tanggal", "Nama Lengkap", "Email", "No. HP", 
        "Paket", "Tanggal Mulai", "Pesan/Catatan", "Status"
      ]);
      // Format header
      sheet.getRange(1, 1, 1, 8).setFontWeight("bold").setBackground("#f5c518").setFontColor("#000000");
      sheet.setFrozenRows(1);
    }
    
    // Tambah data baru
    sheet.appendRow([
      new Date().toLocaleString("id-ID"),
      data.full_name || "-",
      data.email || "-",
      data.phone || "-",
      data.membership_type || "-",
      data.start_date || "-",
      data.message || "-",
      "Baru"
    ]);
    
    // Auto-resize kolom
    sheet.autoResizeColumns(1, 8);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Test fungsi (jalankan manual dari editor untuk cek koneksi)
function testScript() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  Logger.log("Spreadsheet: " + ss.getName());
  Logger.log("Script berjalan dengan benar!");
}
