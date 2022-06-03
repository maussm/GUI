// Hämtar alla deltagare via REST API.
$.ajax({
    type: "GET",
    url: "/api/participant",
    contentType: "application/json; charset=utf-8",
    datatype: "json",
    success: function(response) {

        // Sorterar namnen i bokstavsordning.
        response.sort(function(a, b) {
            let aname = a.firstName + " " + a.lastName;
            let bname = b.firstName + " " + b.lastName;

            if (aname > bname) {
                return 1;
            } else if (aname < bname) {
                return -1;
            }
            return 0;
        });

        // Bygger upp knapparna för varje person baserat på datan som hämtas.
        response.forEach(function(val) {
            let name = val.firstName + " " + val.lastName;
            let $main = $('<p class="button-blue">');
            let $sub = $('<p class="button-blue">');
            $main.attr('data-id', val.id);
            $main.attr('data-name', name);
            $main.text(name);

            $sub.attr('data-id', val.id);
            $sub.text(name);
            $sub.addClass('hidden');

            $main.click(function() {
                // Kontrollerar om elementet med id "antal" finns.
                // Om det finns hindras användare från att lägga till fler person än vad som är angivet.
                if(document.getElementById("antal")) {
                    if(document.getElementById("antal").valueAsNumber > $("#chosencontainer > p:not(.hidden)").length) {
                        $(this).toggleClass('hidden');
                        $(`#chosencontainer > p[data-id=${val.id}]`).toggleClass('hidden');
                    } else {
                        $("#messagebox > p").text("Du kan inte lägga fler personer än volym.")
                        $("#messagebox").toggleClass("hidden");
                        $("#overlay").toggleClass("overlay");
                    }
                // Annars kan personer lägga till i obegränsat antal.
                } else {
                    $(this).toggleClass('hidden');
                    $(`#chosencontainer > p[data-id=${val.id}]`).toggleClass('hidden');
                }
            });

            $sub.click(function() {
                $(this).toggleClass('hidden');
                $(`#buttoncontainer > p[data-id=${val.id}]`).toggleClass('hidden');
            });

            $('#buttoncontainer').append($main);
            $('#chosencontainer').append($sub);
        });

        // Sökfunktionen. Gömmer alla element när användare skriver något och visar enbart de vars data-name tagg
        // matchar det användare skriver.
        let tags = $('p[data-name');
        $('#search').bind('input', function() {
            let val = $.trim(this.value.toLowerCase()); // Det här det man skriver in när man söker.
            tags.addClass('hidden');

            tags.filter(function() {
                return $(this).data('name').toLowerCase().match(val) !== null;
            }).removeClass('hidden');
        });

        // Visar alla elementen igen.
        $('#deletebutton').click(function() {
            $('#search').val("");
            tags.removeClass('hidden');
        });
    },
    error: function (error) {
        console.log(error);
    }
});

// Funktion för att stänga av och sätta på knapparna för att välja personer.
function showOrHideParticipants(checkbox) {
    if(checkbox.checked) {
        $("#personer").removeClass("blur")
    } else {
        $("#personer").addClass("blur")
    }
}
