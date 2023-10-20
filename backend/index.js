//req é requesiçao, res é resposta
//TODO: Authentication 
const { PrismaClient } = require('@prisma/client')
const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
const express = require("express")

const port = 3000

const prisma = new PrismaClient()
const app = express()
dotenv.config()
app.use(express.json())

app.get("/products", async (req, res) => {
	const products = await prisma.product.findMany()
	res.json(products)
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
app.get(`/user`,async (req, res) => {
	const bearer_token = req.bearer_token
	const user = await prisma.user.findFirst({
		where: {
			bearer_token: bearer_token
		}
	})
})

//Post requests
app.post('/user', async (req, res) => {
	const user = await prisma.user.create({
		data: {
			name: req.name,
			email: req.email,
			password: req.password,

		}
	})
	let jwtSecretKey = process.env.JWT_SECRET_KEY
	let data = {
		time: Date(),
		userId: user.id
	}
	const token = jwt.sign(data, jwtSecretKey)
	res.send(token)
}) 

const check = function(req, res, next) {
	let tokenHeaderKey = process.env.TOKEN_HEADER_KEY
	let jwtSecretKey = process.env.JWT_SECRET_KEY;

	try {
		const token = req.header(tokenHeaderKey)
		const verified = jwt.verify(token, jwt)
		if(verified) {
			req.verified = "true"
		}else {
			throw Error
		}
	}catch {
		req.verified = "false"
	}
	next()
}

const server = app.listen(port, () =>
	console.log(`Server ready at http://localhost:${port}`)
)
