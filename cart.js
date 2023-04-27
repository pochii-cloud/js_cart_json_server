let openshopping = document.querySelector(".shopping");
let closeshopping = document.querySelector(".closeShopping");
let list = document.querySelector(".list");
let listCard = document.querySelector(".listCard");
let body = document.querySelector("body");
let total = document.querySelector(".total");
let quantity = document.querySelector(".quantity");

let form=document.querySelector('#form')
let productname=document.getElementById('p_name')
let productimage=document.getElementById('p_image')
let productdescription=document.getElementById('p_description')
let productprice=document.getElementById('p_price')
let submitbutton=document.getElementById('btn')
let modalbtn=document.querySelector('.btn1')

openshopping.addEventListener("click", () => {
  body.classList.add("active");
});
closeshopping.addEventListener("click", () => {
  body.classList.remove("active");
});

let listCards = [];


function readinputs(){
  let productName=productname.value;
  let productImage=productimage.value;
  let productDescription=productdescription.value;
  let productPrice=productprice.value;

  return {
    productName,
    productImage,
    productDescription,
    productPrice
  }
}

function readValues() {
  const productName = document.querySelector("#p_name").value;
  const productImage = document.querySelector("#p_image").value;
  const productPrice = document.querySelector("#p_price").value;
  const productDescription = document.querySelector("#p_description").value;
  return { productName, productImage, productDescription, productPrice };
}

function prePopulate(product) {
  document.querySelector("#p_name").value = product.productName;
  document.querySelector("#p_image").value = product.productImage;
  document.querySelector("#p_price").value = product.productPrice;
  document.querySelector("#p_description").value = product.productDescription;
  document.querySelector("#btn").textContent = `Update Product`;
  document.querySelector('.btn1').textContent=`Update Product`
}

async function  updateProduct(id){
  const response = await fetch(`https://json-server-3nva.onrender.com/products/${id}`)
  const product = await response.json()

 prePopulate(product)
 const btn = document.querySelector("#btn")
 btn.addEventListener('click', (e)=>{
  e.preventDefault()
  
  const updatedProduct= readValues();
  if(btn.innerText==="Update Product"){
      console.log("Updating");
      sendUpdate({...updatedProduct, id})
     }
 })

}

async function sendUpdate(product) {
  await fetch(`https://json-server-3nva.onrender.com/products/${product.id}`, {
    method: "PUT",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
}


async function addproducts (){
   let data1=readinputs();
   console.log(data1)
   
  
    await fetch("https://json-server-3nva.onrender.com/products",{
      method:'POST',
      headers:{
        'content-type':'application/json'
      },
      body:JSON.stringify(data1)
    })
  console.log('success')
}

submitbutton.addEventListener('click',()=>{
  if(submitbutton.innerText==="Add Product"){
    addproducts()
  }
})

async function  deleteProduct(id) {
  await fetch(`https://json-server-3nva.onrender.com/products/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}


async function initApp() {
  const response = await fetch("https://json-server-3nva.onrender.com/products");
  const products = await response.json();
  console.log(products)
  products.map((value, key) => {
    let newDiv = document.createElement("div");
    newDiv.classList.add("item");
    newDiv.innerHTML += `<img src="${value.productImage}" height=150px/>
         <div class="title"><b>${value.productName}</b></div>
         <div class="description">${value.productDescription}</div>
         
         <div class="card-butttons">
         <div class="price">Ksh.${value.productPrice}</div>  
         <ion-icon name="cart-outline" onclick="addToCard(${key})"></ion-icon>
         <ion-icon name="trash-outline" onclick="deleteProduct(${value.id})"></ion-icon>
         <ion-icon name="create-outline" onclick="updateProduct(${value.id})"></ion-icon></div>
        
        `;
    list.appendChild(newDiv);
  });
}
initApp();

async function addToCard(key) {
  const response = await fetch("https://json-server-3nva.onrender.com/products");
  const products = await response.json();
  if (listCards[key] == null) {
    listCards[key] = products[key];
    listCards[key].quantity = 1;
  }
  reloadcart();
}

function reloadcart() {
  listCard.innerHTML = "";
  let count = 0;
  let totalprice = 0;

  listCards.forEach((value, key) => {
    totalprice = totalprice - value.productPrice;
    count = count + value.quantity;
    if (value != null) {
      let newDiv = document.createElement("li");
      newDiv.innerHTML += `
            <div><img src="${value.productImage}" height=100px></div>
            <div class="content">
            <div>${value.productName}</div>
            <div class="price">${value.productPrice}</div>
            <div>
            <button onClick="changeQuantity(${key},${
        value.quantity - 1
      })">-</button>
            <div class="count">${value.quantity}</div>
            <button onClick="changeQuantity(${key},${
        value.quantity + 1
      })">+</button>
            </div>
            </div>`;
      listCard.appendChild(newDiv);
    }
  });
  total.innerText = 'Total:' + Math.abs(totalprice);
  quantity.innerText = count;
}

async function changeQuantity(key, quantity) {
  const response = await fetch("https://json-server-3nva.onrender.com/products");
  const products = await response.json();
  if (quantity == 0) {
    delete listCards[key];
  } else {
    listCards[key].quantity = quantity;
    listCards[key].productPrice = quantity * products[key].productPrice;
  }
  reloadcart();
}


const url = window.location.href
console.log("this is the url=>" +url)
