function postArrival() {
    let date = $("#date").val();
    let ccid = $("[ccid]").attr("ccid");

    let ptags = document.querySelectorAll("#chosencontainer > p:not(.hidden)")

    if(ptags === null) {
        return "null"
    }

    ptags.forEach(function(p) {
        let data = {
            "participant_id": ptags[0].dataset.id,
            "cost_center_id": ccid,
            "date": date
        }

        $.ajax({
            type: "POST",
            url: "/api/attendance",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            data: JSON.stringify(data),
            success: function(alert) {
                alert("Whoopee!🎉");
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
}

function postNewParticipant() {
    let data = {
        "unoCode"           : $("#UNO").val(),
        "firstName"         : $("#fname").val(),
        "lastName"          : $("#lname").val(),
        "birthDate"         : $("#birthyear").val(),
        "spokenLanguage"    : $("#country").val(),
        "country"           : $("#languages").val(),
    }
    $.ajax({
        type: "POST",
        url: "/api/participant",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify(data),
        success: function(alert) {
            alert("Whoopee!🎉");
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
        success: function(activityId) {
            alert("Whoopee!🎉");
            if(!$("#personer").hasClass("blur")) {
                let ptags = document.querySelectorAll("#chosencontainer > p:not(.hidden)");
                ptags.forEach( function(p){
                    let personData = {
                        "activity_id"     : activityId,
                        "participant_id"  : p.dataset.id
                    }
                    $.ajax({
                        type: "POST",
                        url: "http://localhost/api/activity_contents",
                        contentType: "application/json; charset=utf-8",
                        datatype: "json",
                        data:JSON.stringify(personData),
                        success:function(alert) {
                            alert("Whoopee!🎉");
                        },
                        error: function(error) {
                            console.log(error);
                        }
                    });
                });
            }
        },
        error: function (error) {
            console.log(error);
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
        }
    });
}

function hide() {
    $("#messagebox").toggleClass("hidden");
    $("#overlay").toggleClass("overlay");
}

function getActivity(){
    Date.prototype.yyyymmdd = function() {
        let mm = this.getMonth() + 1; // getMonth() is zero-based
        let dd = this.getDate();

        return [this.getFullYear(),
                (mm>9 ? '' : '0') + mm,
                (dd>9 ? '' : '0') + dd
               ].join('-');
      };

    let data = {
        "reportedDate":    date.yyyymmdd(),
        "occurrenceDate":  $("#occurrence_date").val(),
        "costCenterId":      $("[ccid]").attr("ccid"),
        "tkActivityId":      $("#aktivitet").val(),
        "participants":     $("#antal").val()
    }

    $.ajax({
        type: "GET",
        url: "/api/activity",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify(data),
        success: function(alert) {
            alert("Whoopee!🎉");

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function getActivitiesPerDate() {
    let date = $("#datepicker").val();

    if(date === null) {
        return false;
    }

    let ccid = $("#chosen").attr("ccid");


    $.ajax({
    type: "GET",
    url: `/api/activity/cost_center_occurrence_date/${ccid}/${date}`,
    contentType: "application/json; charset=utf-8",
    datatype: "json",
    success: function(response) {
        response.forEach(function (val) {
            $("#activity").find('tbody').append(
                $('<tr>').append(
                    $('<td>').text(val.id)
                ).append(
                    $('<td>').text(val.occurrenceDate)
                ).append(
                    $('<td>').text(val.reportedDate)
                ).append(
                    $('<td>').text(val.costCenter.name)
                ).append(
                    $('<td>').text(val.participants)
                )
            );
        });
    },
    error: function (error) {
        console.log(error);
    }
});

}
