function postArrival() {
    let data = {
        "participant_id":      $("#UNO").val(),
        "cost_center_id":     $("[ccid]").attr("ccid"),
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
function postNewParticipant() {
    let data = {
    "unoCode"           : $("#UNO").val(),
    "firstName"         : $("#fname").val(),
    "lastName"          : $("#lname").val(),
    "birthDate"         : $("#birthyear").val(),
    "spokenLanguage"    : $("#language").val(),
    "country"           : $("#land").val(),
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
        success: function(response) {
            console.log(response);
        },
        error: function (error) {
            console.log(error);
        }
    });

}

// on success..
let response = [{
        'unocode': 1,
        'name': 'emile'
    },
    {
        'unocode': 2,
        'name': 'slobo'
    },
    {
        'unocode': 3,
        'name': 'nicole'
    },
    {
        'unocode': 4,
        'name': 'vincent'
    },
    {
        'unocode': 5,
        'name': 'jens'
    },
    {
        'unocode': 6,
        'name': 'anders'
    }
]

response.sort(function(a, b) {
    console.log(a.name);
    if (a.name > b.name) {
        return 1;
    } else if (a.name < b.name) {
        return -1;
    }
    return 0;
});

response.forEach(function(val) {
    $main = $('<p>');
    $sub = $('<p>');
    $main.attr('data-unocode', val.unocode);
    $main.attr('data-name', val.name);
    $main.text(val.name);

    $sub.attr('data-unocode', val.unocode);
    $sub.text(val.name);
    $sub.addClass('not-selected');


    $main.click(function() {
        $(this).toggleClass('clicked');
        $(`#chosencontainer > p[data-unocode=${val.unocode}]`).toggleClass('not-selected');
    });

    $sub.click(function() {
        $(this).toggleClass('not-selected');
        $(`#buttoncontainer > p[data-unocode=${val.unocode}]`).toggleClass('clicked');
    });

    $('#buttoncontainer').append($main);
    $('#chosencontainer').append($sub);
});


let tags = $('p[data-name');
$('#search').bind('input', function() {
    let val = $.trim(this.value.toLowerCase()); // Det här det man skriver in när man söker.
    tags.addClass('hidden');

    tags.filter(function() {
        return $(this).data('name').match(val) !== null;
    }).removeClass('hidden');
});

$('#deletebutton').click(function() {
    $('#search').val("");
    tags.removeClass('hidden');
});
