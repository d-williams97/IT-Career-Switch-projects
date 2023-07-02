$(document).ready(function () {
    $('#postcodebtn').click(function() {

        console.log ($('#postcodeText').val());
        console.log ($('#selCountry').val());
        $.ajax({
            url: "libs/php/getPostCode.php",
            type:'POST',
            dataType:'json',
            data: {
                country: $('#selCountry').val(),
                postcode: $('#postcodeText').val(),
            },
            success: function(data) {
                console.log('success');
            },
            error: function(data) {
                console.log(data);
            }
        })
        



        
    });
















});
