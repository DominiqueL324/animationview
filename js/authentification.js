//baseUrlLogin = 'http://127.0.0.1:8000/'
baseUrlLogin = "http://195.15.218.172:8086"
baseLocalUrl = "http://127.0.0.1/animation/administration/"
baseLocalUrlGestion = "http://127.0.0.1/animation/gestion/";
//baseLocalUrl = "http://195.15.218.172/animation/administration/"
//baseLocalUrlGestion = "http://195.15.218.172/animation/gestion/"

$('#login').on('click', function() {
    username = $('#email').val()
    mdp = $('#mdp').val()
    if (username == "" || mdp == "") {
        $('#warning1').css('display', 'inline')
        return
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: baseUrlLogin + "login/",
        data: {
            username: username,
            password: mdp,
        },
        success: function(response) {
            if (response['token'] != "" && response['id'] != "") {
                $('#error').css('display', 'none')
                $.cookie("token", response['token'], { path: '/' });
                $.cookie("idUser", response['id'], { path: '/' });
                $.cookie("entete", "Token " + response['token'], { path: '/' });
                window.location.replace(baseLocalUrl + "dashboard.html");
            }
        },
        error: function(response) {
            $('#error').css('display', 'inline')
            return
        }
    })
})

$('#login1').on('click', function() {
    username = $('#email').val()
    mdp = $('#mdp').val()
    if (username == "" || mdp == "") {
        $('#warning1').css('display', 'inline')
        return
    }
    $.ajax({
        type: 'POST',
        dataType: 'json',
        url: baseUrlLogin + "login/",
        data: {
            username: username,
            password: mdp,
        },
        success: function(response) {
            if (response['token'] != "" && response['id'] != "") {
                $('#error').css('display', 'none')
                $.cookie("token", response['token'], { path: '/' });
                $.cookie("idUser", response['id'], { path: '/' });
                $.cookie("entete", "Token " + response['token'], { path: '/' });
                window.location.replace(baseLocalUrlGestion + "dashboard.html");
            }
        },
        error: function(response) {
            $('#error').css('display', 'inline')
            return
        }
    })
})

$('#logout').on('click', function() {
    $.ajax({
        type: 'GET',
        headers: {
            "Authorization": $.cookie('entete')
        },
        data: { token: $.cookie('token') },
        url: baseUrlLogin + "logout/",
        success: function(response) {
            $.removeCookie('token', { path: '/' });
            $.removeCookie('idUser', { path: '/' });
            $.removeCookie('entete', { path: '/' });
            console.log($.cookie("token"))
            window.location.replace(baseLocalUrl + "index.html");
        },
        error: function(response) {
            //window.location.replace(baseLocalUrl+"index.html");
            $('#error').css('display', 'inline')
            return
        }
    })
})