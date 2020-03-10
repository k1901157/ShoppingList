const products_view = ((data) => {
    let html = `

    <html>
    <head><title>Shopping List App</title>
    <meta http-equiv="Content-Type", content="text/html;charset=UTF-8">
    <link rel='stylesheet' href='/style/style.css' />
    </head>

    <body>
    <div id="product">
    <h1>Shopping list application</h1>

    <a href='/'>Home</a><br>
    <h2>Shopping list Name: ${data.product_text} </h2>
    
    <div></div>
    <div></div> `;

    data.products.forEach((product) => {
        html += `<tr>
        <label> Product Name: </label> <td>${product.text}</td><br>
        <label> Product Quantity:</label> <td>${product.number}</td> <div></div>
        <div></div>
        <br>
        <td>
        `;
    });


    html += `
     <form action="/add-product/${data.shoppingList_id}" method="POST">

        <label> Product Name: </label><br>
        <input type="text" name="pname"><br>
        
        <label> Quantity: </label><br>
        <input type="number" name="q"><br>
            
        <div></div>
        <br>
        <button type="submit" class="add_product_botton">Add Product</button>
     </form>

     <div></div>
     <div></div>

     </div>
     </html>
     </body>
     `;

    return html;
});

    const product_view = (data) => {
        let html = `

        <html>
        <body>
            product text: ${data.text}
            product number: ${data.number}
        </body>
        </html>
        shoppingList_id.Products.forEach((product) => {
        res.write(product.pname) 
        res.write(product.number) 
    `;
    return html;
};

module.exports.products_view = products_view;
module.exports.product_view = product_view;
