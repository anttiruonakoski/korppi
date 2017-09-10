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

    var marker_l;
				
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
			if (marker_l) {
        		map.removeLayer(marker_l);
      		}        

      		marker_l = new L.marker(e.latlng, {icon: L.AwesomeMarkers.icon({icon: 'twitter', prefix: 'fa', markerColor: 'cadetblue'}) }).addTo(map);
        
			var piste = EPSG3067.project(e.latlng).toString();
			var piste_temp = piste.replace("Point(", "").replace(")", "").split(", ");
      		var no = Math.round(piste_temp[1]).toString();
			var ea = Math.round(piste_temp[0]).toString();
      		var bbox_koord = ea.concat(",",no,",",ea,",",no);

    		document.getElementById('n_koord').value = no;	
			document.getElementById('e_koord').value = ea;

      		//poista tarkkuudesta disabled
      		document.getElementById('hp_tarkkuus').disabled = false;

      //document.getElementById('paikka_nimi').value = piste_temp;
  			getKunta(bbox_koord).done(handleKunta);

		}
	
		map.on('click', onMapClick);

    }

