function postArrival() {
    let data = {
        "participant":      $("#UNO").val(),
        "costCentedId":     $("[ccid]").attr("ccid"),
        "date":             $("#date").val()
    }

    $.ajax({
        type: "POST",
        url: "http://localhost/api/attendance",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify(data),
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}
postNewParticipant() {
    let data = {
    "unoCode"           = $("#UNO").val(),
    "firstName"         = $("#fname").val(),
    "lastName"          = $("#lname").val(),
    "birthDate"         = $("#birthyear").val(),
    "spokenLanguage"    = $("#language").val(),
    "country"           = $("#land").val(),
    }
    $.ajax({
        type: "POST",
        url: "http://localhost/api/participant",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify(data),
        success: function(response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function postActivity() {
    Date.prototype.yyyymmdd = function() {
      let mm = this.getMonth() + 1; // getMonth() is zero-based
      let dd = this.getDate();

      return [this.getFullYear(),
              (mm>9 ? '' : '0') + mm,
              (dd>9 ? '' : '0') + dd
             ].join('-');
    };

    let date = new Date();

    let data = {
        "reportedDate":    date.yyyymmdd(),
        "occurrenceDate":  $("#occurrence_date").val(),
        "costCenterId":      $("[ccid]").attr("ccid"),
        "tkActivityId":      $("#aktivitet").val(),
        "participants":     $("#antal").val()
    }
    $.ajax({
        type: "POST",
        url: "http://localhost/api/activity",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify(data),
        success: function(response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });
}
