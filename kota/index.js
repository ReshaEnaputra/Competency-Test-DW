const http = require("http");
const path = require("path");
const express = require("express");
const { dirname } = require('path');
const hbs = require('hbs');
const dbConnection = require('./connection/db');
const uploadFile = require('./middleware/uploadFile');
const session = require('express-session')

const app = express()

const {response} = require('express');
const { query } = require("./connection/db");

hbs.registerPartials(__dirname + '/views/partials');

app.use('/public', express.static(path.join(__dirname, '/public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use(express.json())
app.use(express.static('express'));
app.use(express.urlencoded({ extended: false }));
app.set('views', path.join(__dirname, 'views'));

const pathFile = 'http://localhost:3000/uploads/'

app.set('view engine', 'hbs')

app.use(
    session({
      cookie:{
        maxAge: 1000 * 60 * 60 * 2,
        secure: false,
        httpOnly: true
      },
      store: new session.MemoryStore(),
      saveUninitialized: true,
      resave: false,
      secret: 'secretkey'
    })
  )

app.get('/', function(request, response){
    const title = "Kota"
    const query = `SELECT * FROM provinsi_tb ORDER BY id ASC`
    dbConnection.getConnection(function(err, conn){
        if (err) throw err;
        conn.query(query, function(err, results){
            if (err) throw err;
            const provinsi = [];
            for(let result of results){
                provinsi.push({
                    id : result.id,
                    image : pathFile + result.photo,
                    nama :  result.nama,
                    tgl : result.diresmikan,
                    pulau : result.pulau
                })
            }
            response.render('index', {
                title : title,
                provinsi : provinsi
            })
        })
    })
})

app.get('/kabupaten', function(request, response){
    const title = "Kota"
    const query = `SELECT * FROM kabupaten_tb ORDER BY id ASC`
    dbConnection.getConnection(function(err, conn){
        if (err) throw err;
        conn.query(query, function(err, results){
            if (err) throw err;
            const provinsi = []
            for(let result of results){
                provinsi.push({
                    id : result.id,
                    nama : result.Nama,
                    tgl : result.diresmikan,
                    image : pathFile + result.photo
                })
            }
            response.render('kabupaten', {
                title : title,
                provinsi : provinsi
            })
        })
    })
})

app.get('/add-provinsi', function(request, response){
    const title = "Kota"
    response.render('add-provinsi', {
        title : title
    })
})

app.get('/add-kabupaten', function(request, response){
    const title = "Kota"
    const query = `SELECT * FROM provinsi_tb ORDER BY id ASC`
    dbConnection.getConnection(function(err, conn){
        if (err) throw err;
        conn.query(query, function(err, results){
            if (err) throw err;
            const provinsi = []
            for(let result of results){
                provinsi.push({
                    id : result.id,
                    nama : result.nama
                })
            }
            response.render('add-kabupaten', {
                title : title,
                provinsi : provinsi
            })
        })
    })
})

app.get('/kabupaten/edit/:id', function(request, response){
    const title = "Kota"
    const query = `SELECT * FROM provinsi_tb ORDER BY id ASC`
    dbConnection.getConnection(function(err, conn){
        if (err) throw err;
        conn.query(query, function(err, results){
            if (err) throw err;
            const provinsi = []
            for(let result of results){
                provinsi.push({
                    id : result.id,
                    nama : result.nama
                })
            }
            response.render('editkabupaten', {
                title : title,
                provinsi : provinsi
            })
        })
    })
})

app.post('/add-provinsi/store', uploadFile('image'), function(request, response){
    let image = ''
    if(request.file) {
        image = request.file.filename
    }
    const { nama, tgl, provinsi, pulau } = request.body
    var countQuery = `SELECT COUNT(id) as COUNT FROM provinsi_tb`
    dbConnection.getConnection(function(err, conn){
        if(err) throw err;
        conn.query(countQuery, function(err, results){
            if(err) throw err;
            const query = `INSERT INTO provinsi_tb (id, nama, diresmikan, pulau, photo) VALUES ("${results[0].count + 1}", "${nama}", "${tgl}", "${pulau}", "${image}")`
            conn.query(query, function(err, results){
                if(err) throw err;
                response.redirect('/add-provinsi')
            })
        })
    })
})

app.get('/provinsi/delete/:id', function(request, response){
    const { id } = request.params
    const query = `DELETE FROM provinsi_tb WHERE id = ${id}`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(query, function (err, results) {
            if (err) throw err;
            
            response.redirect('/')
        })
    })
})

app.get('/kabupaten/delete/:id', function(request, response){
    const { id } = request.params
    const query = `DELETE FROM kabupaten_tb WHERE id = ${id}`
    dbConnection.getConnection(function (err, conn) {
        if (err) throw err;
        conn.query(query, function (err, results) {
            if (err) throw err;
            
            response.redirect('/kabupaten')
        })
    })
})

app.post('/add-kabupaten/store', uploadFile('image'), function(request, response){
    let image = ''
    if(request.file) {
        image = request.file.filename
    }
    const { nama, tgl, provinsi } = request.body
    var countQuery = `SELECT COUNT(id) as COUNT FROM kabupaten_tb`
    dbConnection.getConnection(function(err, conn){
        if(err) throw err;
        conn.query(countQuery, function(err, results){
            if(err) throw err;
            const query = `INSERT INTO kabupaten_tb (id, nama, diresmikan, provinsi_id, photo) VALUES ("${results[0].count + 1}", "${nama}", "${tgl}", "${provinsi}", "${image}")`
            conn.query(query, function(err, results){
                if(err) throw err;
                response.redirect('/add-kabupaten')
            })
        })
    })
})

app.get('/provinsi/detail/:id', function(request, response){
    const { id } = request.params
    const title = "Provinsi"

    const query = `SELECT * FROM provinsi_tb WHERE id = ${id}`
    // const query = `SELECT
    //                     provinsi_tb.id,
    //                     provinsi_tb.nama,
    //                     provinsi_tb.diresmikan,
    //                     provinsi_tb.photo,
    //                     provinsi_tb.pulau,
    //                     kabupaten_tb.Nama,
    //                     kabupaten_tb.id
    //                 FROM
    //                     kabupaten_tb
    //                 INNER JOIN
    //                     provinsi_tb
    //                     ON kabupaten_tb.provinsi_id = provinsi_tb.id
    //                 WHERE provinsi_tb.id = ${id}`
    dbConnection.getConnection(function (err, conn){
        if (err) throw err;
        conn.query(query, function (err, results){
            if (err) throw err;
            const provinsi = []
            provinsi.push({
                id : results[0].id,
                nama : results[0].nama,
                tlg : results[0].diresmikan,
                logo : pathFile + results[0].photo,
                pulau : results[0].pulau,
            })
            response.render('detail', {
                provinsi : provinsi,
                title : title
            })
        })
    })
})

app.get('/provinsi/:pulau', function(request, response){
    const { pulau } = request.params
    const title = "Pulau"
    const query = `SELECT * FROM provinsi_tb WHERE pulau = "${pulau}"`
    dbConnection.getConnection(function(err, conn){
        if (err) throw err;
        conn.query(query, function(err, results){
            if (err) throw err;
            const pulau = results[0].pulau
            const provinsi = []
            for(let result of results){
                provinsi.push({
                    id : result.id,
                    nama : result.nama,
                    image : pathFile + result.photo,
                    tgl : result.diresmikan
                })
            }
            response.render('pulau', {
                title : title,
                provinsi : provinsi,
                pulau : pulau
            })
        })
    })
})

app.get('/provinsi/edit/:id', function(request, response){
    const { id } = request.params
    const title = "Edit"
    const query = `SELECT * FROM provinsi_tb WHERE id = ${id}`

    dbConnection.getConnection(function (err, conn){
        if (err) throw err;
        conn.query(query, function(err, results){
            if (err) throw err;
            const provinsi = results[0]

            response.render('editprovinsi', {
                title : title,
                provinsi : provinsi,
                id : id
            })
        })
    })
})

app.post('/provinsi/update/:id', uploadFile('image'), function(req, res){
    const { id } = req.params
    const { nama, tgl, pulau } = req.body
    image = ''
    if(req.file) {
        image = req.file.filename
    }
    const query = `UPDATE provinsi_tb SET 
                                        nama = "${nama}",
                                        diresmikan = "${tgl}",
                                        pulau = "${pulau}",
                                        photo = "${image}" WHERE id = ${id}`

    dbConnection.getConnection((err, conn) => {
        if(err) throw err;
        conn.query(query, function(err, results){
            if (err) throw err;
        })
        res.redirect('/')
    })
})

const port = 3000
const server = http.createServer(app)
server.listen(port)