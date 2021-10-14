/**
 * logic
 */

function select(sensorType, sensorTypeID, unit, repetitions, brakeTime, sleepTime) {
    const editElement = document.getElementById("typeName");
    editElement.value = sensorType;
    editElement.setAttribute("data-id", sensorTypeID);
    document.getElementById("typeUnit").value = unit;
    document.getElementById("repetitions").value = repetitions;
    document.getElementById("brakeTime").value = brakeTime;
    document.getElementById("sleepTime").value = sleepTime;
}

function editButton(input_id) {
    let input = document.getElementById(input_id);
    input.disabled =  !input.disabled;
}

function submitData() {
    const sensorType = document.getElementById("typeName").value;
    const sensorTypeID = document.getElementById("typeName").getAttribute("data-id");
    const unit = document.getElementById("typeUnit").value;
    const repetitions = document.getElementById("repetitions").value;
    const brakeTime = document.getElementById("brakeTime").value;
    const sleepTime = document.getElementById("sleepTime").value;
    const ajax = new XMLHttpRequest();

    let json;
    if (sensorTypeID !== "" ) {
        ajax.open("PUT", "/sensors/types/", true);
        json = {sensorType : sensorType, sensorTypeID :sensorTypeID, unit: unit, repetitions: repetitions, brakeTime : brakeTime, sleepTime : sleepTime}
    } else if (sensorTypeID === "") {
        ajax.open("POST", "/sensors/types/", true);
        json = {sensorType : sensorType, unit : unit, repetitions: repetitions, brakeTime : brakeTime, sleepTime : sleepTime}
    }
    if (json !== undefined && isNaN(repetitions) && isNaN(brakeTime) && isNaN(sleepTime) && unit.length > 0 && unit.length < 6 && sensorType.length > 0 && sensorType.length < 17) {
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(json));
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    updateTypes();
                    document.getElementById("typeName").disabled = true;
                    document.getElementById("typeUnit").disabled = true;
                    document.getElementById("repetitions").disabled = true;
                    document.getElementById("brakeTime").disabled = true;
                    document.getElementById("sleepTime").disabled = true;
                    document.getElementById("typeUnit").value = "";
                    document.getElementById("repetitions").value = "";
                    document.getElementById("brakeTime").value = "";
                    document.getElementById("sleepTime").value = "";
                } else {
                    alert(ajax.responseText);
                }
            }
        };
    }
}

function updateTypes() {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "/sensors/types/", true);
    ajax.send();
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4) {
            if(ajax.status === 200) {
                const listElement = document.getElementById("list");
                listElement.textContent = '';
                const data = JSON.parse(ajax.responseText);
                for (let i = 0; i < data.length + 1; i++) {
                    let btn = document.createElement("button");
                    btn.classList.add('list-group-item','list-group-item-action');
                    if (i === data.length) btn.classList.add('active');
                    btn.id = "list_" + (i === data.length ? "new" : data[i].sensorTypeID);
                    btn.setAttribute("type", "button");
                    btn.setAttribute("data-toggle", "list");
                    btn.setAttribute("onclick", (i === data.length ? "select('','','','','','')" : "select('" + data[i].sensorType + "','" + data[i].sensorTypeID + "','" + data[i].unit +"','" +
                        data[i].repetitions + "','" + data[i].brakeTime + "','" + data[i].sleepTime
                        +"')"));
                    btn.innerHTML = (i === data.length ? "+" : data[i].sensorType);
                    listElement.appendChild(btn);
                }
                document.getElementById("typeName").value = "";
            } else {
                alert(ajax.responseText);
            }
        }
    };
}

document.getElementById("submit").addEventListener("click", function () {
    submitData();
});

document.getElementById("delete").addEventListener("click", function () {
    if (confirm("Are you sure to delete?")) {
        const sensorTypeID = document.getElementById("typeName").getAttribute("data-id");
        const ajax = new XMLHttpRequest();
        ajax.open("DELETE", "/sensors/types/" + sensorTypeID, true);
        ajax.send();
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 201) {
                    updateTypes();
                } else {
                    alert(ajax.responseText);
                }
            }
        }
    }
});