//requiring modules
require('dotenv').config()
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const Sequelize = require('sequelize');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const fileUpload = require('express-fileupload');
const locationsFinder = require('./locationfinder.js')

//configuring modules
app = express();
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))
app.use(fileUpload());

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  storage: "./session.postgres",
  host: process.env.DB_HOST,
  dialect: 'postgres',
  operatorsAliases: false
})

sequelize.sync({force: false}).then(() => {
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
    woonplaats: {
        type: Sequelize.STRING
    },
    overig: {
        type: Sequelize.TEXT
    }
});

const Oppassers = sequelize.define('oppassers', {
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
        type: Sequelize.FLOAT
    },
    woonplaats: {
        type: Sequelize.STRING
    },
    reizen: {
        type: Sequelize.FLOAT
    },
    kmvergoeding: {
        type: Sequelize.FLOAT
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
    },
    temploc: {
        type: Sequelize.FLOAT
    }
});

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
        res.render("home", {message: ""})
    } else {
       res.render("homeloggedin", {message: ""})
    }
})

//about
app.get("/about", (req, res) => {
    if (req.session.user === undefined) {
        res.render("about", {message: ""})
    } else {
        res.render("aboutloggedin")
    }
})

//signing up
app.get("/signup", (req, res) => {
    res.render("signup", {message: ""})
})

app.get("/signupoppas", (req, res) => {
    res.render("signupoppas", {message: ""})
})

app.get("/signupeigenaar", (req, res) => {
    res.render("signupeigenaar", {message: ""})
})

app.post("/signupoppas", (req, res) => {
    console.log(req.body)
    Oppassers.findOne({
        where: {
            gebruikersnaam: req.body.gebruikersnaam
        }
    })
    .then((result) => {
        if (result === null) {
            let hash = bcrypt.hashSync(req.body.wachtwoord, saltRounds);
            Oppassers.create({
                naam: req.body.voorachternaam,
                email: req.body.email,
                gebruikersnaam: req.body.gebruikersnaam,
                wachtwoord: hash,
                ervaring: req.body.ervaring,
                uurtarief: req.body.uurtarief,
                woonplaats: req.body.locatie,
                reizen: req.body.reizen,
                kmvergoeding: req.body.kmvergoeding,
                referenties: req.body.referenties,
                biografie: req.body.biografie,
                werkwijze: req.body.werkwijze,
                voorwaarden: req.body.voorwaarden,
                overig: req.body.overig
            })
            .then((user) => {
                if (req.files.profilepic) {
                    let picture = req.files.profilepic;
                    picture.mv(__dirname + '/public/images/' + user.gebruikersnaam + '.jpg', function(err) {
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
                woonplaats: req.body.woonplaats,
                overig: req.body.overig,
            })
            .then((user) => {
                if (req.files.profilepic) {
                    let picture = req.files.profilepic;
                    picture.mv(__dirname + '/public/images/' + user.gebruikersnaam + '.jpg', function(err) {
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

//loggin in
app.post('/login', (req, res) => {
      
    Eigenaars.findOne({
        where: {
        email: req.body.email
        }
    })
    .then((user) => {
        if (user !== null && bcrypt.compareSync(req.body.wachtwoord, user.wachtwoord)) {
            req.session.user = user;
            res.redirect('/oppassers');
        } else if (user === null) {
            Oppassers.findOne({
                where: {
                email: req.body.email
                }
            })
            .then((user2) => {
                if (user2 !== null && bcrypt.compareSync(req.body.wachtwoord, user.wachtwoord)) {
                    req.session.user = user2;
                    res.redirect('/user');
                } else {
                    res.render("home", {message: "Error, cannot log you in!"})
                }
            })
        }
    })
})
   



//viewing the catsitters
app.get('/oppassers', (req, res) => {
    if (req.session.user === undefined) {
        res.redirect("/signup")
    }
    
    Oppassers.findAll()
    .then((sitters) => {
        res.render("sitters", {sitters: sitters})
    })
    .catch(err => console.error('Error', err.stack))
})


//view individual catsitterxs
app.get("/oppassers/:id", (req, res) => {
    let user = req.session.user
    Oppassers.findById(req.params.id)
        .then((sitter) => {
            res.render("sitterprofile", {sitter: sitter, user: user})
            })
        .catch(err => console.error('Error', err.stack))
        
    }) 

app.get("/user", (req, res) => {
    Oppassers.findOne({ where: {gebruikersnaam: req.session.user.gebruikersnaam} })
    .then((sitter) => {
        if (sitter) {
            res.render("sitterprofile", {sitter: sitter})
        } else {
            Eigenaars.findOne({ where: {gebruikersnaam: req.session.user.gebruikersnaam} })
            .then((owner) => {
                if (owner) {
                    res.render("ownerprofile", {owner: owner})
                }
            })
        }
    })
})

function callback(data) {
    let distances = data;
    return distances
} 

//filtered by location sitters
app.get('/oppasserslocatie', (req, res) => {
    let user = req.session.user;
    let distances = [];

    Oppassers.findAll()
    .then((sitters) => {
        distances2 = sitters.forEach(function(sitter) {
            search = `https://www.distance24.org/route.json?stops=${sitter.woonplaats}|${user.woonplaats}`
            request(search, function (err, response, body) {
                if (err){
                    console.log('error:', error);
                }  
                var result = JSON.parse(body)
                console.log(result.distances)
                Oppassers.update({
                    temploc: result.distance
                }, {
                    where: {
                        id: sitter.id
                    }
                })               
            })
        })
    })
    .then(() => {
        return Oppassers.findAll()
    })
    .then((sitters) => {
        res.render("sitterslocation", {user: user, sitters: sitters})
    })
    .catch(err => console.error('Error', err.stack))
})

//logging out
app.get('/logout', (req, res) => {
    req.session.destroy() 
    .then(res.render("home"))
    .catch(err => console.error('Error', err.stack))
})

app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})


