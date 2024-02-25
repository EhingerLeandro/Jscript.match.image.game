const board = document.querySelector('.board'),
      bigGame= document.querySelector('#bigGame'),
      midGame= document.querySelector('#midGame'),
      smallGame= document.querySelector('#smallGame'),
      restart= document.querySelector('#restart'),
      spanish = document.querySelector('#spanish'),
      english = document.querySelector('#english'),
      tittle = document.querySelector('#title'),
      instruction = document.querySelector('#instructions');

let unicodeEmot='&#x1F', 
	rangeEmot= 25,
	arrayEmot= [],
	arrSelecEmot =[],
	sizeGame=[16, 24, 32];
	isEnglish=false;

for (let i=0; i<rangeEmot; ++i ){
	arrayEmot.push(unicodeEmot+(400+i*2));
}

let arrEmotInitial=[];
let arrRandomFin = [];
let compareEmot = [];

//This part decides what is rendered inside the board, it depends on the language chosen previously.
function iniRestart (language){
	board.innerHTML = `<div  class='instruction'>
					<div id='instruct' class='inner-inst'>
						${language ?
						 'Pick the Board Size.':
						 'Elige el tamaño del tablero.' }
					</div>
				</div>`;
}
iniRestart(isEnglish);

//Function that creates a array of emoticons.
function choseEmoticon(size, emotOptions){
	let numEmotChosen= size/2;
	let arrChosen =  emotOptions.slice(0, numEmotChosen);
	let arrChosenB = arrChosen.map(item=> item+'b');
	let arrEmotDupli = [...arrChosen, ...arrChosenB];
	arrEmotInitial = arrEmotDupli;
	if(size>24){
		board.classList.remove('smallSize');
	}else{
		board.classList.add('smallSize');
	}
}

//Function that generates another array with emoticons in a random order.
const randomEmotOrder = (arr) =>{
	let arrRandom=[],
	arrApart = [...arr],
	sizeArray = arr.length;
	while ( sizeArray>0){
		let currentEmot= Math.floor(Math.random() * sizeArray);
		/*In this part an object is created, it has one name and an ID,
		after that, it is pushed in an array*/
		arrRandom.push({name:String(arrApart[currentEmot]).substring(0, 8), id: String(arrApart[currentEmot]).substring(5, 9), match: false});
		arrApart.splice(currentEmot, 1);
		sizeArray -= 1;
	}
	arrRandomFin = arrRandom;
}

const allCardsFound =(language)=>{
	let numberMatches = 0;
	arrRandomFin.forEach(item=>{
		if(item.match === true){
			numberMatches +=1;
		}
	})
	if(numberMatches === arrRandomFin.length){
		board.innerHTML = `<div style='display:flex; flex-direction:column; align-items:center; padding:5px;' 
					class='instruction'>
						<img src='./images/trophy.png'/>
						<div style='margin:4px;' id='instruct' class='inner-inst-win'>
							${language ?
							 '¡Congratulations you Won!':
							 '¡Felicitaciones ganaste!' }
						</div>
					</div>`;
	}

};


//This functionlaity will be activated when a pair of cards matches.
const itMatches=()=>{
	//Here it gets the array from the localStorage 
	let compare = localStorage.getItem('comparative');
	let arrCompare = JSON.parse(compare);

	const card1 = document.querySelector('.card'+arrCompare[0]);
	const card2 = document.querySelector('.card'+arrCompare[1]);

	//In this part, it toggles a class that allows to change the opacity of cards.
	card1.classList.toggle('cardOpacity');
	card2.classList.toggle('cardOpacity');

	arrRandomFin.forEach(item=>{
		if(item.id==arrCompare[0]){
			item.match=true;
		}
		if(item.id==arrCompare[1]){
			item.match=true;
		}
	})
	
	//This two lines of code are used to know if the matches are changing.
	let arrMatchTest = arrRandomFin.map(item=> item.match);
	console.log('Arreglo con items que hacen match ->'+ arrMatchTest);

	card1.disable=true;
	card2.disable=true;

	allCardsFound(isEnglish);
}

