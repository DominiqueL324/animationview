//baseUrl = "http://127.0.0.1:8000"
baseUrl = "http://195.15.218.172:8086";
//baseLocalUrl = "http://127.0.0.1/animation/administration/"
baseLocalUrl = "http://195.15.218.172/animation/administration/"
evt = []

function checkIfLogged() {
    if ($.cookie("token") == undefined || $.cookie("idUser") == undefined || $.cookie("entete") == undefined) {
        window.location.replace(baseLocalUrl);
    }
}

function onLoad() {

    $.ajax({
        type: 'GET',
        url: baseUrl + "/viewset/evenements",
        success: function(response) {
            response.forEach(element => {
                evt.push({
                    id: element['id'],
                    daysOfWeek: element['jours'],
                    title: element['intitule'] + " " + element['lieux'],
                    startRecur: element['date_d'],
                    endRecur: element['date_f'],
                    startTime: element['heure_r'],
                    endTime: element['heure_f'],
                })
            });
            console.log(evt)
            configCalHeure(evt)
        },
        error: function(response) {

        }
    })
}

function configCalHeure(evt) {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        headerToolbar: {
            left: 'prev,next',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        initialView: 'dayGridMonth',
        events: evt,
        locales: 'fr',
        eventClick: function(arg) {
            console.log(arg)
            agent = arg.event._def.publicId
            debut = arg.event._instance.range.start
            fin = arg.event._instance.range.end
            clearForm()
            $('#date_d').html(('0' + arg.event._def.recurringDef.typeData.startRecur.getDate()).slice(-2) + "/" + ('0' + (arg.event._def.recurringDef.typeData.startRecur.getMonth() + 1)).slice(-2) + "/" + arg.event._def.recurringDef.typeData.startRecur.getFullYear())
            $('#date').html(('0' + arg.event._instance.range.start.getDate()).slice(-2) + "/" + ('0' + (arg.event._instance.range.start.getMonth() + 1)).slice(-2) + "/" + arg.event._instance.range.start.getFullYear())
            $('#date_f').html(('0' + arg.event._def.recurringDef.typeData.endRecur.getDate()).slice(-2) + "/" + ('0' + (arg.event._def.recurringDef.typeData.endRecur.getMonth() + 1)).slice(-2) + "/" + arg.event._def.recurringDef.typeData.endRecur.getFullYear())
            $('#heure_r').html(('0' + arg.event._instance.range.start.getHours()).slice(-2) + ":" + ('0' + arg.event._instance.range.start.getMinutes()).slice(-2))
            $('#heure_f').html(('0' + arg.event._instance.range.end.getHours()).slice(-2) + ":" + ('0' + arg.event._instance.range.end.getMinutes()).slice(-2))
                //$('#date').val(arg.event._instance.range.start.getFullYear()+"-"+('0'+(arg.event._instance.range.start.getMonth()+1)).slice(-2)+"-"+('0'+arg.event._instance.range.start.getDate()).slice(-2))
                // $('#date_d').val(arg.event._def.recurringDef.typeData.startRecur.getFullYear() + "-" + ('0' + (arg.event._def.recurringDef.typeData.startRecur.getMonth() + 1)).slice(-2) + "-" + ('0' + arg.event._def.recurringDef.typeData.startRecur.getDate()).slice(-2))
                //$('#date_f').val(arg.event._def.recurringDef.typeData.endRecur.getFullYear() + "-" + ('0' + (arg.event._def.recurringDef.typeData.endRecur.getMonth() + 1)).slice(-2) + "-" + ('0' + arg.event._def.recurringDef.typeData.endRecur.getDate()).slice(-2))
                //$('#heure_r').val(('0' + arg.event._instance.range.start.getHours()).slice(-2) + ":" + ('0' + arg.event._instance.range.start.getMinutes()).slice(-2))
                //$('#heure_f').val(('0' + arg.event._instance.range.end.getHours()).slice(-2) + ":" + ('0' + arg.event._instance.range.end.getMinutes()).slice(-2))
            $('#evt').text(arg.event._def.title)
            $('#idVal').val(arg.event._def.publicId)
            $('#ModalCenter').modal('show')
        }
    });
    calendar.render();
}

$('#cancel').on('click', function() {
    clearForm()
    $('#ModalCenter').modal('hide')
})

$('#close').on('click', function() {
    clearForm()
    $('#ModalCenter').modal('hide')
})

function clearForm() {
    $('#nom').val("")
    $('#prenom').val("")
    $('#adresse').val("")
    $('#telephone').val("")
    $('#email').val("")
    $('#idVal').val("")
    $('#warning1').css('display', 'none')
    $('#warning2').css('display', 'none')
    $("#waiter").css('display', 'none')
}

$('#go').on('click', function() {
    sendRdv()
})

function sendRdv() {
    $("#waiter").css('display', 'inline')
    if ($('#nom').val() != "" && $('#prenom').val() != "" && $('#adresse').val() != "" && $('#telephone').val() != "" && $('#email').val() != "") {
        $('#warning1').css('display', 'none')
    } else {
        $('#warning1').css('display', 'inline')
        $("#waiter").css('display', 'none')
        return
    }

    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: baseUrl + "/viewset/rdv/",
        data: {
            nom: $('#nom').val(),
            prenom: $('#prenom').val(),
            adresse: $('#adresse').val(),
            telephone: $('#telephone').val(),
            email: $('#email').val(),
            date_d: $('#date').val(),
            date_f: $('#date').val(),
            heure_d: $('#heure_r').val(),
            heure_f: $('#heure_f').val(),
            evenement: $('#idVal').val(),
            responsable: 1

        },
        success: function(response) {
            clearForm()
            $('#ModalCenter').modal('hide')
            alert('Rendez-vous enregistré avec succes \nvous recevrez un mail avec plus de détails')
        },
        error: function(response) {
            if (response.status == 401 || response.status == 400) {
                window.location.replace(baseLocalUrl);
            }
        }
    })

}

