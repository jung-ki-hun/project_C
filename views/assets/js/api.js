async function Request(method, url, body) {
    if(fetch != undefined) {
        let option = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept' : 'application/json'
            }
        };
        if(body != undefined && body != null) {
            option.body = JSON.stringify(body);
        }
        return (await fetch(url, option)).json();
    }
    else {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.onreadystatechange = function(a) {
            if(a.currentTarget.readyState == 4) {
                if(a.currentTarget.status == 200) {
                    resolve(JSON.parse(a.currentTarget.response));
                }
                else {
                    reject("request failed, http status = " + status);
                }
            }
        }
        if(body != undefined && body != null) {
            xhr.send(JSON.stringify(body));
        }
        else {
            xhr.send();
        }
    }
}

async function GET(url) {
    return await Request('GET', url);
}
async function POST(url, body) {
    return await Request('POST', url, body);
}

function GetCurrentUser(cb, cb_if_not_logged_in) {
    GET('/api/account').then(function(data) {
        if(data.error) {
            if(cb_if_not_logged_in) {
                cb_if_not_logged_in(data);
            }
        }
        else {
            if(cb) {
                cb(data);
            }
        }
    }).catch(function (err) {
        alert("서버와 통신하는데 문제가 생겼습니다.");
        console.log(err);
    });
}