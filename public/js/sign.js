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
    if (real_token == "User already found") {
        alert("Já existe um usário com esse email")
        return
    }
    console.log(real_token)
    const cookie_str = `auth=${real_token}`
    document.location.href = "/login"
}

var form = document.getElementById("myForm");
console.log(form)
function handleForm(event) {
    event.preventDefault()
    createUser()
}
form.addEventListener('submit', handleForm);