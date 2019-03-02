
function http(method,url,query,data,cb){
	var xmlhttp;
	if (window.XMLHttpRequest){
		// IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
		xmlhttp = new XMLHttpRequest();
	}else{
		// IE6, IE5 浏览器执行代码
		xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}

	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && (xmlhttp.status==200 || xmlhttp.status==201)){
			if(cb != null){
				cb( JSON.parse(xmlhttp.responseText));
			}
		}
	}
	xmlhttp.open(method, url+query,true);
	xmlhttp.setRequestHeader("X-LC-Id","KaJCHDQOnTAMEFXevwVkiQVj-gzGzoHsz");
	xmlhttp.setRequestHeader("X-LC-Key","gSbhSM8oUPrcJwTFGIjA3Hsq");
	xmlhttp.setRequestHeader("Content-Type","application/json");
	xmlhttp.send(data);
}

function http_get(method,url,query,data,cb){
  var xmlhttp;
  if (window.XMLHttpRequest){
    // IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
    xmlhttp = new XMLHttpRequest();
  }else{
    // IE6, IE5 浏览器执行代码
    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && (xmlhttp.status==200 || xmlhttp.status==201)){
      if(cb != null){
        cb( JSON.parse(xmlhttp.responseText));
      }
    }
  }
  xmlhttp.open(method, url+query,true);
  xmlhttp.setRequestHeader("X-LC-Id","KaJCHDQOnTAMEFXevwVkiQVj-gzGzoHsz");
  xmlhttp.setRequestHeader("X-LC-Key","rciT3rVSxBGdKRSiFRfoNGmU,master");
  xmlhttp.setRequestHeader("--data-urlencode","limit=1000");
  xmlhttp.setRequestHeader("Content-Type","application/json");
  xmlhttp.send(data);
}

var DAYms = 1000*60*60*24;
var HOURms = 1000*60*60;
var MINms = 60*1000;  //每分钟毫米数

function getinfo()
{
    http("GET", "https://kajchdqo.api.lncld.net/1.1/classes/workTime", "", "",function(data){
    //http("GET", "https://kajchdqo.engine.lncld.net/1.1/functions/getWorkTime", "", "",function(data){
    
		console.log(data);
		results = data.results;
		var tbody = $("#workTimeTbody");
		tbody.empty();
		var table = document.createElement('table');
		var tr = document.createElement('tr');
		var pool = document.createDocumentFragment();

		var tableH = ["index", "date", "on", "off", "time"];
		for(var i=0;i<tableH.length;i++){
			var td=document.createElement('td');
			td.innerHTML=tableH[i];
			tr.appendChild(td);
		}
		table.appendChild(tr);

		var tbodyData = "";
		//for(var i = 0; i < results.length; i++)
    for (var i = results.length-1; i >= 0; i--)
    {
		    tbodyData += "<tr>";
		    tbodyData += "<td>" + results[i].id + "</td>";

		    if(results[i].on){
		    	var time = new Date(results[i].on.iso);
		    	tbodyData += "<td>" + time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + "</td>";
			}else{
				tbodyData += "<td></td>";
			}

		    if(results[i].on){
		    	tbodyData += "<td>" + new Date(results[i].on.iso).toTimeString().replace(/\:00 GMT\+0800 \(中国标准时间\)/i,"").replace(/\:00 GMT\+0800 \(CST\)/i,"") +"</td>"
			}else{
				tbodyData += "<td></td>";
			}

		    if(results[i].off){
		    	tbodyData += "<td>" + new Date(results[i].off.iso).toTimeString().replace(/\:00 GMT\+0800 \(中国标准时间\)/i,"").replace(/\:00 GMT\+0800 \(CST\)/i,"") + "</td>"
			}else{
				tbodyData += "<td></td>";
			}

			if(results[i].off && results[i].on){
			var time = (new Date(results[i].off.iso).getTime() - new Date(results[i].on.iso).getTime())/1000/60/60;
			tbodyData += "<td>" + time.toFixed(2) + "</td>";
			}else
			{
				tbodyData += "<td></td>";
			}
		    tbodyData += "</tr>";
		}
		tbody.append(tbodyData);

		playmap(data);

	});
}

