const request = require ('request')
const cheerio = require ('cheerio')


const fs = require('fs')

try {

    repostaFinal = {}

     categorias = []


    const url = 'https://storage.googleapis.com/infosimples-public/commercia/case/product.html'
    
    request(url, function(error, response, body){
        const parseHtml = cheerio.load(body)

        repostaFinal['title'] = parseHtml('h2#product_title').text()
        repostaFinal['brand'] = parseHtml('body > div.content > section > div > div.brand').text()
        
        const arraycat = repostaFinal['categories'] = parseHtml('nav').text()
        
        categorias.push(arraycat)
        console.log(repostaFinal, categorias)

        
    })
    
} catch (error) {
    console.log(error)
}