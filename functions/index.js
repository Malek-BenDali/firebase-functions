const functions = require("firebase-functions")
const admin = require("firebase-admin")
const express = require("express")

admin.initializeApp()

const app = express()

app.get("/screams", async (req, res) => {
	try {
		const screams = await admin.firestore().collection("screams").get()

		let data = []
		screams.forEach(scream => {
			data.push(scream.data())
		})
		res.json(data)
	} catch (err) {
		res.status(500).json({
			error: "something went wrong",
		})
	}
})

exports.api = functions.https.onRequest(app)

//exports.createScream = functions.https.onRequest((req, res) => {
//	const { body, userHandle } = req.body
//	const newScream = {
//		body,
//		userHandle,
//		createdAt: admin.firestore.Timestamp.fromDate(new Date()),
//	}
//	const addToDb = async () => {
//		try {
//			const addedDoc = await admin
//				.firestore()
//				.collection("screams")
//				.add(newScream)
//			res.json({ message: `document ${addedDoc.id} added successfully` })
//		} catch (err) {
//			res.status(500).json({
//				error: "something went wrong",
//			})
//		}
//	}
//	addToDb()
//})
