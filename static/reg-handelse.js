let label = $('.switch');
let input = $('.switch input');

label.addClass("disabled");
input.prop("disabled", true)


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
