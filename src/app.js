const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('../utils/geocode')
const forecast = require('../utils/forecast')


const app = express()
const port = process.env.PORT || 3000

// path for static files and views
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup location 
app.use(express.static(publicDirectoryPath))
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.get('',(req, res) => {
    res.render('index.hbs', {
        title: 'Weather',
        name: 'Nupur'
    })    
})

app.get('/help', (req, res) => {
    res.render('help.hbs', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Nupur'
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        title: 'About Me',
        name: 'Nupur'
    })
})

app.get('/weather', (req, res) => {
    if (!req.query.address){
        res.send({
            error: 'Provide Address'
        })
    }
    else{
        geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
                if (!error){        
                    forecast(latitude,longitude, (error, data) => {
                        if (error === undefined) {
                            res.send({
                                Location : location,
                                Weather: data
                            })
                                               
                        }
                        else res.send({error: 'couldn\'t fetch'})
                    })
                }
                else{
                    res.send({error: 'couldn\'t fetch'})
                }
        })
        
    }
})

app.get('/help/*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        name: 'Nupur',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404.hbs', {
        title: '404',
        name: 'Nupur',
        errorMessage: 'Page not found.'
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+ port)
})