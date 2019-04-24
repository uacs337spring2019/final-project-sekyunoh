/*
Sekyun Oh
CSC 337
Final Project
04/24/2019
final.js

This is a JavaScript code for the final web page's behavior.
This JavaScript code interacts with final_service.js to get
data from the server.
*/


(function(){
	'use strict';
	/**
	window.onload = function()

	This is an anonymous function that is called when html file is being loaded.
	**/
	window.onload = function(){
		getList();
		document.getElementById('input').onkeyup = userTyping;
	};

	/**
	getList()

	This function gets called when the page is beign loaded.
	This function calls the server to get the data for people.
	**/
	function getList(){
		// call ajax
		let url = 'https://final-project-sekyunoh.herokuapp.com/get-user';
		fetch(url)
		.then(checkStatus)
		.then(function(responseText) {
			let res = JSON.parse(responseText);
			let people = res['people'];
			displayList(people);
		})
		.catch(function(error) {
			// show error
			displayError(error + ' while getting list');
		});
	}

	/**
	userTyping()

	This function gets called when user typing.
	This is main function that completes auto-complete function.
	This calls server to get the data and show to the front.
	**/
	function userTyping(){
		let value = document.getElementById('input').value;
		let url = 'https://final-project-sekyunoh.herokuapp.com/get-user?name='+value;

		// fetch url
		fetch(url)
		.then(checkStatus)
		.then(function(responseText) {
			let res = JSON.parse(responseText);
			let people = res['people'];
			displayList(people);
		})
		.catch(function(error) {
			// error: do something with error
			displayError(error + ' while displaying list');
		});
	}

	/**
	@param {object} people

	displayList(people)

	This function get called when the getting people's data succeeds.
	This function is a main function that displays the list of people
	into the front.
	**/
	function displayList(people){
		document.getElementById('list').innerHTML = '';
		let i;
		for(i = 0; i < people.length; i++){
			let person = people[i];
			let div = document.createElement('div');
			div.className = person['url'];
			div.onclick = modal;
			div.id = i.toString();
			let img = document.createElement('img');
			let infoDiv = document.createElement('div');
			let h3 = document.createElement('h3');
			let p = document.createElement('p');

			let image = '/image/'+person['pic'].replace(/^\s+|\s+$/g,'');
			let fullname = person['name'].split(' ');
			let name = fullname[0] + ' ' + fullname[1];
			let addr = person['address'].replace(/^\s+|\s+$/g,'');

			img.src = image;
			img.alt = person['pic'].replace(/^\s+|\s+$/g,'');
			h3.innerHTML = name;
			p.innerHTML = addr;
			infoDiv.appendChild(h3);
			infoDiv.appendChild(p);

			div.appendChild(img);
			div.appendChild(infoDiv);

			document.getElementById('list').appendChild(div);
		}
	}

	/**
	@param {error} error

	displayError(error)

	This function gets called when fetching url fails.
	This removes every dom in list-container div and
	shows error instead.
	**/
	function displayError(error){
		document.getElementById('list').innerHTML = '';
		let h1 = document.createElement('h1');
		h1.className = 'error';
		h1.innerHTML = error;
		document.getElementById('list').appendChild(h1);
	}

	/**
	modal()

	This function gets called when user clicks a person in a list.
	This pops up and shows the person's detail.
	**/
	function modal(){

		document.getElementById('modal-pic').src = this.children[0].getAttribute('src');
		document.getElementById('modal-pic').alt = this.children[0].getAttribute('alt');
		document.getElementById('modal-name').innerHTML = '';
		let a = document.createElement('a');
		a.innerHTML = this.children[1].children[0].innerHTML;
		a.href = this.getAttribute('class');
		a.target = '_blank';
		document.getElementById('modal-name').appendChild(a);

		let url = 'https://final-project-sekyunoh.herokuapp.com/description?id='
		+this.getAttribute('id');
		// fetch url
		fetch(url)
		.then(checkStatus)
		.then(function(responseText) {
			let res = JSON.parse(responseText);
			document.getElementById('modal-desc').innerHTML = res['desc'];
		})
		.catch(function(error) {
			// error: do something with error
			//showError(error,);
			displayError(error + ' while fetching description');
		});

		let modal = document.getElementById('myModal');
		modal.style.display = "block";

		document.getElementsByClassName("close")[0].onclick = function() {
			modal.style.display = "none";
		};
	}

	/**
	@param {JSON} response
	checkStatus(response)

	This function is called when Ajax fetchs url.
	This function simply determines if the Ajax call was successful or not.
	This is a main function that we can handle errors.
	@returns {JSON} JSON or Error
	**/
	function checkStatus(response) {

		if (response.status >= 200 && response.status < 300) {
			return response.text();
		}
		else{
			return Promise.reject(new Error(response.status+":"+response.statusText));
		}
	}
})();
