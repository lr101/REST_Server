const MAX_TEMP_DISPLAYED = 250;


module.exports = {
    formatForGraph: function (object, timezone) {
        let value = [];
        let date = [];
        if (object.length > 0) {

            object.forEach(function (o) {
                value.push(o.value);
                let d = new Date(o.date);
                d.setMinutes(d.getMinutes() + timezone);
                date.push(d);
            });
        }
        return {values: value, dates: date};

    }
}
