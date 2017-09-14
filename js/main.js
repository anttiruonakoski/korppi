// main.js
	
	var L;
    var line;
    var accuracyCircle = {
        obs: null,
        bird: null
    };
    var drawAccuracyCircle = {
        obs: false,
        bird: false
    }

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
            layer.bindPopup('Aseta paikaksi: <button type="button" class="btn btn-sm btn-success btn-select-site">' + feature.properties.name +'</button>', {
                maxWidth : 'auto'
                });
            }
            layer._leaflet_id = feature.id;
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
    		"<span id='common-sites-control'>Yhdistyspaikat</span>" : sitesExample,
    		"Omat paikat" : testLayer
    	};

        const map = new L.map('map_div', initMap);

        // Create additional Control placeholders https://stackoverflow.com/questions/33614912/how-to-locate-leaflet-zoom-control-in-a-desired-position

        function addControlPlaceholders(map) {
            var corners = map._controlCorners,
                l = 'leaflet-',
                container = map._controlContainer;

            function createCorner(vSide, hSide) {
                var className = l + vSide + ' ' + l + hSide;

                corners[vSide + hSide] = L.DomUtil.create('div', className, container);
            }
            createCorner('verticalcenter', 'left');
            createCorner('top', 'horisontalcenter');
        }
        addControlPlaceholders(map);

        //add custom control to show Raven

        L.Control.Raven = L.Control.extend({
        	onAdd: function(map) {
        	        var img = L.DomUtil.create('img');

        	        img.src = 'images/corrax.jpg';
        	        img.style.width = '48px';
                    img.id = 'raven'

        	        return img;
        	    },

        	    onRemove: function(map) {
        	        // Nothing to do here
        	    }
        	});

        //add custom control to show tools

        // L.Control.Tools = L.Control.extend({
        //     onAdd: function(map) {
        //     var divi = L.DomUtil.create('div', 'leaflet-control leaflet-control-layers leaflet-control-layers-expanded');
     
        //     divi.setAttribute("class", "leaflet-control leaflet-control-layers leaflet-control-layers-expanded");
        //         return divi;
        //        },

        //     onRemove: function(map) {
        //             // Nothing to do here
        //         }

        // });

        var raven = function(opts) {
            return new L.Control.Raven(opts);
        };

        // var tools = function(opts) {
        //     return new L.Control.Tools(opts);
        //  };

        sitesExample.addTo(map);
        //assign variable only after json request complete, otherwise empty result
        var sitesExampleAsJSON = sitesExample.toGeoJSON();

       	L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);
       	L.control.layers(null, siteLayers, {collapsed: false}).addTo(map);

        L.control.locate().addTo(map);
        L.control.scale({maxWidth: 400, imperial: false}).addTo(map);

        // custom controls

        raven({ position: 'bottomright' }).addTo(map);
        // tools({ position: 'tophorisontalcenter' }).addTo(map);
        
        el = document.getElementById('obs-tools') 
        L.DomEvent.disableClickPropagation(this.el);

        // helper functions

        function getCoords(point) {
    		var point_temp = point.replace("Point(", "").replace(")", "").split(", ");
      		var no = Math.round(point_temp[1]).toString();
			var ea = Math.round(point_temp[0]).toString();
      		var bbox = ea.concat(",",no,",",ea,",",no);
      		return {no: no, ea: ea, bbox: bbox};
        }

        function centerObs(zoomLvl) {
            map.setView(markerObs.getLatLng(),zoomLvl);
        }

        function drawLine(obs,bird,line) {
            var polyline = line; 
            if (polyline) {
                map.removeLayer(polyline);        
            }    
            if (obs && bird) {
                var latlngs = [obs.getLatLng(), bird.getLatLng()]; 
                var polyline = L.polyline(latlngs, {color: 'red', opacity: 0.75, weight: 4}).addTo(map).showMeasurements();
            }
            return polyline;
        }

        function drawaccuracyCircle(latlng,radius,type) {
                
                accuracyCircle.type = L.circle(latlng, {radius: radius}).addTo(map); 

        }

        function setMarker(latlng,icon,tooltip) {

            newMarker = L.marker(latlng, icon).addTo(map);

            // bindTooltip('Havainnoija', {permanent: true, direction: 'left' }).addTo(map);

            return newMarker; 
        }


		function onMapClick(e) { 

			var coords = getCoords(EPSG3067.project(e.latlng).toString());

			if (currentMarker === obsIcon) {  
				if (markerObs) {
	        		map.removeLayer(markerObs);
	      		}        

                // disable label for now
                // markerObs = new L.marker(e.latlng, {icon: currentMarker}).bindTooltip('Havainnoija', {permanent: true, direction: 'left' }).addTo(map);

                markerObs = new L.marker(e.latlng, {icon: currentMarker}).
                addTo(map);

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

	      		markerBird = setMarker(e.latlng, {icon: currentMarker},null);

	    		document.getElementById('bird-n-koord').value = coords.no;	
				document.getElementById('bird-e-koord').value = coords.ea;
	      		//poista tarkkuudesta disabled
	      		document.getElementById('bird-accuracy').disabled = false;
  			}

            if (markerObs && markerBird) {
                line = drawLine(markerObs, markerBird, line);
            }
		}

	
		map.on('click', onMapClick);

        map.on('popupopen', function(e) {
            $(".btn-select-site").click(function() {
                var popupSourceFeature = e.popup._source;
                var kuntaName = popupSourceFeature.feature.properties.kunta;
                var placeName = popupSourceFeature.feature.properties.name;
                var coords = getCoords(EPSG3067.project(popupSourceFeature._latlng).toString());
                console.log(kuntaName, placeName, coords);

                        if (markerObs) {
                            map.removeLayer(markerObs);
                        }        
                        currentMarker = obsIcon;
                            $( "#btn-observer").toggleClass("active",true);
                            $( "#btn-bird").toggleClass("active",false);
                            $( "#btn-ruler").toggleClass("active",false);
                            $( "#btn-move").toggleClass("active",false);

                         //needs to reset tool buttons

                        markerObs = setMarker(popupSourceFeature._latlng, {icon: currentMarker},null);

                        // L.marker(popupSourceFeature._latlng, {icon: currentMarker}).bindTooltip('Havainnoija', {permanent: true, direction: 'left' }).addTo(map);

                        if (map.getZoom() < 12) {
                            var zoomLevel = 12;
                        }
                        else {
                            var zoomLevel = map.getZoom();
                        }
                        centerObs(zoomLevel);

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

                map.closePopup();
            });
        });

		function clearPositionForm(form) {
		//clear and reset input fields and markers after button press 	

			var uppercaseScope = form.charAt(0).toUpperCase() + form.slice(1);
			const formName = form + '-form';

			document.getElementById(formName).reset();

			if (form==='obs') {
			document.getElementById("obs-kunta-name").classList.remove('is-invalid');
            document.getElementById('obs-accuracy').disabled = true;			
			}

            if (form==='bird') {
            document.getElementById('bird-accuracy').disabled = true;          
            }          

			var markerName = "marker".concat(uppercaseScope); 
			if (this[markerName]) {
				map.removeLayer(this[markerName]);
                this[markerName] = null;         
			} 

            line = drawLine(markerObs, markerBird, line);

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

		$("#btn-connect-bird").click(function(){
				if (markerObs) {
                    var coords = getCoords(EPSG3067.project(markerObs._latlng).toString());
                    console.log(coords);
                    document.getElementById('bird-n-koord').value = coords.no;  
                    document.getElementById('bird-e-koord').value = coords.ea;
                    document.getElementById('bird-accuracy').disabled = false;
                    if (markerBird) {
                        map.removeLayer(markerBird);
                     }        
                    markerBird = new L.marker(markerObs._latlng, {icon: birdIcon}).addTo(map);
                    markerBird.setRotationAngle(-75);

                    if (line) {
                        map.removeLayer(line);        
                    }    
                }
		    }); 


		$("#btn-get-placenames").click(function(){
				getPlaceNames = !getPlaceNames;
				console.log(getPlaceNames);
		    });

		$("#btn-trash-all").click(function(){
				$().button('toggle');
				clearPositionForm("obs");
				clearPositionForm("bird");
		    });

        $("#btn-reset-map").click(function(){
                map.setView(initMap.center, initMap.zoom);
                clearPositionForm("obs");
                clearPositionForm("bird");
            }); 

		$('#obs-accuracy').change(function() {
			var showAccuracy = true;
			var accuracyRadius = document.getElementById('obs-accuracy').value;
            drawaccuracyCircle(markerObs.getLatLng(), accuracyRadius, 'obs');
		});

        $('#bird-accuracy').change(function() {
            var accuracyRadius = document.getElementById('bird-accuracy').value;
            drawaccuracyCircle(markerBird.getLatLng(), accuracyRadius, 'bird');
        });

        $("#btn-obs-center").click(function(){
                centerObs();
            });

        $("#btn-obs-centerzoom").click(function(){
                const zoomLevel = 12;
                centerObs(zoomLevel);
            });

		

    }

