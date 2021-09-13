const ajax = new XMLHttpRequest();

ajax.onreadystatechange = function() {
    if (ajax.readyState === 4) {
        let data = JSON.parse(ajax.responseText);
        document.getElementById("tempDisplay").innerHTML = "Temperatur - " + data.temp + "°C";
        document.getElementById("ft").innerHTML = "Temperatur gemessen um: "+ toTime(data.date) + " Uhr";
    }
};

/**
 * converts date parsed from server into formatted time
 * @param date
 * @returns {string}
 */
function toTime(date) {
    let dt = new Date(date);
    let ti = "";
    if (dt.getHours()< 10) ti = "0";
    ti +=  dt.getHours().toString() + ":";
    if (dt.getMinutes() < 10) ti = ti + "0";
    ti +=  dt.getMinutes().toString() + ":";
    if (dt.getSeconds() < 10) ti = ti + "0";
    ti +=  dt.getSeconds().toString();
    return ti;
}

function update() {
    ajax.open("GET", "/sensors/" + document.getElementById("tempDisplay").getAttribute("data-table") , true);
    ajax.send(null);
}

/**
 * on startup
 * get data from server
 */
$(function() {
    update();
    let t = setInterval(update,60000);
});

