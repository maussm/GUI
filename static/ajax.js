// Skapa en ny rad i tabellen attendance via APIt.
function postArrival() {
    let success = true;
    let date = $("#date").val();
    let ccid = $("[ccid]").attr("ccid");

    // Alla valda personer.
    let ptags = document.querySelectorAll("#chosencontainer > p:not(.hidden)")

    // Kontroll om någon person är vald.
    if(ptags.length === 0) {
        $("#messagebox > p").text("Välj en person först.")
        $("#messagebox").toggleClass("hidden");
        $("#overlay").toggleClass("overlay");
        return null;
    }

    // Loopar alla valda personer.
    ptags.forEach(function(p) {
        let data = {
            "participant_id": ptags[0].dataset.id,
            "cost_center_id": ccid,
            "date": date
        }

        // Skickar en REST fråga för varje person.
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

    // Informerar användare om det lyckades eller inte.
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


// Skapar en ny person som man registreras som ankommande i databasen via REST APIt.
function postNewParticipant() {
    // Hämtar alla värden för personen som ska skapas.
    let data = {
        "unoCode"           : $("#UNO").val(),
        "firstName"         : $("#fname").val(),
        "lastName"          : $("#lname").val(),
        "birthDate"         : $("#birthyear").val(),
        "spokenLanguage"    : $("#country").val(),
        "country"           : $("#languages").val(),
    }

    // REST frågan
    $.ajax({
        type: "POST",
        url: "/api/participant",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify(data),
        // Återställ formuläret och meddela att lyckades.
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
        // Meddela att misslyckades.
        error: function (error) {
            console.log(error);
            $("#messagebox > p").text("Misslyckades med registrering.")
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
        }
    });
}

// Registrera en ny aktivitet via REST API.
function postActivity() {
    // En funktion för att skapa datum i rätt format.
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

    // REST frågan.
    $.ajax({
        type: "POST",
        url: "/api/activity",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        data: JSON.stringify(data),
        // Om lyckas och det finns personer valda, registrera varje person i tabellen activity_contents via en ny
        // fråga för varje person.
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
            // Meddela när allt är klar.
            $("#messagebox > p").text("Händelsen är rapporterad.")
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
            $("#aktivitet").prop('selectedIndex',0);
            $("#antal").val("");
            document.querySelectorAll("#chosencontainer > p:not(.hidden)").forEach(function(p){p.click()});
        },
        // Meddela att något gick fel.
        error: function (error) {
            console.log(error);
            $("#messagebox > p").text("Händelsen kunde inte rapporteras.")
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
        }
    });
}

// En funktion som används för att ta fram eller visa meddelandefönstret.
function hide() {
    $("#messagebox").toggleClass("hidden");
    $("#overlay").toggleClass("overlay");
}

// Hämtar alla aktiviteter för att visst datum via REST API.
function getActivitiesPerDate() {
    // Gömmer den nedre tabellen vid en ny sökning.
    $("#activity_contents").parent().addClass("hidden");

    let oldTags = $("#activity tbody tr")
    let date = $("#datepicker").val();

    // Gör inget utan datam.
    if(date === null) {
        return false;
    }

    let ccid = $("#chosen").attr("ccid");


    // Hämta alla aktiviteterna.
    $.ajax({
        type: "GET",
        url: `/api/report_data/cost_center_occurrence_date/${ccid}/${date}`,
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        success: function(response) {
            // Meddela om det inte fanns något att hämta för datumet.
            if(response.length === 0) {
                $("#messagebox > p").text("Det fanns inget för det datumet.")
                $("#messagebox").toggleClass("hidden");
                $("#overlay").toggleClass("overlay");
            }

            // Bygg upp innehållet i tabellen baserat på datan som hämtades.
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

    // Ta bort all gammal data.
    oldTags.remove();
}

// Hämta vilka som deltog på en viss aktivtet via REST API.
function getActivityContents(activity_id) {
    let ac = $("#activity_contents");
    ac.find("tbody").children().remove();

    $.ajax({
        type: "GET",
        url: `/api/activity_contents/activityId/${activity_id}`,
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        success: function(response) {
            // Bygger upp tabellen baserat på datan som hämtades.
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

            // Visar tabellen som annars är dold (ska inte visas om inget finns att visa).
            ac.parent().removeClass("hidden");
        },
        error: function (error) {
            $("#messagebox > p").text("Kunde inte hämta data.\n" + error);
            $("#messagebox").toggleClass("hidden");
            $("#overlay").toggleClass("overlay");
        }
    });
}
