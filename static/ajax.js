function reg_hand() {
    let request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            alert("kaffe");
        }
    };

    request.open("GET", '/api/cost_center/1');
    let jsonData = {"name" : "Lokesh"};
    request.send( JSON.stringify( jsonData ) );
    request.send();
}