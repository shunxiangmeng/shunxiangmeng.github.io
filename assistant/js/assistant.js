
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


function getinfo()
{
	http("GET", "https://kajchdqo.api.lncld.net/1.1/classes/workTime", "", "",function(data){

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


/*
		    var newcellname=newRow.insertCell(count++);
		    if(results[i].on){
		    	var time = new Date(results[i].on.iso);
		    	newcellname.innerHTML = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
			}else{
				newcellname.innerHTML="";
			}

		    var newcellname=newRow.insertCell(count++);
		    if(results[i].on){
		    	//newcellname.innerHTML=results[i].on.iso.replace(/T/, ' ').replace(/\.[\d]{3}Z/,'');
		    	//date = new Date(results[i].on.iso);
		    	//newcellname.innerHTML = date.getHours() + ":" + date.getMinutes();
		    	newcellname.innerHTML = new Date(results[i].on.iso).toTimeString().replace(/\:00 GMT\+0800 \(中国标准时间\)/i,"");
			}else{
				newcellname.innerHTML="";
			}
		    var newcellname=newRow.insertCell(count++);
		    if(results[i].off){
		    	newcellname.innerHTML=new Date(results[i].off.iso).toTimeString().replace(/\:00 GMT\+0800 \(中国标准时间\)/i,"");
			}else{
				newcellname.innerHTML="";
			}

			var newcellname=newRow.insertCell(count++);
			if(results[i].off && results[i].on){
			var time = (new Date(results[i].off.iso).getTime() - new Date(results[i].on.iso).getTime())/1000/60/60;
			newcellname.innerHTML = time.toFixed(2);
			}else
			{
				newcellname.innerHTML = "";
			}
			
*/
		}
		//document.body.appendChild(table);

		tbody.append(tbodyData);

	});


}