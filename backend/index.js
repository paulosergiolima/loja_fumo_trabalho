//req é requesiçao, res é resposta
//TODO: Criação de novos produtos
const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const express = require("express")

const port = 3000

const prisma = new PrismaClient()
const app = express()
dotenv.config()
app.use(express.json())
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }));

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
//test endpoint
app.get("/test", (req,res) => {
	console.log(req.body.user)
	res.send(req.body.user)
})
app.get(`/products/:userName`,async (req, res) => {
	const username = req.params.userName
	const product = await prisma.product.findFirst({
		where: {
			name: username
		}
	})
	res.json(product)
})

//Post requests
app.post('/user', async (req, res) => {
	const user = await prisma.user.create({
		data: {
			email: req.body.email,
			password: req.body.password,
			name: req.body.name

		}
	})
	let jwtSecretKey = process.env.JWT_SECRET_KEY
	console.log(jwtSecretKey)
	let data = {
		time: Date(),
		userEmail: user.email,
	}
	const token = jwt.sign(data, jwtSecretKey)
	res.send(token)
}) 



const server = app.listen(port, () =>
	console.log(`Server ready at http://localhost:${port}`)
)
