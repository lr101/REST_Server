let chart;


const id = document.getElementById("title").getAttribute("data-id");

function chartIt(values, dates) {
    let ctx = document.getElementById('myChart').getContext('2d');


    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dates,
            datasets: [{
                label: 'Values in ' + document.getElementById("current").getAttribute("data-unit") + ' in the given time interval',
                data: values,
                pointRadius: 1,
                borderWidth: 1,
                lineWidth: 2,
                borderColor: 'rgba(240, 40, 40, 1)',
                fill: false
            }]
        },
        options: {
            transition: {
                duration: 1000,
                easing: 'easeInOutElastic'
            },
            responsive: true,
            resizeDelay: 100,
            maintainAspectRatio: false,
            scales: {
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Temperatur in °C'
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.5)'
                    },
                    ticks: {
                        fontColor: "black",
                        autoSkip: true,
                    }
                }],
                xAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: 'Uhrzeit in Stunden und Minuten'
                    },
                    gridLines: {
                        color: 'rgba(0, 0, 0, 0.5)'
                    },
                    ticks: {
                        fontColor: "black",
                        maxTicksLimit: 20
                    },

                    type: 'time',
                    time: {
                        tooltipFormat: 'HH:mm'
                    },

                }]
            }
        }
    });
    chart.resize();
}

function getDataGraph(offset, date1, date2) {
    if (offset  === undefined) offset = 60;
    if (date1 === undefined)  date1 = getCurrentDate(0);
    if (date2 === undefined)  date2 = getCurrentDate(offset);
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "/display/graph?sensorID=" + id + "&date1=" + date1 + "&date2=" + date2, true);
    ajax.send(null);
    ajax.onreadystatechange = function () {
        if (ajax.readyState === 4) {
            let values = JSON.parse(ajax.responseText);
            let dates = values.dates;
            chart.data.datasets[0].data = values.values;
            chart.data.labels = dates;
            chart.update();
        }
    };
}

function getCurrentDate(offset) {
    let date = new Date(new Date().getTime() + 2 * 3600 * 1000);
    date.setMinutes(date.getMinutes() - offset);
    return date.toISOString().slice(0, 19).replace('T', ' ');
}


function getDataCurrent() {
    const ajax = new XMLHttpRequest();
    ajax.open("GET", "/sensors/" + id + "?date2=" + getCurrentDate(10) , true);
    ajax.send(null);
    ajax.onreadystatechange = function() {
        if (ajax.readyState === 4) {
            let list = JSON.parse(ajax.responseText);
            if (list.length === 0) {
                document.getElementById("current").innerHTML = "No Data available";
            } else {
                let unit = document.getElementById("current").getAttribute("data-unit");
                document.getElementById("current").innerHTML = "Current Value: " + list[list.length - 1].value + unit;
            }
        }
    };
}

$(function () {
    chartIt([], []);
    getDataCurrent();
    getDataGraph();
    setInterval(getDataCurrent, 20000);
});