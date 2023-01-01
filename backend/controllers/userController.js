const registerUser = (req, res) => {
    if (!req.body.email || !req.body.username) {
        res.status(400)
        throw new Error("Please add an email address or username")
    }
    res.send("Register User")
}

module.exports = {
    registerUser
}