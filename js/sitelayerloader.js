// new layer loader

function createLayer (societyID) {

	console.log(typeof sites[societyID]);
	var newLayer;

	if (typeof sites[societyID] !== "undefined" ) {
		return;
	}  

	switch (societyID) {
		case 99: 
			var societySitesFile = 'data/7500.geojson';			
			break; 
	}


	function onEachFeature(feature, layer) {
	 // does this feature have a property named name?

	    if (feature.properties && feature.properties.name) {
	        counter++;
	        layer.bindPopup('Siirry yhdistyspaikkaan: <button type="button" class="btn btn-sm btn-primary btn-select-site">' + feature.properties.name +'</button>', {
	            maxWidth : 'auto'
	            });
	        }            
	         siteLayerGroups.societySitesGroup[societyID].addLayer(layer); 
	         idHashes.society[feature.properties.id] = layer._leaflet_id;
	}


	newLayer = new L.GeoJSON.AJAX( societySitesFile, { pointToLayer : function(geoJsonPoint, latlng) {
    return L.circleMarker(latlng, siteMarkerOptions);
	}, onEachFeature: onEachFeature});

	return newLayer;
}

