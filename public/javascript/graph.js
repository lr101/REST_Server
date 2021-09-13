/**
 * Slider setup
 * @type {HTMLElement}
 */
let slider = document.getElementById("myRange");
let output = document.getElementById("hours");

output.innerHTML = "Temperaturen der letzten " + slider.value + " Stunde(n)";

slider.oninput = function () {
    output.innerHTML = "Temperaturen der letzten " + this.value + " Stunde(n)";
}
//EventListener slider
slider.addEventListener('mouseup', function () {
    update(this.value);
})

/**
 * button setup
 */

document.getElementById("b1hours").addEventListener('click', function () {
   update(1);
});

document.getElementById("b12hours").addEventListener('click', function () {
    update(12);
});

document.getElementById("b24hours").addEventListener('click', function () {
    update(24);
});

document.getElementById("b2days").addEventListener('click', function () {
    update(48);
});

document.getElementById("b7days").addEventListener('click', function () {
    update(168);
});

document.getElementById("b14days").addEventListener('click', function () {
    update(336);
});


/**
 * chart setup
 */
let chart;

function chartIt(temp, time) {
    let ctx = document.getElementById('myChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                label: 'Temperaturen in °C im angegeben Zeitraum',
                data: temp,
                pointRadius: 1,
                borderWidth: 1,
                lineWidth: 2,
                borderColor: 'rgba(240, 40, 40, 1)',
                fill: false
            }]
        },
        options: {
            responsive: false,
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
                        displayFormats: {
                            'millisecond': 'HH:mm',
                            'second': 'HH:mm',
                            'minute': 'HH:mm',
                            'hour': 'HH:mm',
                            'day': 'HH:mm',
                            'week': 'HH:mm',
                            'month': 'HH:mm',
                            'quarter': 'HH:mm',
                            'year': 'HH:mm',
                        }
                    },

                }]
            }
        }
    });
    chart.resize();
}

/**
 * refactor data
 * @param myObj
 */
function useData(myObj) {
    let temp = [];
    let time = [];
    if (myObj.length > 0) {

        myObj.forEach(function(o){
            temp.push(o.temp);
            time.push(o.date);
        });

        const MAX_TEMP_DISPLAYED = 250;

        if (time.length > MAX_TEMP_DISPLAYED) {

            let d1 = new Date(time[0]);
            let d2 = new Date(time[time.length - 1]);
            let d3;
            let dates = [];
            let temps = [];
            let tempper = 0;
            let counter = 0;
            let dif = (d2.getTime() - d1.getTime()) / 1000 / MAX_TEMP_DISPLAYED;
            d1.setSeconds(d1.getSeconds() + dif);
            for (let i = 0; i < time.length - 1; i++) {

                d2 = new Date(time[i]);
                if (d1.getTime() > d2.getTime()) {
                    d3 = new Date(time[i + 1]);
                    tempper = tempper + parseFloat(temp[i]);
                    counter++;
                    if (d1.getTime() <= d3.getTime()) {
                        d1.setSeconds(d1.getSeconds() + dif);
                        dates.push(d2);
                        temps.push((parseFloat(tempper) / parseFloat(counter)).toFixed(2));
                        counter = 0;
                        tempper = 0;
                    }
                    if (i + 2 === time.length) {
                        dates.push(d3);
                        temps.push((parseFloat(tempper) / parseFloat(counter)).toFixed(2));
                    }
                } else {
                    d1.setSeconds(d1.getSeconds() + dif);
                }
            }
            temp = temps;
            time = dates;
        }
        chart.destroy();
        chartIt(temp, time);
    }

}

/**
 * ajax request chart data
 * @returns {string}
 */

const ajax = new XMLHttpRequest();



function getData(interval, callback) {
    let nameTB = document.getElementById("myChart").getAttribute("data-table");
    if (nameTB !== "" && nameTB !== undefined) {

        ajax.onreadystatechange = function () {
            if (this.readyState === 4) {
                let myObj = JSON.parse(this.responseText);
                callback(myObj);
            }
        };
        ajax.open("GET", "/sensors/" + nameTB + "?i=" + interval, true);
        ajax.send();
    }
}


function update(h) {
    let tage;
    if (h >= 48) {
        tage = h / 24;
        output.innerHTML = "Temperaturen der letzten " + tage + " Tage";
        slider.value = 48;
    } else {
        output.innerHTML = "Temperaturen der letzten " + h + " Stunde(n)";
        slider.value = h;
    }
    chart.destroy();
    chartIt([],[]);
    getData(h, useData);
}


/**
 * on startup
 */
$(function() {
    chartIt([],[]);
    getData(1, useData);
});




