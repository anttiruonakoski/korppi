// jsonfunctions.js
// parse json to html table

function tableFeatures(jsonObj,scope) {




    //scope societySites, ownSites
    //observation site lists population relies on list.js
    //generic appendchild method & class changes would be faster but list.js gives indexed, searchable object
    //id = leafet marker (layer) id 

    var options = {
        valueNames: ['place', 'kunta', { data: ['id'] }],
        indexAsync: true,
        item: '<li class="list-group-item list-group-item-action"><a href="#" class="text-primary place"></a><span class="font-weight-bold kunta"></span></li>'
    }; 

    var features = jsonObj.features;
    console.log('Kohteita listalle :' + features.length + scope);

    var listLength = features.length;

    const headerText = {societySites: "Yhdistyspaikat", ownSites: "Omat paikat"};

    // var header = document.getElementById("sites-title"); 

    var sc = document.getElementById("tabs");
    // sc.classList.add('row');

    var tab = document.getElementById("tabheader");
    var div = document.createElement('div');
    sc.appendChild(div);

    //some magic to hide list header during 1-column layout and show tabs instead. should be improved to show tabs side by side, not one top of another. 

    tab.innerHTML = '<div class="col-12 d-lg-none d-xl-none">  <ul class="nav nav-tabs nav-fill"> <li class="nav-item"> <a class="nav-link active" href="#"> Omat paikat </a> </li> <li class="nav-item"> <a class="nav-link" href="#societySites" >Yhdistyspaikat</a> </li> </div>';
    div.classList.add('col-xs-12', 'col-sm-12', 'col-md-12', 'col-lg-6', 'col-xl-6');

    div2 = document.createElement('div');
    hdr = document.createElement('h6');
    div.appendChild(div2).appendChild(hdr);

    hdr.textContent = headerText[scope] + ' ' + listLength + ' kpl';

    // hdr.classList.add('');

    div2.classList.add('d-lg-inline-block','d-md-none', 'd-sm-none', 'd-none');

    //it's important to define layout order. otherwise it'd depend which div's file was loaded first.

    if (scope === 'ownSites') {
        div.classList.add('order-1');
    }
    else {
        div.classList.add('order-12');
        div2.classList.remove('d-md-none', 'd-sm-none', 'd-none');
    }

    //magic ends

    div.id = scope;


    var list = document.createElement('ul');
    list.classList.add('list', 'list-group'); 

    // header.textContent = headerText[scope] + ' ' + listLength + ' kpl';
    
    var textcon;
    var listValues = [];

    console.time('lista');   

    for (var i = 0; i < features.length; i++) {

        textcon = features[i].properties.name + ' ';
        listValues.push({place: textcon,
                        kunta: features[i].properties.kunta,
                        id: features[i].properties.id
                        });

    
    // former appendchild method, was quite fast.  
    //     sid = 'site_' + features[i].properties.id;
    //     // console.log(sid);

    //     siteName = document.createElement('li');
    //     // siteName.classList.add('list-group-item', 'list-group-item-action');
    //     siteName.className = 'list-group-item';

    //     siteName.id = sid;

    //     di2 = document.createElement('div');
    //     di2.className = 'paikka' 
    
    //     siteName.appendChild(di2); 
    //     a = document.createElement('a');
    // // kunta.textContent = 'Kunta: ' + features[i].properties.kunta;

        
    //     di2.appendChild(a);
    //     a.className = 'text-primary';
    //     a.appendChild(document.createTextNode(textcon));

    //     // di2.innerHTML = '<a href="#" class="text-primary">' + features[i].properties.name +'</a>' + '<span class="font-weight-bold"> ' + features[i].properties.kunta + '</span>';

    //     // console.log(listValues.length);
    //     list.appendChild(siteName);        

    }

    // console.log('tehdään lista n itemistä: ',listValues.length);

    div.appendChild(list);
    siteElements[org] = div.cloneNode(true);

    // console.timeEnd('lista');
    // console.time('list.js');

    //sList [0,1] can't say which is society's which user's cause it's ambiguos which is populated first. 
    
    return new List(scope, options, listValues);

    // sList[Object.keys(headerText).indexOf(scope)] = new List(scope, options, listValues);
}    

    // console.timeEnd('list.js');

        function getCoords(point) {
    		var point_temp = point.replace("Point(", "").replace(")", "").split(", ");
      		var no = Math.round(point_temp[1]).toString();
			var ea = Math.round(point_temp[0]).toString();
      		var bbox = ea.concat(",",no,",",ea,",",no);
      		return {no: no, ea: ea, bbox: bbox};
        }

    function setSite (site) {

    		$('#site-list-modal').modal('hide');

    		//GeoJSON and Leaflet express N/E in different order
    		// ll = e.data.geometry.coordinates.reverse();
    		// fails sometimes, hence slice() which makes a copy of array

    		const ll = site._latlng;

    		currentMarker = obsIcon;

    		var placeName = site.feature.properties.name;
    		var kuntaName = site.feature.properties.kunta;
    
    		//get ETRS-TM35FIN coordinates
    		coords = getCoords(EPSG3067.project(L.latLng(ll)).toString());

 			if (layerGroup['obs']) {
 			    layerGroup['obs'].remove();
 			}     	
 			markerObs = new setMarker(ll, {icon: currentMarker}, 'obs');
    	       
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
    	            // map.removeLayer(sites);
    	            // map.removeLayer(ownsites);
    	            
    	            centerObs(zoomLevel);

    	            map.once('moveend', function() {
    	                // map.addLayer(sites);
    	                // map.addLayer(ownsites);
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

	

