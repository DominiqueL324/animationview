//baseUrl = "http://127.0.0.1:8000"
baseUrl = "http://195.15.218.172:8086";
evt = []

function getRDVAll() {
    //checkIfLogged()
    $.ajax({
        type: 'GET',
        /*headers: {
             "Authorization": $.cookie('entete')
         },*/
        url: baseUrl + "/viewset/gestion/rdv",
        success: function(response) {
            $('#tbody').empty()
            response.forEach(elt => {
                dates = new Date(elt['date_d'])
                datef = new Date(elt['date_f'])
                $('#tbody').append("\
                    <tr>\
                        <td>" + elt['administre'].nom + " " + elt['administre'].prenom + "</td>\
                        <td>" + elt['evenement'].intitule + "</td>\
                        <td>" + elt['evenement'].lieux + "</td>\
                        <td>" + ("0" + dates.getDate()).slice(-2) + "/" + ("0" + (dates.getMonth() + 1)).slice(-2) + "/" + dates.getFullYear() + "</td>\
                        <td>" + elt['heure_r'] + "</td>\
                        <td>" + elt['heure_f'] + "</td>\
                        <td>\
                            <a href='#' onclick='goToRdv(" + elt['id'] + ")' class='nav-link'>\
                                <i class='nav-icon fas fa-ellipsis-h'></i>\
                            </a>\
                        </td>\
                    </tr>")
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

function goToRdv(id) {
    $.ajax({
        type: 'GET',
        url: baseUrl + "/viewset/viewset/rdv/" + id,
        success: function(response) {
            clearForm()
            response.forEach(element => {
                deb = element['date_d'].split("-")
                fin = element['date_f'].split("-")
                deb = deb[1] + "/" + deb[2] + "/" + deb[0]
                fin = fin[1] + "/" + fin[2] + "/" + fin[0]
                periode = JSON.parse(element['jours'])
                console.log(periode)
                $('#idEvenement').val(id)
                $('#jour').val(periode)
                $('#ville').val(element['ville'])
                $('#lieux').val(element['lieux'])
                $('#intitule').val(element['intitule'])
                $('#heure_debut').val(element['heure_r'])
                $('#heure_fin').val(element['heure_f'])
                $('#reservation').val(deb + " - " + fin)
                if (element['validite'].includes(":")) {
                    $('#validite').val("1")
                    $('#dayRow').css('display', 'none')
                    $('#hourRow').css('display', 'inline')
                    $('#minRow').css('display', 'inline')
                    $('#heure').val(("0" + element['validite'].split(":")[0]).slice(-2))
                    $('#minute').val(("0" + element['validite'].split(":")[1]).slice(-2))
                } else if (element['validite'] == "-1") {
                    $('#validite').val("2")
                    $('#hourRow').val("")
                    $('#minRow').val("")
                    $('#dayRow').css('display', 'none')
                    $('#hourRow').css('display', 'none')
                    $('#minRow').css('display', 'none')
                } else {
                    $('#validite').val("0")
                    $('#days').val(("0" + element['validite']).slice(-2))
                    $('#dayRow').css('display', 'inline')
                    $('#hourRow').val("")
                    $('#minRow').val("")
                    $('#hourRow').css('display', 'none')
                    $('#minRow').css('display', 'none')
                }
            });
            $("#action").show("slow")
        },
        error: function(response) {

        }
    })
    return id
}

function onLoad() {
    alert('ok')
    evt = []
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
            goToEvent(parseInt(arg.event._def.publicId))
        }
    });
    calendar.render();
}

$('#validite').on('change', function() {
    //console.log($('#reservation').val().replace(/\//g,'-'))
    //console.log($('#reservation').val().split('-'))
    if ($('#validite').val() == 0) {
        $('#days').val("")
        $('#dayRow').css('display', 'inline')
        $('#hourRow').css('display', 'none')
        $('#minRow').css('display', 'none')
    }

    if ($('#validite').val() == 1) {
        $('#heure').val("")
        $('#minute').val("")
        $('#dayRow').css('display', 'none')
        $('#hourRow').css('display', 'inline')
        $('#minRow').css('display', 'inline')
    }

    if ($('#validite').val() == 2 || $('#validite').val() == 3) {
        $('#dayRow').css('display', 'none')
        $('#hourRow').css('display', 'none')
        $('#minRow').css('display', 'none')
    }
})

$('#go').on('click', function() {
    //console.log($('#jour').val())
    $('#warning1').css('display', 'none')
    $('#warning2').css('display', 'none')
    $('#warning3').css('display', 'none')
    $('#warning4').css('display', 'none')
    periode = ""
    data = {}
    url = ""
    if ($('#ville').val() == "" || $('#lieux').val() == "" || $('#intitule').val() == "" || $('#jour').val() == "" || $('#reservation').val() == "") {
        $('#warning1').css('display', 'inline')
        return
    }
    if ($('#heure_debut').val() == "" || $('#heure_fin').val() == "") {
        $('#warning1').css('display', 'inline')
        return
    }
    deb = $('#reservation').val().split('-')[0].replace(/\//g, '-')
    fin = $('#reservation').val().split('-')[1].replace(/\//g, '-')
    deb = (deb.split('-')[2] + "-" + deb.split('-')[0] + "-" + deb.split('-')[1]).replace(' ', '')
    fin = (fin.split('-')[2] + "-" + fin.split('-')[0] + "-" + fin.split('-')[1]).replace(' ', '')
    if (deb == fin) {
        deb = new Date(deb.split('-')[0], (deb.split('-')[1] - 1), deb.split('-')[2])
        fin = new Date(fin.split('-')[0], (fin.split('-')[1] - 1), fin.split('-')[2])
        periode = '["' + deb.getDay().toString() + '"]'
        fin.setDate(fin.getDate() + 1)
        deb = (deb.getFullYear().toString() + '-' + (deb.getMonth() + 1).toString() + '-' + deb.getDate().toString())
        fin = (fin.getFullYear().toString() + '-' + (fin.getMonth() + 1).toString() + '-' + fin.getDate().toString())
    } else {
        periode = JSON.stringify($('#jour').val())
    }

    data = {
        ville: $('#ville').val(),
        lieux: $('#lieux').val(),
        intitule: $('#intitule').val(),
        periode: periode,
        date_d: deb,
        date_f: fin,
        heure_d: $('#heure_debut').val(),
        heure_f: $('#heure_fin').val(),
    }
    if ($('#validite').val() == "1") {
        if ($('#minute').val() == "" || $('#minute').val() > 59 || $('#minute').val() < 0 || $('#heure').val() == "" || $('#heure').val() > 23 || $('#heure').val() < 0) {
            $('#warning3').css('display', 'inline')
            return
        } else {
            data['validite'] = $('#heure').val().toString() + ":" + $('#minute').val().toString()
        }
    } else if ($('#validite').val() == "0") {
        if ($('#days').val() == "") {
            $('#warning4').css('display', 'inline')
            return
        } else {
            data['validite'] = $('#days').val().toString()
        }
    } else if ($('#validite').val() == "3") {
        $('#warning2').css('display', 'inline')
        return
    } else {
        data['validite'] = "-1"
    }

    method = ''
    if ($('#idEvenement').val() == "") {
        method = "POST"
        url = baseUrl + "/viewset/gestion/evenement/"
    } else {
        method = "PUT"
        url = baseUrl + "/viewset/gestion/evenement/" + $('#idEvenement').val()
    }
    $.ajax({
        type: method,
        dataType: 'json',
        url: url,
        data: data,
        success: function(response) {
            clearForm()
            configCalHeure([])
            onLoad()
            $("#action").hide("slow")
            $('#successA').css('display', 'inline')
            setTimeout(function() {
                $('#successA').css('display', 'none')
            }, 7000);
        },
        error: function(response) {
            /*if(response.status == 401 || response.status == 400){
                if(response.responseJSON == "login existant"){
                    $('#warning3').css('display','inline')
                    $("#waiter").css('display','none')
                }else{

                }
                console.log(response.responseJSON)
            }*/
        }
    })
})
$('#leave').click(function() {
    clearForm()
    $("#action").hide("slow")
})

$('#add').click(function() {
    clearForm()
    $("#action").show("slow")
})

$('#close').click(function() {
    clearForm()
    $("#action").hide("slow")
})

function clearForm() {
    $('#warning1').css('display', 'none')
    $('#warning2').css('display', 'none')
    $('#warning3').css('display', 'none')
    $('#warning4').css('display', 'none')
    $('#ville').val("")
    $('#lieux').val("")
    $('#intitule').val("")
    $('#jour').val([])
    $('#reservation').val("")
    $('#minute').val("")
    $('#heure').val("")
    $('#days').val("")
    $('#heure_debut').val("")
    $('#heure_fin').val("")
    $('#validite').val("3")
    $('#idEvenement').val("")
}

$('#delete').on('click', function() {
    if (confirm('Voulez vous vraiment supprimer ce Rendez-vous??')) {
        $.ajax({
            type: 'DELETE',
            url: baseUrl + "/viewset/gestion/evenement/" + $('#idEvenement').val(),
            success: function(response) {
                clearForm()
                $("#action").hide("slow")
                onLoad()
                $('#successA').css('display', 'inline')
                setTimeout(function() {
                    $('#successA').css('display', 'none')
                }, 7000);
            },
            error: function(response) {

            }
        })
    }
})