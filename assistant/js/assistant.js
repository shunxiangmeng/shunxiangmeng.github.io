
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
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			if(cb != null){
				cb( JSON.parse(xmlhttp.responseText));
			}
		}
	}
	xmlhttp.open(method, url+query,true);
	xmlhttp.setRequestHeader("X-LC-Id","KaJCHDQOnTAMEFXevwVkiQVj-gzGzoHsz");
	xmlhttp.setRequestHeader("X-LC-Key","gSbhSM8oUPrcJwTFGIjA3Hsq");
	xmlhttp.setRequestHeader("Content-Type","application/json");
	xmlhttp.send();
}

var DAYms = 1000*60*60*24;
var HOURms = 1000*60*60;

function getinfo()
{
	http("GET", "https://kajchdqo.api.lncld.net/1.1/classes/workTime", "", "",function(data){
		//console.log(data);
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
		for(var i=0;i<results.length;i++){
		    tbodyData += "<tr>";
		    tbodyData += "<td>" + results[i].id + "</td>";

		    if(results[i].on){
		    	var time = new Date(results[i].on.iso);
		    	tbodyData += "<td>" + time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + "</td>";
			}else{
				tbodyData += "<td></td>";
			}

		    if(results[i].on){
		    	tbodyData += "<td>" + new Date(results[i].on.iso).toTimeString().replace(/\:00 GMT\+0800 \(中国标准时间\)/i,"") + "</td>"
			}else{
				tbodyData += "<td></td>";
			}

		    if(results[i].off){
		    	tbodyData += "<td>" + new Date(results[i].off.iso).toTimeString().replace(/\:00 GMT\+0800 \(中国标准时间\)/i,"") + "</td>"
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

function playmap(data)
{
	var results = data.results;
	//console.log(results);
	var onData = [];
	var offData = [];
	var allData = [];
	for (var i = 0; i < results.length; i++){
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

