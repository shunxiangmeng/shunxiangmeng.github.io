    /**
 * 在Safari和IE8上执行 new Date('2017-12-8 11:36:45'); 会得到Invalid Date
 * 本函数重写默认的Date函数，以解决其在Safari，IE8上的bug
 */
Date = function (Date) {
    MyDate.prototype = Date.prototype;
    return MyDate;

    function MyDate() {
        // 当只有一个参数并且参数类型是字符串时，把字符串中的-替换为/
        if (arguments.length === 1) {
        let arg = arguments[0];
        if (Object.prototype.toString.call(arg) === '[object String]' && arg.indexOf('T') === -1) {
            arguments[0] = arg.replace(/-/g, "/");
            // console.log(arguments[0]);
        }
        }
        let bind = Function.bind;
        let unbind = bind.bind(bind);
        return new (unbind(Date, null).apply(null, arguments));
    }
}(Date);

function getAndDisplayWork()
{
    http("GET", "https://kajchdqo.engine.lncld.net/1.1/classes/learn", "", "", function(data){
        results = data.results;
        //console.log(results);
        for (var i = 0; i < results.length; i++){
            var updateTimeStr = results[i].updatedAt.replace(/T/i," ").replace(/(.\d\d\dZ)/i,"");
            //console.log(updateTimeStr);
            var timestamp = new Date(updateTimeStr).getTime();
            results[i].timestamp = timestamp;
        }
        for (var i = 0; i < results.length; i++){
            for (var j = i + 1; j < results.length; j++){
                if (results[i].timestamp < results[j].timestamp){
                    var tmp = results[j];
                    results[j] = results[i];
                    results[i] = tmp;
                }
            }
        }
        //console.log(results);
        var tbody = $("#learnItem");
        tbody.empty();
        var percentage = 0;
        for (var i = 0; i < results.length; i++)
        {
            var percent = results[i].z_percentage;
            if (results[i].b_isBook){
                percent = results[i].e_pageNow / results[i].d_pageAll * 100;
                if (percent >= 100)
                    percent = 100;
            }
            var tbodyData = "";
            tbodyData += "<tr>";
            tbodyData += "<td>" + (i + 1) + "</td>";
            tbodyData += "<td>" + results[i].a_name + "</td>";
            tbodyData += "<td>" + results[i].d_pageAll + "</td>";
            tbodyData += "<td>" + results[i].e_pageNow + "</td>";
            tbodyData += "<td>" + results[i].x_done + "</td>";
            tbodyData += "<td>" + results[i].y_todo + "</td>";
            tbodyData += "<td>" + percent.toFixed(2) + "%</td>";
            tbodyData += "</tr>";  
            tbody.append(tbodyData); 
            percentage = percentage + percent;
        }

        percentage = percentage / results.length;
        $( "#progressbar" ).progressbar({
            value: 0,
            change:function(){
                $(".progress-label").text($("#progressbar").progressbar("value").toFixed(3)+"%");
              },
          });

        $('#progressbar').progressbar("option","value", percentage);
    });
}