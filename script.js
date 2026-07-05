// =========================================================
// AMARISSE HIJAB — script.js (versi bersih, tanpa WordPress)
// =========================================================

document.addEventListener("DOMContentLoaded", function () {

  var cart = [];

  var cartDrawer   = document.getElementById("cartDrawer");
  var cartOverlay  = document.getElementById("cartOverlay");
  var cartClose    = document.getElementById("cartClose");
  var cartIconBtn  = document.getElementById("cartIconBtn");
  var cartBody     = document.getElementById("cartBody");
  var cartEmptyMsg = document.getElementById("cartEmptyMsg");
  var cartTotalEl  = document.getElementById("cartTotal");
  var cartCountEl  = document.getElementById("cartCount");

  function openCart() {
    cartDrawer.classList.add("active");
    cartOverlay.classList.add("active");
  }
  function closeCart() {
    cartDrawer.classList.remove("active");
    cartOverlay.classList.remove("active");
  }

  if (cartClose)   cartClose.addEventListener("click", closeCart);
  if (cartOverlay) cartOverlay.addEventListener("click", closeCart);
  if (cartIconBtn) cartIconBtn.addEventListener("click", openCart);

  function formatRupiah(num) {
    return "Rp" + num.toLocaleString("id-ID");
  }

  function renderCart() {
    cartBody.innerHTML = "";
    if (cart.length === 0) {
      cartBody.appendChild(cartEmptyMsg);
      cartTotalEl.textContent = formatRupiah(0);
      cartCountEl.textContent = "0";
      return;
    }
    var total = 0;
    cart.forEach(function (item) {
      total += item.price * item.qty;
      var row = document.createElement("div");
      row.className = "cart-item";
      row.innerHTML =
        '<div>' +
          '<div class="cart-item-name">' + item.name + '</div>' +
          '<div class="cart-item-meta">Warna: ' + item.color + ' &times; ' + item.qty + '</div>' +
        '</div>' +
        '<div class="cart-item-price">' + formatRupiah(item.price * item.qty) + '</div>';
      cartBody.appendChild(row);
    });
    cartTotalEl.textContent = formatRupiah(total);
    var totalQty = cart.reduce(function (sum, i) { return sum + i.qty; }, 0);
    cartCountEl.textContent = String(totalQty);
  }

  function addToCart(name, price, color) {
    var existing = cart.find(function (i) { return i.name === name && i.color === color; });
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ name: name, price: price, color: color, qty: 1 });
    }
    renderCart();
    openCart();
  }

  var colorNames = ["Hitam", "Krem", "Coklat", "Hijau", "Pink", "Ungu", "Navy", "Maroon"];
  document.querySelectorAll(".swatches").forEach(function (group) {
    group.addEventListener("click", function (e) {
      var target = e.target;
      if (!target.classList.contains("swatch")) return;
      group.querySelectorAll(".swatch").forEach(function (s) {
        s.classList.remove("active");
      });
      target.classList.add("active");
      var idx = Array.prototype.indexOf.call(group.children, target);
      var label = colorNames[idx] || "Hitam";
      var card = group.closest(".product-card");
      if (card) {
        var colorLabel = card.querySelector(".swatch-row span:last-child");
        if (colorLabel) colorLabel.textContent = label;
      }
    });
  });

  document.querySelectorAll(".btn-buy").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var card = btn.closest(".product-card");
      if (!card) return;
      var name = card.querySelector(".product-name").textContent.trim();
      var priceText = card.querySelector(".product-price").textContent.replace(/[^\d]/g, "");
      var price = parseInt(priceText, 10) || 0;
      var activeSwatch = card.querySelector(".swatch.active");
      var color = "Hitam";
      if (activeSwatch) {
        var idx = Array.prototype.indexOf.call(activeSwatch.parentElement.children, activeSwatch);
        color = colorNames[idx] || "Hitam";
      }
      addToCart(name, price, color);
    });
  });

  var toggle = document.getElementById("menuToggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var nav = document.querySelector(".nav-main");
      if (!nav) return;
      nav.classList.toggle("mobile-open");
    });
  }

  document.querySelectorAll(".ph[style*='background-image']").forEach(function (el) {
    var match = el.getAttribute("style").match(/url\('([^']+)'\)/);
    if (!match) return;
    var path = match[1];
    var img = new Image();
    img.onload = function () {};
    img.onerror = function () {
      el.style.backgroundImage = "none";
      var label = document.createElement("span");
      label.textContent = "Ganti dengan foto: " + path.split("/").pop();
      el.appendChild(label);
    };
    img.src = path;
  });

  renderCart();

});