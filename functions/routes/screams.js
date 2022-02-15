const { db, admin } = require("../utils/admin")
const express = require("express")
const checkAuth = require("../middleware/checkAuth")
const Router = express.Router()

Router.get("/", checkAuth, async (req, res) => {
	console.error("aaaaaaaaaaaaaaaa")
	try {
		const screams = await admin
			.firestore()
			.collection("screams")
			.orderBy("createdAt", "desc")
			.get()

		let data = []
		screams.forEach(scream => {
			data.push({
				screamId: scream.id,
				...scream.data(),
			})
		})
		res.json(data)
	} catch (err) {
		console.error(err)
		res.status(500).json({
			error: "something went wrong",
		})
	}
})

Router.post("/", async (req, res) => {
	if (req.body?.body !== undefined && req.body?.userHandle !== undefined)
		return res.status(401).json({
			error: "Validation error",
		})
	const { body, userHandle } = req.body

	const newScream = {
		body,
		userHandle,
		createdAt: db.Timestamp.fromDate(new Date()),
	}

	try {
		const addedDoc = await admin
			.firestore()
			.collection("screams")
			.add(newScream)
		res.json({ message: `document ${addedDoc.id} added successfully` })
	} catch (err) {
		res.status(500).json({
			error: "something went wrong",
		})
	}
})

module.exports = Router
