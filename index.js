//req é requesiçao, res é resposta
//TODO: Criação de novos produtos
const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const express = require("express")
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser')
const ejs = require('ejs')
const fs = require('fs')
const path = require('path')

const saltRounds = 10

const prisma = new PrismaClient()
const app = express()
app.set('view engine', 'ejs')
dotenv.config()
const port = process.env.PORT
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))

let ejsOptions = {delimiter: '?'}

const check = async function(req, res, next) {
	let jwtSecretKey = process.env.JWT_SECRET_KEY;

	try {
		const token = req.headers.authorization.split(' ')[1] 
		const verified = jwt.verify(token, jwtSecretKey)
		console.log(verified)
		if(verified) {
			user = await prisma.user.findFirstOrThrow({
				where: {
					email: verified.email
				}
			})
			req.body.user = verified.userEmail
		}else {
			throw Error
		}
	}catch {
		req.body.user =  null
	}
	next()
}
//Adicione os endpoints que vão precisar de autenticação(provavelmente todos excetos de post)
app.get("/products",check)
app.get("/product/:userName", check)
app.get("/test", check)

app.get("/", async (req,res) => {
	const products = await prisma.product.findMany({})
	console.log(products.length)
	res.render('index', {products: products})
}) 

app.get("/cart", async (req, res) => {
	res.render('cart')
})



app.get(`/products`, async (req, res) => {
	const products = await prisma.product.findMany({
		include: {
			categories: true
		},
	})
	res.render('products', {products: products})
	return
})

app.get(`/products/:name`,async (req, res) => {
	const name = req.params.name
	const product = await prisma.product.findFirst({
		where: {
			name: name
		},
		include: {
			categories: true,
		}
	})
	res.render('product', {product: product})	
})

app.get('/user', async(req, res) => {
	const user = await prisma.user.findFirst({
		where: {
			email: req.body.email
		}
	})
	verified = bcrypt.compare(req.body.password, user.password)
	if (!verified) {
		res.send("Not today")
		return
	}
	const jwtSecretKey = process.env.JWT_SECRET_KEY
	const data = {
		time: Date(),
		userEmail: req.body.email,
	}
	const token = jwt.sign(data, jwtSecretKey)
	res.send(token)
	return
})
app.get('/categories', async (req, res) => {
	const categories = await prisma.category.findMany({})
	res.render('categories', {categories: categories})
})


app.get('/categories/:name', async (req, res) => {
	const products = await prisma.product.findMany({
		where: {
			categories: {
				some: {
					name: req.params.name
				}
			}
		},
		include: {
			categories: true
		}
	})

	res.render('category', {products: products, category: req.params.name})
})

//Post requests
app.post('/user', async (req, res) => {
	console.log(req.body)
	var hash_password;
	bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
		const user = await prisma.user.create({
			data: {
				email: req.body.email,
				password: hash,
				name: req.body.name

			}
		})
	})
	//const user = await prisma.user.create({
		//	data: {
			//		email: req.body.email,
			//		password: hash_password,
			//		name: req.body.name

			//	}
		//})
	let jwtSecretKey = process.env.JWT_SECRET_KEY
	let data = {
		time: Date(),
		userEmail: req.body.email,
	}
	const token = jwt.sign(data, jwtSecretKey)
	res.json(token)
}) 

app.post('/product', async (req, res) => {
	const new_product = await prisma.product.create({
		data: {
			img_path: req.body.img_path,
			name: req.body.name,
			price: parseInt(req.body.price),
			desc: req.body.desc,
			rating: req.body.rating,
		}
	})
	res.send(new_product)
})

app.put('/categoryToProduct', async (req, res) => {
	const result = await prisma.product.update({
		where: {
			name: req.body.name,
		},
		data: {
			categories: {
				connect: {
					id: parseInt(req.body.category_id)
				}
			}
		},
		include: {
			categories: true,
		}
	})
	res.send(result)
	return
})


app.delete('/product', async(req, res) => {
	const deleted_product = await prisma.product.delete({
		where: {
			name: req.body.name
		}
	})
	res.send(deleted_product)
})

const server = app.listen(port, () =>
	console.log(`Server ready at http://localhost:${port}`)
)
