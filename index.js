const cheerio  = require('cheerio')
const express = require('express')
const axios = require('axios')

const url = 'https://storage.googleapis.com/infosimples-public/commercia/case/product.html'


async function getProducts() {
    try {

        const url = 'https://storage.googleapis.com/infosimples-public/commercia/case/product.html'
        const { data } = await axios.get(url)
        const $ = cheerio.load(data)
        const response = {}

        response['title'] = $('h2#product_title').text()
        response['brand'] = $('div.brand').text()

        console.log(response)

        
    } catch (error) {
        
    }
}

getProducts()