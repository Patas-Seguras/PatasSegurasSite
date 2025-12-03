var map = L.map('map').setView([-5.788623, -35.237237], 13);

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
}).addTo(map);

var pata = L.icon({
    iconUrl: "img/patas-seguras-icone-mapa.png",

    iconSize: [40, 40],
    iconAnchor: [20, 40], 
    popupAnchor: [0, -40] 
})
const mark = [
    {
        name: "Adote um amigo pet",
        coordinates: [-5.755868722077635, -35.26612132794077]
    },
    {
        name: "Unidade de Vigilância de Zoonoses - UVZ / SMS Natal",
        coordinates: [-5.752602241105135, -35.26266664270184]
    },
    {
        name: "Amigos do bem",
        coordinates: [-5.846121816050981, -35.25797725762108]
    },
    {
        name: "S.O.S. Animais - Clínica Veterinária 24 Horas",
        coordinates: [-5.808722252272569, -35.212486993050156]
    }
]
mark.forEach(point => {

    const markers = L.marker(point.coordinates, {icon: pata}).addTo(map);

    markers.bindPopup(`<span><b>${point.name}</b></span>`);
    
    var circle = L.circle(point.coordinates, {
        color: '#0d6efd',
        fillColor: 'blue',
        fillOpacity: '0.5',
        radius: '30'
    }).addTo(map)
});
