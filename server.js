const express = require("express");
const mustacheExpress = require("mustache-express")
const session = require("express-session");
const bodyParser = require("body-parser");
const logger = require("morgan");
const path = require("path");
const sessionConfig = require("./sessionConfig.js");
const user = require("./data.js")
const checkAuth = require("./checkAuth.js")
const app = express();
const port = process.env.PORT || 8000;


app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");


app.use(express.static(path.join(__dirname, "./public")));
app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session(sessionConfig));

app.get("/", function (req, res) {
    console.log(req.session);
    res.render("home");
})
app.get("/home", function (req, res) {
    res.render("home");
})
app.get("/signup", function (req, res) {
    res.render("signup")
})
app.get("/login", function (req, res) {
    res.render("login");
})
app.get("/profile", checkAuth, (req, res) => {
    res.render("profile", { user: req.session.user });
})

app.post("/login", function (req, res) {
    let reqUsername = req.body.username;
    let reqPassword = req.body.password;

    let foundUser = user.find(function (user) { return user.username === reqUsername })
    if (!foundUser) {
        return res.render("login", { errors: ["User not found"] })
    }
    if (foundUser.password === reqPassword) {
        delete foundUser.password;
        req.session.user = foundUser;
        res.redirect("profile");
    }
    else {
        return res.render("login", { errors: ["Password does not match."] });
    }
})

app.post("/signup", function (req, res) {
    let newUser = req.body;
    user.push(newUser);
    res.redirect("login");
})

app.listen(port, function () {
    console.log(`Server is running on port ${port}`);
})