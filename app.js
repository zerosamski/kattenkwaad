//requiring modules
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bcrypt = require('bcryptjs');
const saltRounds = 10;

//configuring modules
app = express();
app.set("view engine", "ejs")

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  storage: "./session.postgres",
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: false
})

//model definitions
const Eigenaars = sequelize.define('eigenaars', {
    naam: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    gebruikersnaam: {
        type: Sequelize.STRING, unique: true
    },
    wachtwoord: {
        type: Sequelize.STRING
    },
    aantalkatten: {
        type: Sequelize.INTEGER
    },
    naarbuiten: {
        type: Sequelize.STRING
    },
    ingeent: {
        type: Sequelize.STRING
    },
    overig: {
        type: Sequelize.TEXT
    }
});

const Oppassers = sequelize.define('eigenaars', {
    naam: {
        type: Sequelize.STRING
    },
    email: {
        type: Sequelize.STRING
    },
    gebruikersnaam: {
        type: Sequelize.STRING, unique: true
    },
    wachtwoord: {
        type: Sequelize.STRING
    },
    ervaring: {
        type: Sequelize.STRING
    },
    uurtarief: {
        type: Sequelize.INTEGER
    },
    locatie: {
        type: Sequelize.STRING
    },
    reizen: {
        type: Sequelize.INTEGER
    },
    kmvergoeding: {
        type: Sequelize.INTEGER
    },
    referenties: {
        type: Sequelize.STRING
    },
    biografie: {
        type: Sequelize.TEXT
    },
    werkwijze: {
        type: Sequelize.TEXT
    },
    voorwaarden: {
        type: Sequelize.TEXT
    },
    overig: {
        type: Sequelize.TEXT
    }
});

sequelize.sync({force: true}).then(() => {
})

//set up sessions
app.use(session({
    secret: "canihazcheeseburger",
    store: new SequelizeStore({
        db: sequelize
    }),
    resave: false,
    saveUninitialized: false,

}))

//homepage
app.get("/", (req, res) => {
    if (req.session.user === undefined) {
        res.render("home")
    } else {
        res.send("Hello you're logged in")
    }
})

app.get("/about", (req, res) => {
    if (req.session.user === undefined) {
        res.render("about")
    } else {
        res.send("Hello you're not")
    }
})

app.get("/signup", (req, res) => {
    res.render("signup")
})

app.get("/signupoppas", (req, res) => {
    res.render("signupoppas")
})

app.get("/signupeigenaar", (req, res) => {
    res.render("signupeigenaar")
})

app.post("/signupeigenaar", (req, res) => {
    Eigenaars.findOne({
        where: {
            gebruikersnaam: req.body.gebruikersnaam
        }
    })
    .then((result) => {
        if (result === null) {
            let hash = bcrypt.hashSync(req.body.wachtwoord, saltRounds);
            Eigenaars.create({
                naam: req.body.voorachternaam,
                email: req.body.email,
                gebruikersnaam: req.body.gebruikersnaam,
                wachtwoord: hash,
                aantalkatten: req.body.aantalkatten,
                naarbuiten: req.body.binnenbuiten,
                ingeent: req.body.ingeent,
                overig: req.body.overig,
            })
            .then((user) => {
                if (req.files.profilepic) {
                    let picture = req.files.profilepic;
                    picture.mv(__dirname + '/public/images/' + user.userName + '.jpg', function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                        console.log('hello')
                        }
                    })
                }
                req.session.user = user;
                res.send("Loggedin!")
            })
            .catch(err => console.error('Error', err.stack))
        } else {
            res.send("booo user name already taken")
        }
    })
}) 


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})