//This functionlaity will be activated when a pair of cards DOESN'T match.
const dontMatch=()=>{
	let compare = localStorage.getItem('comparative');
	let arrCompare = JSON.parse(compare);

	const card1 = document.querySelector('.card'+arrCompare[0]);
	const spanCard1 = document.querySelector('.spanCard'+arrCompare[0]);
	const card2 = document.querySelector('.card'+arrCompare[1]);
	const spanCard2 = document.querySelector('.spanCard'+arrCompare[1]);
	
	card1.classList.toggle('cardToggle');
	spanCard1.classList.toggle('spanToggle');
	card2.classList.toggle('cardToggle');
	spanCard2.classList.toggle('spanToggle');
}


/*With this function you use an array to save the record of those cards that
have been selected (the first and second card), in order to compare them*/
const checkMatch =(pickEmot)=>{
	compareEmot.push(pickEmot);
	if(compareEmot.length >= 2){
		//The array is saved in localsotrage, so that it avoids scope problems.
		localStorage.setItem('comparative', JSON.stringify(compareEmot));
		//Here it compares the first and second card.
		if(compareEmot[0].substring(0, 3) === compareEmot[1].substring(0,3)){
			setTimeout(itMatches, 500)
			console.log('Comparación de seleccionados -> '+compareEmot);
			compareEmot=[];
		}else{
			console.log('Comparación de seleccionados -> '+compareEmot)
			setTimeout(dontMatch, 500)
			compareEmot=[];
		}
	}
}

//This functionality is inside every card, and it's activated when one card is clicked.
const pickCardEmot = (pickEmot) =>{
	console.log('Card elegida -> '+pickEmot);
	const card = document.querySelector('.card'+pickEmot);
	const spanCard = document.querySelector('.spanCard'+pickEmot);
	card.classList.toggle('cardToggle');
	spanCard.classList.toggle('spanToggle');
	checkMatch(pickEmot);
}

//This function render all cards and gives and eventListener to those cards.
const renderCards = (size, renArr)=>{
	//This for iterates through every card represented in the array.
	for (let i=0; i<size; ++i){
		let divCard = document.createElement('div');
		divCard.classList.add('card');
		divCard.classList.add('card'+renArr[i].id);
		divCard.classList.add('cardToggle');
		//Span is created in order to allow me to hide the emoticons.
		let spanCard = document.createElement('span');
		spanCard.classList.add('spanCard'+renArr[i].id);
		spanCard.classList.add('spanToggle');
		spanCard.innerHTML = renArr[i].name;
		//Here span is render inside the div.
		divCard.append(spanCard);
		//In this part every card receives an eventListener with a function and an argument.
		divCard.addEventListener('click', ()=>pickCardEmot(renArr[i].id) )
		board.append(divCard);
	}
}

//This function allows the app to change the size of the board.
const chosenButton = (size) =>{
	board.innerHTML='';
	choseEmoticon(size, arrayEmot);
	randomEmotOrder(arrEmotInitial);
	renderCards(size, arrRandomFin);
	console.log('Este es el arreglo total aleatorio -> ' + arrRandomFin);
}

//This function changes the information into spanish.
const turnIntoSpanish =() =>{
	isEnglish=false;
	restart.innerText='Reiniciar';
	bigGame.innerText='Juego Grande';
	midGame.innerText='Juego Mediano';
	smallGame.innerText='Juego Pequeño';
	title.innerText='Juego de Memoria';
	iniRestart(isEnglish);
}

//This function changes the information into english.
const turnIntoEnglish =() =>{
	isEnglish=true;
	restart.innerText='Restart';
	bigGame.innerText='Big Game';
	midGame.innerText='Medium Game';
	smallGame.innerText='Small Game';
	title.innerText='Memory Game';
	iniRestart(isEnglish);
}

restart.addEventListener('click', ()=>iniRestart(isEnglish) )
bigGame.addEventListener('click', ()=>chosenButton(sizeGame[2]) )
midGame.addEventListener('click', ()=>chosenButton(sizeGame[1]) )
smallGame.addEventListener('click', ()=>chosenButton(sizeGame[0]) )
spanish.addEventListener('click', turnIntoSpanish )
english.addEventListener('click', turnIntoEnglish)

