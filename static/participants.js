$.ajax({
    type: "GET",
    url: "/api/participant",
    contentType: "application/json; charset=utf-8",
    datatype: "json",
    success: function(response) {

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

        response.forEach(function(val) {
            let name = val.firstName + " " + val.lastName;
            $main = $('<p class="button-blue">');
            $sub = $('<p class="button-blue">');
            $main.attr('data-id', val.id);
            $main.attr('data-name', name);
            $main.text(name);

            $sub.attr('data-id', val.id);
            $sub.text(name);
            $sub.addClass('hidden');

            $main.click(function() {
                if(document.getElementById("antal")) {
                    if(document.getElementById("antal").valueAsNumber > $("#chosencontainer > p:not(.hidden)").length) {
                        $(this).toggleClass('hidden');
                        $(`#chosencontainer > p[data-id=${val.id}]`).toggleClass('hidden');
                    } else {
                        $("#messagebox > p").text("Du kan inte lägga fler personer än volym.")
                        $("#messagebox").toggleClass("hidden");
                        $("#overlay").toggleClass("overlay");
                    }
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


        let tags = $('p[data-name');
        $('#search').bind('input', function() {
            let val = $.trim(this.value.toLowerCase()); // Det här det man skriver in när man söker.
            tags.addClass('hidden');

            tags.filter(function() {
                return $(this).data('name').toLowerCase().match(val) !== null;
            }).removeClass('hidden');
        });

        $('#deletebutton').click(function() {
            $('#search').val("");
            tags.removeClass('hidden');
        });
    },
    error: function (error) {
        console.log(error);
    }
});


function showOrHideParticipants(checkbox) {
    if(checkbox.checked) {
        $("#personer").removeClass("blur")
    } else {
        $("#personer").addClass("blur")
    }
}
