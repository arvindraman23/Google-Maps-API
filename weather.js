// 2238-CSE-5335-001-WEB DATA MANAGEMENT
// ARVIND RAMAN
// 1002050501

var map;
var marker;

function initialize() {
   // Initializing a map with the given coordinates and zoom level
   mapCenter = { lat: 32.75, lng: -97.13 }
   map = new google.maps.Map(document.getElementById('map'), {
      center: mapCenter,
      zoom: 8
   });

   // Setting a listener for 'click' events on the map
   map.addListener("click", (mapsMouseEvent) => {
      console.log(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2) + "</pre>");
      var lat = mapsMouseEvent.latLng.lat();
      var lon = mapsMouseEvent.latLng.lng();
      setMarker(mapsMouseEvent.latLng);
      getCoordinatesWeather(lat, lon);
   });
}

// Function to get the weather data based on the input text given by the user
function sendRequest() {
   var xhr = new XMLHttpRequest();
   var cityName = encodeURI(document.getElementById("form-input").value);
   var str = "";
   if (cityName == "") {
      str = "</br>Search field is Empty!</br>Please try again."
      if (marker) {
         marker.setMap(null);
      }
   } else {
      xhr.open("GET", "proxy.php?q=" + cityName);
      xhr.setRequestHeader("Accept", "application/json");
      xhr.onreadystatechange = function () {
         if (this.readyState == 4) {
            var json = JSON.parse(this.responseText);
            if (json["cod"] != 200) {
               str = "</br>City not found!</br>Please try again."
               if (marker) {
                  marker.setMap(null);
               }
               document.getElementById("output").innerHTML = "<pre>" + str + "</pre>";
            } else {
               str = JSON.stringify(json, undefined, 2);
               displayWeatherData(json);
               var newLocation = { lat: json.coord.lat, lng: json.coord.lon };
               setMarker(newLocation);
            }
         }
      };
   }
   document.getElementById("output").innerHTML = "<pre>" + str + "</pre>";
   xhr.send(null);
}

// Function to get the weather by the clicked location's latitude and longitude values
function getCoordinatesWeather(lat, lon) {
   var xhr = new XMLHttpRequest();
   var str = "";
   xhr.open("GET", "proxy.php?lat=" + lat + "&lon=" + lon);
   xhr.setRequestHeader("Accept", "application/json");
   xhr.onreadystatechange = function () {
      if (this.readyState == 4) {
         var json = JSON.parse(this.responseText);
         if (json["cod"] != 200) {
            str = "</br>City not found!</br>Please try again."
            document.getElementById("output").innerHTML = "<pre>" + str + "</pre>";
         }
         displayWeatherData(json);
      }
   };
   xhr.send(null);
}

function setMarker(latLonValue) {
   // Removing any existing markers
   if (marker) {
      marker.setMap(null);
   }
   map.setCenter(latLonValue);
   // Creating a new marker on the clicked location
   marker = new google.maps.Marker({
      position: latLonValue,
      map: map,
      title: "Clicked Location"
   });
}

// Function to display the data and format by creating new div element
function displayWeatherData(data) {
   var weatherOutputArea = document.getElementById("output");
   weatherOutputArea.innerHTML = "";

   for (var element in data) {
      if (typeof data[element] === "object") {
         var subElementData = data[element];
         if (element == "weather") {
            subElementData = subElementData[0];
         }
         generateDisplayLabel("<br><strong>" + element + ":</strong> ")

         for (var item in subElementData) {
            var labelItem = item;
            var valueItem = subElementData[item];
            var labelValuePair = "&nbsp;&nbsp;&nbsp;<strong>" + labelItem + ":</strong> " + valueItem;
            generateDisplayLabel(labelValuePair);
         }
      } else {
         var labelValuePair = "<br><strong>" + element + ":</strong> " + data[element];
         generateDisplayLabel(labelValuePair);
      }
   }

   function generateDisplayLabel(labelValuePair) {
      var newDataRow = document.createElement("div");
      newDataRow.innerHTML = labelValuePair;
      weatherOutputArea.appendChild(newDataRow);
   }
}