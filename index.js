const cheerio  = require('cheerio')
const express = require('express')
const axios = require('axios')
const fs = require('fs')

const app = express()
const port = 4444
const cleanPrice = require('./helpers/format-price')
const e = require('express')
const { error } = require('console')

app.get('/', async(req, res)=>{
    try {
        const url = 'https://storage.googleapis.com/infosimples-public/commercia/case/product.html'
        const { data } = await axios.get(url)
        const $ = cheerio.load(data)
        const response = {}

        response['title'] = $('h2#product_title').text()
        response['brand'] = $('div.brand').text()
        response['categories'] = []
        response['sku'] = []
        response['reviews_average_score'] = ''
        response['properties'] = []
        response['reviews'] = []
        //product page url
        response['url'] = url

        //product categories
        $('nav.current-category').find('a').each(function(){
            response['categories'].push($(this).text())
        })

        // List with details of each of the product variations.
        $('div.skus-area > div:first-child > div.card').each(function(){
            const name = $(this).find('meta[itemprop="name"]').attr('content')
            const current_price = $(this).find('div.card-container > div.sku-current-price').text()
            const old_price = $(this).find('div.card-container > div.sku-old-price').text()
            const available = !$(this).hasClass('not-avaliable')

            //add the called items to the array
            response['sku'].push({
                name,
                current_price: cleanPrice(current_price),
                old_price: cleanPrice(old_price),
                available
            })
        })

        //List with product properties.
        $('#additional-properties > table.pure-table > tbody > tr').each(function(){
            const label = $(this).find('td:first-child').text()
            const value = $(this).find('td:first-child').text()

            response['properties'].push({
                label,
                value
            })

        })

        //List of product reviews
        $('#comments > div.review-box').each(function (){
            const name = $(this).find('span.review-username').text()
            const date = $(this).find('span.review-date').text()
            const stars = $(this).find('span.review-stars').text().split('')
            const text = $(this).find('p').text()
            let note = 0

            stars.forEach(item =>{
                if(item === '★') note++
            })

            response['reviews'].push({
                name,
                date,
                stars: note,
                text
            })
            
        })

        //Average grade of product reviews
        let note = $('#comments > h4').text().split(':')[1]
        response['reviews_average_score'] = Number(note.split('/')[0])

        res.send(response)

        const json = JSON.stringify(response)

        
        fs.writeFile('json/product.json,', json, function(err) {
            if(err) res.status(400).send({
                status:false,
                body: 'falha ao salvar o arquivo json\n'
            })
        })

        res.status(200).send({
            status: true,
            message: 'Arquivo salvo com sucesso!'
        })
        

    } catch (e) {
        res.status(400).send({
            status: false,
            body: 'Ocorreu um erro'
            
        })
    } 
})

app.listen(port, () => {
    console.log(`Servidor rodando na porta: ${port}`)
  })

