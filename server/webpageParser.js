const MAX_TEMP_DISPLAYED = 250;


module.exports = {
    formatForGraph: function (object) {
        let value = [];
        let date = [];
        if (object.length > 0) {

            object.forEach(function (o) {
                value.push(o.value);
                date.push(o.date);
            });
            if (date.length > MAX_TEMP_DISPLAYED) {

                let d1 = new Date(date[0]);
                let d2 = new Date(date[date.length - 1]);
                let d3;
                let dates = [];
                let values = [];
                let tempValues = 0;
                let counter = 0;
                let dif = (d2.getTime() - d1.getTime()) / 1000 / MAX_TEMP_DISPLAYED;
                d1.setSeconds(d1.getSeconds() + dif);
                for (let i = 0; i < date.length - 1; i++) {

                    d2 = new Date(date[i]);
                    if (d1.getTime() > d2.getTime()) {
                        d3 = new Date(date[i + 1]);
                        tempValues = tempValues + parseFloat(value[i]);
                        counter++;
                        if (d1.getTime() <= d3.getTime()) {
                            d1.setSeconds(d1.getSeconds() + dif);
                            dates.push(d2);
                            values.push((parseFloat(tempValues.toString()) / parseFloat(counter.toString())).toFixed(2));
                            counter = 0;
                            tempValues = 0;
                        }
                        if (i + 2 === date.length) {
                            dates.push(d3);
                            values.push((parseFloat(tempValues.toString()) / parseFloat(counter.toString())).toFixed(2));
                        }
                    } else {
                        d1.setSeconds(d1.getSeconds() + dif);
                    }
                }
                value = values;
                date = dates;
            }

        }
        return {values: value, dates: date};

    }
}
