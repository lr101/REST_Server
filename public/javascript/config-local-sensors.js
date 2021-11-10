/**
 * logic
 */

function dropdown(id) {
    if (id) {
        const ajax = new XMLHttpRequest();
        ajax.open("GET", "/sensors/id/" + id, true);
        ajax.send(null);
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                let values = JSON.parse(ajax.responseText)[0];
                if (values) {
                    document.getElementById("config_name").innerHTML = values.sensor_nick;
                    document.getElementById("nickname").value = values.sensor_nick;
                    document.getElementById("id").value = values.sensor_id;
                    let nodes = document.getElementById("selectType").children;
                    for (let i = 0; i < nodes.length; i++) {
                        let value = nodes[i].getAttribute("value");
                        if (value && value.toString() === values.sensor_type_id.toString()) {
                            document.getElementById("selectType").selectedIndex = i.toString();
                        }
                    }
                }
            }
        };
        checkActive(id);
    }
}

function updatesensor_types() {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "/sensors/types/", true);
    ajax.send(null);
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4) {
            let values = JSON.parse(ajax.responseText);
            let select = document.getElementById("selectType");
            for(let i = 0; i < values.length; i++) {
                let node = document.createElement("option");
                node.setAttribute("value", values[i].sensor_type_id);
                node.innerHTML = values[i].sensor_type;
                select.appendChild(node);
            }
        }
    };
}

function submitData() {
    const sensor_id = document.getElementById("id").value;
    const select = document.getElementById("selectType");
    const sensor_type_id = select.options[select.selectedIndex].value;
    const sensor_nick = document.getElementById("nickname").value;
    if (sensor_nick.length > 0 && sensor_nick.length < 17 && sensor_type_id !== "" && sensor_id !== "") {
        const ajax = new XMLHttpRequest();
        ajax.open("PUT", "/sensors/id/" + sensor_id, true);
        const username = document.getElementById("username_sub").value;
        const password = document.getElementById("password_sub").value;
        ajax.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
        ajax.setRequestHeader("Content-Type", "application/json");
        let json = {sensor_id : sensor_id, sensor_type_id :sensor_type_id, sensor_nick: sensor_nick}
        ajax.send(JSON.stringify(json));
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4) {
                if(ajax.status === 200) {
                    document.getElementById("list_" +sensor_id).innerHTML = sensor_nick;
                    document.getElementById("dropdown_" + sensor_id).value = sensor_nick;

                } else {
                    alert(ajax.responseText);
                }
            }
        };
    }
}

function checkActive(id) {
    let date = new Date(new Date().getTime() + 2 * 3600 * 1000);
    date.setMinutes(date.getMinutes() - 2);
    date = date.toISOString().slice(0, 19).replace('T', ' ');
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "/sensors/" + id + "?date2=" + date , true);
    ajax.send(null);
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4) {
            document.getElementById("active_content").style.color = "white";
            if(JSON.parse(ajax.responseText).length > 0) {
                document.getElementById("active").innerHTML = "ACTIVE";
                document.getElementById("active_content").style.backgroundColor = "#35fb74";
            } else {
                document.getElementById("active").innerHTML = "INACTIVE";
                document.getElementById("active_content").style.backgroundColor = "rgba(223,26,56,1)";

            }
        }
    };
}

updatesensor_types();

document.getElementById("submit_login").addEventListener("click", function () {
    submitData();
});

document.getElementById("delete_login2").addEventListener("click", function () {
    const id = document.getElementById("id").value;
    if (id !== "") {
        const ajax = new XMLHttpRequest();
        ajax.open("DELETE", "/sensors/id/" + id, true);
        const username = document.getElementById("username_del1").value;
        const password = document.getElementById("password_del1").value;
        ajax.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
        ajax.send(null);
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 201) {
                    document.getElementById("list").removeChild(document.getElementById("list_" + id));
                    document.getElementById("dropdown").removeChild(document.getElementById("dropdown_" + id));
                } else {
                    alert(ajax.responseText);
                }
            }
        }
    }
});

window.addEventListener('load', () => {
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let currentDate = now.toISOString().substring(0,10);
    let currentTime = now.toISOString().substring(11,16);
    document.getElementById('date1_date').value = currentDate;
    document.getElementById("date1_time").value = currentTime;
});

function getTime(elementID) {
    let date = new Date(document.getElementById(elementID + "_date").valueAsDate);
    let time  = document.getElementById( elementID+ "_time").value;
    date.setMinutes(time.split(':')[1]);
    date.setHours(time.split(':')[0]);
    return date;
}

function alterTempData (method) {
    const id = document.getElementById("id").value;
    if (id !== "") {
        let date1 = getTime("date1");
        let date2 = getTime("date2");
        date1.setMinutes(date1.getMinutes() - date1.getTimezoneOffset());
        date2.setMinutes(date2.getMinutes() - date2.getTimezoneOffset());
        if (date1 > date2) {
            const ajax = new XMLHttpRequest();
            ajax.open(method, "/sensors/" + id + "?date1=" + date1.toISOString().slice(0, 19).replace('T', ' ') + "&date2=" + date2.toISOString().slice(0, 19).replace('T', ' '), true);
            if (method === "DELETE") {
                const username = document.getElementById("username_del1").value;
                const password = document.getElementById("password_del1").value;
                ajax.setRequestHeader ("Authorization", "Basic " + btoa(username + ":" + password));
            }
            ajax.send(null);
            ajax.onreadystatechange = function () {
                if (ajax.readyState === 4 && ajax.status === 200 && method === "GET") {
                    let items = JSON.parse(ajax.responseText);
                    exportCSVFile(Object.keys(items), items, "export_" + id);
                }
            };
        }
    } else {
        alert("Select Sensor first!")
    }
}


document.getElementById("getTempData").addEventListener("click", function () {
    alterTempData("GET");
});

document.getElementById("delete_login1").addEventListener("click", function () {
    if (confirm("Are you sure to delete?")) {
        alterTempData("DELETE");
    }
});

function convertToCSV(array) {
    let str = '';

    for (let i = 0; i < array.length; i++) {
        let line = '';
        for (let index in array[i]) {
            if (line !== '') line += ','
            line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

function exportCSVFile(headers, jsonObject, fileTitle) {
    if (jsonObject.length !== 0) {
        let csv = this.convertToCSV(jsonObject);

        let exportedFilename = fileTitle + '.csv' || 'export.csv';

        let blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, exportedFilename);
        } else {
            let link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", exportedFilename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    } else {
        alert("No Data available");
    }
}


