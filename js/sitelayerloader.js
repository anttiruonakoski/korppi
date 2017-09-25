// new layer loader

function createLayer (assocId) {

	console.log(typeof assocsites[assocId]);
	var newLayer;

	if (typeof assocsites[assocId] !== "undefined" ) {
		return;
	}  

	switch (assocId) {
		case 99: 
			var societySitesFile = 'data/7500.geojson';	
			console.log('koko suomi ladataan');			
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

