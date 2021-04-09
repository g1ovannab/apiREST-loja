const mongoose = require('mongoose');

/* 'module.exports' permite dizer que o seguinte código pode retornar algo que seja 
utilizado em outro arquivo. Nesse caso, quem utilizará o valor retornado, será o 
'app' que é passado como parâmetro. */
module.exports = app => {

    /* Para utilizarmos o banco de dados 'MongoDB', precisamos criar 'Coleções', que se 
    assemelham a tabelas num banco de dados relacional. E assim como num banco relacional,
    precisamos definir qual será a base ('ou esquema') do dado que será inserido. No nosso
    caso, a base, modelo ou esquema do nosso dado se dará através do seguinte objeto: */
    const productSchema = {
        /* Dentro, dizemos o nome do campo (ou coluna no caso do banco de dados relacional), 
        e o tipo de dado que ele receberá. */
        title: String,
        price: Number,
        zipcode: String,
        seller: String,
        thumbnailHd: String,
        date: String
    };

    /* Por fim, criamos a coleção 'Purchase', coleção que guarda todas as informações de compra, 
    baseado nom modelo 'purchaseSchema' criado. */
    const Product = mongoose.model('Product', productSchema);


    /* Aqui, inicializamos a dinamização das rotas. Quando o usuário digitar a rota '/starstor/products',
    ele deverá enviar os dados da compra e receber os dados da compra, por conta dos métodos que essa 
    rota tem (POST e GET). */
    app.route('/starstore/products')
    .post((req, res) => {

        /* Quando o(s) dado(s) for(em) digitado(s) no POSTMAN (como já explicado no arquivo 
        README.md), ele(s) virá(ão) através de um array: 

        [
            {
                "title": ".....",
                "price": ".....",
            }
        ]
        
        E por conta disso, deveremos pegar todo esse array (mesmo que só contenha um dado), e 
        percorrê-lo um a um. A variável 'data' mantém todos esses dados através do 'req.body', 
        informações que são passadas como parâmetro através da requisição do body. */
        var data = req.body;

        /* Aqui, percorre-se todo o array (forEach - paraCada). Ou seja, para cada 'item', algo
        ocorrerá. */
        data.forEach((item) => {
            /* Cria-se um novo objeto, na qual coletamos todas as informações oferecidas pelo 'req.body'. */
            const newProduct = new Product ({
                title: item.title,
                price: item.price,
                zipcode: item.zipcode,
                seller: item.seller,
                thumbnailHd: item.thumbnailHd,
                date: item.date
            });
    
            /* Esse novo objeto é salvo na coleção a qual pertence ('Product'). */
            newProduct.save((err) => {
                if (!err){
                    console.log("Product document inserted successfully");
                    /* Caso não ocorra nenhum erro, envia-se o status 201 (Requisição bem sucedida 
                    e um novo recurso foi criado como resultado). */
                    res.status(200).end();
                } else {
                    console.log(err);
                }
            });
        });
    })
    .get((req, res) => {
        /* Utiliza-se um método do 'MongoDB', 'find()', na qual permite achar algum documento (data), 
        dependendo do(s) partâmetro(s) de consulta. Como não foi especificado nenhum parâmetro
        para consulta, todos os objetos da coleção serão retornados (como 'foundProducts'). */
        Product.find((err, foundProducts) => {
            if (!err){
                /* Caso não ocorra nenhum erro, envia-se o status 200 (Requisição bem sucedida),
                juntamente com o json do resultado. */
                res.status(200).json(foundProducts);
            } else {
                res.send(err);
            }
        });
    });
}