//画打卡曲线图
function playmap(data)
{
	var results = data.results;
	//console.log(results);
	var onData = [];
	var offData = [];
	var allData = [];
	for (var i = 0; i < results.length; i++)
  //for (var i = results.length-1; i >= 0; i--)
  {
		var temp = [];
		if(results[i].on){
		    var time = new Date(results[i].on.iso).getTime() + HOURms*8;
		    	temp.push(time);
		    	temp.push(time%DAYms);
		}
		onData.push(temp);

		temp = [];
		if(results[i].off){
		    var time = new Date(results[i].off.iso).getTime() + HOURms*8;
		    	temp.push(time);
		    	temp.push(time%DAYms);
		}
		offData.push(temp);

		temp = [];
		if(results[i].off && results[i].on){
		    var time = new Date(results[i].on.iso).getTime() + HOURms*8;
		    var allTime = new Date(results[i].off.iso).getTime() - new Date(results[i].on.iso).getTime();
		    	temp.push(time);
		    	temp.push(allTime);
		}
		allData.push(temp);
	}

	//console.log(onData);
	//console.log(offData);
	//console.log(allData);

	var chart = {
      type: 'spline'      
   }; 
   var title = {
      text: 'workTime'   
   };
   var subtitle = {
   };
   var xAxis = {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
         month: '%e. %b',
         year: '%b'
      },
      title: {
         text: 'Date'
      }
   };
   var yAxis = {
      title: {
         text: '打卡时间'
      },
      tickPositions: [HOURms*6, HOURms*8, HOURms*10, HOURms*12, HOURms*18, HOURms*20, HOURms*21, HOURms*22, HOURms*24],
      min: HOURms*8,
      max: HOURms*9,
      labels: {
      	//step: 1,
      	formatter:function(){
      	if(this.value == HOURms*6) { 
        	return "06:00";
      	}
      	else if(this.value == HOURms*8) { 
        	return "08:00"; 
      	}
      	else if(this.value == HOURms*9) { 
        	return "09:00"; 
      	}
      	else if(this.value == HOURms*10) { 
        	return "10:00"; 
      	}
      	else if(this.value == HOURms*11) { 
        	return "11:00"; 
      	}
      	else if(this.value == HOURms*12) { 
        	return "12:00"; 
      	}
      	else if(this.value == HOURms*16) { 
        	return "16:00"; 
      	}
      	else if(this.value == HOURms*18) { 
        	return "18:00"; 
      	}
      	else if(this.value == HOURms*20) { 
        	return "20:00"; 
      	}
      	else if(this.value == HOURms*21) { 
        	return "21:00"; 
      	}
      	else if(this.value == HOURms*22) { 
        	return "22:00"; 
      	}
      	else if(this.value == HOURms*24) { 
        	return "24:00"; 
      	}
      	else { 
        	return "0("+this.value+")";
      	}
    }
  }
   };
   var tooltip = {
      headerFormat: '<b>{series.name}</b><br>',
      pointFormat: '{point.x:%e. %b}: {point.y:.2f} m'
   };
   var plotOptions = {
      spline: {
         marker: {
            enabled: true
         }
      }
   };
   var series= [{
      name:"on",
      data: onData
    },
    {
      name:"off",
      data: offData
    },
    {
      name:"all",
      data: allData
    }
   ];

   var json = {};
   json.chart = chart;
   json.title = title;
   json.subtitle = subtitle;
   json.tooltip = tooltip;
   json.xAxis = xAxis;
   json.yAxis = yAxis;  
   json.series = series;
   json.plotOptions = plotOptions;
   $('#container').highcharts(json);
}

function addClockInTime()
{
  //console.log($("#datepicker").val());
  //console.log($("#clockInTime").val());
  //console.log($("#clockOutTime").val());
  if ($("#datepicker").val() == "" || $("#clockInTime").val() == "" || $("#clockOutTime").val() == "")
  {
    console.log("time is null");
    return;
  }

  var inTime = $("#datepicker").val() + " " +$("#clockInTime").val() + ":00";
  var outTime = $("#datepicker").val() + " " +$("#clockOutTime").val() + ":00";
  var inDate = new Date(inTime.replace(/-/g, '/'));  
  var outDate = new Date(outTime.replace(/-/g, '/'));  

  var data = {};
  var IN = {};
  IN.__type = "Date";
  IN.iso = inDate;
  data.on = IN;

  var OUT = {};
  OUT.__type = "Date";
  OUT.iso = outDate;
  data.off = OUT;
  //console.log(JSON.stringify(data));

  http("POST", "https://kajchdqo.api.lncld.net/1.1/classes/workTime", "", JSON.stringify(data) ,function(data){
    //console.log(data);
    getWorkTimeData();
  });
}

