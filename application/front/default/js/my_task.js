
onmessage = function (oEvent) {
        var params = { "detailLvl": 'test', "startWeek": 'test', "endWeek": 'test', "mkt": 'test' };
        var xhr;
        try {
            xhr = new XMLHttpRequest();
            xhr.open('POST', '/index.php/session/log', false);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var result = xhr;
                    self.postMessage(result.d);
                }
            }; 
            xhr.send(JSON.stringify(params));
        } catch (e) {
            self.postMessage('Error occured in XMLHttpRequest: ' + xhr.statusText + '  ReadyState: ' + xhr.readyState + ' Status:' + xhr.status + ' E: ' +e+' Msg:'+e.message);
        }
};

