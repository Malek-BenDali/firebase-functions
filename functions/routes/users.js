const express = require("express")
const { firebase } = require("../utils/admin")
const Router = express.Router()

Router.post("/login", async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await firebase.default
			.auth()
			.signInWithEmailAndPassword(email, password)
		console.log("eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
		const token = await user.user.getIdToken()
		return res.json({ token })
	} catch (err) {
		console.log(err)
		return res.status(400).json({ error: err.code })
	}
})

Router.post("/signup", async (req, res) => {
	const { email, password, handle } = req.body
	const doc = await db.doc(`users/${handle}`).get()
	if (doc.exists) {
		return res.status(400).json({
			error: "this handle exist",
		})
	}
	try {
		const user = await firebase.default
			.auth()
			.createUserWithEmailAndPassword(email, password)
		const token = await user.user.getIdToken()

		await db.doc(`/users/${handle}`).set({
			handle,
			email,
			createdAt: new Date().toISOString(),
			userId: user.user.uid,
		})
		return res.status(201).json({
			token,
		})
	} catch (err) {
		return res.status(400).json({ error: err.code })
	}
})

module.exports = Router
