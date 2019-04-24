/*
Sekyun Oh
CSC 337
Final Project
04/24/2019
final_service.js

This is a JavaScript code for the final web page's data.
This JavaScript code interacts with final.js to send
data to HTML.
*/

const express = require("express");
const app = express();
var fs = require('fs');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers",
               "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

app.use(express.static('public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

app.get('/', function(req, res){
	res.render('final.html');
});

// main get comment function
app.get('/get-user',function(req,res){
	res.header("Access-Control-Allow-Origin", "*");

	var value = req.query.name;
	let arr = [];
	let people = fs.readFileSync(__dirname+'/info.txt', 'utf8').split('\n');

	if(value == undefined) {

		for (let i = 0; i < people.length - 1; i++) {
			let person = people[i].split(',');
			let name = person[0];
			let addr = person[1];
			let pic = person[2];
			let url = person[3];

			let obj = {'name':name, 'address':addr, 'pic':pic, 'url':url};
			arr.push(obj);
		}

	}else{

		for (let i = 0; i < people.length - 1; i++) {
			let person = people[i].split(',');
			let name = person[0];
			let addr = person[1];
			let pic = person[2];
			let url = person[3];

			if(name.toLowerCase().includes(value)){
				let obj = {'name':name, 'address':addr, 'pic':pic, 'url':url};
				arr.push(obj);
			}
		}

	}
	let object = {'people':arr};
	res.send(JSON.stringify(object));
});

app.get('/description', function(req,res){
	res.header("Access-Control-Allow-Origin", "*");

	var value = req.query.id;
	let people = fs.readFileSync(__dirname+'/des.txt', 'utf8').split('\n\n');
	let object = {'desc':people[value]};
	res.send(JSON.stringify(object));
})

// listen connection on 3000 PORT
app.listen(process.env.PORT);
