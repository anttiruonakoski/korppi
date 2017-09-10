// main.js
	
	var L;
  	const taustakartta = L.tileLayer.mml_wmts({ layer: "taustakartta" });
    const maastokartta = L.tileLayer.mml_wmts({ layer: "maastokartta" });
    const ortokuva = L.tileLayer.mml("Ortokuva_3067");
    ortokuva.options.minZoom = 8;  

    const EPSG3067 = L.TileLayer.MML.get3067Proj();

    const taustakartta_uusi = L.tileLayer.mml("Taustakartta_3067");

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
        	"Ilmakuva" : ortokuva,
        	"Uusi Taustakartta": taustakartta_uusi
    	};

        const map = new L.map('map_div', initMap);

       	L.control.layers(baseMaps).addTo(map);
        L.control.locate().addTo(map);
        L.control.scale({maxWidth: 400, imperial: false}).addTo(map);

		function onMapClick(e) { 

			if (currentMarker === obsIcon) {  
				if (markerObs) {
	        		map.removeLayer(markerObs);
	      		}        

	      		markerObs = new L.marker(e.latlng, {icon: currentMarker}).addTo(map);
	        
				var piste = EPSG3067.project(e.latlng).toString();
				var piste_temp = piste.replace("Point(", "").replace(")", "").split(", ");
	      		var no = Math.round(piste_temp[1]).toString();
				var ea = Math.round(piste_temp[0]).toString();
	      		var bbox_koord = ea.concat(",",no,",",ea,",",no);

	    		document.getElementById('obs-n-koord').value = no;	
				document.getElementById('obs-e-koord').value = ea;
				document.getElementById('obs-n-koord').classList.remove('real_disabled');
				document.getElementById('obs-e-koord').classList.remove('real_disabled');
				document.getElementById('obs-kunta-nimi').classList.remove('real_disabled');

	      		//poista tarkkuudesta disabled
	      		document.getElementById('obs-accuracy').disabled = false;

	      		//hae koordinaattipisteen kunta
  				getKunta(bbox_koord).done(handleKunta);

  			}

  			if (currentMarker === birdIcon) {  
				if (markerBird) {
	        		map.removeLayer(markerBird);
	      		}        

	      		markerBird = new L.marker(e.latlng, {icon: currentMarker}).addTo(map);
	        
				var piste = EPSG3067.project(e.latlng).toString();
				var piste_temp = piste.replace("Point(", "").replace(")", "").split(", ");
	      		var no = Math.round(piste_temp[1]).toString();
				var ea = Math.round(piste_temp[0]).toString();
	      		var bbox_koord = ea.concat(",",no,",",ea,",",no);

	    		document.getElementById('bird-n-koord').value = no;	
				document.getElementById('bird-e-koord').value = ea;

	      		//poista tarkkuudesta disabled
	      		document.getElementById('bird-accuracy').disabled = false;
  			}

		}
	
		map.on('click', onMapClick);

		function clearPosition(scope) {
		//clear and reset input fields and markers after button press 	

			var uppercaseScope = scope.charAt(0).toUpperCase() + scope.slice(1);

			const elements = {accuracy: ["accuracy", "value", 0], disabled: ["accuracy", "disabled", true], nKoord: ["n-koord", "value", null], eKoord: ["e-koord", "value", null], kuntaNimi: ["kunta-nimi", "value", null]};

			for (var [key, value] of Object.entries(elements)) {
				let elementId = scope.concat("-",value[0]);

					if ( $( "#" + elementId ).length ) {
						document.getElementById(elementId)[value[1]] = value[2];
					}	
			}

			var markerName = "marker".concat(uppercaseScope); 
			if (this[markerName]) {
				map.removeLayer(this[markerName]);
			} 
		} 

		function connectPosition() {

			const scopes = ['obs', 'bird'];
			const elements = {nKoord: ["n-koord"], eKoord: ["e-koord"]};

			// for (var)

		}

		$("#btn-observer").click(function(){
				currentMarker = obsIcon; 
		    }); 

		$("#btn-bird").click(function(){
				currentMarker = birdIcon;
		    }); 

		$("#btn-clear-obs").click(function(){
				clearPosition("obs");
			});
			
		$("#btn-clear-bird").click(function(){
				clearPosition("bird");
			});

		$("#btn-move").click(function(){
				currentMarker = null;
		    }); 
		$("#btn-distance").click(function(){
				currentMarker = null;
		    }); 

		$("#btn-connect").click(function(){
				connectPosition();
		    }); 

		$("#btn-get-placenames").click(function(){
				getPlaceNames = !getPlaceNames;
				console.log(getPlaceNames);
		    });

		$("#btn-trash-all").click(function(){
				$().button('toggle');
				currentMarker = obsIcon;
				clearPosition("obs");
				clearPosition("bird");

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

