const express = require("express")
// const app = express()
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST)
const bodyParser = require("body-parser")
const cors = require("cors")
var router = express.Router();

// app.use(bodyParser.urlencoded({ extended: true }))
// app.use(bodyParser.json())

// app.use(cors())

router.post("/", async (req, res) => {
	let { amount, id } = req.body
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "ecommerce company",
			payment_method: id,
			confirm: true
		})
		console.log("Payment", payment)
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})

// app.listen(process.env.PORT, () => {
// 	console.log("Sever is listening on port 9000")
// })

module.exports = router;
