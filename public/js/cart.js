const current_items = JSON.parse(localStorage.getItem("inCart"))
const product_list = document.getElementById("cart_list")
var complete_price = 0
for (item of current_items) {
	var product_base = ` <li class="Cart_Product" id="${item.name}">
				<table>
					<tr class="Table">
						<td rowspan="2"class="Product_Img">
							<img class="Img" src="${item.img_path}">
						</td>
						<td class="Product_Name">
							${item.name}
						</td>
						<td rowspan="2"class="Product_Price">
							<div class="IndividualP">R$${item.price}</div>
							<div class="Quantidade"><input onchange="changeTotal('${item.name}')" type="number" value="${item.quant}"></div>
							<div class="PrecoTotal">R$${(item.price * item.quant).toFixed(2)}</div>
						</td>
					</tr>
					<tr>
						<td class="Product_Desc">
							${item.desc}
						</td>
					</tr>
				</table>
			</li>
            `
	complete_price = item.price + complete_price
	console.log(typeof (product_base))
	product_list.insertAdjacentHTML("afterbegin", product_base)

}

function changeTotal(id) {
	const current_element = document.getElementById(id)
	const quantity = current_element.getElementsByClassName("Quantidade")[0].firstElementChild
	const price_total = current_element.getElementsByClassName("PrecoTotal")[0]
	const price = current_element.getElementsByClassName("IndividualP")[0]
	const real_price = parseFloat(price.innerHTML.slice(2))
	const real_quantity = parseInt(quantity.value)
	const name = current_element.getElementsByClassName("Product_Name")[0].innerHTML.replace(/(\r\n|\n|\r|\t)/gm, "")
	if (real_quantity === 0) {
		current_element.remove()
		for (const i in current_items) {
			console.log(name, current_items[i].name)
			if (name === current_items[i].name) {
				current_items.splice(i, 1)
				localStorage.setItem("inCart", JSON.stringify(current_items))
				return
			}
		}
	} else {
		for (const i in current_items) {
			if (name == current_items[i].name) {
				current_items[i].quant = real_quantity
				localStorage.setItem("inCart", JSON.stringify(current_items))
			}
		}
	}
	price_total.innerHTML = `R$${(real_price * real_quantity).toFixed(2)}`

}

