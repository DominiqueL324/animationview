//baseUrl = "http://127.0.0.1:8000"
baseUrl = "http://195.15.218.172:8086"
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