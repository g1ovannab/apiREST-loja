/* Mesmo que no arquivo de caminho './config/express', nós já tivessemos requisitado 
o módulo 'mongoose', aqui precisamos dele novamente. Esse módulo é 'esperto' o suficiente
para resgatar seu valor e manter o seu valor original, mesmo que declarado e requisitado
em outro lugar. */
const mongoose = require('mongoose');

/* Módulo que permite criar um número de identidicação único de usuário (unique user id).
Quando requisitamos com o '.v4' ao final, significa que ele gerará uma String ALEATÓRIA. */
const uuid = require('uuid').v4;

/* 'module.exports' permite dizer que o seguinte código pode retornar algo que seja 
utilizado em outro arquivo. Nesse caso, quem utilizará o valor retornado, será o 
'app' que é passado como parâmetro. */
module.exports = app => {

    /* Para utilizarmos o banco de dados 'MongoDB', precisamos criar 'Coleções', que se 
    assemelham a tabelas num banco de dados relacional. E assim como num banco relacional,
    precisamos definir qual será a base ('ou esquema') do dado que será inserido. No nosso
    caso, a base, modelo ou esquema do nosso dado se dará através do seguinte objeto: */
    const purchaseSchema = {
        /* Dentro, dizemos o nome do campo (ou coluna no caso do banco de dados relacional), 
        e o tipo de dado que ele receberá. */
        client_id: String,
        purchase_id: String,
        client_name: String,
        total_to_pay: Number,
        credit_card: {
            //! ATENÇÃO: O valor da variável 'card_number' deve conter 16 caracteres (números)
            //! no modelo a seguir: '1234567890122356'. 
            card_number: String,
            card_holder_name: String,
            value: Number,
            cvv: Number,
            exp_date: String
        }
    }

    /* Por fim, criamos a coleção 'Purchase', coleção que guarda todas as informações de compra, 
    baseado nom modelo 'purchaseSchema' criado. */
    const Purchase = mongoose.model('Purchase', purchaseSchema)

    /* Como precisamos de mostrar esses dados para o cliente com a rota '/starstore/history',
    devemos manter em sigilo alguns dados. Foi decidido implementar outra coleção que só mostra 
    os dados que devem ser mostrados. */
    const historySchema = {
        client_id: String,
        purchase_id: String,
        value: Number,
        date: String,
        card_number: String,
    }

    /* Essa coleção 'History' se baseia no modelo criado 'historySchema'. */
    const History = mongoose.model('History', historySchema)
    

    /* Aqui, inicializamos a dinamização das rotas. Quando o usuário digitar a rota '/starstor/buy',
    ele deverá enviar os dados da compra, por conta do único método que essa rota tem (POST). */
    app.route('/starstore/buy').post((req, res) => {

        /* Quando o(s) dado(s) for(em) digitado(s) no POSTMAN (como já explicado no arquivo 
        README.md), ele(s) virá(ão) através de um array: 

        [
            {
                "client_id": ".....",
                "client_name": ".....",
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
            const newPurchase = new Purchase ({
                client_id: item.client_id,
                /* O método 'uuid()', como já explicado na requisição do módulo, cria uma String de 
                user id aleatória. */
                purchase_id: uuid(),
                total_to_pay: item.total_to_pay,
                credit_card: {
                    card_number: item.card_number,
                    value: item.value,
                    cvv: item.cvv,
                    card_holder_name: item.card_holder_name,
                    exp_date: item.exp_date
                }
            });
    
            /* Esse novo objeto é salvo na coleção a qual pertence ('Purchase'). */
            newPurchase.save((err) => {
                if (!err){
                    console.log("Purchase document inserted successfully");
                    /* Caso não ocorra nenhum erro, envia-se o status 201 (Requisição bem sucedida 
                    e um novo recurso foi criado como resultado). */
                    res.status(201).end();
                } else {
                    console.log(err);
                }
            });


            /* Ainda percorrendo cada item do array de dados, adicionaremos a coleção criada a 
            seguir 'History', algumas informações que guardamos na coleção 'Purchase'.
            
            !ATENÇÃO: Estamos considerando que o valor do campo 'card_number'  terá 16 caracteres
            ! (números), como já dito na declaração do squema da coleção 'Purchase'. Por conta disso, 
            ! vamos tratar essa String para que o número do cartão fique censurado ao mostrar para 
            ! o usuário. */

            /* Como o cartão terá 16 números, pegamos somente o de index 12 até index 15 (index 16 
            não se aplica). */
            const show = item.card_number.substring(12, 16);
            const censored_card_number = "**** **** **** ".concat(show);
        
            /* Em seguida, criamos um novo objeto na qual coletamos os dados para mostrar ao 
            usuário. */
            const newHistory = new History ({
                client_id: item.client_id,
                purchase_id: item.purchase_id,
                value: item.value,
                /* O campo 'data' é gerado na hora e convertido para ums String que seja legível. */
                date: (new Date()).toLocaleDateString(),
                card_number: censored_card_number
            });

            /* Por fim, esse novo objeto é salvo na coleção a qual pertence ('History'). */
            newHistory.save((err) => {
                if (!err) {
                    /* Caso não ocorra nenhum erro, envia-se o status 201 (Requisição bem sucedida 
                    e um novo recurso foi criado como resultado). */
                    res.status(201).end();
                } else {
                    console.log(err);
                }
            });
        });        

    });    


    /* Quando o usuário digitar a rota '/starstor/history', ele deverá receber os dados da compra,
    por conta do único método que essa rota tem (GET). */
    app.route('/starstore/history').get((req, res) => {
        /* Utiliza-se um método do 'MongoDB', 'find()', na qual permite achar algum documento (data), 
        dependendo do(s) partâmetro(s) de consulta. Como não foi especificado nenhum parâmetro
        para consulta, todos os objetos da coleção serão retornados (como 'foundPurchase'). */
        History.find((err, foundPurchase) => {
            if (!err){
                /* Caso não ocorra nenhum erro, envia-se o status 200 (Requisição bem sucedida),
                juntamente com o json do resultado. */
                res.status(200).json(foundPurchase);
            } else {
                res.send(err);
            }
        });
    })

    /* Quando o usuário digitar a rota '/starstore/history/{clientId}', ele deverá receber os dados
    da compra de um determinado cliente - o que contém seu client_id igual ao especificado pelo 
    usuário - por conta do único método que essa rota tem (GET). */
    app.route('/starstore/history/:client_id').get((req, res) => {
        /* Utiliza-se um método do 'MongoDB', 'find()', na qual permite achar algum documento (data), 
        dependendo do(s) partâmetro(s) de consulta. Aqui, temos especificado que o parâmetro que 
        deveremos observar é o 'client_id'. Se esse campo for semelhante ao o que o usuário digitou
        na rota (possível saber através do 'req.params' que permite pegar os parâmetros passados),
        iremos mostrar para o mesmo (foundPurchaseClient). */
        History.find({'client_id': req.params.client_id}, (err, foundPurchaseClient) => {
            if (!err){
                /* Caso não ocorra nenhum erro, envia-se o status 200 (Requisição bem sucedida),
                juntamente com o json do resultado. */
                res.status(200).json(foundPurchaseClient);
            } else {
                res.send(err);
            }
        })
    })

}

