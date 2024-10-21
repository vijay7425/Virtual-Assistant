

let box = document.querySelector(".box")
let btn = document.querySelector("button")

const speakfunc  = (input)=> {
    let speakInput = new SpeechSynthesisUtterance(input)

    window.speechSynthesis.speak(speakInput)
}

window.onload = ()=>{
    //greeting()
}


const greeting = () =>{
    let date = new Date()
    let hour = date.getHours()

    if (hour >= 0 && hour < 12){
        speakfunc("Good morning sir , How can i help you !")
    }else if (hour >= 12 && hour < 16){
        speakfunc("Good afternoon sir , how can i help you !")
    }else{
        speakfunc("Good evening sir , How can i help you!")
    }
}

const startvoiceInput = () =>{
    if('webkitSpeechRecognition' in window){

        let recognition = new webkitSpeechRecognition();
        recognition.lang = "en-US"
        recognition.onresult = (e) =>{

            let spokenText = e.results[0][0].transcript;
            handleCommands(spokenText.toLowerCase())
            box.classList.remove("btn-box")
            btn.innerHTML = ` <i class="fa-solid fa-microphone-lines-slash"></i>`
            
        } 
        recognition.start();

    }else{
        alert("your browser does not support voice input")
    }
} 

btn.onclick = () =>{
    box.classList.add("btn-box")
    btn.innerHTML = `<i class="fa-solid fa-microphone-lines"></i>`
    startvoiceInput()

}

const getWeather = async (city) =>{
    const apikey = "2fac3d0f75affeb9bc404f5b152c070b"
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${apikey}&units=metric`)
    const data = await response.json();

    if (data.cod === 200){
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp
        console.log(temperature);
        
        return `the weather in ${city} is currently ${weatherDescription} with a temperature of ${temperature} degrees Celsius.`;

    }else{
        return "I could not fetch the weather information"
    }
}
    
const getNews = async () =>{
    const apiKey = "b9827a35be6349d08e822c1f781ac880"
    const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`)
    const data = await response.json()

    if (data.status === "ok"){
        const articles = data.articles.slice(0,5)
        let news = "Her are the latest news updates: "
        articles.forEach(article =>{
            news += `${article.title}`
        })
        console.log(news);
        
        return news
    }else{
        return "i could not fetch the news updates"
    }
}


const handleCommands = async(command) =>{
    console.log(command);
    if (command.includes("hello")|| command.includes("hey") || command.includes("hy")) {
        speakfunc("Hello sir , How can i help you")
    }
    else if (command.includes("who are you")|| command.includes("hu r u")) {
        speakfunc("I am virtual Assistant , Developed By Mr. Vijay, Who is an AI Developer and researcher ")
    }
     else if (command.includes("open")) {
        let commandWords = command.split(" ");
        let site = commandWords[commandWords.indexOf("open")+1];
        
        if (site) {
            speakfunc(`Opening ${site}`);
            window.open(`https://www.${site}.com`);
        } else {
            speakfunc("Please specify what to open.");
        }
    }
    else if (!command.includes("date and time")&&(!command.includes("time and date"))&&command.includes("time") ) {
       let time = new  Date().toLocaleString(undefined,{hour:"numeric",minute : "numeric"})
       speakfunc(`time is ${time}`)
    }else if (command.includes("news")) {
        try{
            const newsInfo = await getNews()
            speakfunc(newsInfo)
        } catch(error){
            speakfunc("there was an error fetching the news")
        }
    }
    else if (command.includes("play")) {
        const song = command.substring(command.indexOf("play")+5)
        if (song.trim()){
            speakfunc(`Searching your song on youtube`)
            window.open(`https://www.youtube.com/results?search_query=${song.trim()}`)

        }else{
            speakfunc("please specify a song")
        }
        
    }
    else if (!command.includes("date and time")&&(!command.includes("time and date"))&&command.includes("date") ) {
        let date = new  Date().toLocaleString(undefined,{day:"numeric",month : "long"})
       speakfunc(`time is ${date}`)
    }
    else if (command.includes("date and time")|| command.includes("time and date")) {
        let time1 = new  Date().toLocaleString(undefined,{hour:"numeric",minute : "numeric"})
        let date2 = new  Date().toLocaleString(undefined,{day:"numeric",month : "long"})
        speakfunc(`time is ${time1} and date is ${date2}`)
    }
    else if (command.includes("run")) {
        let commandWords2 = command.split(" ") 
        let app = commandWords2[commandWords2.indexOf("run")+1]
        if (app){
            speakfunc(`Opening ${app}`)
            window.open(`${app}://`)
        }else{
            speakfunc("app Cannot be Found")
        }
    }
    else if (command.includes("search chat gpt")) {
        speakfunc("opening chat gpt ")
        window.open("https://www.chatgpt.com")
    }
    else if(command.includes("weather")) {
        const city = command.split("weather in ")[1] || command.split("weather")[1].trim()
        if (city){
            try{
                const weatherInfo = await  getWeather(city)
                speakfunc(weatherInfo)
            }catch (error){
                speakfunc(error.message)
            }
        }else{
            speakfunc("please specify a city")
        }
        
    }

     else {
        speakfunc(`this is what i found on internet regarding ${command}`)
        window.open(`https://www.google.com/search?q=${command}`)
    }
    
}

