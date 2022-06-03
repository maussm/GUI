let label = $('.switch');
let input = $('.switch input');

label.addClass("disabled");
input.prop("disabled", true)

// Funktion för att förhindra användare att kunna välja personer om de anger något annat än en siffra som antal.
function a(obj) {
    let value = obj.valueAsNumber;
    if(!isNaN(value)) {
        label.removeClass("disabled");
        input.prop("disabled", false)
    } else {
        if(input.prop("checked") === true) {
            input.click();
        }
        label.addClass("disabled");
        input.prop("disabled", true)
    }
}
