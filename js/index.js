
/*var map = new AMap.Map(('container'), {
    resizeEnable: true, //是否监控地图容器尺寸变化
    zoom:11, //初始化地图层级
    center: [116.397428, 39.90923] //初始化地图中心点
});*/

//创建地图
var map = new AMap.Map('container');

///////////////地图的基础控件
AMapUI.loadUI(['control/BasicControl'], function(BasicControl) {

    //添加一个缩放控件
    map.addControl(new BasicControl.Zoom({
        position: 'lt'
    }));

    //缩放控件，显示Zoom值
    map.addControl(new BasicControl.Zoom({
        position: 'lb',
        showZoomNum: true
    }));

    //图层切换控件
    map.addControl(new BasicControl.LayerSwitcher({
        position: 'rt'
    }));
});

////// //////////////图层控制
//设置地图显示要素
function setMapFeatures() {
    var features = [];
    var inputs = document.querySelectorAll("#map-features input");
    inputs.forEach(function(input) {
        if (input.checked) {
            features.push(input.value);
        }
    });
    map.setFeatures(features);
}

//绑定checkbox点击事件
var inputs = document.querySelectorAll("#map-features input");
inputs.forEach(function(checkbox) {
    checkbox.onclick = setMapFeatures;
});

////////////////  样式控制
//绑定radio点击事件
var radios = document.querySelectorAll("#map-styles input");
radios.forEach(function(ratio) {
    ratio.onclick = setMapStyle;
});

function setMapStyle() {
    var styleName = "amap://styles/" + this.value;
    map.setMapStyle(styleName);
}

///////////// 鼠标工具绘制
var mouseTool = new AMap.MouseTool(map);
//监听draw事件可获取画好的覆盖物
var overlays = [];
/*var path = [
    [116.362209, 39.887487],
    [116.422897, 39.878002],
    [116.372105, 39.90651],
    [116.428945, 39.89663]
];*/
mouseTool.on('draw',function(e){
    overlays.push(e.obj);
});

function draw(type){
    switch(type){
        case 'marker':{
            mouseTool.marker({
                //同Marker的Option设置
                draggable:true
            });
            break;
        }
        case 'polyline':{
            mouseTool.polyline({
              /*  strokeColor:'#80d8ff'
                //同Polyline的Option设置*/

               /* path: path,*/
                isOutline: true,
                outlineColor: '#ffeeff',
                borderWeight: 3,
                strokeColor: "#3366FF",
                strokeOpacity: 1,
                strokeWeight: 6,
                // 折线样式还支持 'dashed'
                strokeStyle: "solid",
                // strokeStyle是dashed时有效
                strokeDasharray: [10, 5],
                lineJoin: 'round',
                lineCap: 'round',
                zIndex: 50,
                showDir: true
            });
            break;
        }
        case 'polygon':{
            mouseTool.polygon({
                fillColor:'#00b0ff',
                strokeColor:'#80d8ff'
                //同Polygon的Option设置
            });
            break;
        }
        case 'rectangle':{
            mouseTool.rectangle({
                fillColor:'#00b0ff',
                strokeColor:'#80d8ff'
                //同Polygon的Option设置
            });
            break;
        }
        case 'circle':{
            mouseTool.circle({
                fillColor:'#00b0ff',
                strokeColor:'#80d8ff'
                //同Circle的Option设置
            });
            break;
        }
        case 'origin':{
            mouseTool.marker({
                icon: '../images/起点.png',
                draggable:true
            });
            break;
        }
        case 'destination':{
            mouseTool.marker({
                icon: '../images/终点.png',
                draggable:true
            });
            break;
        }

        ////////// 态势
        case 'situation':{
            function xmMap() {
                var bounds = new AMap.Bounds(),
                    groundImageOpts = {
                        opacity:1,
                        clickable:true,
                        map:mapObj
                    }
                var groundImage = new AMap.GroundImage('../images/起点.png',bounds,groundImageOpts);
            }
            break;
        }






        case 'rule':{
            mouseTool.rule({
                startMarkerOptions : {//可缺省
                    icon: new AMap.Icon({
                        size: new AMap.Size(19, 31),//图标大小
                        imageSize:new AMap.Size(19, 31),
                        image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
                    })
                },
                endMarkerOptions : {//可缺省
                    icon: new AMap.Icon({
                        size: new AMap.Size(19, 31),//图标大小
                        imageSize:new AMap.Size(19, 31),
                        image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
                    }),
                    offset: new AMap.Pixel(-9, -31)
                },
                midMarkerOptions : {//可缺省
                    icon: new AMap.Icon({
                        size: new AMap.Size(19, 31),//图标大小
                        imageSize:new AMap.Size(19, 31),
                        image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
                    }),
                    offset: new AMap.Pixel(-9, -31)
                },
                lineOptions : {//可缺省
                    strokeStyle: "solid",
                    strokeColor: "#FF33FF",
                    strokeOpacity: 1,
                    strokeWeight: 2
                }
                //同 RangingTool 的 自定义 设置，缺省为默认样式
            });
            break;
        }
        case 'measureArea':{
            mouseTool.measureArea({
                strokeColor:'#80d8ff',
                fillColor:'#80d8ff',
                fillOpacity:0.3
                //同 Polygon 的 Option 设置
            });
            break;
        }
    }
}
var radios1 = document.getElementsByName('func');
for(var i=0;i<radios1.length;i+=1){
    radios1[i].onchange = function(e){

        draw(e.target.value)
    }
}


