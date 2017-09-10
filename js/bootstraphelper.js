//page.js
//scripts for bootstrap

// enable tooltips
    $(function () {
      $('[data-toggle="tooltip"]').tooltip();
    });    

    //enable modal
    $('#myModal').on('shown.bs.modal', function () {
      $('#myInput').focus();
    });
 