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
 