const products = [
  {id:1,name:"Inferno Core Tee",category:"tees",price:899,badge:"BESTSELLER",visual:"INFERNO",bg:"#24201d"},
  {id:2,name:"Ember Oversized Tee",category:"tees",price:999,badge:"NEW",visual:"EMBER",bg:"#171b1e"},
  {id:3,name:"Flame Mark Hoodie",category:"hoodies",price:1899,badge:"LIMITED",visual:"🔥",bg:"#211616"},
  {id:4,name:"After Dark Hoodie",category:"hoodies",price:2099,badge:"NEW",visual:"AFTER\nDARK",bg:"#161719"},
  {id:5,name:"Inferno Snapback",category:"accessories",price:799,badge:"",visual:"CAP",bg:"#1d1916"},
  {id:6,name:"Fireline Tote",category:"accessories",price:699,badge:"",visual:"FIRELINE",bg:"#1a1c1a"},
  {id:7,name:"Inferno Steel Chain",category:"accessories",price:1199,badge:"LIMITED",visual:"✦",bg:"#1b1b1b"},
  {id:8,name:"Heatwave Tee",category:"tees",price:949,badge:"",visual:"HEATWAVE",bg:"#221917"}
];

const money = n => "₹" + n.toLocaleString("en-IN");
let cart = JSON.parse(localStorage.getItem("infernoCart") || "[]");
let currentCategory = "all";
let query = "";

const grid = document.getElementById("productGrid");
const empty = document.getElementById("emptyState");
const cartDrawer = document.getElementById("cartDrawer");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartSubtotal = document.getElementById("cartSubtotal");
const checkoutTotal = document.getElementById("checkoutTotal");
const toast = document.getElementById("toast");

