const ajax = new XMLHttpRequest();


ajax.onreadystatechange = function() {
    if (ajax.readyState === 4 && ajax.status === 200) {
        let data = JSON.parse(ajax.responseText);
        deleteTable();
        if (data.SensorObject !== undefined) {
            fillTable(data.SensorObject);
        }
        setListeners(".r1");
        setListeners(".r2");
        setListeners(".r3");
    }
};


function fillTable(data) {
    const table = document.getElementById("table");
    for (let i = 0; i < data.length; i++) {
        let tempObject = data[i];
        let tr = document.createElement("TR");
        tr.id = "collumn_" + tempObject.nameTB;
        tr.setAttribute("class", "column")
        for (let three = 0; three < 3; three++) {
            let td = document.createElement("TD");
            td.setAttribute("type", "button");
            switch (three) {
                case 0: td.innerText = tempObject.nameTB;
                        td.id = "r1_" + tempObject.nameTB;
                        td.setAttribute("class", "r1");
                        break;
                case 1: td.innerText = tempObject.namePlace;
                        td.id = "r2_" + tempObject.nameTB;
                        td.setAttribute("class", "r2");
                        break;
                case 2 :td.innerText = tempObject.nameSensor;
                        td.id = "r3_" + tempObject.nameTB;
                        td.setAttribute("class", "r3");
                        break;
            }
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}

function deleteTable() {
    let columns = document.querySelectorAll(".column");
    columns.forEach(function (item) {
        item.remove();
    });
}

function setListeners(classSelector) {
    let sensorPlaceDOM = document.querySelectorAll(classSelector);
    for (let i = 0; i < sensorPlaceDOM.length; i++) {
        const element = sensorPlaceDOM[i];
        element.addEventListener("click", function() {editPLace(element.id)});
    }
}

function editPLace(id) {
    const namePlace = document.getElementById(id).innerText;

    if (id.substring(0,2) === "r1") {
        let alert  = prompt("Schreibe 'YES' wenn die Tabelle wirklich gelöscht werden soll!");
        if (alert !== undefined && alert !== "" && alert !== null && alert === "YES") {
            ajaxRequest("DELETE", "sensors/id/" + id.substring(3), false, null);
        }
    } else if (id.substring(0, 2) === "r2"){
        let newPlace = prompt("Neuer Ort name");
        if (newPlace !== undefined && newPlace !== "" &&    newPlace !== null &&  newPlace !== namePlace){
            ajaxRequest("POST", "sensors/id/" + id.substring(3) + "/namePlace/", true, "namePlace=" + newPlace);
        }
    } else if (id.substring(0, 2) === "r3") {
        let newPlace = prompt("Neue SensorID");
        if (newPlace !== undefined && newPlace !== "" && newPlace !== null &&  newPlace !== namePlace ) {
            ajaxRequest("POST", "sensors/id/" + id.substring(3) + "/nameSensor/", true, "nameSensor=" + newPlace);
        }
    } else if (id === "addTable") {
        if (document.getElementById("inputRow") === null) {
            addTable();
        } else {
            let nameSensor = document.getElementById("input2").value;
            let namePlace = document.getElementById("input1").value;
            let body = "namePlace=" + namePlace + "&nameSensor=" + nameSensor;
            if  (nameSensor !== "" && namePlace !== "")
                ajaxRequest("POST", "sensors/id", true, body);
            document.getElementById("addTable").innerHTML = "+";
            document.getElementById("inputRow").remove();
        }
    }
}

function addTable() {
    const table = document.getElementById("table");
    let tr = document.createElement("TR");
    let td1 = document.createElement("TD");
    td1.innerText = "AUTOMATIC ID";
    tr.appendChild(td1);
    tr.id = "inputRow";
    for(let i = 1; i < 3; i++) {
        let td = document.createElement("TD");
        let input = document.createElement("input");
        td.id = "newRow" + i;
        input.id = "input" + i;
        input.setAttribute("maxlength", "16");
        input.setAttribute("minlength", "1");
        td.appendChild( input);
        tr.appendChild(td);
    }
    table.appendChild(tr);
    document.getElementById("addTable").innerHTML = "Submit";
}

function ajaxRequest(method, url, header, body) {
    ajax.open(method, url, true);
    if (header) ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    ajax.send(body);
}


/**
 * on startup
 */
$(function() {
    setListeners(".r2");
    setListeners(".r3");
    setListeners(".r1");
    setListeners("#addTable")
});




