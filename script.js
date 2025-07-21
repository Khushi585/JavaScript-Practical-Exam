

let products = JSON.parse(localStorage.getItem("products")) || [];
let editingId = null;


const form = document.getElementById("product-form");
const title = document.getElementById("title");
const price = document.getElementById("price");
const image = document.getElementById("image");
const category = document.getElementById("category");

const search = document.getElementById("search");
const sort = document.getElementById("sort");
const filterCategory = document.getElementById("filter-category");

form.addEventListener("submit", e => {
  e.preventDefault();
  if (!title.value || !price.value) 
    return alert("Title and Price are required.");


  const product = {
    id:  Date.now(),
    title: title.value.trim(),
    price: parseFloat(price.value).toFixed(2),
    image: image.value.trim(),
    category: category.value.trim()
  };

  if (editingId) {
    products = products.map(p => p.id === editingId ? product : p);
  } else {
    products.push(product);
  }

  saveProducts();
  AddProducts();
  form.reset();
  editingId = null;
});

function AddProducts(data = products) {
 let output = "";
  const categories = new Set();

  data.forEach(p => {
    categories.add(p.category);

    output += `
      <div class="product-item" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
        <img src="${p.image}" alt="${p.title}" style="width: 100px; height: auto;">
        <div><strong>${p.title}</strong> - $${p.price}</div>
        <small>[${p.category}]</small>
        <div>
          <button onclick="editProduct(${p.id})">Edit</button>
          <button onclick="deleteProduct(${p.id})">Delete</button>
        </div>
      </div>
    `;
    document.getElementById("showProduct").innerHTML = output
  });

  
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products));
}

function editProduct(id) {
  const p = products.find(p => p.id === id);
  if (!p) return;
  title.value = p.title;
  price.value = p.price;
  image.value = p.image;
  category.value = p.category;
  editingId = id;
}

function deleteProduct(id) {
  products = products.filter(p => p.id !== id);
  if (editingId === id) editingId = null;
  saveProducts();
  AddProducts();
}



search.addEventListener("input", () => {
  const value = search.value.toLowerCase();
  const filtered = products.filter(p => p.title.toLowerCase().includes(value));
  AddProducts(filtered);
});

sort.addEventListener("change", () => {
  let sorted = [...products];
  if (sort.value === "asc") {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sort.value === "desc") {
    sorted.sort((a, b) => b.price - a.price);
  }
  AddProducts(sorted);
});



AddProducts();
