//wfs_queries.js

const WFS_SERVICE="https://avaa.tdata.fi/geoserver/paituli/wfs";
	

function getKunta(bBox) {
		var result =$.ajax(WFS_SERVICE,{
    	type: 'GET',
    	dataType: 'jsonp',
    	jsonpCallback: 'getJson',
    	data: {
        	service: 'WFS',
        	version: '2.0.0',
        	request: 'GetFeature',
        	typeName: 'paituli:mml_hallinto_2017_10k',
        	PropertyName: 'NAMEFIN',
        	maxFeatures: 10,
        	outputFormat: 'text/javascript',
        	format_options: 'callback: getJson',
        	bbox: bBox
    	}});
    	return result;
}

  //  function getPaikannimet(bBox) {
		//  return $.ajax(WFS_SERVICE,{
  //   type: 'GET',
  //   dataType: 'jsonp',
  //   jsonpCallback: 'getJson',
  //   data: {
  //       service: 'WFS',
  //       version: '2.0.0',
  //       request: 'GetFeature',
  //       typeName: 'paituli:mml_hallinto_2017_10k',
  //       PropertyName: 'NAMEFIN',
  //       maxFeatures: 10,
  //       outputFormat: 'text/javascript',
  //       format_options: 'callback: getJson',
  //       bbox: bBox
  //   	}});
  // }

  function parseKunta(response){ 
  //parsi kuntanimi
  if (response.totalFeatures) {
  document.getElementById('obs-kunta-nimi').value = response.features[0].properties.NAMEFIN;
  document.getElementById('obs-kunta-nimi').classList.remove('is-invalid');
  }

  //kysely ei palauta kohteita -> ulkomailla 
  else { 
  document.getElementById('obs-kunta-nimi').value = null;
  document.getElementById('obs-kunta-nimi').classList.add('is-invalid');
  }
  }