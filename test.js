const express = require('express');
const PORT = process.env.PORT || 8080;
const body_parser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');

//Controllers
const auth_controller = require('./controllers/auth_controller');
const shoppingList_controller = require('./controllers/shoppingList_controller');

//Models
const user_model = require('./models/user-model.js');
const shoppingList_model = require('./models/shoppingList-model.js');
const product_model = require ('./models/product-model')

//Views
const auth_views = require('./views/auth-views.js');
const shoppingList_views = require('./views/shoppingList-views.js');
const product_views = require('./views/product-views.js');


let app = express();

app.use(body_parser.urlencoded({
    extended: true
}));

app.use(session({
    secret: 'shopping/1234qwerty',
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000000
    }
}));

let users = [];

app.use((req, res, next) => {
    console.log(`path: ${req.path}`);
    next();
});

const is_logged_handler = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }
    next();
};


app.use('/style', express.static('style'));

//app.use('/style', express.static(__dirname + "/style"));

//app.get('/style.style.css', function (req, res,){
//res.sendFile(__dirname +'/style/style.css');
//});
//Auth
app.use(auth_controller.handle_user);
app.get('/login', auth_controller.get_login);
app.post('/login', auth_controller.post_login);
app.post('/register', auth_controller.post_register);
app.post('/logout', auth_controller.post_logout);


//shoppingLists
app.get('/', is_logged_handler, shoppingList_controller.get_shoppingLists);
app.post('/delete-shoppingList', is_logged_handler, shoppingList_controller.post_delete_shoppingList);
app.get('/shoppingList/:id', is_logged_handler, shoppingList_controller.get_shoppingList);
app.post('/add-shoppingList', is_logged_handler, shoppingList_controller.post_shoppingList);
app.post('/product', is_logged_handler, shoppingList_controller.post_product);



app.use((req, res, next) => {
    res.status(404);
    res.send(`
        page not found
    `);
});

//Shutdown server CTRL + C in terminal

const mongoose_url = 'mongodb+srv://memoappdb:bTRE53AvKm4x0wT0@cluster0-wk8t5.mongodb.net/test?retryWrites=true&w=majority';

mongoose.connect(mongoose_url, {
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log('Mongoose connected');
    console.log('Start Express server');
    app.listen(PORT);
});