function getWorkTimeData() 
{
  http("GET", "https://kajchdqo.engine.lncld.net/1.1/functions/getWorkTime", "", "", function(data){

    //console.log(data);
    results = data.result;
    //console.log(results);
    var tbody = $("#workTimeTbody");
    tbody.empty();
    var table = document.createElement('table');
    var tr = document.createElement('tr');
    var pool = document.createDocumentFragment();

    var tableH = ["index", "date", "clockIn", "clockOut", "time", "avg"];
    for(var i=0;i<tableH.length;i++){
      var td=document.createElement('td');
      td.innerHTML=tableH[i];
      tr.appendChild(td);
    }
    table.appendChild(tr);

    var tbodyData = "";
    //console.log(results.length);
    //for(var i = 0; i < results.length; i++)
    var avg = [];
    var avrArrayData = [];
    var count = 0;
    for (var i = 0; i < results.length; i++)
    {
      if(results[i].off && results[i].on){
        var time = (new Date(results[i].off).getTime() - new Date(results[i].on).getTime())/1000/60/60;
        avrArrayData.push(time);
        count++;
        var sum = 0;
        for(var j = 0; j < count; j++){
          sum += avrArrayData[j];
        }
        var a = sum/count;
        avg.push(a);
      }
    }

    for (var i = results.length-1; i >= 0; i--)
    {
      tbodyData += "<tr>";
      tbodyData += "<td>" + (i) + "</td>";
      tbodyData += "<td>" + results[i].id + "</td>";

      if(results[i].on){
          var time = new Date(results[i].on);
          tbodyData += "<td>" + time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + "</td>";
      }else{
        tbodyData += "<td></td>";
      }

      if(results[i].on){
          tbodyData += "<td>" + new Date(results[i].on).toTimeString().replace(/\:00 GMT\+0800 \(中国标准时间\)/i,"") + "</td>"
      }else{
        tbodyData += "<td></td>";
      }

      if(results[i].off){
          tbodyData += "<td>" + new Date(results[i].off).toTimeString().replace(/\:00 GMT\+0800 \(中国标准时间\)/i,"") + "</td>"
      }else{
        tbodyData += "<td></td>";
      }

      if(results[i].off && results[i].on){
        var time = (new Date(results[i].off).getTime() - new Date(results[i].on).getTime())/1000/60/60;
        tbodyData += "<td>" + time.toFixed(2) + "</td>";
        tbodyData += "<td>" + avg[i].toFixed(2) + "</td>";
      }else{
        tbodyData += "<td></td>";
      }

      tbodyData += "</tr>";
    }
    tbody.append(tbodyData);

    displaymap(data, avg);

  });
}
//画曲线图
function add0(m){return m<10?'0'+m:m }
function displaymap(data,avg)
{
  var results = data.result;
  //console.log(results);
  var onData = [];
  var offData = [];
  var allData = [];
  var avgData = [];

  //生成正太数组
  var zt = [];
  var interval = 1*MINms;
  var startCount = 60 * 7.5;   //7.5hour
  var stopCount = 60 * 9.5;   //9.5hour

  var count = DAYms / interval;
  
  for (var i = startCount; i <= stopCount; i++)
  {
    var tmp = [];
    tmp.push(i*interval);  //时间
    tmp.push(0);
    zt.push(tmp);
  }

  for (var i = 0; i < results.length; i++)
  //for (var i = results.length-1; i >= 0; i--)
  {
    var temp = [];
    if(results[i].on){
        var time = new Date(results[i].on).getTime() + HOURms*8;
        temp.push(time);
        temp.push(time%DAYms);
    }
    onData.push(temp);

    temp = [];
    if(results[i].off){
        var time = new Date(results[i].off).getTime() + HOURms*8;
        temp.push(time);
        temp.push(time%DAYms);
    }
    offData.push(temp);

    temp = [];
    if(results[i].off && results[i].on){
        var time = new Date(results[i].on).getTime() + HOURms*8;
        var allTime = new Date(results[i].off).getTime() - new Date(results[i].on).getTime();
        temp.push(time);
        temp.push(allTime);
    }
    allData.push(temp);

    temp = [];
    if(results[i].off){
        var time = new Date(results[i].off).getTime() + HOURms*8;
        temp.push(time);
        temp.push(avg[i]*HOURms);
    }
    avgData.push(temp);

        //增加正太数据数组
    if(results[i].on){
        var time = new Date(results[i].on).getTime() + HOURms*8;
        time = time%DAYms;
        qujian = Math.ceil(time / interval);  // 向上取整
        qujian = qujian - startCount;
        if (qujian <= (stopCount-startCount)){
          zt[qujian][1] = zt[qujian][1] + 1;
        }
    }
  }

  //console.log(onData);
  //console.log(offData);
  //console.log(allData);
  //console.log(avgData);

  var chart = {
      type: 'line'      
   }; 
   var title = {
      text: 'workTime'   
   };
   var subtitle = {
   };
   var xAxis = {
      type: 'datetime',
      dateTimeLabelFormats: { // don't display the dummy year
         month: '%e. %b',
         year: '%b'
      },
      title: {
         text: 'Date'
      }
   };
   var yAxis = {
      title: {
         text: '打卡时间'
      },
      tickPositions: [HOURms*6, HOURms*8,HOURms*8.5,HOURms*10, HOURms*12, 
        HOURms*14,HOURms*16,HOURms*18, HOURms*19,HOURms*20, HOURms*21, HOURms*21.5,HOURms*22,HOURms*22.5,HOURms*23,HOURms*23.5,HOURms*24],
      min: HOURms*8,
      max: HOURms*9,
      labels: {
        //step: 1,
        formatter:function(){
        if(this.value == HOURms*6) { 
          return "06:00";
        }
        else if(this.value == HOURms*8) { 
          return "08:00"; 
        }
        else if(this.value == HOURms*8.5) { 
          return "08:30"; 
        }
        else if(this.value == HOURms*9) { 
          return "09:00"; 
        }
        else if(this.value == HOURms*10) { 
          return "10:00"; 
        }
        else if(this.value == HOURms*11) { 
          return "11:00"; 
        }
        else if(this.value == HOURms*12) { 
          return "12:00"; 
        }
        else if(this.value == HOURms*14) { 
          return "14:00"; 
        }
        else if(this.value == HOURms*16) { 
          return "16:00"; 
        }
        else if(this.value == HOURms*18) { 
          return "18:00"; 
        }
        else if(this.value == HOURms*19) { 
          return "19:00"; 
        }
        else if(this.value == HOURms*20) { 
          return "20:00"; 
        }
        else if(this.value == HOURms*21) { 
          return "21:00"; 
        }
        else if(this.value == HOURms*21.5) { 
          return "21:30"; 
        }
        else if(this.value == HOURms*22) { 
          return "22:00"; 
        }
        else if(this.value == HOURms*22.5) { 
          return "22:30"; 
        }
        else if(this.value == HOURms*23) { 
          return "23:00"; 
        }
        else if(this.value == HOURms*23.5) { 
          return "23:30"; 
        }
        else if(this.value == HOURms*24) { 
          return "24:00"; 
        }
        else { 
          return "0("+this.value+")";
        }
    }
  }
   };
   var tooltip = {
      headerFormat: '<b>{series.name}</b><br>',
      //pointFormat: '{point.x:%y-%m-%d} {point.y:%h}',
      pointFormatter: function(){
        var date = new Date(this.x);
        var m = date.getMonth()+1;
        return date.getFullYear() +'-'+ add0(m) +'-'+add0(date.getDate()) +' '+ add0(parseInt(this.y/HOURms))+ ':' + add0((this.y%HOURms)/1000/60);
        //return parseInt(this.y/HOURms) + ':' + (this.y%HOURms)/1000/60;
      }
   };
   var plotOptions = {
      spline: {
         marker: {
            enabled: true
         }
      }
   };
   var series= [{
    name:"clock in",
    data: onData
   },
   {
    name:"clock out",
    data: offData
   },
   {
    name:"clockTime",
    data: allData
   },
   {
    name:"average",
    data: avgData
   }];

   var json = {};
   json.chart = chart;
   json.title = title;
   json.subtitle = subtitle;
   json.tooltip = tooltip;
   json.xAxis = xAxis;
   json.yAxis = yAxis;  
   json.series = series;
   json.plotOptions = plotOptions;
   $('#container').highcharts(json);

   //-----画正太曲线图--------------------------------------------------------------------------

  var chart1 = {
      type: 'spline'      
   }; 
   var title1 = {
      text: '正太图'   
   };
   var xAxis = {
      type: 'datetime',
      title: {
         text: 'Date'
      }
   };
var yAxis = {
      title: {
         text: '打卡时间'
      },
      tickPositions: [0, 5, 10, 15, 20],
      min: 1,
      max: 1000,

   };
   var tooltip = {
      headerFormat: '<b>打卡</b><br>',
      //pointFormat: '{point.x:%y-%m-%d} {point.y:%h}',
      pointFormatter: function(){
        return this.y +"次<br>"+add0(parseInt(this.x/HOURms))+ ':' + add0((this.x%HOURms)/1000/60);
        //return parseInt(this.y/HOURms) + ':' + (this.y%HOURms)/1000/60;
      }
   };
   var series= [{
      name: "上班打卡",
      data: zt
     }
   ];

   var json = {};
   json.chart = chart1;
   json.title = title1;
   json.tooltip = tooltip;
   json.xAxis = xAxis;
   json.yAxis = yAxis;  
   json.series = series;
   json.plotOptions = plotOptions;
   $('#container1').highcharts(json);
}




