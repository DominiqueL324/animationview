//baseUrl = "http://127.0.0.1:8000";
baseUrl = "http://195.15.218.172:8086";
baseLocalUrl = "http://127.0.0.1/animation/administration/";
//baseLocalUrl = "http://195.15.218.172/animation/administration/"

function getMyInfo() {
    $.ajax({
        type: 'GET',
        headers: {
            "Authorization": $.cookie('entete')
        },
        url: baseUrl + "/viewset/administre/" + $.cookie('idUser'),
        success: function(response) {
            response.forEach(element => {
                $('#username').text(element['nom'] + " " + element['prenom'])
            });
        },
        error: function(response) {
            if (response.status == 401 || response.status == 400) {
                window.location.replace(baseLocalUrl);
            }
        }
    })
}

$('#go2').on('click', function() {
    $("#waiter").css('display', 'inline')

    $.ajax({
        type: 'PUT',
        dataType: 'json',
        headers: {
            "Authorization": $.cookie('entete')
        },
        url: baseUrl + "/viewset/rdv/" + $.cookie("rdvId"),
        data: {
            date_d: $('#date').val(),
            date_f: $('#date').val(),
            heure_d: $('#heure_r').val(),
            heure_f: $('#heure_f').val(),
            evenement: $('#idVal').val(),
        },
        success: function(response) {
            alert('Rendez-vous modifié avec succes \nvous recevrez un mail avec plus de détails')
            $.removeCookie('token', { path: '/' });
            window.location.replace(baseLocalUrl + "dashboard.html")
        },
        error: function(response) {
            if (response.status == 401 || response.status == 400) {
                window.location.replace(baseLocalUrl);
            }
        }
    })
})

function getRdv() {
    $.ajax({
        type: 'GET',
        headers: {
            "Authorization": $.cookie('entete')
        },
        url: baseUrl + "/viewset/rdv/" + $.cookie("rdvId"),
        success: function(response) {
            $('#tbody').empty()
            response.forEach(element => {
                $('#date').val(element['date_d'])
                $('#date_d').val(element['date_d'])
                $('#date_f').val(element['date_f'])
                $('#heure_r').val(element['heure_d'])
                $('#heure_f').val(element['heure_f'])
                $('#evt').text($.cookie("evt"))
                $('#idVal').val(element['evenement'])

            })

        },
        error: function(response) {
            if (response.status == 401 || response.status == 400) {
                window.location.replace(baseLocalUrl);
            }
        }
    })
}