$("#telephone").on('change', function() {
    min = $("#telephone").val()
    min = min.toString()
    if ((min.length < 10 || min.length > 10) || min.charAt(0) != "0") {
        $("#erreurPhone").css('display', 'inline')
        $("#go").css('display', 'none')

    } else {
        $("#erreurPhone").css('display', 'none')
        $("#go").css('display', 'inline')
    }
})

$("#telephone").keyup(function() {
    min = $("#telephone").val()
    min = min.toString()
    if ((min.length < 10 || min.length > 10) || min.charAt(0) != "0") {
        $("#erreurPhone").css('display', 'inline')
        $("#go").css('display', 'none')
    } else {
        $("#erreurPhone").css('display', 'none')
        $("#go").css('display', 'inline')
    }
})

function getAllMyRdv() {
    checkIfLogged()
    $.ajax({
        type: 'GET',
        headers: {
            "Authorization": $.cookie('entete')
        },
        url: baseUrl + "/viewset/administre/" + $.cookie('idUser'),
        success: function(response) {
            $('#tbody').empty()
            response.forEach(element => {
                element['rdv'].forEach(elt => {
                    dates = new Date(elt['date_d'])
                    datef = new Date(elt['date_f'])

                    $('#tbody').append("\
                    <tr>\
                    <td>" + ("0" + dates.getDate()).slice(-2) + "/" + ("0" + (dates.getMonth() + 1)).slice(-2) + "/" + dates.getFullYear() + "</td>\
                    <td>" + ("0" + datef.getDate()).slice(-2) + "/" + ("0" + (datef.getMonth() + 1)).slice(-2) + "/" + datef.getFullYear() + "</td>\
                    <td>" + elt['heure_d'] + "</td>\
                    <td>" + elt['heure_f'] + "</td>\
                    <td>" + elt['evenement'] + "</td>\
                    <td>\
                    <a href='#' onclick='goToRdv(" + elt['id'] + ",\"" + elt['evenement'] + "\")' class='nav-link'>\
                        <i class='nav-icon fas fa-ellipsis-h'></i>\
                    </a>\
                  </td>\
                    </tr>")
                })
            });
            $(".buttons-copy").html("<span>copier</span>");
            $(".buttons-print").html("<span>imprimer</span>")
            $(".buttons-collection").html("<span></span>")
        },
        error: function(response) {
            if (response.status == 401 || response.status == 400) {
                window.location.replace(baseLocalUrl);
            }
        }
    })
}

function getMyProfile() {
    checkIfLogged()
    $('#nom').val("")
    $('#prenom').val("")
    $('#email').val("")
    $('#adresse').val("")
    $('#telephone').val("")
    $('#mdp1').val("")
    $('#mdp2').val("")
    $.ajax({
        type: 'GET',
        headers: {
            "Authorization": $.cookie('entete')
        },
        url: baseUrl + "/viewset/administre/" + $.cookie('idUser'),
        success: function(response) {
            response.forEach(element => {
                $('#nom').val(element['nom'])
                $('#prenom').val(element['prenom'])
                $('#email').val(element['email'])
                $('#adresse').val(element['adresse'])
                $('#telephone').val(element['telephone'])
                $('#idUser').val(element['id'])
                $("#usernameC").text(element['nom'] + " " + element['prenom']);
                $('#username').text(element['nom'] + " " + element['prenom'])
                $('#emailT').text(element['email'])
            });
        },
        error: function(response) {
            if (response.status == 401 || response.status == 400) {
                window.location.replace(baseLocalUrl);
            }
        }
    })
}

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

function editMyprofile() {
    checkIfLogged()
    test = false
    fin = {}
    $("#waiter").css('display', 'inline')
    if ($('#nom').val() != "" && $('#prenom').val() != "" && $('#adresse').val() != "" && $('#telephone').val() != "" && $('#email').val() != "") {
        $('#warning1').css('display', 'none')
    } else {
        $('#warning1').css('display', 'inline')
        return
    }
    if ($('#mdp1').val() != "") {
        test = true
        if ($('#mdp1').val() != $('#mdp2').val()) {
            $('#warning2').css('display', 'inline')
            return
        } else {
            $('#warning2').css('display', 'none')
        }
    } else {
        test = false
    }
    if (test == true) {
        fin = {
            nom: $('#nom').val(),
            prenom: $('#prenom').val(),
            adresse: $('#adresse').val(),
            telephone: $('#telephone').val(),
            email: $('#email').val(),
            mdp: $('#mdp1').val(),
        }
    } else {
        fin = {
            nom: $('#nom').val(),
            prenom: $('#prenom').val(),
            adresse: $('#adresse').val(),
            telephone: $('#telephone').val(),
            email: $('#email').val(),
        }
    }

    $.ajax({
        type: 'PUT',
        headers: {
            "Authorization": $.cookie('entete')
        },
        dataType: 'json',
        url: baseUrl + "/viewset/administre/" + $.cookie('idUser'),
        data: fin,
        success: function(response) {
            alert('Profil modifé avec succès')
            window.location.replace(baseLocalUrl + "index.html");
        },
        error: function(response) {
            if (response.status == 401 || response.status == 400) {
                window.location.replace(baseLocalUrl);
            }
        }
    })
}

$('#goE').on('click', function() {
    editMyprofile()
})

function goToRdv(id, texte) {
    checkIfLogged()
    $.cookie('rdvId', id, { path: '/' })
    $.cookie('evt', texte, { path: '/' })
    window.location.replace(baseLocalUrl + "rdv.html")
}