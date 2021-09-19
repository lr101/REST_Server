/**
 * Dropdown menu
 */

$(document).ready(function() {
    $(".dropdown-toggle").dropdown();
});

//context menu for orders table
$(document).on("contextmenu", "body", function (event) {

    $('#menu').dropdown('toggle')

    //showing it close to our cursor
    $('#menu').dropdown('toggle').css({
        top: (event.pageY) + "px",
        left: (event.pageX) + "px"
    });
});
$(document).mousedown(function (e) {
    var container = $("#menu");

    if (!container.is(e.target) && container.has(e.target).length === 0 && container.parent().hasClass('open')) {
        container.dropdown('toggle')
        container.parent().removeClass('open');
    }
});

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
                    nodes = document.getElementById("list").children;
                    for (let i = 0; i < nodes.length; i++) {
                        nodes[i].classList.remove("active");
                        if (nodes[i].getAttribute("data-id").toString() === id.toString()) {
                            nodes[i].classList.add("active");
                        }
                    }
                }
            }
        };
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
    if (sensorNick.length > 0 && sensorNick.length < 17 && sensorType !== "") {
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
                    document.getElementById("sensor_" + sensorID).innerHTML = sensorNick;
                }
            }
        };
    }

}

updateSensorTypes();

document.getElementById("submit").addEventListener("click", function () {
    submitData();
})