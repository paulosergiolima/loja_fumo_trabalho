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
const cookieParser = require('cookie-parser')

const saltRounds = 10

const prisma = new PrismaClient()
const app = express()
app.set('view engine', 'ejs')
dotenv.config()
const port = process.env.PORT
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser())

app.use(express.static('public'))

let ejsOptions = {delimiter: '?'}


const getUser = async function(req, res, next) {
	try {
		req.user = jwt.verify(req.cookies.auth, process.env.JWT_SECRET_KEY)
	}catch(err) {
		console.log(err)
		res.send("Not signed in")
		return

	}
	next()
}
app.use('/favorites', getUser)
app.use('/buyProduct', getUser)
app.get("/", async (req,res) => {
	const products = await prisma.product.findMany({
		include: {
			categories: true
		}
	})
	console.log(req.user)
	res.render('index', {products: products})
}) 

app.get("/cart", async (req, res) => {
	res.render('cart')
})

app.get("/login", async (req, res) => {
	res.render('login')
})

app.get("/signup", async (req, res) => {
	res.render('signup')
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
			favorited_by: true,
			categories: true,
		}
	})
	console.log(product.favorited_by.length)
	res.render('product', {product: product, favorites: product.favorited_by.length})	
})

app.post('/login', async(req, res) => {
	console.log("it got here")
	const user = await prisma.user.findFirst({
		where: {
			email: req.body.email
		}
	})
	const verified = await bcrypt.compare(req.body.password, user.password)
	console.log(verified)
	if (!verified) {
		console.log("You baddie")
		res.json("false")
		return
	}
	const jwtSecretKey = process.env.JWT_SECRET_KEY
	const data = {
		time: Date(),
		userEmail: req.body.email,
	}
	const token = jwt.sign(data, jwtSecretKey)
	console.log("You are not baddie")
	res.json(token)
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

app.get('/favorites', async (req, res) => {
	console.log(req.user.userEmail)
	const products = await prisma.product.findMany({
		where: {
			favorited_by: {
				some: {
					email: req.user.userEmail 
				}	
			} 
		},
		include: {
			categories: true
		}
	})
	res.render('favorite', {products: products})
})

app.get('/history', async (req, res) => {
	console.log("History")
})
//Post requests
app.post('/user', async (req, res) => {
	var hash_password;
	const already_found_user = await prisma.user.findFirst({
		where: {
			email: req.body.email,
		}
	})
	if (already_found_user) {
		res.json("User already found")
		console.log("Hi")
		return
	}
	bcrypt.hash(req.body.password, saltRounds, async function(err, hash) {
		const user = await prisma.user.create({
			data: {
				email: req.body.email,
				password: hash,
				name: req.body.name

			}
		})
	})

	let jwtSecretKey = process.env.JWT_SECRET_KEY
	let data = {
		time: Date(),
		userEmail: req.body.email,
	}
	const token = jwt.sign(data, jwtSecretKey)
	res.json(token)
}) 
app.post('/product', async (req, res) => { const new_product = await prisma.product.create({ data: {
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

app.post('/buyProduct', async (req, res) => {
	const user = await prisma.user.findFirst({
		where: {
			email: req.user.userEmail
		}
	})
	const product = await prisma.product.findFirst({
		where: {
			name: req.body.product
		}
	})
	const bought_product = await prisma.bought_product.create({
		data: {
			user_email: req.user.userEmail,
			product_name: product.name,
		}	

	})
	res.json(bought_product)
	return
})

app.put('/favoriteProduct', async (req, res) => {
	const auth = req.cookies.auth  
	const user = jwt.verify(auth, process.env.JWT_SECRET_KEY)
	const favorite = await prisma.user.update({
		where: {
			email: user.userEmail,
		},
		data: {
			favorites: {
				connect: {
					name: req.body.name
				}
			}
		},
		include: {
			favorites: true
		}
	})
	res.json(favorite)
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
