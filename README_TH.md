# Crystal Clear Retainer Web v3

ไฟล์หลัก:
- `index.html` หน้าลูกค้า มี 2 ทางเลือก: ลงทะเบียน / ตรวจสอบสถานะ
- `register.html` ฟอร์มลูกค้ากรอกข้อมูล
- `login.html` หน้า Login Admin
- `admin.html` หลังบ้าน Seller Portal
- `config.js` ตั้งค่า username/password และ API URL
- `apps-script/Code.gs` โค้ดสำหรับ Google Apps Script

## รหัสหลังบ้าน
Username: `admin`
Password: `1234`

เวอร์ชันนี้แก้ Login ให้แน่นขึ้นแล้ว โดยหน้า `login.html` มีสคริปต์ Login อยู่ในตัวเอง ไม่พึ่ง `app.js` อย่างเดียว

## วิธีใช้งานบนเครื่อง
1. แตกไฟล์ ZIP ก่อน
2. เปิด `index.html` หรือ `login.html`
3. ห้ามเปิดจาก preview ใน ZIP โดยตรง เพราะบางเครื่องจะไม่โหลด JavaScript

## ถ้า Login ยังไม่เปลี่ยนหน้า
- กด Hard Refresh: Mac `Cmd + Shift + R`, Windows `Ctrl + F5`
- หรือเปิด Incognito แล้วเปิดไฟล์ใหม่
- ตรวจว่าใช้ไฟล์ชุด `v3` นี้ ไม่ใช่ชุดเก่า

## เชื่อม Google Sheet
1. เปิด Google Sheet: Crystal Clear Orders Database
2. Extensions > Apps Script
3. วางโค้ดจาก `apps-script/Code.gs`
4. Deploy > New deployment > Web app
5. Execute as: Me / Who has access: Anyone
6. เอา Web App URL มาใส่ใน `config.js` ตรง `API_URL`
