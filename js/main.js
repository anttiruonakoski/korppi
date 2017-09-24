// main.js
	
    var map;
	var L;

    var hashMaps = {};
    var siteLists = {};

    var idhashMap = new Map();
    var sList = {};

    const me = {  
                id: 0,
                name: 'own'
    };    

    const associations = [
               {id: 23, name: 'Lapin lintutieteellinen yhdistys ry'} ,
               {id: 99, name: 'Koko Suomi', }
    ];  
          
    //shorthand for organizations
    orgsNames = associations;
    orgsNames.push(me);

    orgsNames.forEach(function (org) {
    //23, [lly, {havaintopaikan id: leaflet-id}]    
       hashMaps[org.id] = new Map();
       siteLists[org.id] = null;

    });

    var org = 23; //deftault to LLY
  
    var line;
    var gKunta = null;
    var clearPositionForm;
    var gsetMarker;
    var centerObs;
    var drawLine;

    //Site markers must be grouped as a layerGroup, so that we can select feature by id.
    // getLayer is a LayerGroup method
    let siteLayerGroups = {
        societySitesGroup : new L.layerGroup(),
        ownSitesGroup : new L.layerGroup()
    };

    // hashmap (objet literal) needed, because leaflet layers (or markers) can only have internal id. you can't mix it with GeoJSON feature ids. 

    // societyHash = {};
    // ownHash = {}; //orgData.

    // let idHashes = [{
    //     society: societyHash,
    //     own: ownHash
    // }];

    // getLayer is a LayerGroup method, so those needed too 
    // let societySitesGroup = L.layerGroup();
    // let ownSitesGroup = L.layerGroup();

    var currentMarker;
    var markerObs, markerBird;

    var counter = 0;

    var accuracyCircle = {
        obs: null,
        bird: null
    };

    var accuracyRadius = {
        obs: null,
        bird: null
    };

    var layerGroup = {
        obs: null,
        bird: null
    };

    var ownSitesFile = 'data/100.geojson';
    var societySitesFile = 'data/lintutornit_lly_kaikki_2017_wgs84.geojson';

    // var societySitesFile = 'data/7500.geojson';

  	const taustakartta = L.tileLayer.mml_wmts({ layer: "taustakartta" });
    const maastokartta = L.tileLayer.mml_wmts({ layer: "maastokartta" });
    const ortokuva = L.tileLayer.mml("Ortokuva_3067");
    ortokuva.options.minZoom = 8;
    maastokartta.setOpacity(0.75);  
    // const taustakartta_uusi = L.tileLayer.mml("Taustakartta_3067");

    const siteMarkerOptions = {
    	radius : 4,
    	fillOpacity : 1,
    	fillColor : '#4169E1',
    	color : 'dimgray',
        stroke: false
    };

    const ownsiteMarkerOptions = {
        radius : 7,
        fillOpacity : 0.6,
        fillColor : 'darkorange',
        color : 'dimgray',
        weight: 1 
    };


    function onEachFeature(feature, layer) {
     // does this feature have a property named name?

        if (feature.properties && feature.properties.name) {
            counter++;
            layer.bindPopup('Siirry yhdistyspaikkaan: <button type="button" class="btn btn-sm btn-primary btn-select-site">' + feature.properties.name +'</button>', {
                maxWidth : 'auto'
                });
            }            
             siteLayerGroups.societySitesGroup.addLayer(layer); 
            hashMaps[org].set(feature.properties.id, layer._leaflet_id);
        
    }

    function onEachFeature_own(feature, layer) {
     // does this feature have a property named name?

        if (feature.properties && feature.properties.name) {
            counter++;
            layer.bindPopup('Siirry omaan paikkaan: <button type="button" class="btn btn-sm btn-primary btn-select-site">' + feature.properties.name +'</button>', {
                maxWidth : 'auto'
                });      
            }
            siteLayerGroups.ownSitesGroup.addLayer(layer);
            hashMaps[0].set(feature.properties.id, layer._leaflet_id);
        
    }

    // example_100_random_site.geojson

    var ownsites = new L.GeoJSON.AJAX( ownSitesFile, { pointToLayer : function(geoJsonPoint, latlng) {
    return L.circleMarker(latlng, ownsiteMarkerOptions);
    }, onEachFeature: onEachFeature_own});


    // lintutornit_lly_kaikki_2017_wgs84.geojson
    var sites = new L.GeoJSON.AJAX( societySitesFile, { pointToLayer : function(geoJsonPoint, latlng) {
    return L.circleMarker(latlng, siteMarkerOptions);
	}, onEachFeature: onEachFeature});

    //

        sites.on('data:loaded', function () {
            console.log('tasolla kohteita: ', counter);
            counter = 0;
            var sitesAsJSON = sites.toGeoJSON();
            siteLists[org] = tableFeatures(sitesAsJSON,"societySites"); 

        });  

       ownsites.on('data:loaded', function () {
            console.log('omalla tasolla kohteita: ', counter);
            counter = 0;
            var sitesAsJSON = ownsites.toGeoJSON();   
            siteLists[0] = tableFeatures(sitesAsJSON,"ownSites");
        }); 

    // 

    const EPSG3067 = L.TileLayer.MML.get3067Proj();

  	const initMap = {
        crs: L.TileLayer.MML.get3067Proj(),
        center: [66.5, 25.3],
        zoom: 6,
        minZoom: 3,
        maxZoom: 14,
        layers: [taustakartta, sites],    
        maxBounds: [[58.2133,16.16359],
                    [71.2133,36.16359]],
        //test canvas renderer,
        renderer: L.canvas(),
        prefercanvas: true                   
		};

	const obsIcon = L.AwesomeMarkers.icon({
		icon: 'binoculars', prefix: 'fa', markerColor: 'cadetblue'
	});
	const birdIcon = L.AwesomeMarkers.icon({
		icon: 'twitter', prefix: 'fa', markerColor: 'cadetblue'
	});

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
    		"Yhdistyspaikat <span id='common-sites-control'></span>" : sites,
    		"Omat paikat" : ownsites
    	};

        map = new L.map('map_div', initMap);

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
          	        img.src = 'images/corrax.png';
                    img.classList.add('reverse-flip', 'ravenimg');
                    img.id = 'raven';
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

        // sites.addTo(map);

        //assign variable only after json request complete, otherwise empty result

        //for collapsing layer switcher

        var collapseState = sizeCheck();
        console.log(collapseState);
        
       	var baseControl = L.control.layers(baseMaps, null, {collapsed: false}).addTo(map);
       	var siteControl = L.control.layers(null, siteLayers, {collapsed: collapseState}).addTo(map);

        L.control.locate().addTo(map);
        L.control.scale({maxWidth: 400, imperial: false}).addTo(map);

        // custom controls

        raven({ position: 'bottomleft' }).addTo(map);
        // tools({ position: 'tophorisontalcenter' }).addTo(map);      

        //otherwise click events pass through to map layer 
        el = document.getElementById('obs-tools');
        L.DomEvent.disableClickPropagation(this.el);

        // helper functions

        function getCoords(point) {
    		var point_temp = point.replace("Point(", "").replace(")", "").split(", ");
      		var no = Math.round(point_temp[1]).toString();
			var ea = Math.round(point_temp[0]).toString();
      		var bbox = ea.concat(",",no,",",ea,",",no);
      		return {no: no, ea: ea, bbox: bbox};
        }

        centerObs =  function centerObs(zoomLvl) {
            map.flyTo(markerObs.getLatLng(),zoomLvl);
        }

        drawLine = function drawLine(obs,bird,line) {
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
                
            var weight = 1;
            var color = "#c68585";
            var fillOpacity = 0.25;   

            if (accuracyCircle[type]) {
                layerGroup[type].removeLayer(accuracyCircle[type]);   
            }

            accuracyCircle[type] = new L.circle(latlng, {radius: radius, weight: weight, color: color, fillOpacity: fillOpacity }).addTo(map);

            layerGroup[type].addLayer(accuracyCircle[type]);
            
        }

        setMarker = function setMarker(latlng,icon,type) {

            newMarker = L.marker(latlng, icon).addTo(map);

            layerGroup[type] = new L.layerGroup().addTo(map);

                if (accuracyRadius[type]) {
                    drawaccuracyCircle(latlng, accuracyRadius[type], type);    
                }     

            layerGroup[type].addLayer(newMarker); 

            // bindTooltip('Havainnoija', {permanent: true, direction: 'left' }).addTo(map);

            return newMarker; 
        }


        resetlayerGroups = function resetlayerGroups(types) {

            Object.keys(accuracyRadius).forEach(v => accuracyRadius[v] = null);
            types.forEach(function(i) {
                if (layerGroup[i]) {
                    layerGroup[i].remove();
                }  
            });
            if (line) {
                        map.removeLayer(line);        
                    } 
        }

        function conlog() {
            console.log('test function l2 code noob', parseKunta.kunta);
        }

		function onMapClick(e) { 

			var coords = getCoords(EPSG3067.project(e.latlng).toString());

			if (currentMarker === obsIcon) {  
				if (layerGroup['obs']) {
	        		layerGroup['obs'].remove();
	      		}  
                getKunta(coords.bbox).done(parseKunta);
                // disable label for now
                // markerObs = new L.marker(e.latlng, {icon: currentMarker}).bindTooltip('Havainnoija', {permanent: true, direction: 'left' }).addTo(map);
                
                markerObs = new setMarker(e.latlng, {icon: currentMarker}, 'obs');

                // if (accuracyRadius['obs']) {
                // drawaccuracyCircle(markerObs.getLatLng(), accuracyRadius['obs'], 'obs');
                // }
                
	    		document.getElementById('obs-n-koord').value = coords.no;	
				document.getElementById('obs-e-koord').value = coords.ea;
	      		//poista tarkkuudesta disabled
	      		document.getElementById('obs-accuracy').disabled = false;
	      		
  			}

  			if (currentMarker === birdIcon) {  
				if (layerGroup['bird']) {
	        		layerGroup['bird'].remove();
	      		}        

	      		markerBird = new setMarker(e.latlng, {icon: currentMarker}, 'bird'). addTo(map);

	    		document.getElementById('bird-n-koord').value = coords.no;	
				document.getElementById('bird-e-koord').value = coords.ea;
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

                        if (layerGroup['obs']) {
                            layerGroup['obs'].remove();
                        }     

                        currentMarker = obsIcon;
                            $( "#btn-observer").toggleClass("active",true);
                            $( "#btn-bird").toggleClass("active",false);
                            $( "#btn-ruler").toggleClass("active",false);
                            $( "#btn-move").toggleClass("active",false);

                         //needs to reset tool buttons

                        markerObs = new setMarker(popupSourceFeature._latlng, {icon: currentMarker}, 'obs').addTo(map);

                        // L.marker(popupSourceFeature._latlng, {icon: currentMarker}).bindTooltip('Havainnoija', {permanent: true, direction: 'left' }).addTo(map);

                        if (map.getZoom() < 12) {
                            var zoomLevel = 12;
                        }
                        else {
                            var zoomLevel = map.getZoom();
                        }

                        //should really fix this, no logic here
                        map.removeLayer(sites[0]);
                        map.removeLayer(ownsites);
                        
                        centerObs(zoomLevel);

                        map.once('moveend', function() {
                            map.addLayer(sites[0]);
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

                map.closePopup();
            });
        });

		clearPositionForm = function clearPositionForm(form) {
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

            if (line) {
                        map.removeLayer(line);        
                    }
		}; 

		$("#btn-observer").click(function(){
				currentMarker = obsIcon; 
		    }); 

		$("#btn-bird").click(function(){
				currentMarker = birdIcon;
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
                    document.getElementById('bird-n-koord').value = coords.no;  
                    document.getElementById('bird-e-koord').value = coords.ea;
                    document.getElementById('bird-accuracy').disabled = false;
                    if (layerGroup['bird']) {
                        layerGroup['bird'].remove();
                    }        
       
                    markerBird = new setMarker(markerObs.getLatLng(), { icon: birdIcon }, 'bird'). addTo(map);
                    markerBird.setRotationAngle(-75);

                      
                }
		    }); 


		$("#btn-get-placenames").click(function(){
				getPlaceNames = !getPlaceNames;
				console.log(getPlaceNames);
		    });

        // clears

        $("#btn-clear-obs").click(function(){
                clearPositionForm('obs');
                resetlayerGroups(['obs']);
            });
            
        $("#btn-clear-bird").click(function(){
                clearPositionForm('bird');
                resetlayerGroups(['bird'])
            });

		$("#btn-trash-all").click(function(){
				$().button('toggle');
                clearPositionForm("obs");
                clearPositionForm("bird");
                resetlayerGroups(['obs','bird']);
		    });

        $("#btn-reset-map").click(function(){
                map.setView(initMap.center, initMap.zoom);
                // initMap.layers[0].addTo(map); buggy need to remove all base first;
                clearPositionForm("obs");
                clearPositionForm("bird");
                resetlayerGroups(['obs','bird']);
            }); 

		$('#obs-accuracy').change(function() {
			accuracyRadius['obs'] = document.getElementById('obs-accuracy').value;
            drawaccuracyCircle(markerObs.getLatLng(), accuracyRadius['obs'], 'obs');
		});

        $('#bird-accuracy').change(function() {
            accuracyRadius['bird'] = document.getElementById('bird-accuracy').value;
            drawaccuracyCircle(markerBird.getLatLng(), accuracyRadius['bird'], 'bird');
        });

        $("#btn-obs-center").click(function(){
                centerObs();
            });

        $("#btn-obs-centerzoom").click(function(){
                const zoomLevel = 12;
                centerObs(zoomLevel);
            });

        $(".dropdown-item").click(function(){
            var soc = ( $(this).data ( 'id' ));
            sites[soc] = createLayer (soc);
            
            map.addLayer(sites[soc]);

            });

        $('#sites-content'). on( 'click', 'li', function() {

            scope = this.closest('div').id;
            console.log(scope);

            m = (scope === 'ownSites') ? 0 : org; 

            layergroupName = scope + 'Group';
        
            //own or society, ugly fix this by changin function call
            hashkey = scope.substr(0, scope.length - 5);

            id = $( this ).data('id');

            console.log(hashkey, id);

            //get Leaflet internal layer ID from our table

            internalid = hashMaps[m].get(id);

            console.log('internal ' + internalid + ' id ' + id);

            //when we know ID, we can get layer from LayerGroup
            // societySitesGroup is an array of layerGroups

            if (scope === "societySites") {
                sitePoint = siteLayerGroups[layergroupName].getLayer(internalid);
            }
            else {
                sitePoint = siteLayerGroups[layergroupName].getLayer(internalid);           
            }

            setSite(sitePoint);
        });   


        //collapse obs point layer switcher, when under certain display resolution

        function sizeCheck() {
            //@media (max-width: 390px)

            const collapseWidth = 390;

            //initialization
            if  (typeof siteControl === 'undefined') {
            return (map.getContainer().offsetWidth < collapseWidth);            
            }

            // just not working, collpased remains false even if collapse()

            // var coll = siteControl.options.collapsed;
            // console.log(coll);

            // if ( (map.getContainer().offsetWidth < collapseWidth) && !coll ) {
            //     siteControl.collapse();
            //     // coll = true;
            // }
            // return;
        }

        map.on('resize', sizeCheck);


// test functions
            
         //scripts needed for bootstrap

         // enable tooltips
             $(function () {
               $('[data-toggle="tooltip"]').tooltip();
             });    

             //enable modal focus
             // $('#site-list-modal').on('shown.bs.modal', function () {
             // $(this).find('#sites-search').focus();
             // });
             
 

    }