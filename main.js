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


function choseEmoticon(size, emotOptions){
	let numEmotChosen= size/2;
	let arrChosen =  emotOptions.slice(0, numEmotChosen);
	let arrChosenB = arrChosen.map(item=> item+'b');
	let arrEmotDupli = [...arrChosen, ...arrChosenB];
	arrEmotInitial = arrEmotDupli;
}

const randomEmotOrder = (arr) =>{
	let arrRandom=[],
	arrApart = [...arr],
	sizeArray = arr.length;
	while ( sizeArray>0){
		let currentEmot= Math.floor(Math.random() * sizeArray);
		arrRandom.push({name:String(arrApart[currentEmot]).substring(0, 8), id: String(arrApart[currentEmot]).substring(5, 9), match: false});
		arrApart.splice(currentEmot, 1);
		sizeArray -= 1;
	}
	arrRandomFin = arrRandom;
}

const itMatches=()=>{
	let compare = localStorage.getItem('comparative');
	let arrCompare = JSON.parse(compare);

	const card1 = document.querySelector('.card'+arrCompare[0]);
	const card2 = document.querySelector('.card'+arrCompare[1]);

	card1.classList.toggle('cardOpacity');
	card2.classList.toggle('cardOpacity');

	card1.disable=true;
	card2.disable=false;
}

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


const checkMatch =(pickEmot)=>{
	compareEmot.push(pickEmot);
	if(compareEmot.length >= 2){
		localStorage.setItem('comparative', JSON.stringify(compareEmot));
		if(compareEmot[0].substring(0, 3) === compareEmot[1].substring(0,3)){
			setTimeout(itMatches, 500)
			console.log(compareEmot);
			compareEmot=[];
		}else{
			console.log(compareEmot)
			setTimeout(dontMatch, 500)
			compareEmot=[];
		}
	}else{

	}
	console.log(compareEmot);
}

const pickCardEmot = (pickEmot) =>{
	console.log(pickEmot);
	const card = document.querySelector('.card'+pickEmot);
	const spanCard = document.querySelector('.spanCard'+pickEmot);
	card.classList.toggle('cardToggle');
	spanCard.classList.toggle('spanToggle');
	checkMatch(pickEmot);
}

const renderCards = (size, renArr)=>{
	for (let i=0; i<size; ++i){
		let divCard = document.createElement('div');
		divCard.classList.add('card');
		divCard.classList.add('card'+renArr[i].id);
		divCard.classList.add('cardToggle');
		//Span is created in order to allow me to hide the emoticons
		let spanCard = document.createElement('span');
		spanCard.classList.add('spanCard'+renArr[i].id);
		spanCard.classList.add('spanToggle');
		spanCard.innerHTML = renArr[i].name;
		divCard.append(spanCard);
		divCard.addEventListener('click', ()=>pickCardEmot(renArr[i].id) )
		board.append(divCard);
	}
}

const chosenButton = (size) =>{
	board.innerHTML='';
	choseEmoticon(size, arrayEmot);
	randomEmotOrder(arrEmotInitial);
	renderCards(size, arrRandomFin);
	console.log(arrRandomFin);
}

const turnIntoSpanish =() =>{
	isEnglish=false;
	restart.innerText='Reiniciar';
	bigGame.innerText='Juego Grande';
	midGame.innerText='Juego Mediano';
	smallGame.innerText='Juego Pequeño';
	title.innerText='Juego de Memoria';
	iniRestart(isEnglish);
}

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

