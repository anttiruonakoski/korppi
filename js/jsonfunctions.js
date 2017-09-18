// jsonfunctions.js
// parse json to html table


	const si = new L.GeoJSON.AJAX("data/lintutornit_lly_kaikki_2017_wgs84.geojson");

	// const si = new L.GeoJSON.AJAX("data/lintutornit_lly_kaikki_2017_wgs84.geojson", { 
		
	// 	pointToLayer : function(geoJsonPoint, latlng) {
	//     return L.circleMarker(latlng, siteMarkerOptions);
	// 	}, onEachFeature: onEachFeature});

	// si.on('data:loaded', function () {
	// 		console.log('eureka');
	// 		});	 

	// si.on('data:loading', function () {
	// 	console.log('eureka');
	// 	});	 


// function init() {
		
// 	// var m= L.map('map');

// 	// si.addTo(m);

// 	console.log(si.toGeoJSON());

// 	sites = si.toGeoJSON();	
function tableFeatures(jsonObj,scope) {

  var features = jsonObj['features'];

  const headerText = {yhditys: "Yhdistyksen havaintopaikat", omat :"Omat havaintopaikat"};

  var header = document.getElementById("sites-title"); 		
  var div = document.getElementById("sites-content");
  header.textContent = headerText[scope];

  var myPara = document.createElement('p');

  myPara.textContent = 'koes';
      
  for (var i = 0; i < features.length; i++) {
    // var myArticle = document.createElement('article');
    // var myH2 = document.createElement('h2');
    // var kunta = document.createElement('p');
    var siteName = document.createElement('p');
    var sid = 'site_' + features[i].properties.id;
    siteName.id = sid;

    // var myPara3 = document.createElement('p');
    // var myList = document.createElement('ul');

    // myH2.textContent = features[i].name;
    // kunta.textContent = 'Kunta: ' + features[i].properties.kunta;
    siteName.textContent = 'Havaintopaikka: ' + features[i].properties.name + ' kunta: ' + features[i].properties.kunta;

    // myPara3.textContent = 'Superpowers:';
        
    // var superPowers = features[i].powers;
    // for (var j = 0; j < superPowers.length; j++) {
    //   var listItem = document.createElement('li');
    //   listItem.textContent = superPowers[j];
    //   myList.appendChild(listItem);
    // }

    // myArticle.appendChild(myH2);
    // div.appendChild(kunta);
    div.appendChild(siteName);

    // siteName.addEventListener('click', function(){
    // 	alert ('clikattu');
    // 	}, false);

        function getCoords(point) {
    		var point_temp = point.replace("Point(", "").replace(")", "").split(", ");
      		var no = Math.round(point_temp[1]).toString();
			var ea = Math.round(point_temp[0]).toString();
      		var bbox = ea.concat(",",no,",",ea,",",no);
      		return {no: no, ea: ea, bbox: bbox};
        }

    function setSite (e) {

    		$('#site-list').modal('hide');

    		//GeoJSON and Leaflet express N/E in different order
    		latlng = e.data.geometry.coordinates.reverse();

    		currentMarker = obsIcon;
    		var placeName = e.data.properties.name;
    		var kuntaName = e.data.properties.kunta;
    		// var coords_ea = e.data.geometry.coordinates[0];
    		// var coords_no = e.data.geometry.coordinates[1];

    		//works only in ES6, may need fix later
    		
    		//also buggy, sometimes fails to swap before console.log()
    		// [latlng[0], latlng[1]] = [latlng[1], latlng[0]];

    		//get ETRS-TM35FIN coordinates
    		coords = getCoords(EPSG3067.project(L.latLng(latlng)).toString());

 			console.log(placeName, kuntaName, coords.no, coords.ea);
 			console.log(currentMarker, latlng);

 			if (layerGroup['obs']) {
 			    layerGroup['obs'].remove();
 			}     
 			
 			markerObs = new gsetMarker(latlng, {icon: currentMarker}, 'obs');
 			// coords = getCoords(EPSG3067.project(markerObs._latlng).toString());
    	       
    	            currentMarker = obsIcon;

    	                $( "#btn-observer").toggleClass("active",true);
    	                $( "#btn-bird").toggleClass("active",false);
    	                $( "#btn-ruler").toggleClass("active",false);
    	                $( "#btn-move").toggleClass("active",false);

    	            if (map.getZoom() < 12) {
    	                var zoomLevel = 12;
    	            }
    	            else {
    	                var zoomLevel = map.getZoom();
    	            }

    	            //should really fix this, no logic here
    	            map.removeLayer(sites);
    	            map.removeLayer(ownsites);
    	            
    	            centerObs(zoomLevel);

    	            map.once('moveend', function() {
    	                map.addLayer(sites);
    	                map.addLayer(ownsites);
    	            });  

    	            document.getElementById('obs-n-koord').value = coords.no;   
    	            document.getElementById('obs-e-koord').value = coords.ea;
    	            //poista tarkkuudesta disabled
    	            document.getElementById('obs-accuracy').disabled = false;
    	            document.getElementById('obs-kunta-name').value = kuntaName;
    	            document.getElementById('obs-place-name').value = placeName;

    	            document.getElementById("obs-kunta-name").classList.remove('is-invalid');

    	            if (markerObs && markerBird) {
    	                line = drawLine(markerObs, markerBird, line);
    	            }    
    	   }
    	    // map.closePopup();

    	    $( "#"+sid ). click(features[i]
    	     , setSite      
    	);

	
    // myArticle.appendChild(myPara3);
    // myArticle.appendChild(myList);

    // section.appendChild(myArticle);
  }
}
	
	// tableFeatures(sites,"yhditys");

// }

