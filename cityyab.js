/*let weather = {
    paris: {
      temp: 19.7,
      humidity: 80
    },
    tokyo: {
      temp: 17.3,
      humidity: 50
    },
    lisbon: {
      temp: 30.2,
      humidity: 20
    },
    san_francisco: {
      temp: 20.9,
      humidity: 100
    },
    oslo: {
      temp: -5,
      humidity: 20
    }
  };
  // write your code here
    function ract() {
        const val = document.querySelector('input').value;
        console.log(val);
        if (val=="paris") {
            temp_P =Math.round(weather.paris.temp)
            faren= (((weather.paris.temp)*1.8)+32)
            faren = Math.floor(faren)
            alert(`It is currently ${temp_P} °C (${faren}°F) in paris with a humidity of ${weather.paris.humidity}%`)
        }
        else if(val =="tokyo"){
            faren= (((weather.tokyo.temp)*1.8)+32)
            faren = Math.floor(faren)
            temp_t =Math.round(weather.tokyo.temp)
            alert(`It is currently ${temp_t} °C (${faren}°F) in paris with a humidity of ${weather.tokyo.humidity}%`)
        }
        if(val =="lisbon"){
            faren= (((weather.lisbon.temp)*1.8)+32)
            faren = Math.floor(faren)
            temp_l =Math.round(weather.lisbon.temp)
            alert(`It is currently ${temp_l} °C (${faren}°F) in paris with a humidity of ${weather.lisbon.humidity}%`)
        }
        if(val =="san_francisco"){
            faren= (((weather.san_francisco.temp)*1.8)+32)
            faren = Math.floor(faren)
            temp_s =Math.round(weather.san_francisco.temp)
            alert(`It is currently ${temp_s} °C (${faren}°F) in paris with a humidity of ${weather.san_francisco.humidity}%`)
        }
        if(val =="oslo"){
            faren= (((weather.oslo.temp)*1.8)+32)
            faren = Math.floor(faren)
            temp_o =Math.round(weather.oslo.temp)
            alert(`It is currently ${temp_o} °C (${faren}°F) in paris with a humidity of ${weather.oslo.humidity}%`)
        }
        else{
            alert("Sorry we don't know the weather for this city")
        }
  }
  let stm = document.getElementById("suc")
    stm.addEventListener("click", ract)
    //////////////////////////////////////
    function change() {
      const val = document.querySelector('input').value;
      document.getElementById("city-2").innerHTML= val;
      let now = new Date();
      const dayNames = ["Sunday", "Monday", "Tuesday"," Wednesday"," Thursday","Friday"];
      let day = now.getDay();
      let hour = now.getHours();
      let min = now.getMinutes();
      document.getElementById("timing").innerHTML= `${dayNames[day]}   ${hour}:${min}`;
      
    }
    let primary = document.getElementById("prim")
    primary.addEventListener("click",change)
    
    /////////////////////////////////////////////
    function dama(params) {
      document.getElementById("number").innerHTML="14"
    }
    let clicus = document.getElementById("cli")
    clicus.addEventListener("click",dama)

    function dama_F() {
      document.getElementById("number").innerHTML="66"
    }
    let farenheit = document.getElementById("faren")
    farenheit.addEventListener("click",dama_F)*/
     //////////////////////////////////////////////////////
     function displaywheather(response) {
      let show_name_city = response.data.name;
      document.getElementById("city-2").innerHTML = show_name_city;
      document.getElementById("number").innerHTML = Math.round(response.data.main.temp);
      document.getElementById("humidity").innerHTML = response.data.main.humidity;
      document.getElementById("wind").innerHTML = Math.round(response.data.wind.speed);
      document.getElementById("discription").innerHTML = response.data.weather[0].main;
   }
   function search_city(event) {
    let apikey ="3679755b1ebb6cd9b2cd32048242a186";
    let name_city =document.querySelector('input').value;
    let apiurl=`https://api.openweathermap.org/data/2.5/weather?q=${name_city}&appid=${apikey}&units=metric`;
    axios.get(apiurl).then(displaywheather)
   }
   function search_current(position) {
    let apikey ="3679755b1ebb6cd9b2cd32048242a186";
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apikey}`;
    axios.get(url).then(displaywheather)
    console.log(url)
   }

  navigator.geolocation.getCurrentPosition(search_current);
  let search = document.getElementById("prim")
  search.addEventListener("click",search_city)
  let CurrentCity = document.getElementById("suc")
  CurrentCity.addEventListener("click",search_current)
  
  
    
    