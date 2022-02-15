const admin = require("firebase-admin")
const firebase = require("firebase/compat/app")
require("firebase/compat/auth")

admin.initializeApp()
const db = admin.firestore()

const firebaseConfig = {
	apiKey: "AIzaSyD_C53eITdECBQRzQP_ozQAA8mY1zrqngs",
	authDomain: "social-media-5dd4b.firebaseapp.com",
	projectId: "social-media-5dd4b",
	storageBucket: "social-media-5dd4b.appspot.com",
	messagingSenderId: "893759780896",
	appId: "1:893759780896:web:f5803d174696c52c536445",
	measurementId: "G-6KX1PS4RC3",
}
firebase.default.initializeApp(firebaseConfig)

module.exports = { db, admin, firebase }
