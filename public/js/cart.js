const current_items = JSON.parse(localStorage.getItem("inCart"))
const product_list = document.getElementById("cart_list")
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
							<div class="Quantidade"><input onchange="changeTotal('${item.name}')" type="number" value="1"></div>
							<div class="PrecoTotal">R$${item.price}</div>
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
    console.log(typeof(product_base))
    product_list.insertAdjacentHTML("afterbegin", product_base)

}

function changeTotal(id) {
	const current_element = document.getElementById(id)
    console.log(id)
	console.log(current_element)
	const quantity = current_element.getElementsByClassName("Quantidade")[0].firstElementChild
	console.log(quantity)
	const price_total = current_element.getElementsByClassName("PrecoTotal")[0]
	const price = current_element.getElementsByClassName("IndividualP")[0]
	const real_price = parseFloat(price.innerHTML.slice(2))
	const real_quantity = parseInt(quantity.value)
	price_total.innerHTML = `R$${(real_price * real_quantity).toFixed(2)}`

}