function renderProducts(){
  let list = products.filter(p => {
    const categoryOk = currentCategory === "all" || p.category === currentCategory;
    const text = (p.name + " " + p.category + " " + p.visual).toLowerCase();
    return categoryOk && text.includes(query.toLowerCase());
  });
  const sort = document.getElementById("sortSelect").value;
  if(sort === "low") list.sort((a,b)=>a.price-b.price);
  if(sort === "high") list.sort((a,b)=>b.price-a.price);
  if(sort === "name") list.sort((a,b)=>a.name.localeCompare(b.name));
  grid.innerHTML = list.map(p => `
    <article class="product-card">
      <div class="product-image" style="--card-bg:${p.bg}">
        ${p.badge ? `<span class="tag">${p.badge}</span>` : ""}
        <div class="visual">${p.visual === "🔥" ? `<span class="mini-fire">🔥</span>` : p.visual.replace("\n","<br>")}</div>
      </div>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-meta"><span class="price">${money(p.price)}</span><span class="category-label">${p.category}</span></div>
        <button class="add-btn" data-add="${p.id}">Add to cart</button>
      </div>
    </article>
  `).join("");
  empty.hidden = list.length !== 0;
}
function saveCart(){ localStorage.setItem("infernoCart", JSON.stringify(cart)); renderCart(); }
function cartQty(){ return cart.reduce((sum,i)=>sum+i.qty,0); }
function renderCart(){
  cartCount.textContent = cartQty();
  if(!cart.length){
    cartItems.innerHTML = `<div class="empty-cart"><strong>YOUR CART IS EMPTY</strong><span>Find something worth wearing.</span></div>`;
    cartSubtotal.textContent = money(0);
    checkoutTotal.textContent = money(0);
    return;
  }
  cartItems.innerHTML = cart.map(item => {
    const p = products.find(x=>x.id===item.id);
    return `<div class="cart-row">
      <div class="cart-thumb" style="background:${p.bg}">${p.visual === "🔥" ? "🔥" : p.visual}</div>
      <div><h4>${p.name}</h4><div class="small">${money(p.price)} each</div>
        <div class="qty"><button data-dec="${p.id}">−</button><span>${item.qty}</span><button data-inc="${p.id}">+</button></div>
        <button class="remove" data-remove="${p.id}">REMOVE</button>
      </div>
      <strong>${money(p.price * item.qty)}</strong>
    </div>`;
  }).join("");
  const total = cart.reduce((sum,item)=>sum + products.find(p=>p.id===item.id).price*item.qty,0);
  cartSubtotal.textContent = money(total);
  checkoutTotal.textContent = money(total);
}
function showToast(message){
  toast.textContent = message; toast.classList.add("show");
  clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>toast.classList.remove("show"),1800);
}
function addToCart(id){
  const found = cart.find(x=>x.id===id);
  if(found) found.qty++;
  else cart.push({id,qty:1});
  saveCart(); showToast("Added to your cart 🔥");
}
function openCart(){cartDrawer.classList.add("open");overlay.classList.add("show");}
function closeCart(){cartDrawer.classList.remove("open");overlay.classList.remove("show");}
document.addEventListener("click", e => {
  const add = e.target.closest("[data-add]"); if(add){addToCart(Number(add.dataset.add));return;}
  const inc = e.target.closest("[data-inc]"); if(inc){const x=cart.find(i=>i.id===Number(inc.dataset.inc));x.qty++;saveCart();return;}
  const dec = e.target.closest("[data-dec]"); if(dec){const x=cart.find(i=>i.id===Number(dec.dataset.dec));x.qty--;if(x.qty<=0)cart=cart.filter(i=>i.id!==x.id);saveCart();return;}
  const rem = e.target.closest("[data-remove]"); if(rem){cart=cart.filter(i=>i.id!==Number(rem.dataset.remove));saveCart();return;}
});
document.getElementById("filters").addEventListener("click", e=>{
  const btn=e.target.closest(".filter"); if(!btn)return;
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  btn.classList.add("active"); currentCategory=btn.dataset.category; renderProducts();
});
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.getElementById("searchInput").addEventListener("input",e=>{query=e.target.value;renderProducts();});
document.getElementById("searchToggle").onclick=()=>{document.getElementById("searchPanel").classList.toggle("open");document.getElementById("searchInput").focus();};
document.getElementById("searchClose").onclick=()=>document.getElementById("searchPanel").classList.remove("open");
document.getElementById("cartToggle").onclick=openCart;
document.getElementById("cartClose").onclick=closeCart;
document.getElementById("continueShopping").onclick=closeCart;
overlay.onclick=closeCart;
document.getElementById("menuToggle").onclick=()=>document.getElementById("mobileNav").classList.toggle("open");
document.querySelectorAll(".mobile-nav a").forEach(a=>a.onclick=()=>document.getElementById("mobileNav").classList.remove("open"));

const modal=document.getElementById("checkoutModal");
document.getElementById("checkoutButton").onclick=()=>{
  if(!cart.length){showToast("Your cart is empty.");return;}
  closeCart(); modal.classList.add("open"); document.body.style.overflow="hidden";
};
document.getElementById("checkoutClose").onclick=()=>{modal.classList.remove("open");document.body.style.overflow="";};
modal.addEventListener("click",e=>{if(e.target===modal){modal.classList.remove("open");document.body.style.overflow="";}});

document.getElementById("checkoutForm").addEventListener("submit",e=>{
  e.preventDefault();
  const form=e.currentTarget;
  const orderNo="INF-"+Math.floor(100000+Math.random()*900000);
  document.getElementById("orderSuccess").hidden=false;
  document.getElementById("orderSuccess").innerHTML=`<strong>ORDER RECEIVED — ${orderNo}</strong><br><br>This is a demo checkout. Connect a payment gateway and backend to process real orders.`;
  form.hidden=true; cart=[]; saveCart();
});
document.getElementById("newsletterForm").addEventListener("submit",e=>{
  e.preventDefault();
  document.getElementById("newsletterMessage").textContent="You're on the list. Welcome to the fire.";
  e.currentTarget.reset();
});
renderProducts();renderCart();
