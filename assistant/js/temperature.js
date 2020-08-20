function addtemp(){
    var data = {};
    var temp_arry = [];
    temp_arry[0] = 12.6;
    data["temp_arry"] = temp_arry;
    data["temperature"] = 55.5;
    data["open"] = true;
    data["people"] = true;
    //console.log(data);
    http("POST", "https://kajchdqo.api.lncld.net/1.1/classes/temperature", "", JSON.stringify(data) ,function(data){
        //console.log(data);
      });
    http("PUT", "https://kajchdqo.api.lncld.net/1.1/classes/temperature/5f3d4127edbb97455529c54b", "", JSON.stringify(data) ,function(data){
        //console.log(data);
      });
}

function getTemperature(){
    http("GET", "https://kajchdqo.engine.lncld.net/1.1/classes/temperature/5f3d4127edbb97455529c54b", "", "", function(data){
        //console.log(data);
        $("#temperature").text(data["temperature"]);
        if (data["open"])
            $("#isOpen").text("炉火已打开");
        else
            $("#isOpen").text("炉火关闭");

        if (data["people"])
            $("#hasPeople").text("有人在");
        else
            $("#hasPeople").text("没人在");
    })
} 