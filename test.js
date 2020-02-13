const express = require('express');
const PORT = process.env.PORT || 8080;
const body_parser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const shopping_list_schema = new Schema({
    text: {
        type: String,
        required: true
    }
});
const shopping_list_model = new mongoose.model('shopping_list', shopping_list_schema);


const user_schema = new Schema({
    name: {
        type: String,
        required: true
    },
    shopping_lists: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'shopping_list',
        req: true
    }]
});
const user_model = mongoose.model('user', user_schema);

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

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    user_model.findById(req.session.user._id).then((user) => {
        req.user = user;
        next();
    }).catch((err) => {
        console.log(err);
        res.redirect('login');
    });
});

app.use('/style', express.static('style'));

//app.use('/style', express.static(__dirname + "/style"));

//app.get('/style.style.css', function (req, res,){
//res.sendFile(__dirname +'/style/style.css');
//});



app.get('/', is_logged_handler, (req, res, next) => {
    const user = req.user;
    user.populate('shopping_lists')
    
        .execPopulate()
        .then(() => {
            console.log('user:', user);
            res.write(`
        <html>
        <head><title>MemoApp</title>
        <meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
        
        <link rel='stylesheet' href='/style/style.css' />
        </head>
        <body>
        <h1>Shopping list application</h1>
        <h2>Shopping list:</h2>`);
        
            user.shopping_lists.forEach((shopping_list) => {
                res.write(shopping_list.text);
                res.write(`
                <a href= "/shopping_list/${shopping_list._id}">${shopping_list.name}</a>

                
                <form action="delete-shopping_list" method="POST">
                    <input type="hidden" name="shopping_list_id" value="${shopping_list._id}">
                    <button type="submit" class="delete_button">Delete shopping_list</button>
                </form>
                <div></div>
                `);

            });
            res.write(`
            <form action="/add-shopping_list" method="POST">
                <input type="text" name="shopping_list">
                <button type="submit" class="add_button">Add shopping_list</button>
            </form>
            <div></div>
            <div></div>
            Logged in as user: ${user.name}
    
        </html>
        </body>
        `);

        console.log('user:', user);
        res.write(`
            <form action="/logout" method="POST">
                <button type="submit">Log out</button>
            </form>`);
            res.end();
        });

});

app.post('/delete-shopping_list', (req, res, next) => {
    const user = req.user;
    const shopping_list_id_to_delete = req.body.shopping_list_id;

    //Remove shopping_list from user.shopping_lists
    const updated_shopping_lists = user.shopping_lists.filter((shopping_list_id) => {
        return shopping_list_id != shopping_list_id_to_delete;
    });
    user.shopping_lists = updated_shopping_lists;

    //Remove shopping_list object from database
    user.save().then(() => {
        shopping_list_model.findByIdAndRemove(shopping_list_id_to_delete).then(() => {
            res.redirect('/');
        });
    });
});

app.get('/shopping_list/:id', (req, res, next) => {
    const shopping_list_id = req.params.id;
    shopping_list_model.findOne({
        _id: shopping_list_id
    }).then((shopping_list) => {
        res.send(shopping_list.text);
    });
});




app.post('/add-shopping_list', (req, res, next) => {
    const user = req.user;

    let new_shopping_list = shopping_list_model({
        text: req.body.shopping_list
    });
    new_shopping_list.save().then(() => {
        console.log('shopping_list saved');
        user.shopping_lists.push(new_shopping_list);
        user.save().then(() => {
            return res.redirect('/');
        });
    });
});

app.post('/logout', (req, res, next) => {
    req.session.destroy();
    res.redirect('/login');
});

app.get('/login', (req, res, next) => {
    console.log('user: ', req.session.user)
    res.write(`
    <html>
    <head><title>Shoping Lists App</title>
    <h1>Shopping list application</h1>
    <body>
        <form action="/login" method="POST">
            <input type="text" name="user_name">
            <button type="submit">Log in</button>
        </form>
        <form action="/register" method="POST">
            <input type="text" name="user_name">
            <button type="submit">Register</button>
        </form>
    </body>
    <html>
    `);
    res.end();
});

app.post('/login', (req, res, next) => {
    const user_name = req.body.user_name;
    user_model.findOne({
        name: user_name
    }).then((user) => {
        if (user) {
            req.session.user = user;
            return res.redirect('/');
        }

        res.redirect('/login');
    });
});

app.post('/register', (req, res, next) => {
    const user_name = req.body.user_name;

    user_model.findOne({
        name: user_name
    }).then((user) => {
        if (user) {
            console.log('User name already registered');
            return res.redirect('/login');
        }

        let new_user = new user_model({
            name: user_name,
            shopping_lists: []
        });

        new_user.save().then(() => {
            return res.redirect('/login');
        });

    });
});

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