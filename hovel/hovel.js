

var map;   //全局变量
AV.init("id", "apk");

function hovelInit()
{
	// 百度地图API功能
	map = new BMap.Map("map",{minZoom:4, maxZoom:15});    // 创建Map实例
	map.centerAndZoom(new BMap.Point(120.1617, 30.2799), 10);  // 初始化地图,设置中心点坐标和地图级别
	//添加地图类型控件
	map.addControl(new BMap.MapTypeControl({
		mapTypes:[
			BMAP_NORMAL_MAP,
			BMAP_HYBRID_MAP
		]}));
	//map.setCurrentCity("杭州");          // 设置地图显示的城市 此项是必须设置的
	map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

	getHousesData();
}

function getHousesData()
{
	var query = new AV.Query('houses');
	query.limit(1000);// 最多返回 1000 条结果
	query.find().then(function (results) 
	{
		
		var data = JSON.stringify(results);
		var obj = JSON.parse(data);
		console.log(obj.length);

		for (var i = 0; i < obj.length; i++)
		{
			var point = new BMap.Point(obj[i].lng, obj[i].lat);
			var marker = new BMap.Marker(point);
			map.addOverlay(marker); 

			var content = "<a href='" + obj[i].source + "' target='_blank'>"+ obj[i].houses + "</a>";
			console.log(content);
			var infoWindow = new BMap.InfoWindow(content); 
			//var label = new BMap.Label("我是文字标注哦",{offset:new BMap.Size(20,-10)});
			//marker.setLabel(label);

			//marker.addEventListener("click", function(){          
	   		//	this.openInfoWindow(infoWindow);
			//});
			addClickHandler(content,marker);
			//marker.addEventListener("click",function(e){
			//	openInfo(content,e)}
			//);
		}

  	}).catch(function(error) 
  	{
    	alert(JSON.stringify(error));
  	});

}

var opts = {
				width : 250,     // 信息窗口宽度
				height: 80,     // 信息窗口高度
				//title : "信息窗口" , // 信息窗口标题
				enableMessage:true//设置允许信息窗发送短息
			   };
function addClickHandler(content,marker)
{
	marker.addEventListener("click",function(e){
		openInfo(content,e)}
	);
}
function openInfo(content, e)
{
	var p = e.target;
	var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
	var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象 
	map.openInfoWindow(infoWindow,point); //开启信息窗口
}



