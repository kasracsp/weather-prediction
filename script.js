import {key_of_mine,IP_key} from './hiddenKey.js';

let weatherType=[]
const searchEl=document.querySelector('#search')
const closeModal=document.querySelector('#close_modal')
const searchModal=document.querySelector('#search_modal')
const submit=document.querySelector('#submit')
const searchText=document.querySelector('#search_text')
const overlayEl=document.querySelector('#overlay')
const cityEl=document.querySelector('#city')
const highTemp=document.querySelector('#high_temp')
const lowTemp=document.querySelector('#low_temp')
const humidityEl=document.querySelector('#humidity')
const compassPointer=document.querySelector('#compass_pointer')
const speedEl=document.querySelector('#speed')
const weatherTypeText=document.querySelector('#weather_type_text')
const weatherTypeIcon=document.querySelector('#weather_type_img')
const nextWeekWeathers=document.querySelector('.next_week_weathers')
let searchedCity="london"
//set json file
fetch('weatherCondition.json')
.then(res=>res.json())
.then(json=>{
	weatherType=json
}).catch(err=>console.log(err))
//set time
const yearEl=document.querySelector("#year")
const monthEl=document.querySelector("#month")
const dayEl=document.querySelector("#day")
const weekdayEl=document.querySelector("#weekday")
const date=new Date()
let yearHolder=date.getFullYear()
let monthHolder=date.getMonth()
let dateHolder=date.getDate()
let dayHolder=date.getDay()
yearEl.textContent=yearHolder
monthEl.textContent=setMonth(monthHolder)
weekdayEl.textContent=setWeekday(dayHolder)
dayEl.textContent=setDay(dateHolder)
//changing cel to fah and opposite
let isFah=false
const changeType=document.querySelector("#change_type")
changeType.addEventListener("click",()=>{
	if(!isFah){
		changeType.classList.add("after")
		isFah=true
		setMainWeather()
	}else{
		changeType.classList.remove("after")
		isFah=false
		setMainWeather()
	}	
})
//turn on the next 2 days
const weeklyWeather=document.querySelector(".weekly_weather")
const upDown=document.querySelector("#up_down")
upDown.addEventListener("click",()=>{
		upDown.classList.toggle("turn")
		weeklyWeather.classList.toggle("open")
})
//set city location by IP
let tempHolder
setCityLoc().catch(err=>console.log(err))
async function setCityLoc() {
	const foundCity=await fetch('https://ip-geolocation.whoisxmlapi.com/api/v1?apiKey='+IP_key+'&ipAddress=8.8.8.8')
	const jsonFoundCity=await foundCity.json()
	searchedCity=jsonFoundCity.location.city
	console.log(jsonFoundCity.location)
	setTemperature().catch(err=>console.log(err))
}
//set the temperature
async function setTemperature() {
	const tempjson=await fetch('http://api.weatherapi.com/v1/forecast.json?key='+key_of_mine+'&q='+searchedCity+'&days=3')
	const tempData=await tempjson.json()
	cityEl.textContent=tempData.location.name
	speedEl.textContent=tempData.current.wind_kph
	humidityEl.textContent=tempData.current.humidity+"%"
	setBackgroundImage(tempData.current.condition.text)
	compassPointer.style.setProperty('--compass-rotate',tempData.current.wind_degree)
	weatherTypeText.textContent=tempData.current.condition.text
	weatherTypeIcon.src=tempData.current.condition.icon
	tempHolder=tempData.forecast.forecastday.map(temp=>{
		return{
			date:temp.date,
			maxtempc:temp.day.maxtemp_c,
			mintempc:temp.day.mintemp_c,
			maxtempf:temp.day.maxtemp_f,
			mintempf:temp.day.mintemp_f,
			text:temp.day.condition.text,
			icon:temp.day.condition.icon,
			maxwind:temp.day.maxwind_kph
		}
	})
	setMainWeather()
}
function setMainWeather() {
	if(isFah){
		highTemp.textContent=tempHolder[0].maxtempf+"°F"
		lowTemp.textContent=tempHolder[0].mintempf+"°F"
		nextWeekWeathers.innerHTML=''
		for(let i=1;i<tempHolder.length;i++){
			let dateList=tempHolder[i].date.split('-')
			let monthL=parseInt(dateList[1])-1
			let dayL=parseInt(dateList[2])
			const nextDiv=document.createElement('div')
			nextDiv.classList.add('next_week_weather')
			//date
			const dateDiv=document.createElement('div')
			dateDiv.classList.add('next_date')

			const monthP=document.createElement('p')
			monthP.classList.add('next_month')
			monthP.textContent=setMonth(monthL)
			dateDiv.appendChild(monthP)

			const dayP=document.createElement('p')
			dayP.classList.add('next_day')
			dayP.textContent=setDay(dayL)
			dateDiv.appendChild(dayP)
			nextDiv.appendChild(dateDiv)
			//high-low
			const HighLowDiv=document.createElement('div')
			HighLowDiv.classList.add('next_high_low')

			const highP=document.createElement('p')
			highP.textContent='High: '
			const highSpan=document.createElement('span')
			highSpan.classList.add('next_high')
			highSpan.textContent=tempHolder[i].maxtempf+"°F"
			highP.appendChild(highSpan)
			HighLowDiv.appendChild(highP)

			const lowP=document.createElement('p')
			lowP.textContent='Low: '
			const lowSpan=document.createElement('span')
			lowSpan.classList.add('next_low')
			lowSpan.textContent=tempHolder[i].mintempf+"°F"
			lowP.appendChild(lowSpan)
			HighLowDiv.appendChild(lowP)
			nextDiv.appendChild(HighLowDiv)
			//type
			const typeDiv=document.createElement('div')
			typeDiv.classList.add('next_type')

			const typeH=document.createElement('h2')
			typeH.classList.add('next_type_text')
			typeH.textContent=tempHolder[i].text
			typeDiv.appendChild(typeH)

			const typeImg=document.createElement('img')
			typeImg.classList.add('next_type_img')
			typeImg.src=tempHolder[i].icon
			typeDiv.appendChild(typeImg)
			nextDiv.appendChild(typeDiv)
			
			nextWeekWeathers.appendChild(nextDiv)
			}
		}else{
			highTemp.textContent=tempHolder[0].maxtempc+"°C"
			lowTemp.textContent=tempHolder[0].mintempc+"°C"
			nextWeekWeathers.innerHTML=''
			for(let i=1;i<tempHolder.length;i++){
				let dateList=tempHolder[i].date.split('-')
				let monthL=parseInt(dateList[1])-1
				let dayL=parseInt(dateList[2])
				const nextDiv=document.createElement('div')
				nextDiv.classList.add('next_week_weather')
				//date
				const dateDiv=document.createElement('div')
				dateDiv.classList.add('next_date')
	
				const monthP=document.createElement('p')
				monthP.classList.add('next_month')
				monthP.textContent=setMonth(monthL)
				dateDiv.appendChild(monthP)
	
				const dayP=document.createElement('p')
				dayP.classList.add('next_day')
				dayP.textContent=setDay(dayL)
				dateDiv.appendChild(dayP)
				nextDiv.appendChild(dateDiv)
				//high-low
				const HighLowDiv=document.createElement('div')
				HighLowDiv.classList.add('next_high_low')
	
				const highP=document.createElement('p')
				highP.textContent='High: '
				const highSpan=document.createElement('span')
				highSpan.classList.add('next_high')
				highSpan.textContent=tempHolder[i].maxtempc+"°C"
				highP.appendChild(highSpan)
				HighLowDiv.appendChild(highP)
	
				const lowP=document.createElement('p')
				lowP.textContent='Low: '
				const lowSpan=document.createElement('span')
				lowSpan.classList.add('next_low')
				lowSpan.textContent=tempHolder[i].mintempc+"°C"
				lowP.appendChild(lowSpan)
				HighLowDiv.appendChild(lowP)
				nextDiv.appendChild(HighLowDiv)
				//type
				const typeDiv=document.createElement('div')
				typeDiv.classList.add('next_type')
	
				const typeH=document.createElement('h2')
				typeH.classList.add('next_type_text')
				typeH.textContent=tempHolder[i].text
				typeDiv.appendChild(typeH)
	
				const typeImg=document.createElement('img')
				typeImg.classList.add('next_type_img')
				typeImg.src=tempHolder[i].icon
				typeDiv.appendChild(typeImg)
				nextDiv.appendChild(typeDiv)
	
				nextWeekWeathers.appendChild(nextDiv)
				}
		}
	
}
function setBackgroundImage(type) {
	let indexHolder=weatherType.findIndex(x=>x.day===type)
	if(indexHolder>-1){
		document.body.style.backgroundImage="url("+weatherType[indexHolder].img+")"
	}else{
		document.body.style.backgroundImage="url("+weatherType[0].img+")"
	}
}
//search
searchEl.addEventListener("click",showModal)
closeModal.addEventListener("click",hiddenModal)
overlayEl.addEventListener("click",hiddenModal)
submit.addEventListener("click",submitForm)
searchText.addEventListener("keydown",(e)=>{
		if(e.keyCode===13){
				submitForm(e)
		}
})
function submitForm(e) {
		const matches=searchText.value.match(/[A-Za-z]/g) || []
 		if(matches.length===0){
    	e.preventDefault()
    	searchText.value=""
		}else{
			searchedCity=searchText.value
			setTemperature()
			searchText.value=""
			hiddenModal()
		}
}
function showModal() {
		searchEl.classList.add("open")
		searchModal.classList.add("open")
		overlayEl.classList.add("open")
}
function hiddenModal() {
		searchEl.classList.remove("open")
		searchModal.classList.remove("open")
		overlayEl.classList.remove("open")
		searchText.value=""
}
//set month
function setMonth(monthNumber) {
	switch(monthNumber){
			case 0:{
					return "January"
					break;
			}
			case 1:{
					return "February"
					break;
			}
			case 2:{
					return "March"
					break;
			}
			case 3:{
					return "April"
					break;
			}
			case 4:{
					return "May"
					break;
			}
			case 5:{
					return "June"
					break;
			}
			case 6:{
					return "July"
					break;
			}
			case 7:{
					return "August"
					break;
			}
			case 8:{
					return "September"
					break;
			}
			case 9:{
					return "October"
					break;
			}
			case 10:{
					return "November"
					break;
			}
			case 11:{
					return "December"
					break;
			}
	}
}
//set day
function setDay(dayNumber) {
switch(dayNumber){
		case 1:{
				return "1st"
				break;
		}
		case 2:{
				return "2nd"
				break;
		}
		case 3:{
				return "3rd"
				break;
		}
		default:{
				return dayNumber+"th"
				break;
		}
}
}
//set weekday
function setWeekday(weekdayNumber) {
	switch(weekdayNumber){
		case 0:{
					return "Sun"
					break;
			}
			case 1:{
					return "Mon"
					break;
			}
			case 2:{
					return "Tue"
					break;
			}
			case 3:{
					return "Wed"
					break;
			}
			case 4:{
					return "Thu"
					break;
			}
			case 5:{
					return "Fri"
					break;
			}
			case 6:{
					return "Sat"
					break;
			}
	}
}