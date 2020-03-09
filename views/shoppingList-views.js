const shoppingLists_view = ((data) => {
    let html = `

    

    <html>
   

    <head><title>Shopping List App</title>
    <meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
    <link rel='stylesheet' href='/style/style.css' />
    </head>

    <body>
    <h1>Shopping list application</h1>
    <h2>Shopping list:</h2> `;


    data.shoppingLists.forEach((shoppingList) => {
        //html += shoppingList.text;
        html += `

            <a href= "/shoppingList/${shoppingList._id}">${shoppingList.text}</a>
            
            <form action="delete-shoppingList" method="POST">
                <input type="hidden" name="shoppingList_id" value="${shoppingList._id}">
                <button type="submit" class="delete_button">Delete shoppingList</button>
            </form>
            <div></div>
            `;
    });

    html += `
        <form action="/add-shoppingList" method="POST">
            <input type="text" name="shoppingList">
            <button type="submit" class="add_button">Add shoppingList</button>
        </form>
        <div></div>

        <div></div>
        Logged in as user: ${data.user_name}
        <form action="/logout" method="POST">
            <button type="submit">Log out</button>
        </form>

    </html>
    </body>
    `;
    return html;
});


const shoppingList_view = (data) => {
    let html = `
    <html>
    <body>
        shoppingList text: ${data.text}
    </body>
    </html>
    `;
    return html;
};

module.exports.shoppingLists_view = shoppingLists_view;
module.exports.shoppingList_view = shoppingList_view;