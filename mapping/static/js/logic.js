
var mapboxAccessToken = API_KEY;
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

var geojson;

function yearlyData(year){

    d3.json('http://127.0.0.1:5000/api/disasters', function(data){

        L.geoJson(statesData).addTo(map);

        // Create a function to add color based on disaster count.​
        /**
         * This will style each marker.
         * @param {*} feature 
         */
        function style(feature) {
            return {
                fillColor: getColor(feature.properties.name, data),
                weight: 2,
                opacity: 1,
                color: 'white',
                dashArray: '3',
                fillOpacity: 0.7
            };
        }


        geojson = L.geoJson(statesData, {
            style: style,
            onEachFeature: function(feature, layer){
            return {
                    mouseover: highlightFeature,
                    mouseout: resetHighlight,
                    click: zoomToFeature
                }
            }
        }
        ).addTo(map);
    // Create a function to add interactivity with mouseover

        var info = L.control();


        info.onAdd = function (map) {
            this._div = L.DomUtil.create('div', 'info');
            this.update();
            return this._div;
        };
        // Hover over a state to see the Total obligated cost and the Disaster Count
        info.update = function (props) {
            this._div.innerHTML = '<h4>Total Obligated Cost & Disaster Count</h4>' +  (props ?
                '<b>' + statesData.name + '</b><br />' + props.Total + ' USD' +
                '<b>' + '<h4>Disaster Count: </h4>' + props.Incident_Count //add variable for disaster count
                : 'Hover over a state');
        };

        info.addTo(map);
    });
//-----------------------------------------------------------------------------------//



    console.log(year);
};
document = "mapping/index.html"
window.onload = function () {
    var DropdownList = document.getElementById("data_sources").value;
    var SelectedValue = DropdownList.value;

    if (SelectedValue = "2016")
    {year = 2016;}
    else if (SelectedValue = "2017")
    {year = 2017;}
    else if (SelectedValue = "2018")
    {year = 2018;}
    else
    {year = 2019;}
}

// var year = 2017

/**
 * 
 * @param {*} name 
 */
function getColor(name, apidata) {

    console.log(apidata.Result);

    console.log(typeof apidata.Result);
    console.log(`State name is: ${name}`);
    console.log(`Its type is: ${typeof name}`)

    var test = '';
    if (typeof name === 'number') {
        console.log("this is a number skipping value");
        return;
    }

    //first loop through each year


    // then loop through each state

    var dollars = 0;

    if (typeof apidata === 'object') {
        apidata.Result.forEach(function(data){
            if(data.State === name) {
                console.log(`Yo I am on state ${data.State} and I found a match`)
                if(data.Year === year){                  
                    dollars = data.Total;
                    console.log(`dollars be this much ${dollars}`);
                }
            }
        });
    }
    else{
        console.log('Apidata is empty');
    }

    return dollars > 100000000 ? '#800026' : //just an example using population density from us-states.js
        dollars > 60000000  ? '#BD0026' :
        dollars > 40000000 ? '#E31A1C' :
        dollars > 10000000  ? '#FC4E2A' :
        dollars > 5000000   ? '#FD8D3C' :
        dollars > 1000000   ? '#FEB24C' :
        dollars > 100000   ? '#FED976' :
                    '#FFEDA0';
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    info.update(layer.feature.properties);    
}

/**
 * 
 * @param {*} e 
 */
function resetHighlight(e) {
    geojson1.resetStyle(e.target);
    info.update();
}

/**
 * 
 * @param {*} e 
 */
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

/**
 * This function adds an event per feature from our dataset. 
 * @param {LeafletObject} feature This is the feature that leaflet will add per gps coordinate.
 * @param {*} layer 
 */
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

// geojson = L.geoJson(statesData, {
//     style: style,
//     onEachFeature: onEachFeature
// }).addTo(map);

// var legend = L.control({position: 'bottomright'});

// legend.onAdd = function (map) {

//     var div = L.DomUtil.create('div', 'info legend'),
//         grades = [0, 10, 20, 50, 100, 200, 500, 1000],
//         labels = [],
//         from, to;

//     for (var i = 0; i < grades.length; i++) {
//         from = grades[i];
//         to = grades[i + 1];

//         labels.push(
//             '<i style="background:' + getColor(from + 1) + '"></i> ' +
//             from + (to ? '&ndash;' + to : '+'));
//     }

//     div.innerHTML = labels.join('<br>');
//     return div;
// };

// legend.addTo(map);