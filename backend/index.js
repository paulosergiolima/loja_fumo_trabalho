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
const port = 3000

const prisma = new PrismaClient()
const app = express()
app.set('view engine', 'ejs')
dotenv.config()
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('frontend'))

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


app.get("/products", async (req, res) => {
	const products = await prisma.product.findMany()
	res.json(products)
})
app.get("/views/style.css", async (req, res) => {
	const opts = {root: path.basename(__dirname) + "/.."}
	console.log(opts.root)
	res.sendFile("views/style.css", opts)
})
//test endpoint
app.get("/test", async (req,res) => {
	console.log(req.body.user)
	res.send(req.body.user)
})

app.post(`/test`, async (req, res) => {
	console.log(req.body)
	res.send(req.body)
})

app.get(`/products/:userName`,async (req, res) => {
	const username = req.params.userName
	const product = await prisma.product.findFirst({
		where: {
			name: username
		}
	})
	console.log(product)
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
	console.log(jwtSecretKey)
	let data = {
		time: Date(),
		userEmail: req.body.email,
	}
	const token = jwt.sign(data, jwtSecretKey)
	console.log(token)
	res.json(token)
}) 



const server = app.listen(port, () =>
	console.log(`Server ready at http://localhost:${port}`)
)
