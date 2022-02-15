const userRoute = require("../routes/users")
const screams = require("../routes/screams")

module.exports = app => {
	app.use("/user", userRoute)
	app.use("/screams", screams)
}
