function reg_hand() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            alert("kaffe");
        }
    };

    request.open("GET", '/api/cost_center/1');
    let jsonData = {"name" : "Lokesh"};
    request.send( JSON.stringify( jsonData ) );
    request.send();
}

function postActivity() {
  let data = {
    "reported_date":    (new Date()),
    "occurrence_date":  $("#occurrence_date").value,
    "cost_center":      $("#aktivitet").ccId,
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
    };
  });
}