document.getElementById('clear').onclick = function(){
    map.remove(overlays);
    overlays = [];
};
document.getElementById('close').onclick = function(){
    mouseTool.close(true);//关闭，并清除覆盖物
    for(var i=0;i<radios.length;i+=1){
        radios[i].checked = false;
    }
};
document.getElementById('close1').onclick = function(){
    mouseTool.close(true);//关闭，并清除覆盖物
    for(var i=0;i<radios.length;i+=1){
        radios[i].checked = false;
    }
};

/*
/////////////////拖拽操作
AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {
    var map = new AMap.Map('container', {
        zoom: 16,
        scrollWheel: false
    });
    var positionPicker = new PositionPicker({
        mode: 'dragMap',
        map: map
    });

    positionPicker.on('success', function(positionResult) {
        document.getElementById('lnglat').innerHTML = positionResult.position;
        document.getElementById('address').innerHTML = positionResult.address;
        document.getElementById('nearestJunction').innerHTML = positionResult.nearestJunction;
        document.getElementById('nearestRoad').innerHTML = positionResult.nearestRoad;
        document.getElementById('nearestPOI').innerHTML = positionResult.nearestPOI;
    });
    positionPicker.on('fail', function(positionResult) {
        document.getElementById('lnglat').innerHTML = ' ';
        document.getElementById('address').innerHTML = ' ';
        document.getElementById('nearestJunction').innerHTML = ' ';
        document.getElementById('nearestRoad').innerHTML = ' ';
        document.getElementById('nearestPOI').innerHTML = ' ';
    });
    var onModeChange = function(e) {
        positionPicker.setMode(e.target.value)
    }
    var startButton = document.getElementById('start');
    var stopButton = document.getElementById('stop');
    var dragMapMode = document.getElementsByName('mode')[0];
    var dragMarkerMode = document.getElementsByName('mode')[1];
    AMap.event.addDomListener(startButton, 'click', function() {
        positionPicker.start(map.getBounds().getSouthWest())
    })
    AMap.event.addDomListener(stopButton, 'click', function() {
        positionPicker.stop();
    })
    AMap.event.addDomListener(dragMapMode, 'change', onModeChange)
    AMap.event.addDomListener(dragMarkerMode, 'change', onModeChange);
    positionPicker.start();
    map.panBy(0, 1);

    map.addControl(new AMap.ToolBar({
        liteStyle: true
    }))
});*/

/////////////////测量操作


///////////////////////查询操作
AMapUI.loadUI(['misc/PoiPicker'], function(PoiPicker) {

    var poiPicker = new PoiPicker({
        //city:'北京',
        input: 'pickerInput'
    });

    //初始化poiPicker
    poiPickerReady(poiPicker);
});

function poiPickerReady(poiPicker) {

    window.poiPicker = poiPicker;

    var marker = new AMap.Marker();

    var infoWindow = new AMap.InfoWindow({
        offset: new AMap.Pixel(0, -20)
    });

    //选取了某个POI
    poiPicker.on('poiPicked', function(poiResult) {

        var source = poiResult.source,
            poi = poiResult.item,
            info = {
                source: source,
                id: poi.id,
                name: poi.name,
                location: poi.location.toString(),
                address: poi.address
            };

        marker.setMap(map);
        infoWindow.setMap(map);

        marker.setPosition(poi.location);
        infoWindow.setPosition(poi.location);

        infoWindow.setContent('POI信息: <pre>' + JSON.stringify(info, null, 2) + '</pre>');
        infoWindow.open(map, marker.getPosition());

        //map.setCenter(marker.getPosition());
    });

    poiPicker.onCityReady(function() {
        poiPicker.suggest('');
    });
}


///////////////折线拖拽

/*var path = [
    [116.362209, 39.887487],
    [116.422897, 39.878002]
];

var polyline1 = new AMap.Polyline({
    path: path,
    isOutline: true,
    outlineColor: '#ffeeff',
    borderWeight: 3,
    strokeColor: "#3366FF",
    strokeOpacity: 1,
    strokeWeight: 6,
    // 折线样式还支持 'dashed'
    strokeStyle: "solid",
    // strokeStyle是dashed时有效
    strokeDasharray: [10, 5],
    lineJoin: 'round',
    lineCap: 'round',
    zIndex: 50,
    showDir:true
});

polyline1.setMap(map);
// 缩放地图到合适的视野级别
map.setFitView([ polyline1 ]);

var polyEditor = new AMap.PolyEditor(map, polyline1);


polyEditor.on('addnode', function(event) {
    log.info('触发事件：addnode')
});

polyEditor.on('adjust', function(event) {
    log.info('触发事件：adjust')
});

polyEditor.on('removenode', function(event) {
    log.info('触发事件：removenode')
});

polyEditor.on('end', function(event) {
    log.info('触发事件： end')
    // event.target 即为编辑后的折线对象
});*/

