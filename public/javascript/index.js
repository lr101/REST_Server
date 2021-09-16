function getData() {

    const length = document.getElementById("main").getAttribute("data-length") - 1;
    let date = new Date();

    //document.getElementById("time").innerHTML = "Letzte Aktualisierung um: " + date.getHours() + ":" + date.getMinutes();
    date = new Date(new Date().getTime() + 2 * 3600 * 1000);
    date.setMinutes(date.getMinutes() - 10);
    date = date.toISOString().slice(0, 19).replace('T', ' ');

    for (let i = 0; i < length; i++) {
        let id = document.getElementById("sensor_" + i).getAttribute("data-id");
        console.log(id);
        const ajax = new XMLHttpRequest();
        ajax.open("GET", "/sensors/" + id + "?date2=" + date , true);
        ajax.send(null);
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4) {
                let list = JSON.parse(ajax.responseText);
                if (list.length === 0) {
                    document.getElementById("value_" + i).innerHTML = "No Data available";
                } else {
                    document.getElementById("value_" + i).innerHTML = "Current: " + list[list.length - 1].value + "°C";
                }
            }
        };
    }

}

//document.getElementById("b_reload").addEventListener("click", function () {getData()});

/**
 * on startup
 */
$(function() {
    getData();
});