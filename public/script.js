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
    // shadowUrl: './images/marker-shadow.png',
   
    iconSize:   [41, 53],
    // shadowSize:  [66, 16],
   
    iconAnchor:  [20, 53],
    // shadowAnchor: [3, 15], 
   
    popupAnchor: [1, -19]
   });

  // Pattern for new marker :
  // L.marker([48.858370, 2.294481]).addTo(mymap);
  console.log(cityItem[i])
  L.marker(
    [cityItem[i].dataset.lat,
     cityItem[i].dataset.lon],
    {icon: customIcon}
  ).addTo(mymap).bindPopup(`<b>${cityItem[i].dataset.name}</b><img src="${cityItem[i].dataset.img}" /><br><span class="badge badge-warning badge-pill">${cityItem[i].dataset.max}</span>
  <span class="badge badge-secondary badge-pill">${cityItem[i].dataset.min}</span>`);
}
