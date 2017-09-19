// jsonfunctions.js
// parse json to html table

function tableFeatures(jsonObj,scope) {

  var features = jsonObj['features'];

  const headerText = {yhditys: "Yhdistyksen havaintopaikat", omat :"Omat havaintopaikat"};

  var header = document.getElementById("sites-title"); 		

  var div = document.getElementById("sites-content");
  list = document.createElement('ul'); 
  list.classList.add('list', 'list-group', 'sites', 'col-6');

  div.appendChild(list);

  // header.textContent = headerText[scope];
      
  for (var i = 0; i < features.length; i++) {
    // var myArticle = document.createElement('article');
    // var myH2 = document.createElement('h2');
    var siteName = document.createElement('li');
    var sid = 'site_' + features[i].properties.id;
    var di2 = document.createElement('div');
    di2.classList.add('paikka', 'text-truncate');
 
    siteName.id = sid;
    siteName.classList.add('list-group-item', 'list-group-item-action');

    siteName.appendChild(di2); 

    // var myPara3 = document.createElement('p');
    // var myList = document.createElement('ul');

    // myH2.textContent = features[i].name;
    // kunta.textContent = 'Kunta: ' + features[i].properties.kunta;
    di2.innerHTML = '<a href="#" class="text-primary">' + features[i].properties.name +'</a>' + '<span class="font-weight-bold"> ' + features[i].properties.kunta + '</span>';

    // myPara3.textContent = 'Superpowers:';
        
    // var superPowers = features[i].powers;
    // for (var j = 0; j < superPowers.length; j++) {
    //   var listItem = document.createElement('li');
    //   listItem.textContent = superPowers[j];
    //   myList.appendChild(listItem);
    // }

    // myArticle.appendChild(myH2);
    // div.appendChild(kunta);
    list.appendChild(siteName);

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

    		$('#site-list-modal').modal('hide');

    		//GeoJSON and Leaflet express N/E in different order
    		// ll = e.data.geometry.coordinates.reverse();
    		// fails sometimes, hence slice() which makes a copy of array

    		const ll = e.data.geometry.coordinates.slice().reverse();

    		currentMarker = obsIcon;
    		var placeName = e.data.properties.name;
    		var kuntaName = e.data.properties.kunta;
    
    		//get ETRS-TM35FIN coordinates
    		coords = getCoords(EPSG3067.project(L.latLng(ll)).toString());

 			console.log(placeName, kuntaName, coords.no, coords.ea);
 			console.log(ll);

 			if (layerGroup['obs']) {
 			    layerGroup['obs'].remove();
 			}     
 			
 			markerObs = new gsetMarker(ll, {icon: currentMarker}, 'obs');

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

    	            //lienee syytä nollata linnun paikka

    	            clearPositionForm('bird');

    	   }

    	    $( "#"+sid ). click(features[i], setSite
    	);

  }

	var options = {
	  valueNames: ['paikka']
	};

	sList = new List('sites-content', options);

}
	

