$( function() {
    $( "#datepicker" ).datepicker({
      showOn: "button",
      buttonImage: "/static/kalender.jpeg",
      buttonImageOnly: true,
      buttonText: "Select date"
    });
  } );

  function postArrival() {
  }

  function postActivity() {
    let data = {
      "reported_date":    (new Date()),
      "occurrence_date":  $("#occurrence_date").value,
      "cost_center":      {
        "id": $("#aktivitet").ccId
      },
      "activity_id":      $("#aktivitet").value,
      "participants":     $("#antal")
    }
    $.ajax({
      type: "POST",
      url: "http://localhost/api/activity",
      contentType: "application/json; charset=utf-8",
      datatype: "json",
      data: JSON.stringify(data),
      success: function(response) {
        console.console.log(response);
      },
      error: function (error) {
        console.log(error);
      }
    });
  }
