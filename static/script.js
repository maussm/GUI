// Skapar en datumväljare.
$(function() {
    $( "#datepicker" ).datepicker({
        showOn: "button",
        buttonImage: "/static/noto_spiral-calendar.svg",
        buttonImageOnly: true,
        buttonText: "Select date",
        dateFormat: "yy-mm-dd"
    });
});
