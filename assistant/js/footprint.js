
var map;
var g_marker = [];
function initfootprint()
{
	http("GET", "https://kajchdqo.engine.lncld.net/1.1/functions/getFootPrint", "", "", function(data){
		results = data.result;
		console.log(results);
		// 百度地图API功能
		map = new BMap.Map("allmap",{minZoom:4,maxZoom:15});    // 创建Map实例
		map.centerAndZoom(new BMap.Point(120.155611,30.23593), 7);  // 初始化地图,设置中心点坐标和地图级别
		//添加地图类型控件
		map.addControl(new BMap.MapTypeControl({
			mapTypes:[
	            BMAP_NORMAL_MAP,
	            BMAP_HYBRID_MAP
	        ]}));	  
		//map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
		map.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放

		for (var i = 0; i < results.length; i++)
		{
			var point = new BMap.Point(results[i].longitude, results[i].latitude);
			var marker = new BMap.Marker(point);
			map.addOverlay(marker); 
			g_marker.push(marker);
		}
	});

}

function getfootprint()
{
	http("GET", "https://kajchdqo.engine.lncld.net/1.1/functions/getFootPrint", "", "", function(data){
		results = data.result;
		//console.log(results);  
		for (var i = 0; i < g_marker.length; i++)
		{
			map.removeOverlay(g_marker[i]); 
		}
		g_marker = [];

		for (var i = 0; i < results.length; i++)
		{
			var point = new BMap.Point(results[i].longitude, results[i].latitude);
			var marker = new BMap.Marker(point);
			g_marker.push(marker);
			map.addOverlay(marker); 
		}
	});
}
