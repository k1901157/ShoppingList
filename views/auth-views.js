const login_view = () => {
    let html = `
    
    <html>
    <head>
    <title>Shoping Lists App</title>
    <meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
    <link rel='stylesheet' href='/style/style.css' />
    </head>
    <body>
    <div id=login>

    <h1>Shopping list application</h1>

        <form action="/login" method="POST">
            <input type="text" name="user_name">
            <button type="submit">Log in</button>
        </form>
        </br>

        <form action="/register" method="POST">
            <input type="text" name="user_name">
            <button type="submit">Register</button>
        </form>

    </div>
    </body>
    <html>
    `;

    return html;
}

module.exports.login_view = login_view;