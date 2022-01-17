//baseUrl = "http://127.0.0.1:8000"
baseUrl = "http://195.15.218.172:8086";

$('#add').click(function() {
    loadResponsable()
    $("#action").show("slow")
})
$('#close').click(function() {
    $("#action").hide("slow")
})

$('#ajouter').click(function() {
    method = ""
    url = ""
    $("#waiter").css('display', 'inline')
    if ($('#nom').val() != "") {
        $('#warning1').css('display', 'none')
    } else {
        $('#warning1').css('display', 'inline')
        $("#waiter").css('display', 'none')
        return
    }
    if ($('#idService').val() == "") {
        method = "POST"
        url = baseUrl + "/viewset/gestion/service/"
    } else {
        method = "PUT"
        url = baseUrl + "/viewset/gestion/service/" + $('#idService').val()
    }

    $.ajax({
        type: method,
        dataType: 'json',
        url: url,
        data: {
            nom: $('#nom').val(),
            responsable: $('#responsable').val(),
        },
        success: function(response) {
            clearForm()
            onLoad()
            $("#action").hide("slow")
            $('#successA').css('display', 'inline')
            setTimeout(function() {
                $('#successA').css('display', 'none')
            }, 7000);

        },
        error: function(response) {
            if (response.status == 401 || response.status == 400) {
                //window.location.replace(baseLocalUrl);
            }
        }
    })

})

function loadResponsable() {
    $.ajax({
        type: 'GET',
        url: baseUrl + "/viewset/gestion/responsable",
        success: function(response) {
            $('#responsable').empty()
            response.forEach(elt => {
                $('#responsable').append("\
                    <option value=" + elt['utilisateur'][0]['id'] + ">" + elt['last_name'] + elt['first_name'] + "</option>")
            });
        },
        error: function(response) {

        }
    })
}

function onLoad() {
    $.ajax({
        type: 'GET',
        url: baseUrl + "/viewset/gestion/service",
        success: function(response) {
            $('#tbody').empty()
            response.forEach(elt => {
                $('#tbody').append("\
                    <tr>\
                    <td>" + elt['nom'] + "</td>\
                    <td>\
                    <a href='#' onclick='goToService(" + elt['id'] + ")' class='nav-link'>\
                        <i class='nav-icon fas fa-ellipsis-h'></i>\
                    </a>\
                  </td>\
                </tr>")
            });
            $(".buttons-copy").html("<span>copier</span>");
            $(".buttons-print").html("<span>imprimer</span>")
            $(".buttons-collection").html("<span></span>")
                //alert($(".buttons-copy").html())
        },
        error: function(response) {

        }

    })
}

function goToService(id) {
    clearForm()
    loadResponsable()
    $.ajax({
        type: 'GET',
        url: baseUrl + "/viewset/gestion/service/" + id,
        success: function(response) {
            response.forEach(element => {
                $('#nom').val(element["nom"])
                $('#responsable').val(element["responsable"])
                $('#idService').val(element["id"])
            });
            $('#delete').css('display', 'inline')
            $("#action").show("slow")
        },
        error: function(response) {

        }
    })
}

function clearForm() {
    $('#nom').val("")
    $('#responsable').val("")
    $('#idService').val('')
    $("#waiter").css('display', 'none')
    $('#warning1').css('display', 'none')
    $('#delete').css('display', 'none')
}

$('#delete').on('click', function() {
    if (confirm('Voulez vous vraiment supprimer ce service??')) {
        $.ajax({
            type: 'DELETE',
            url: baseUrl + "/viewset/gestion/service/" + $('#idService').val(),
            success: function(response) {
                clearForm()
                $("#action").hide("slow")
                onLoad()
                $('#successD').css('display', 'inline')
                setTimeout(function() {
                    $('#successD').css('display', 'none')
                }, 7000);
            },
            error: function(response) {

            }
        })
    }
})