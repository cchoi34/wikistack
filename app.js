const express = require('express');
const morgan = require('morgan');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { db } = require('./models');
const models = require('./models/index');

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use("/wiki", require("./routes/wiki"));
app.use("/user", require("./routes/user"));

app.get("/", (req, res, next) => {
    res.redirect('/wiki');
})

const PORT = 3000;
const init = async () => {
    await models.db.sync({force: false});
    server.listen(PORT, () => {
        console.log(`app listening in port ${PORT}`);
})};

init();