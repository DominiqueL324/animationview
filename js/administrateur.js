//baseUrl = "http://127.0.0.1:8000"
baseUrl = "http://195.15.218.172:8086"

$('#add').click(function() {
    $("#action").show("slow")
})
$('#close').click(function() {
    $("#action").hide("slow")
})

$('#ajouter').click(function() {
    $('#warning1').css('display', 'none')
    $('#warning2').css('display', 'none')
    $('#warning3').css('display', 'none')
    $('#warning4').css('display', 'none')
    $('#warning5').css('display', 'none')
    $('#warning6').css('display', 'none')
    method = ""
    url = ""
    data = {}
    $("#waiter").css('display', 'inline')
    if ($('#nom').val() != "" && $('#prenom').val() != "" && $('#email').val() != "" && $('#adresse').val() != "" && $('#telephone').val() != "" && $('#couleur_js').val() != "" && $('#couleur_jo').val() != "") {
        if ($('#login').val() != "") {
            data = {
                nom: $('#nom').val(),
                prenom: $('#prenom').val(),
                adresse: $('#adresse').val(),
                email: $('#email').val(),
                telephone: $('#telephone').val(),
                login: $('#login').val(),
            }
        } else {
            $('#warning1').css('display', 'inline')
            $("#waiter").css('display', 'none')
            return
        }
    } else {
        $('#warning1').css('display', 'inline')
        $("#waiter").css('display', 'none')
        return
    }
    if ($('#idAdministrateur').val() == "") {
        if ($('#mdp').val() != "" && $('#mdp1').val() != "") {
            if ($('#mdp1').val() == $('#mdp').val()) {
                data['mdp'] = $('#mdp1').val()
                method = "POST"
                url = baseUrl + "/viewset/gestion/administrateur/"
            } else {
                $('#warning2').css('display', 'inline')
                $("#waiter").css('display', 'none')
                return
            }
        } else {
            $('#warning1').css('display', 'inline')
            $("#waiter").css('display', 'none')
            return
        }
    } else {
        if ($('#mdp').val() != "" && $('#mdp1').val() != "") {
            if ($('#mdp1').val() == $('#mdp').val()) {
                data['mdp'] = $('#mdp1').val()
            } else {
                $('#warning2').css('display', 'inline')
                $("#waiter").css('display', 'none')
                return
            }
        } else {
            data['mdp'] = ""
        }
        method = "PUT"
        url = baseUrl + "/viewset/gestion/administrateur/" + $('#idAdministrateur').val()
    }

    $.ajax({
        type: method,
        dataType: 'json',
        url: url,
        data: data,
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
                if (response.responseJSON == "login existant") {
                    $('#warning3').css('display', 'inline')
                    $("#waiter").css('display', 'none')
                } else if (response.responseJSON == "couleur_jo existant") {
                    $('#warning4').css('display', 'inline')
                    $("#waiter").css('display', 'none')
                } else if (response.responseJSON == "email existant") {
                    $('#warning6').css('display', 'inline')
                    $("#waiter").css('display', 'none')
                }
                /*else if(response.responseJSON == "couleur_s existant"){
                                    $('#warning3').css('display','inline')
                                    $("#waiter").css('display','none')
                                }*/
                else {

                }
                console.log(response.responseJSON)
            }
        }
    })

})

function onLoad() {
    $.ajax({
        type: 'GET',
        url: baseUrl + "/viewset/gestion/administrateur",
        success: function(response) {
            $('#tbody').empty()
            response.forEach(elt => {
                $('#tbody').append("\
                    <tr>\
                    <td>" + elt['last_name'] + "</td>\
                    <td>" + elt['first_name'] + "</td>\
                    <td>" + elt['email'] + "</td>\
                    <td>" + elt['administrateur'][0]['telephone'] + "</td>\
                    <td>" + elt['administrateur'][0]['adresse'] + "</td>\
                    <td>\
                        <a href='#' onclick='goToAdministrateur(" + elt['id'] + ")' class='nav-link'>\
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

function goToAdministrateur(id) {
    clearForm()
    $.ajax({
        type: 'GET',
        url: baseUrl + "/viewset/gestion/administrateur/" + id,
        success: function(response) {
            response.forEach(element => {
                $('#nom').val(element["first_name"])
                $('#prenom').val(element["last_name"])
                $('#email').val(element["email"])
                $('#adresse').val(element['administrateur'][0]["adresse"])
                $('#telephone').val(element['administrateur'][0]["telephone"])
                $('#login').val(element["username"])
                $('#idAdministrateur').val(element["id"])
            });
            $("#action").show("slow")
            $('#delete').css('display', 'inline')

        },
        error: function(response) {

        }
    })
}

function clearForm() {
    $('#nom').val("")
    $('#prenom').val("")
    $('#adresse').val("")
    $('#email').val("")
    $('#telephone').val("")
    $('#login').val("")
    $('#mdp').val("")
    $('#mdp1').val("")
    $('#idService').val("")
    $('#warning1').css('display', 'none')
    $('#warning2').css('display', 'none')
    $('#warning3').css('display', 'none')
    $('#warning4').css('display', 'none')
    $('#warning5').css('display', 'none')
    $('#warning6').css('display', 'none')
    $('#delete').css('display', 'none')
    $("#waiter").css('display', 'none')
}

$('#delete').on('click', function() {
    if (confirm('Voulez vous vraiment supprimer cet administrateur??')) {

        $.ajax({
            type: 'DELETE',
            url: baseUrl + "/viewset/gestion/administrateur/" + $('#idAdministrateur').val(),
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