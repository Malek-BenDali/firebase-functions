const functions = require("firebase-functions")
const app = require("express")()

require("./start/routes")(app)

exports.api = functions.https.onRequest(app)
