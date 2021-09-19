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