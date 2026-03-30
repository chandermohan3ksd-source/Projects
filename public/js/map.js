if (typeof listingLocation !== "undefined") {

fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(listingLocation)}`)
.then(res => res.json())
.then(data => {

let lat = data[0].lat;
let lon = data[0].lon;

console.log(lat, lon);

var map = L.map('map').setView([lat, lon], 10);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
 attribution: '© OpenStreetMap'
}).addTo(map);

L.marker([lat, lon])
.addTo(map)
.bindPopup(listingLocation)
.openPopup();

});

}