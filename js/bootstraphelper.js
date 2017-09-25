//page.js
//scripts for bootstrap

// enable tooltips
    // $(function () {
    //   $('[data-toggle="tooltip"]').tooltip();
    // });   

    $(document).ready(function(){
  	$('[data-toggle="tooltip"]').tooltip({ trigger: "hover" });
	}); 

    //enable modal focus
    $('#site-list-modal').on('shown.bs.modal', function () {
    $(this).find('#sites-search').focus();
    });

    $( document ).ready(function() {

    // alert('vaömiss');   

    function dateString (d) {
        
        var options = { year: 'numeric', month: 'numeric', day: 'numeric' };    
        return d.toLocaleDateString("fi-FI",options);
    }

    function timeString (t) {
        
        var options = { hour: 'numeric', minute: 'numeric' };    
        return t.toLocaleTimeString("ru-RU",options);
    }

    date = new Date();

    obsStartDate = dateString(date);
    obsStartTime = timeString(date);

    date1 = document.getElementById('obs-start-date'); 
    date1.setAttribute('placeholder', obsStartDate); 

    time1 = document.getElementById('obs-start-time');
    time1.setAttribute('placeholder', obsStartTime); 
    // time.attr;

    });
 