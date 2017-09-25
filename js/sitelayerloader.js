// new layer loader

function createLayer (id) {

	console.log(typeof assocSites[id]);
	
	var newLayer;
	if (typeof assocSites[id] === 'object' ) {

		if (assocSites[id] !== null) {
		console.log('layer on jo');
			
			div = document.getElementById('societySites');
			parent = div.parentNode;
			div.parentNode.removeChild(div);
			parent.appendChild(siteElements[id]);

		return;

		}
	}

	switch (id) {
		case 99: 
			var societySitesFile = 'data/7500.geojson';
			console.log('koko suomi ladataan');			
			break;
		case 25: 
			var societySitesFile = 'data/100_random_site.geojson';
			console.log('Xenus ladataan');			
			break; 		 			
	}

		org = id;
	

	function onEachFeature(feature, layer) {
	 // does this feature have a property named name?

	    if (feature.properties && feature.properties.name) {
	        counter++;
	        layer.bindPopup('Siirry yhdistyspaikkaan: <button type="button" class="btn btn-sm btn-primary btn-select-site">' + feature.properties.name +'</button>', {
	            maxWidth : 'auto'
	            });
	        }                    
	         siteLayerGroups.societySitesGroup[org].addLayer(layer); 
	         console.log('push ', layer._leaflet_id  );
	         hashMaps[org].set(feature.properties.id, layer._leaflet_id);
	}

	// siteLayerGroups.societySitesGroup. 

	newLayer = new L.GeoJSON.AJAX( societySitesFile, { pointToLayer : function(geoJsonPoint, latlng) {
    return L.circleMarker(latlng, siteMarkerOptions);
	}, onEachFeature: onEachFeature});

	newLayer.on('data:loaded', function () {

			div = document.getElementById('societySites');
			div.innerHTML = '';
			div.parentNode.removeChild(div);

			btn = document.getElementById('common-sites-changer');
			
			assocName = orgsNames.find(x => x.id === org).name;

			btnText = '<i class="fa fa-map" aria-hidden="true"></i>&nbsp;&nbsp;' + assocName;

			btn.innerHTML = btnText;


            console.log('tasolla kohteita: ', counter);
            assocSites[org] = newLayer;
            counter = 0;
            var sitesAsJSON = newLayer.toGeoJSON();
            siteLists[org] = tableFeatures(sitesAsJSON,"societySites");


		return newLayer;
});
}