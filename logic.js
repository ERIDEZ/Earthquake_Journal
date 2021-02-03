let mymap = L.map('mapid').setView([38.6044658, -98.0889734], 3);
// loading this doesn't show the map, we need to add layers to it

let limit = 100;

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/light-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(mymap);

let geoData = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

let geojson;

// EXTRACT DATA //

d3.json(geoData, function(data){

    function getColor(d) {
        return d >= 4 ? '#b30000' :
               d >= 3 ? '#e34a33' :
               d >= 2 ? '#fc8d59' :
               d >= 1 ? '#fdcc8a' :
                       '#fef0d9';
    }
    let tremors = data.features

    let coord = [];

    for(let x of tremors)
    coord.push([x.geometry.coordinates[1], x.geometry.coordinates[0]]);


    let locations =[];
    for(let x of tremors)
    locations.push(x.properties.place)

    let magnitude =[];

    for(let x of tremors)
    magnitude.push(x.properties.mag)

    // CIRCLE FILLING //

    for (let i=0; i<limit; i++){
    L.circle(coord[i], {
        fillOpacity: 0.75,
        color:getColor(magnitude[i]),
        weight: 2,
        fillColor:getColor(magnitude[i]),
        radius: magnitude[i] * 15000
    }).bindPopup(`<p>Location: ${locations[i]}</p><p>Magnitude: ${magnitude[i]}</p>`).addTo(mymap)};

    let tbody = d3.select("#table");


    // TABLE //

    for (let i=0; i<limit; i++){
            let row = tbody.append("tr")
            row.append("td").text(new Date(tremors[i].properties.time))
            row.append("td").text(tremors[i].properties.place);
            row.append("td").text(tremors[i].properties.mag);
            row.append("td").text(tremors[i].properties.type);
        };
    
    let legend = L.control({position: 'bottomleft'});
    legend.onAdd = function (map) {


    // LEGEND //

    let div = L.DomUtil.create('div', 'info legend');
    labels = ['<strong>Magnitude</strong>'],
    categories = [0,1,2,3,4];

    for (var i = 0; i < categories.length; i++) {

            div.innerHTML += 
            labels.push(
                '<i style="float:left; width:10px; height:10px; background:' + getColor(categories[i]) + '"></i> ' + (categories[i] ? categories[i] : '0'));
            }
        
        div.innerHTML = labels.join('<br>');
    return div;
    };
    legend.addTo(mymap);

});