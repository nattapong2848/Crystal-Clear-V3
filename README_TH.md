# Crystal Clear Web System

เว็บระบบลูกค้าและหลังบ้านสำหรับร้าน Crystal Clear

## หน้าเว็บ

- `index.html` หน้าหลักลูกค้า มี 2 ตัวเลือก: ลงทะเบียนเพื่อรับรีเทนเนอร์ / ตรวจสอบสถานะ
- `register.html` ฟอร์มลูกค้ากรอกข้อมูลเอง
- `login.html` หน้า Login Admin แยกต่างหาก
- `admin.html` หลังบ้าน Seller Portal

## Admin

Username: `admin`  
Password: `1234`

แก้ได้ใน `config.js`

## วิธีซ่อนปุ่ม Admin

หน้า `index.html` ไม่มีปุ่ม Seller Portal โชว์ชัด ๆ แล้ว มีแค่ปุ่ม ⚙ มุมขวาล่างแบบจางมาก และสามารถดับเบิลคลิกโลโก้/คลิกโลโก้ 5 ครั้งเพื่อเข้า `login.html` ได้

## Google Sheet

1. เปิด Google Sheet ที่สร้างชื่อ Crystal Clear Orders Database
2. ไปที่ Extensions > Apps Script
3. วางโค้ดจาก `apps-script/Code.gs`
4. Deploy > New deployment > Web app
5. Copy Web App URL
6. เอา URL ไปใส่ใน `config.js` ที่ `API_URL`

ถ้ายังไม่ใส่ API_URL เว็บจะใช้ข้อมูลตัวอย่างและ LocalStorage ในเครื่องก่อน
