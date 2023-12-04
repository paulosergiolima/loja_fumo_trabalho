const current_items = JSON.parse(localStorage.getItem("inCart"))
const total_price = document.getElementById("total_price")
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
	complete_price = parseFloat(item.price * item.quant) + complete_price
	product_list.insertAdjacentHTML("afterbegin", product_base)

}
total_price.innerHTML = `Preço da compra: R$ ${complete_price.toFixed(2)}`


function changeComplete() {
	console.log("Hallo")
	const elements = document.getElementsByClassName("Cart_Product")
	var total_price = 0
	for (element of elements) {
		console.log(element)
		total_price = parseFloat(element.getElementsByClassName("PrecoTotal")[0].innerHTML.slice(2)) + total_price
	}
	const new_price = document.getElementById("total_price")
	new_price.innerHTML = `Preço da compra: R$ ${total_price.toFixed(2)}`
}

function changeTotal(id) {
	const current_element = document.getElementById(id)
	const quantity = current_element.getElementsByClassName("Quantidade")[0].firstElementChild
	const price_total = current_element.getElementsByClassName("PrecoTotal")[0]
	const price = current_element.getElementsByClassName("IndividualP")[0]
	const real_price = parseFloat(price.innerHTML.slice(2))
	const real_quantity = parseInt(quantity.value)
	const name = current_element.getElementsByClassName("Product_Name")[0].innerHTML.replace(/(\r\n|\n|\r|\t)/gm, "")
	if (real_quantity <= 0) {
		current_element.remove()
		for (const i in current_items) {
			if (name === current_items[i].name) {
				current_items.splice(i, 1)
				localStorage.setItem("inCart", JSON.stringify(current_items))

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
	changeComplete();


}

//var initialCoordinates = [-22.1187, -51.3913];
//var initialZoomLevel = 13;
//console.log(L)

// create a map in the "map" div, set the view to a given place and zoom
//var map = L.map('map').setView(initialCoordinates, initialZoomLevel);
//var EO = {
	//            'lat' : 47.408478097049354, 
	//            'lng' : 13.215466182754234
	//        };
//
	//// add an OpenStreetMap tile layer
//const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	//	maxZoom: 19,
	//	attribution: '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a>'
	//}).addTo(map);
//L.Control.geocoder().addTo(map);
//
	//L.Routing.control({
		//	waypoints: [
			//		L.latLng(EO.lat, EO.lng),
			//		
			//	],
		//	routeWhileDragging: true,
		//	geocoder: L.Control.Geocoder.nominatim()
		//}).addTo(map);
//map.locate({ setView: true, watch: true })
//	.on('locationfound', function (e) {
	//		console.log("hi")	
	//		var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
//		map.addLayer(marker)
//	});
var loadMap = function (id) {
	var locationFound = false
	var HELSINKI = [60.1708, 24.9375];
	var map = L.map(id);
	var tile_url = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
	var layer = L.tileLayer(tile_url, {
		attribution: 'OSM'
	});
	map.addLayer(layer);
	map.setView(HELSINKI, 19);

	map.locate({setView: false, watch: true}) /* This will return map so you can do chaining */
		.on('locationfound', function(e){
			if (!locationFound) {
				map.setView([e.latitude, e.longitude], 19)
				locationFound = true
				var marker = L.marker([e.latitude, e.longitude]).bindPopup('Your are here :)');
	var circle = L.circle([e.latitude, e.longitude], e.accuracy/2, {
		weight: 1,
		color: 'blue',
		fillColor: '#cacaca',
		fillOpacity: 0.2
	});
	map.addLayer(marker);
	map.addLayer(circle);
	L.Control.geocoder().addTo(map);
	L.Routing.control({
		waypoints : [
			L.latLng(e.latitude, e.longitude),
			L.latLng(-23.4913762, -46.7606961)
		],
		routeWhileDragging: true,
		geocoder: L.Control.Geocoder.nominatim()
	}).addTo(map)
			}
		})
	.on('locationerror', function(e){
	});
};

loadMap('map');
