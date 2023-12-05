var create_user_container = document.getElementById("create_user_container")
var userList = document.getElementById("user_list")
var user = document.getElementById("user")
function showUserOptions() {
    userList.hidden = false
    user.classList.add("big")
}
function hideUserOptions() {
    userList.hidden = true
    user.classList.remove("big")
}

async function loginUser() {
    const token = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({
            email: document.getElementById("userEmail").value,
            password: document.getElementById("userPassword").value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    console.log(token)
    const real_token = await token.json()
    if(real_token == "Usuário não existe") {
        alert("Usuário ou senha incorretos")
        return
    }
    console.log(real_token)
    const cookie_str = `auth=${real_token}`
    document.cookie = cookie_str
    document.location.href = "/"
}

async function addToCart() {
    const product = {};
    var ArrayOfProducts;
    product.img_path = document.getElementById("product_image").src
    product.price = document.getElementById("product_price").innerHTML.trim().slice(2)
    product.name = document.getElementById("product_name").innerHTML.trim()
    product.desc = document.getElementById("product_desc").innerHTML.trim()
    product.quant = 1
    var current_items = JSON.parse(localStorage.getItem("inCart"))
    for (const i in current_items) {
        if (current_items[i].name == product.name) {
            product.quant = current_items[i].quant + 1
            current_items.splice(i, 1)
        }
    }

    if (current_items === null) {
        ArrayOfProducts = [product]
    } else {
        current_items.push(product)
        ArrayOfProducts = current_items
    }
    localStorage.setItem("inCart", JSON.stringify(ArrayOfProducts))
    console.log(ArrayOfProducts)
    await fetch("/buyProduct", {
        method: "POST",
        body: JSON.stringify({
            product: product.name
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
}

function deleteCart() {
    localStorage.removeItem("inCart")
}

function checkLogin() {
    console.log(document.cookie)
}

function logOut() {
    document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.location.href = '/'
}
const user_list = document.getElementById("user_list")
if (document.cookie) {
    user_list.insertAdjacentHTML("afterbegin", `
    <a href="/favorites" class="headerlink"><li class="user_option">Favoritos</li></a>
    <li onclick="logOut()" class="user_option">Deslogar</li>
    `)
} else {
    user_list.insertAdjacentHTML("afterbegin", `
    <a href="/signup" class="headerlink"><li class="user_option" >Criar conta</li> </a>
    <a href="/login" class="headerlink"> <li class="user_option">Logar</li> </a>
    `)
}

async function favorite() {
    const name = document.getElementById("product_name").innerHTML.trim()
    const token = await fetch("/favoriteProduct", {
        method: "PUT",
        body: JSON.stringify({
            name: name
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })

}
