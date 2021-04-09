/* Requisitando o 'valor de retorno' do arquivo 'express.js' que se encontra na pasta
'configs' no diretório principal. Para entender melhor essa parte, vá ao caminho 
'./config/express.js'. Essa linha de código pode ser considerada um exemplo de 
aplicação para o 'module.exports'. Aqui, estamos requisitando o valor da variável 'app'
que foi setada lá.*/
const app = require('./config/express')();

/* 'Escutando' a porta 3000. Aqui, inicia-se a escuta das conexões em um caminho 
fornecido. Aqui, estamos escutando a porta 3000 (ou seja, é preciso se redirecionar 
a 'http://localhost:3000' para executar a aplicação). Veja que 3000 é o número da 
porta que escolhemos. A partir daqui, qualquer requisição que fizermos, deverá ser 
feita a partir dessa. */
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});