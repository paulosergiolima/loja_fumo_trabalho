create_user_container = document.getElementById("create_user_container")
shadow = document.getElementById("shadow")
userList = document.getElementById("user_list")
user = document.getElementById("user")
function showUserOptions() {
    userList.hidden = false
    user.classList.add("big")
}
function hideUserOptions() {
    userList.hidden = true
    user.classList.remove("big")
}
async function createUser() {
    const body_value = JSON.stringify({
        name: document.getElementById("notUserName").value,
        email: document.getElementById("userEmail").value,
        password: document.getElementById("userPassword").value
    })
    console.log(body_value)
    console.log(`${document.getElementById("notUserName").value}`)
    console.log(`${document.getElementById("userEmail").value}`)
    console.log(`${document.getElementById("userPassword").value}`)
    const token = await fetch("/user", {
        method: "POST",
        body: JSON.stringify({
            name: document.getElementById("notUserName").value,
            email: document.getElementById("userEmail").value,
            password: document.getElementById("userPassword").value
        }),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    const real_token = await token.json()
    console.log(real_token)
    localStorage.setItem("myToken", realToken)

}
function showCreateUser() {
    shadow.hidden = false
    create_user_container.hidden = false
}
function close_create_user() {
    shadow.hidden = true
    create_user_container.hidden = true
}
function addToCart() {
    const product = {};
    var ArrayOfProducts;
    product.img_path = document.getElementById("product_image").src
    product.price = document.getElementById("product_price").innerHTML.trim()
    product.name = document.getElementById("product_name").innerHTML.trim()
    product.desc = document.getElementById("product_desc").innerHTML.trim()
    current_items = JSON.parse(localStorage.getItem("inCart"))
    if (current_items === null) {
         ArrayOfProducts =[product]
    }else {
         current_items.push(product)
         ArrayOfProducts = current_items
    }
    localStorage.setItem("inCart", JSON.stringify(ArrayOfProducts))
    console.log(ArrayOfProducts)
}

function deleteCart() {
    localStorage.removeItem("inCart")
}