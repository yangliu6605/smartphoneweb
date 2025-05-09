// 商品数据 - 实际项目中应该从后端API获取
const products = {
    // 手机产品
    "xiaomi15ultra": {
        id: "xiaomi15ultra",
        name: "小米15 Ultra",
        price: 5999,
        image: "images/xiaomi 15 ultra.png",
        category: "手机"
    },
    "redmiturbo4": {
        id: "redmiturbo4",
        name: "Redmi Turbo 4",
        price: 1999,
        image: "images/redmi turbo 4.png",   
        category: "手机"
    },
    "redmiturbo4pro": {
        id: "redmiturbo4pro",
        name: "Redmi Turbo 4 Pro",
        price: 2599,
        image: "images/redmi turbo 4 Pro.png",
        category: "手机"
    },
    "redmi14c": {
        id: "redmi14c",
        name: "Redmi 14C",
        price: 899,
        image: "images/redmi 14c.png",
        category: "手机"
    },
    // 智能穿戴产品
    "redmishouhuan3": {
        id: "redmishouhuan3",
        name: "Redmi 手环3",
        price: 199,
        image: "images/redmi shouhuan 3.png",
        category: "智能穿戴"
    },
    "redmiwatch5": {
        id: "redmiwatch5",
        name: "Redmi Watch 5",
        price: 499,
        image: "images/redmi watch 5.png",
        category: "智能穿戴"
    },
    "xiaomishouhuan9pro": {
        id: "xiaomishouhuan9pro",
        name: "小米手环9 Pro",
        price: 399,
        image: "images/xiaomi shouhuan 9 pro.png",
        category: "智能穿戴"
    },
    "xiaomiwatchs4": {
        id: "xiaomiwatchs4",
        name: "小米Watch S4",
        price: 1299,
        image: "images/xiaomi watch s4.png",
        category: "智能穿戴"
    }
};

// 购物车对象
let cart = {};

// 从本地存储加载购物车
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// 保存购物车到本地存储
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

// 更新购物车数量显示
function updateCartCount() {
    let total = 0;
    for (const id in cart) {
        total += cart[id].quantity;
    }
    document.querySelector('.badge').textContent = total;
}

// 添加商品到购物车
function addToCart(productId) {
    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        cart[productId] = {
            product: products[productId],
            quantity: 1
        };
    }
    saveCart();
    
    // 显示添加成功的提示
    const toast = new bootstrap.Toast(document.getElementById('addedToast'));
    toast.show();
}

// 从购物车移除商品
function removeFromCart(productId) {
    delete cart[productId];
    saveCart();
    renderCart();
}

// 更新购物车中商品数量
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    cart[productId].quantity = newQuantity;
    saveCart();
    renderCart();
}

// 渲染购物车内容
function renderCart() {
    const cartItemsEl = document.getElementById('cartItems');
    const cartTotalEl = document.getElementById('cartTotal');
    
    if (Object.keys(cart).length === 0) {
        cartItemsEl.innerHTML = '<tr><td colspan="6" class="text-center py-4">购物车是空的</td></tr>';
        cartTotalEl.textContent = '¥0.00';
        return;
    }
    
    let itemsHtml = '';
    let total = 0;
    
    for (const id in cart) {
        const item = cart[id];
        const subtotal = item.product.price * item.quantity;
        total += subtotal;
        
        itemsHtml += `
            <tr>
                <td><img src="${item.product.image}" alt="${item.product.name}" style="width: 50px;"></td>
                <td>${item.product.name}</td>
                <td>¥${item.product.price.toFixed(2)}</td>
                <td>
                    <div class="input-group" style="width: 120px;">
                        <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity('${id}', ${item.quantity - 1})">-</button>
                        <input type="number" class="form-control text-center" value="${item.quantity}" min="1" 
                               onchange="updateQuantity('${id}', parseInt(this.value))">
                        <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity('${id}', ${item.quantity + 1})">+</button>
                    </div>
                </td>
                <td>¥${subtotal.toFixed(2)}</td>
                <td><button class="btn btn-danger btn-sm" onclick="removeFromCart('${id}')">删除</button></td>
            </tr>
        `;
    }
    
    cartItemsEl.innerHTML = itemsHtml;
    cartTotalEl.textContent = `¥${total.toFixed(2)}`;
}

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    // 加载购物车
    loadCart();
    
    // 为所有"添加商品"按钮添加事件
    document.querySelectorAll('.btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            // 从按钮的父元素向上找到卡片元素，然后获取图片的alt属性作为产品ID
            const card = this.closest('.card');
            if (card) {
                const img = card.querySelector('img');
                if (img) {
                    // 从图片文件名中提取产品ID
                    const src = img.getAttribute('src');
                    const productId = src.split('/').pop().split('.')[0].replace(/\s+/g, '').toLowerCase();
                    if (products[productId]) {
                        addToCart(productId);
                    }
                }
            }
        });
    });
    
    // 购物车按钮点击事件
    document.querySelector('.bi-cart').closest('a').addEventListener('click', function(e) {
        e.preventDefault();
        renderCart();
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    });
    
    // 移动端底部购物车按钮点击事件
    document.querySelector('.bi-cart-fill').closest('a').addEventListener('click', function(e) {
        e.preventDefault();
        renderCart();
        const cartModal = new bootstrap.Modal(document.getElementById('cartModal'));
        cartModal.show();
    });
});