
const CC=(()=>{
const C=window.CONFIG||{};
const LS='crystal_clear_orders_v2';
const PRODUCTS={upper:['ชิ้นบน',1,'🦷'],lower:['ชิ้นล่าง',1,'🦷'],both:['ชิ้นบน + ชิ้นล่าง',2,'✨']};
const STATUS={
  new:['เปิดออเดอร์ใหม่','new','✨'],
  kit_sent:['ส่งชุดพิมพ์แล้ว','waiting','📦'],
  waiting_impression:['รอลูกค้าพิมพ์ส่งกลับ','waiting','↩️'],
  impression_received:['ได้รับแบบพิมพ์แล้ว','working','🧾'],
  production:['กำลังผลิต','working','🧪'],
  qc:['QC / ตรวจงาน','working','🔎'],
  return_waiting:['รอส่งคืน','return','🚚'],
  returned:['ส่งคืนแล้ว','done','✅'],
  closed:['ปิดงานสำเร็จ','done','🏁'],
  problem:['มีปัญหา / remake','problem','⚠️']
};
let orders=[];
function seed(){return [{
  id:'CC-2026-003',createdAt:'2026-05-23T10:00:00.000Z',updatedAt:'2026-05-23T12:00:00.000Z',
  name:'Earth',phone:'0864080008',line:'earth376366',address:'Bangkok, Thailand',productType:'both',pieceCount:2,status:'kit_sent',expectedDate:'2026-05-30',
  trackingOut:'123234',trackingIn:'',trackingReturn:'',note:'เดโมตามภาพตัวอย่าง',photos:[{type:'รูปรีเทนเนอร์สำเร็จ',url:'https://drive.google.com/',note:'ตัวอย่างลิงก์รูป'}],
  logs:[{at:'2026-05-23T10:00:00.000Z',status:'new',message:'สร้างออเดอร์ใหม่'}, {at:'2026-05-23T12:00:00.000Z',status:'kit_sent',message:'ทางร้านส่งกล่องอุปกรณ์และผงพิมพ์ฟันออกไปให้เรียบร้อยแล้ว'}]
}]}
function $(id){return document.getElementById(id)}
function toast(t){const e=$('toast'); if(!e){alert(t);return} e.textContent=t;e.classList.add('show');setTimeout(()=>e.classList.remove('show'),2800)}
function localLoad(){try{return JSON.parse(localStorage.getItem(LS)||'null')||seed()}catch(e){return seed()}}
function save(){localStorage.setItem(LS,JSON.stringify(orders))}
function fmt(d){if(!d)return'-';try{return new Date(d).toLocaleDateString('th-TH',{year:'numeric',month:'short',day:'numeric'})}catch(e){return d}}
function oid(){const y=new Date().getFullYear();const n=(orders.length+1).toString().padStart(3,'0');return`CC-${y}-${n}`}
function statusLabel(s){return (STATUS[s]||STATUS.new)[0]}
function group(s){return (STATUS[s]||STATUS.new)[1]}
function esc(s=''){return String(s).replace(/[&<>'"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[m]))}
async function api(action,payload={}){
  if(!C.API_URL)throw new Error('API_URL ว่าง');
  const r=await fetch(C.API_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify({action,...payload})});
  return await r.json();
}
async function loadOrders(){
  orders=localLoad();
  if(C.API_URL){try{const res=await api('listOrders'); if(res&&res.ok&&Array.isArray(res.orders)){orders=res.orders.length?res.orders:orders; save();}}catch(e){console.warn('ใช้ข้อมูลในเครื่องชั่วคราว:',e.message)}}
  return orders;
}
function productLabel(k){return PRODUCTS[k]?.[0]||k}
function resultHTML(o){
  if(!o)return`<div class="update-box"><h3>ไม่พบข้อมูล</h3><p>กรุณาตรวจสอบเบอร์โทรหรือหมายเลขออเดอร์อีกครั้ง หากเพิ่งลงทะเบียน อาจรอระบบอัปเดตสักครู่</p></div>`;
  const steps=['kit_sent','waiting_impression','production','return_waiting','closed'];
  const labels=['ส่งชุดพิมพ์ฟัน','ได้รับโมเดลคืน','กำลังผลิต','จัดส่งกลับ','สำเร็จ'];
  let idx=Math.max(0,steps.indexOf(o.status));
  if(['new'].includes(o.status))idx=0;
  if(['impression_received','qc'].includes(o.status))idx=2;
  if(['returned','closed'].includes(o.status))idx=4;
  const tl=steps.map((s,i)=>`<div class="step ${i==idx?'active':i<idx?'done':''}"><div class="dot">${STATUS[s][2]}</div><div>${labels[i]}</div></div>`).join('');
  const last=(o.logs||[]).slice(-1)[0]||{};
  return`<div class="customer-head"><div class="icon">👥</div><div><h2>สวัสดีคุณ ${esc(o.name)}</h2><p>ประเภทชิ้นงาน: ${esc(productLabel(o.productType))} • ${esc(o.pieceCount)} ชิ้น • หมายเลขออเดอร์: ${esc(o.id)}</p></div></div><div class="timeline">${tl}</div><div class="update-box"><h3>ความคืบหน้าล่าสุด</h3><p>${esc(last.message||statusLabel(o.status))}</p><p><b>เลขพัสดุส่งชุดพิมพ์:</b> ${esc(o.trackingOut||'-')} &nbsp; <b>เลขพัสดุส่งรีเทนเนอร์คืน:</b> ${esc(o.trackingReturn||'-')}</p><p>✨ หากได้รับชุดพิมพ์แล้ว กรุณาทำตามคู่มือและส่งกล่องกลับมาตามที่อยู่ร้านที่แนบไว้ในกล่องได้เลยค่ะ</p></div>`
}
async function initHomePage(){
  await loadOrders();
  const logo=$('brandLogo'); if(logo){let clicks=0;logo.addEventListener('click',()=>{clicks++;setTimeout(()=>clicks=0,900);if(clicks>=5)location.href='login.html'});logo.addEventListener('dblclick',()=>location.href='login.html')}
  const toStatus=$('toStatus'); if(toStatus)toStatus.onclick=()=>{document.querySelector('#status').scrollIntoView({behavior:'smooth'});setTimeout(()=>$('searchInput')?.focus(),450)};
  if($('statusResult'))$('statusResult').innerHTML=resultHTML(orders[0]);
  const form=$('searchForm'); if(form)form.addEventListener('submit',e=>{e.preventDefault();const q=$('searchInput').value.trim().toLowerCase();const o=orders.find(x=>[x.id,x.phone,x.trackingOut,x.trackingIn,x.trackingReturn].some(v=>(v||'').toLowerCase().includes(q)));$('statusResult').innerHTML=resultHTML(o);});
}
async function initRegisterPage(){
  await loadOrders();
  document.querySelectorAll('.product-card').forEach(c=>c.onclick=()=>{document.querySelectorAll('.product-card').forEach(x=>x.classList.remove('selected'));c.classList.add('selected');$('productType').value=c.dataset.product});
  const form=$('registerForm'); if(form)form.addEventListener('submit',async e=>{e.preventDefault();const p=$('productType').value;if(!p)return toast('กรุณาเลือกประเภทงาน');const o={id:oid(),createdAt:new Date().toISOString(),updatedAt:new Date().toISOString(),name:$('name').value.trim(),phone:$('phone').value.trim(),line:$('line').value.trim(),address:$('address').value.trim(),productType:p,pieceCount:PRODUCTS[p][1],status:'new',expectedDate:'',trackingOut:'',trackingIn:'',trackingReturn:'',note:'สร้างจากหน้าลูกค้า',photos:[],logs:[{at:new Date().toISOString(),status:'new',message:'ลูกค้ากรอกข้อมูลและสร้างออเดอร์ใหม่'}]};orders.unshift(o);save();try{await api('createOrder',{order:o})}catch(err){console.warn(err.message)}toast(`สร้างออเดอร์ ${o.id} สำเร็จ`);setTimeout(()=>location.href=`index.html#status`,1000)});
}
function initLoginPage(){const form=$('loginForm'); if(form)form.addEventListener('submit',e=>{e.preventDefault();if($('username').value===C.ADMIN_USERNAME&&$('password').value===C.ADMIN_PASSWORD){sessionStorage.setItem('cc_admin','1');location.href='admin.html'}else toast('Username หรือ Password ไม่ถูกต้อง')})}
function statsHTML(list){const total=list.reduce((s,o)=>s+(+o.pieceCount||0),0);const count=g=>list.filter(o=>group(o.status)===g).length;const arr=[['จำนวนชิ้นทั้งหมด',total,'🦷'],['ออเดอร์ใหม่',count('new'),'✨'],['รอลูกค้าพิมพ์',count('waiting'),'📦'],['ระหว่างทำ',count('working'),'🧪'],['รอส่งคืน',count('return'),'🚚'],['มีปัญหา',count('problem'),'⚠️']];return arr.map(x=>`<div class="stat"><small>${x[2]} ${x[0]}</small><b>${x[1]}</b></div>`).join('')}
function badge(s){return`<span class="badge b-${group(s)}">${STATUS[s]?.[2]||'•'} ${statusLabel(s)}</span>`}
function card(o){return`<article class="order-card"><div>${badge(o.status)}</div><h3>${esc(o.name)} <small style="color:#7a899c">${esc(o.id)}</small></h3><div class="meta">โทร: ${esc(o.phone)}<br>Line: ${esc(o.line)}<br>${esc(productLabel(o.productType))} • ${o.pieceCount} ชิ้น<br>อัปเดต: ${fmt(o.updatedAt)}</div><button class="small-btn" onclick="CC.openOrder('${o.id}')">ดูรายละเอียด</button></article>`}
function renderAdmin(){let tab=document.querySelector('.nav button.active')?.dataset.tab||'orders';let q=($('adminSearch')?.value||'').toLowerCase();let sf=$('statusFilter')?.value||'all';let list=orders.filter(o=>{let ok=tab==='orders'||group(o.status)===tab;let qs=[o.id,o.name,o.phone,o.line,o.trackingOut,o.trackingIn,o.trackingReturn].join(' ').toLowerCase().includes(q);let ss=sf==='all'||o.status===sf;return ok&&qs&&ss});$('stats').innerHTML=statsHTML(orders);$('orderGrid').innerHTML=list.map(card).join('')||'<div class="update-box"><h3>ยังไม่มีออเดอร์ในหมวดนี้</h3></div>'}
async function initAdminPage(){if(sessionStorage.getItem('cc_admin')!=='1')return location.href='login.html';await loadOrders();const sel=$('statusFilter');Object.keys(STATUS).forEach(k=>sel.insertAdjacentHTML('beforeend',`<option value="${k}">${statusLabel(k)}</option>`));document.querySelectorAll('.nav button[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.nav button').forEach(x=>x.classList.remove('active'));b.classList.add('active');renderAdmin()});$('adminSearch').oninput=renderAdmin;$('statusFilter').onchange=renderAdmin;$('logoutBtn').onclick=()=>{sessionStorage.removeItem('cc_admin');location.href='login.html'};$('closeModal').onclick=()=>$('modal').classList.remove('show');$('newOrderBtn').onclick=()=>openOrder('new');renderAdmin()}
function detailForm(o){const isNew=o==='new';o=isNew?{id:oid(),name:'',phone:'',line:'',address:'',productType:'both',pieceCount:2,status:'new',expectedDate:'',trackingOut:'',trackingIn:'',trackingReturn:'',note:'',photos:[],logs:[]}:o;return`<form id="orderForm"><div class="detail-grid"><div class="field"><label>Order ID</label><input id="f_id" value="${esc(o.id)}" readonly></div><div class="field"><label>สถานะ</label><select id="f_status">${Object.keys(STATUS).map(k=>`<option value="${k}" ${o.status===k?'selected':''}>${statusLabel(k)}</option>`).join('')}</select></div><div class="field"><label>ชื่อ</label><input id="f_name" value="${esc(o.name)}"></div><div class="field"><label>เบอร์</label><input id="f_phone" value="${esc(o.phone)}"></div><div class="field"><label>Line ID</label><input id="f_line" value="${esc(o.line)}"></div><div class="field"><label>ประเภทงาน</label><select id="f_product">${Object.keys(PRODUCTS).map(k=>`<option value="${k}" ${o.productType===k?'selected':''}>${PRODUCTS[k][0]} (${PRODUCTS[k][1]} ชิ้น)</option>`).join('')}</select></div></div><div class="field"><label>ที่อยู่</label><textarea id="f_address" rows="3">${esc(o.address)}</textarea></div><div class="detail-grid"><div class="field"><label>เลขพัสดุส่งชุดพิมพ์ไป</label><input id="f_out" value="${esc(o.trackingOut)}"></div><div class="field"><label>เลขพัสดุลูกค้าส่งกลับ</label><input id="f_in" value="${esc(o.trackingIn)}"></div><div class="field"><label>เลขพัสดุส่งรีเทนเนอร์คืน</label><input id="f_return" value="${esc(o.trackingReturn)}"></div><div class="field"><label>วันที่คาดว่าจะเสร็จ</label><input id="f_expected" type="date" value="${esc(o.expectedDate)}"></div></div><div class="field"><label>ลิงก์รูป Google Drive / หมายเหตุรูป</label><textarea id="f_photos" rows="3" placeholder="วางลิงก์รูป หรือหลายลิงก์ได้">${(o.photos||[]).map(p=>p.url).join('\n')}</textarea></div><div class="field"><label>หมายเหตุ / ข้อความอัปเดตล่าสุด</label><textarea id="f_note" rows="3">${esc(o.note)}</textarea></div><button class="primary-btn">บันทึกออเดอร์</button></form><h3>ประวัติการอัปเดต</h3><div class="update-box">${(o.logs||[]).map(l=>`<p><b>${fmt(l.at)}</b> — ${esc(l.message)}</p>`).join('')||'ยังไม่มีประวัติ'}</div>`}
async function openOrder(id){const o=id==='new'?'new':orders.find(x=>x.id===id);$('modalTitle').textContent=id==='new'?'เพิ่มออเดอร์ใหม่':'รายละเอียดออเดอร์';$('modalBody').innerHTML=detailForm(o);$('modal').classList.add('show');$('orderForm').onsubmit=async e=>{e.preventDefault();const p=$('f_product').value;let old=orders.find(x=>x.id===id);let item={id:$('f_id').value,createdAt:(id==='new'?new Date().toISOString():(old?.createdAt||new Date().toISOString())),updatedAt:new Date().toISOString(),name:$('f_name').value,phone:$('f_phone').value,line:$('f_line').value,address:$('f_address').value,productType:p,pieceCount:PRODUCTS[p][1],status:$('f_status').value,expectedDate:$('f_expected').value,trackingOut:$('f_out').value,trackingIn:$('f_in').value,trackingReturn:$('f_return').value,note:$('f_note').value,photos:$('f_photos').value.split('\n').filter(Boolean).map(url=>({type:'รูปงาน',url,note:''})),logs:[...(old?.logs||[]),{at:new Date().toISOString(),status:$('f_status').value,message:$('f_note').value||`อัปเดตสถานะเป็น ${statusLabel($('f_status').value)}`}]};const i=orders.findIndex(x=>x.id===item.id);if(i>=0)orders[i]=item;else orders.unshift(item);save();try{await api('updateOrder',{order:item})}catch(err){console.warn(err.message)}$('modal').classList.remove('show');renderAdmin();toast('บันทึกออเดอร์เรียบร้อย')}}
return{initHomePage,initRegisterPage,initLoginPage,initAdminPage,openOrder}})();
