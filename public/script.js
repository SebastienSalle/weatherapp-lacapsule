const mymap = L.map('worldmap',
{
center: [48.866667, 2.333333],
zoom: 4
}
);
//.setView([51.505, -0.09], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '(c) <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(mymap);


const cityItem = document.getElementsByTagName('li');
console.log(cityItem);

for (let i = 0; i < cityItem.length; i++){
    const cityCoord = {
                    longitude : cityItem[i].dataset.lon,
                    latitude : cityItem[i].dataset.lat
}

  const customIcon = L.icon({
    iconUrl: './images/marker-temp.png',
    shadowUrl: './images/marker-shadow.png',
   
    iconSize:   [41, 53],
    shadowSize:  [66, 16],
   
    iconAnchor:  [20, 53],
    shadowAnchor: [3, 15], 
   
    popupAnchor: [-3, -76]
   });

  // Pattern for new marker :
  // L.marker([48.858370, 2.294481]).addTo(mymap);
  L.marker([cityItem[i].dataset.lat, cityItem[i].dataset.lon], {icon: customIcon}).addTo(mymap).bindPopup(cityItem[i].dataset.name);
}



