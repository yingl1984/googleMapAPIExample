'use strict';

const apiKey = ''; 

let map;
let service;
let infowindow;

function placeDetails(query)
{
  fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${query}&inputtype=textquery&fields=place_id,formatted_address,name,rating,opening_hours,geometry&key=${apiKey}`)
  .then(response=>response.json())
  .then(response => {
    console.log(response);
    const isOpened = response.candidates[0].opening_hours.open_now == false ? "No" : "Yes";
    const contentString =
  "<div>" +
  "<p><b>Place id</b>: "+response.candidates[0].place_id+
  "<p><b>Place name</b>: "+response.candidates[0].name+
  "<br><b>Address</b>: "+response.candidates[0].formatted_address+
  "<br><b>Rating</b>: "+response.candidates[0].rating+
  "<br><b>Opened</b>: "+isOpened+
  "</p></div>";

    setUpMap(response.candidates[0].geometry.location.lat, 
      response.candidates[0].geometry.location.lng,
      contentString
      )
  })
  .catch(error=>console.log(error));
}

function generateGeolocation(query){
  fetch(`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/geocode/json?address=${query}&key=${apiKey}`)
  .then(response => response.json())
  .then(response => {
    const contentString =
    "<div>" +
    "<p><b>Place id</b>: "+response.results[0].place_id+
    "<br><b>Address</b>: "+response.results[0].formatted_address+
    "</p></div>";
    setUpMap(response.results[0].geometry.location.lat, 
      response.results[0].geometry.location.lng,
      contentString
      )
  })
  .catch(err=>console.log(err));

}


function setUpMap(lat, lng, contentString)
{
  const latLng = new google.maps.LatLng(lat, lng);

  const mapOptions = {
    center: latLng,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  let marker = new google.maps.Marker({
    position: latLng,
    title:"Search fun stuff!",
    visible: true
  });

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  
  /*const contentString =
  "<div>" +
  "<p><b>Place id or name</b>: "+placeId+
  "<br><b>Address</b>: "+formattedAdd+
  "</p></div>";*/
  
  const infowindow = new google.maps.InfoWindow({
    content: contentString
  });
  marker.addListener("click", () => {
    infowindow.open(map, marker);
  });
  marker.setMap(map);

}

function watchForm() {
  $("#js-form").submit((e)=>{
    e.preventDefault();
    const searchItem = $('#js-search-item').val();
    generateGeolocation(searchItem);
  });
  $("#place-form").submit((e)=>{
    e.preventDefault();
    const placeText = $("#place-item").val();
    placeDetails(placeText);
  })

  
}

$(watchForm);