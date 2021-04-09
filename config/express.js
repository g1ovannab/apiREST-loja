/* Aqui, requisita-se todos os módulos que precisaram ser instalados. 
Primeiramente temos o 'express' (o mais importante), um framework que 
permite responder a solicitações (requests) do protocolo HTTP. Além 
disso, ele permite definir rotas e renderizar páginas html dinamicamente. */
const express = require('express');
/* Entretanto, o express não contém todas as funcionalidades que você precisará 
em um projeto. O 'consign' é um módulo que facilita o desenvolvimento de 
aplicativos com separação lógica de arquivos (assim nosso projeto fica mais
organizado). Ele pode ser usado para carregar modelos, rotas, configurações, 
controladores, entre outros. */
const consign = require('consign');
/* Como banco de dados, usaremos o MongoDB, uma base de dados não relacional. */
const mongoose = require('mongoose');

/* 'module.exports' são instruções que dizem para o 'node.js' quais partes do 
código vão ser exportadas para algum outro arquivo. No nosso caso, todas as 
configurações feitas no código a seguir, são importantes para o desenvolvimento 
do código. Para ver um exemplo de aplicação, vá ao caminho './server.js'. Lá, temos
a requisição da variável 'app' que é retornada ao final do código.*/

module.exports = () => {

    /* Utilizando o express, cria-se essa variável que controlará todo o projeto.
    Aqui, chama-se a função 'express()' e coloca a aplicação do express dentro
    dessa variável. */
    const app = express();


    /* Aqui, configuramos alguns 'middlewares' (software que funciona como uma camada 
    de tradução). O 'app' usa um middleware que converte requisições codificadas
    por url. O parâmetro 'extended: true' significa que a biblioteca a ser utilizada, 
    permite aninhamento (informações organizadas por camadas) de objetos (que é 
    basicamente como o JSON trabalha).*/
    app.use(express.urlencoded({
        extended: true
    }));
    /* Já aqui, o 'app' usa outro middleware que converte requisições de entrada
    com JSON.*/
    app.use(express.json());

    /* Aqui, fazemos a conexão com o o banco de dados 'MongoDB'. Se a base de dados 
    'starwarsDB' já existir, somente conecta-se a ele. Se a base de dados ainda não 
    existir, ela é criada localizada em 'localhost:27017'. Alguns parâmetros são
    importantes para conectar com o 'Mongoose', assim como o 'useNewUrlParser', pois
    o driver do 'MongoDB' tornou seu analisador de string obsoleto. Esse parâmetro
    permite que o usuário voltem para o analisador antigo se encontrarem algum bug no novo.
    Outro parâmetro importante é o 'useUnifiedTopology' que é falso por padrão, e precisamos
    torna-lo em true para usar o novo mecanismo de gerenciamento de conexão do driver.
    Após a conexão ser realizada, printamos no console uma mensagem de que a conexão foi
    feita com sucesso, e caso haja algum erro, também pritamos no console esse erro.*/
    mongoose.connect("mongodb://localhost:27017/starwarsDB", {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log('Connected to MongoDB...')
    })
    .catch((err) => {
        console.error("Coudn't connect MongoDB...", err)
    });  

    
    /* A organização do projeto é feita a partir do consign, que recebe como parâmetro o diretório
    base (cdw), que no nosso caso é o diretório 'api'. Seguidamente, ele segue para 'data', 
    ou seja, primeiro ele percorre o caminho 'api.data', então (then) o caminho 'api.routes',
    isso tudo dentro (into) do 'app'. */
    consign({cwd: 'api'})
    .then('routes')
    .into(app);


    /* A partir do Node.js Versão 6, um erro de "(node:11164) Warning: Possible EventEmitter 
    memory leak detected. 11 end listeners added. Use emitter.setMaxListeners() to increase 
    limit" ocorre. Você pode ou não precisar dessa linha de cõdigo para corrigi-lô. */
    //process.on('warning', e => console.warn(e.stack));
    
    /* Retorna o 'app' caso alguém requisite. */
    return app;
}








