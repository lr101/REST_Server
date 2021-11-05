/**
 * logic
 */

function select(sensor_type, sensor_type_id, unit, repetitions, sleep_time) {
    const editElement = document.getElementById("typeName");
    editElement.value = sensor_type;
    editElement.setAttribute("data-id", sensor_type_id);
    document.getElementById("typeUnit").value = unit;
    document.getElementById("repetitions").value = repetitions;
    document.getElementById("sleep_time").value = sleep_time;
}

function editButton(input_id) {
    let input = document.getElementById(input_id);
    input.disabled =  !input.disabled;
}

function submitData() {
    const sensor_type = document.getElementById("typeName").value;
    const sensor_type_id = document.getElementById("typeName").getAttribute("data-id");
    const unit = document.getElementById("typeUnit").value;
    const repetitions = document.getElementById("repetitions").value;
    const sleep_time = document.getElementById("sleep_time").value;
    const ajax = new XMLHttpRequest();

    let json;
    if (sensor_type_id !== "" ) {
        ajax.open("PUT", "/sensors/types/", true);
        json = {sensor_type : sensor_type, sensor_type_id :sensor_type_id, unit: unit, repetitions: repetitions, sleep_time : sleep_time}
    } else if (sensor_type_id === "") {
        ajax.open("POST", "/sensors/types/", true);
        json = {sensor_type : sensor_type, unit : unit, repetitions: repetitions, sleep_time : sleep_time}
    }
    if (json !== undefined && !isNaN(repetitions)  && !isNaN(sleep_time) && unit.length > 0 && unit.length < 6 && sensor_type.length > 0 && sensor_type.length < 17) {
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(json));
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    updateTypes();
                    document.getElementById("typeName").disabled = true;
                    document.getElementById("typeUnit").disabled = true;
                    document.getElementById("repetitions").disabled = true;
                    document.getElementById("sleep_time").disabled = true;
                    document.getElementById("typeUnit").value = "";
                    document.getElementById("repetitions").value = "";
                    document.getElementById("sleep_time").value = "";
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
                    btn.id = "list_" + (i === data.length ? "new" : data[i].sensor_type_id);
                    btn.setAttribute("type", "button");
                    btn.setAttribute("data-toggle", "list");
                    btn.setAttribute("onclick", (i === data.length ? "select('','','','','')" : "select('" + data[i].sensor_type + "','" + data[i].sensor_type_id + "','" + data[i].unit +"','" +
                        data[i].repetitions +  "','" + data[i].sleep_time
                        +"')"));
                    btn.innerHTML = (i === data.length ? "+" : data[i].sensor_type);
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
        const sensor_type_id = document.getElementById("typeName").getAttribute("data-id");
        const ajax = new XMLHttpRequest();
        ajax.open("DELETE", "/sensors/types/" + sensor_type_id, true);
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