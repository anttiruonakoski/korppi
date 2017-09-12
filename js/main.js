// main.js
	
	var L;
  	const taustakartta = L.tileLayer.mml_wmts({ layer: "taustakartta" });
    const maastokartta = L.tileLayer.mml_wmts({ layer: "maastokartta" });
    const ortokuva = L.tileLayer.mml("Ortokuva_3067");
    ortokuva.options.minZoom = 8;  
    // const taustakartta_uusi = L.tileLayer.mml("Taustakartta_3067");

    const siteMarkerOptions = {
    	radius : 9,
    	fillOpacity : 0.9,
    	fillColor : '#4169E1',
    	color : 'dimgray',
    	weight: 2 
    };

    function onEachFeature(feature, layer) {
     // does this feature have a property named name?
        if (feature.properties && feature.properties.name) {
            layer.bindPopup(feature.properties.name);
        }
    }

    const sitesExample = new L.GeoJSON.AJAX("data/lintutornit_lly_kaikki_2017_wgs84.geojson", { pointToLayer : function(geoJsonPoint, latlng) {
    return L.circleMarker(latlng, siteMarkerOptions);
	}, onEachFeature: onEachFeature});
    const testLayer = new L.GeoJSON();

    const EPSG3067 = L.TileLayer.MML.get3067Proj();

  	const initMap = {
        crs: L.TileLayer.MML.get3067Proj(),
        center: [66.5, 25.3],
        zoom: 6,
        minZoom: 3,
        maxZoom: 14,
        layers: [maastokartta],    
        maxBounds: [[58.2133,16.16359],
                    [71.2133,36.16359]]
		};

	const obsIcon = L.AwesomeMarkers.icon({
		icon: 'binoculars', prefix: 'fa', markerColor: 'cadetblue'
	});
	const birdIcon = L.AwesomeMarkers.icon({
		icon: 'twitter', prefix: 'fa', markerColor: 'cadetblue'
	});

	var currentMarker;
    var markerObs, markerBird;
    currentMarker = obsIcon;

    //make WFS-queries for placenames
    var getPlaceNames = true;
				
	function init() {

    	const baseMaps = { 
    		"Taustakartta" : taustakartta,
    		"Maastokartta" : maastokartta,
        	"Ilmakuva" : ortokuva
        	// "Uusi Taustakartta": taustakartta_uusi
    	};

    	const siteLayers = {
    		"yhdistyspaikat" : sitesExample,
    		"omat paikat" : testLayer
    	}

        const map = new L.map('map_div', initMap);

        
        sitesExample.addTo(map);

       	L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);
       	L.control.layers(null, siteLayers, {collapsed: false}).addTo(map);

        L.control.locate().addTo(map);
        L.control.scale({maxWidth: 400, imperial: false}).addTo(map);

        function getCoords(point) {
    		var point_temp = point.replace("Point(", "").replace(")", "").split(", ");
      		var no = Math.round(point_temp[1]).toString();
			var ea = Math.round(point_temp[0]).toString();
      		var bbox = ea.concat(",",no,",",ea,",",no);
      		return {no: no, ea: ea, bbox: bbox};
        }

		function onMapClick(e) { 

			var coords = getCoords(EPSG3067.project(e.latlng).toString());

			if (currentMarker === obsIcon) {  
				if (markerObs) {
	        		map.removeLayer(markerObs);
	      		}        

	      		markerObs = new L.marker(e.latlng, {icon: currentMarker}).addTo(map);
	    		document.getElementById('obs-n-koord').value = coords.no;	
				document.getElementById('obs-e-koord').value = coords.ea;
	      		//poista tarkkuudesta disabled
	      		document.getElementById('obs-accuracy').disabled = false;
	      		//hae koordinaattipisteen kunta
  				getKunta(coords.bbox).done(parseKunta);

  			}

  			if (currentMarker === birdIcon) {  
				if (markerBird) {
	        		map.removeLayer(markerBird);
	      		}        

	      		markerBird = new L.marker(e.latlng, {icon: currentMarker}).addTo(map);
	    		document.getElementById('bird-n-koord').value = coords.no;	
				document.getElementById('bird-e-koord').value = coords.ea;
	      		//poista tarkkuudesta disabled
	      		document.getElementById('bird-accuracy').disabled = false;
  			}

		}
	
		map.on('click', onMapClick);

		function clearPositionForm(form) {
		//clear and reset input fields and markers after button press 	

			var uppercaseScope = form.charAt(0).toUpperCase() + form.slice(1);
			const formName = form + '-form';

			document.getElementById(formName).reset();

			if (form==='obs') {
			document.getElementById("obs-kunta-nimi").classList.remove('is-invalid');			
			}

			var markerName = "marker".concat(uppercaseScope); 
			if (this[markerName]) {
				map.removeLayer(this[markerName]);
			} 

		} 

		function connectPosition(obs, bird) {

			const fields = {nKoord: ["n-koord"], eKoord: ["e-koord"]};

			// for (var)

		}

		$("#btn-observer").click(function(){
				currentMarker = obsIcon; 
		    }); 

		$("#btn-bird").click(function(){
				currentMarker = birdIcon;
		    }); 

		$("#btn-clear-obs").click(function(){
				clearPositionForm("obs");
			});
			
		$("#btn-clear-bird").click(function(){
				clearPositionForm("bird");
			});

		$("#btn-move").click(function(){
				currentMarker = null;
		    }); 
		$("#btn-distance").click(function(){
				currentMarker = null;
		    }); 

		$("#btn-connect").click(function(){
				connectPosition("obs", "bird");
		    }); 

		$("#btn-get-placenames").click(function(){
				getPlaceNames = !getPlaceNames;
				console.log(getPlaceNames);
		    });

		$("#btn-trash-all").click(function(){
				$().button('toggle');
				currentMarker = obsIcon;
				clearPositionForm("obs");
				clearPositionForm("bird");

		    }); 

		$('#obs-accuracy').change(function() {
			var showAccuracy = true;
			var accuracyRadius = 1000;
		  	L.circle(markerObs.getLatLng(), {radius: accuracyRadius}).addTo(map);
		});

		$('#bird-accuracy').change(function() {
		  L.circle(markerBird.getLatLng(), {radius: 200}).addTo(map);
		});

    }

