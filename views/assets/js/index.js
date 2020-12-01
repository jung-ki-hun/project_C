function init(e) {
    GetCurrentUser(function(data) {
        if(data) {
            if(data.authorized) {
                document.getElementById("login__main_benner").children[0].children[0].innerHTML = data.name + "님 LogOut";
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', init, false);