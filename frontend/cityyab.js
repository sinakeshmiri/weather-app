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
    let apiurl=`http://weather.local/api/?q=${name_city}`;
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
  
  
    
    