function postArrival() {
    let success = true;
    let date = $("#date").val();
    let ccid = $("[ccid]").attr("ccid");

    let ptags = document.querySelectorAll("#chosencontainer > p:not(.hidden)")

    if(ptags.length === 0) {
        $("#messagebox > p").text("Välj en person först.")
        $("#messagebox").toggleClass("hidden");
        $("#overlay").toggleClass("overlay");
        return null;
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
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                success = false;
                console.log(error);
            }
        });
    });

    if(success) {
        $("#messagebox > p").text("Ankommande registrerad.")
        $("#messagebox").toggleClass("hidden");
        $("#overlay").toggleClass("overlay");
        document.querySelectorAll("#chosencontainer > p:not(.hidden)").forEach(function(p){p.click()});
    } else {
        $("#messagebox > p").text("Misslyckades med registrering.")
        $("#messagebox").toggleClass("hidden");
        $("#overlay").toggleClass("overlay");
    }
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
            $("#messagebox > p").text("Deltagare registrerad.")
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
            $("#UNO").val("");
            $("#fname").val("");
            $("#lname").val("");
            $("#birthyear").val("");
            $("#country").prop('selectedIndex',0);
            $("#languages").prop('selectedIndex',0);
        },
        error: function (error) {
            console.log(error);
            $("#messagebox > p").text("Misslyckades med registrering.")
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
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
        "costCenterId":    $("[ccid]").attr("ccid"),
        "tkActivityId":    $("#aktivitet").val(),
        "participants":    $("#antal").val()
    }

    $.ajax({
        type: "POST",
        url: "/api/activity",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify(data),
        success: function(activityId) {
            if(!$("#personer").hasClass("blur")) {
                let ptags = document.querySelectorAll("#chosencontainer > p:not(.hidden)");
                ptags.forEach( function(p){
                    let personData = {
                        "activity_id"     : activityId,
                        "participant_id"  : p.dataset.id
                    }
                    $.ajax({
                        type: "POST",
                        url: "/api/activity_contents",
                        contentType: "application/json; charset=utf-8",
                        datatype: "json",
                        data:JSON.stringify(personData),
                        success:function(response) {
                            console.log(response);
                        },
                        error: function(error) {
                            console.log(error);
                            $("#messagebox > p").text("Kunde inte rapportera person på händelse.")
                            $("#messagebox").toggleClass("hidden");
                            $("#overlay").toggleClass("overlay");
                        }
                    });
                });
            }
            $("#messagebox > p").text("Händelsen är rapporterad.")
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
            $("#aktivitet").prop('selectedIndex',0);
            $("#antal").val("");
            document.querySelectorAll("#chosencontainer > p:not(.hidden)").forEach(function(p){p.click()});
        },
        error: function (error) {
            console.log(error);
            $("#messagebox > p").text("Händelsen kunde inte rapporteras.")
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
        }
    });
}

function hide() {
    $("#messagebox").toggleClass("hidden");
    $("#overlay").toggleClass("overlay");
}

function getActivitiesPerDate() {
    $("#activity_contents").parent().addClass("hidden");
    let oldTags = $("#activity tbody tr")

    let date = $("#datepicker").val();

    if(date === null) {
        return false;
    }

    let ccid = $("#chosen").attr("ccid");


    $.ajax({
        type: "GET",
        url: `/api/report_data/cost_center_occurrence_date/${ccid}/${date}`,
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        success: function(response) {
            if(response.length === 0) {
                $("#messagebox > p").text("Det fanns inget för det datumet.")
                $("#messagebox").toggleClass("hidden");
                $("#overlay").toggleClass("overlay");
            }

            response.forEach(function (val) {
                let linkTag;
                if(val.reportedParticipants > 0) {
                    linkTag = $('<td><button type="button" class="click" onclick="getActivityContents(' + val.id + ')"></button></td>');
                } else {
                    linkTag = $('<td></td>');
                }

                $("#activity").find('tbody').append(
                    $('<tr>').append(
                        linkTag
                    ).append(
                        $('<td>').text(val.activityName)
                    ).append(
                        $('<td>').text(val.occurrenceDate)
                    ).append(
                        $('<td>').text(val.reportedDate)
                    ).append(
                        $('<td>').text(val.costCenterName)
                    ).append(
                        $('<td>').text(val.participants)
                    ).append(
                        $('<td>').text(val.reportedParticipants)
                    )
                );
            });
        },
        error: function (error) {
            console.log(error);
        }
    });

    oldTags.remove();
}

function getActivityContents(activity_id) {
    let ac = $("#activity_contents");
    ac.find("tbody").children().remove();

    $.ajax({
        type: "GET",
        url: `/api/activity_contents/activityId/${activity_id}`,
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        success: function(response) {
            response.forEach(function (val) {
                ac.removeClass("hidden");
                ac.find('tbody').append(
                    $('<tr>').append(
                        $('<td>').text(val.activity.tkActivity.id.name)
                    ).append(
                        $('<td>').text(val.participant.firstName + " " + val.participant.lastName)
                    ).append(
                        $('<td>').text(val.participant.unoCode)
                    ).append(
                        $('<td>').text(val.participant.country)
                    ).append(
                        $('<td>').text(val.participant.spokenLanguage)
                    )
                );
            });

            ac.parent().removeClass("hidden");
        },
        error: function (error) {
            $("#messagebox > p").text("Kunde inte hämta data.\n" + error);
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
        }
    });
}
