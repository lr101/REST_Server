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
                    document.getElementById("config_name").innerHTML = values.sensorNick;
                    document.getElementById("nickname").value = values.sensorNick;
                    document.getElementById("id").value = values.sensorID;
                    let nodes = document.getElementById("selectType").children;
                    for (let i = 0; i < nodes.length; i++) {
                        let value = nodes[i].getAttribute("value");
                        if (value && value.toString() === values.sensorTypeID.toString()) {
                            document.getElementById("selectType").selectedIndex = i.toString();
                        }
                    }
                }
            }
        };
        console.log(id);
        checkActive(id);
    }
}

function updateSensorTypes() {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "/sensors/types/", true);
    ajax.send(null);
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4) {
            let values = JSON.parse(ajax.responseText);
            let select = document.getElementById("selectType");
            for(let i = 0; i < values.length; i++) {
                let node = document.createElement("option");
                node.setAttribute("value", values[i].sensorTypeID);
                node.innerHTML = values[i].sensorType;
                select.appendChild(node);
            }
        }
    };
}

function editButton(input_id) {
    let input = document.getElementById(input_id);
    input.disabled =  !input.disabled;
}

function submitData() {
    const sensorID = document.getElementById("id").value;
    const sensorType = document.getElementById("selectType").selectedIndex;
    const sensorNick = document.getElementById("nickname").value;
    if (sensorNick.length > 0 && sensorNick.length < 17 && sensorType !== "" && sensorID !== "") {
        const ajax = new XMLHttpRequest();
        ajax.open("PUT", "/sensors/id/" + sensorID, true);
        ajax.setRequestHeader("Content-Type", "application/json");
        let json = {sensorID : sensorID, sensorType :sensorType, sensorNick: sensorNick}
        ajax.send(JSON.stringify(json));
        ajax.onreadystatechange = function() {
            if (ajax.readyState === 4) {
                alert(ajax.responseText);
                if(ajax.status === 200) {
                    document.getElementById("list_" +sensorID).innerHTML = sensorNick;
                    document.getElementById("dropdown_" + sensorID).value = sensorNick;
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

updateSensorTypes();

document.getElementById("submit").addEventListener("click", function () {
    submitData();
})