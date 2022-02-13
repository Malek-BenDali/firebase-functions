const functions = require("firebase-functions")
const admin = require("firebase-admin")
const app = require("express")()
const firebase = require("firebase/compat/app")
require("firebase/compat/auth")

const firebaseConfig = {}

firebase.default.initializeApp(firebaseConfig)
admin.initializeApp()
const db = admin.firestore()

app.get("/screams", async (req, res) => {
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
		res.status(500).json({
			error: "something went wrong",
		})
	}
})
app.post("/screams", async (req, res) => {
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

app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
	const { email, password } = req.body

	try {
		const user = await firebase.default
			.auth()
			.signInWithEmailAndPassword(email, password)
		const token = await user.user.getIdToken()
		return res.json({ token })
	} catch (err) {
		return res.status(400).json({ error: err.code })
	}
})

exports.api = functions.https.onRequest(app)
