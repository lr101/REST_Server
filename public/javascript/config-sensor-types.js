/**
 * logic
 */

function select(sensorType, sensorTypeID) {
    const editElement = document.getElementById("typeName");
    editElement.value = sensorType;
    editElement.setAttribute("data-id", sensorTypeID);
}

function editButton(input_id) {
    let input = document.getElementById(input_id);
    input.disabled =  !input.disabled;
}

function submitData() {
    const sensorType = document.getElementById("typeName").value;
    const sensorTypeID = document.getElementById("typeName").getAttribute("data-id");
    const ajax = new XMLHttpRequest();

    let json;
    if (sensorType.length > 0 && sensorType.length < 17 && sensorTypeID !== "" ) {
        ajax.open("PUT", "/sensors/types/", true);
        json = {sensorType : sensorType, sensorTypeID :sensorTypeID}
    } else if (sensorType.length > 0 && sensorType.length < 17 && sensorTypeID === "") {
        ajax.open("POST", "/sensors/types/", true);
        json = {sensorType : sensorType}
    }
    if (json !== undefined) {
        ajax.setRequestHeader("Content-Type", "application/json");
        ajax.send(JSON.stringify(json));
        ajax.onreadystatechange = function () {
            if (ajax.readyState === 4) {
                if (ajax.status === 200) {
                    updateTypes();
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
                    btn.setAttribute("onclick", (i === data.length ? "select('','')" : "select('" + data[i].sensorType + "','" + data[i].sensorTypeID + "')"));
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
    const sensorTypeID = document.getElementById("typeName").getAttribute("data-id");
    const ajax = new XMLHttpRequest();
    ajax.open("DELETE", "/sensors/types/" + sensorTypeID, true);
    ajax.send();
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4) {
            if (ajax.status === 201) {
                updateTypes();
            }else {
                alert(ajax.responseText);
            }
        }
    }
});