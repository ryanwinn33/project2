var mapboxAccessToken = API_KEY;
var map = L.map('map').setView([37.8, -96], 4);

L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
    id: 'mapbox/light-v9',
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

var layerBoolean = false;

/**
 * Geoff:
 * Declared geojson and info outside so they can be used to clear else where in the 
 * file. Effectively changing their scope from local to global
 */

var geojson;

var info;

map.on("layeradd", function(event){


});

/**
 * This function fires off on page load as well as when the select element is changed
 * @param {*} year 
 */
function yearlyData(year){

    if (layerBoolean) {
        map.removeLayer(geojson);
        // Remove old html from layer control
        var controls = d3.select("div.leaflet-top.leaflet-right");
        controls.html('');
        // map.removeLayer(info);
    }
   

    d3.json('http://127.0.0.1:5000/api/disasters', function(data){

        L.geoJson(statesData).addTo(map);

        // Create a function to add color based on disaster count.​
        /**
         * This will style each marker.
         * @param {*} feature 
         */
        function style(feature) {
            return {
                /**
                 * Passed year into this function.
                 */
                fillColor: getColor(feature.properties.name, data, year),
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

        layerBoolean = true;        
    });

};
// document = "mapping/index.html"

/**
 * Geoff: This is a function that fires off on page load and it 
 * just calls the yearly data function with a year.
 */
window.onload = function () {

    yearlyData("2016");
}

/**
 * This function will color the choropleth all pretty and shtuff.
 * @param {*} name This is the name of the state
 * @param {*} apidata This is the data from the d3.json() call
 * @param {*} year This is the selected or provided year to the change function.
 */
function getColor(name, apidata, year) {

    console.log(apidata.Result);

    console.log(typeof apidata.Result);
    console.log(`State name is: ${name}`);
    console.log(`Its type is: ${typeof name}`)

    var test = '';
    if (typeof name === 'number') {
        console.log("this is a number skipping value");
        return;
    }

    var dollars = 0;

    if (typeof apidata === 'object') {
        apidata.Result.forEach(function(data){
            if(data.State === name) {

                /**
                 * Geoff: Here we made sure to test for the years type 
                 * and cast it as a number
                 */
                console.log(`year is: ${year}`);
                console.log(`Its type is: ${typeof year}`)

                if(data.Year === Number(year)){                  
                    dollars = data.Total;
                    console.log(`dollars be this much ${dollars}`);
                }
            }
        });
    }
    else{
        console.log('Apidata is empty');
    }

    return dollars > 100000000 ? '#800026' :
        dollars > 60000000  ? '#BD0026' :
        dollars > 40000000 ? '#E31A1C' :
        dollars > 10000000  ? '#FC4E2A' :
        dollars > 5000000   ? '#FD8D3C' :
        dollars > 1000000   ? '#FEB24C' :
        dollars > 100000   ? '#FED976' :
                    '#FFEDA0';
}

/*Legend specific*/
var legend = L.control({ position: "bottomleft" });

legend.onAdd = function(map) {
  var div = L.DomUtil.create("div", "legend");
  div.innerHTML += "<h4>FEMA Amounts Obligated</h4>";
  div.innerHTML += '<i style="background: #FED976"></i><span>> $100000</span><br>';
  div.innerHTML += '<i style="background: #FEB24C"></i><span>> $1000000</span><br>';
  div.innerHTML += '<i style="background: #FD8D3C"></i><span>> $5000000</span><br>';
  div.innerHTML += '<i style="background: #FC4E2A"></i><span>> $10000000</span><br>';
  div.innerHTML += '<i style="background: #E31A1C"></i><span>> $40000000</span><br>';
  div.innerHTML += '<i style="background: #BD0026"></i><span>> $60000000</span><br>';
  div.innerHTML += '<i style="background: #800026"></i><span>> $100000000</span><br>';

  return div;
};

legend.addTo(map);
/**
 * 
 * @param {*} e 
 */
// Interactivity
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

   
}


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

geojson = L.geoJson(statesData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);