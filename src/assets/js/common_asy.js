//var couponIp_Test="http://192.168.42.26:8090/fuiou/";
////生产环境地址
var serverIP_Mar = "https://buy.fuiou.com/";//特卖
//var serverIP_Lic = "https://lccs.fuiou.com:10666/fund/";//理财接口
var serverAd = "https://static.fuiou.com/sys/o2o/"; //uat图片地址
//var serverIP_sy = "https://lccs.fuiou.com:10666/fund/";//理财新用户取出

//uat测试环境地址
//var serverIP_Mar = "https://buy.fuiou.com/TEST/";//特卖
//var serverIP_Oneb = "http://jf.fuiou.com/TEST/"; //一元夺宝
var serverIP_Lic = "http://lccs.fuiou.com:10622/fund/";//理财接口
//var serverAd = "http://static.fuiou.com/sys/o2o/"; //uat图片地址
var serverIP_sy = "https://lccs.fuiou.com:10522/fund/";//理财新用户取出

	       
var getSessionId=function(suc){
	fuApp.userInfo(function(userInfo){
		var sessionObj = userInfo.ticket;
		suc(sessionObj);
	},function(){
		showErrorTipCon("用户信息获取失败，请重新登录");
	});
	
};
var ajaxAsync = function(options){/*url,params,success,fail,spinner*/
	getSessionId(function(suc){
		var thsSuc = suc;
		if(/^[^\%\'\"\?]*$/.test(thsSuc)){
			options.params.sessionID=thsSuc;
		}else{
			thsSuc = thsSuc.slice(1,thsSuc.length-1);
			options.params.sessionID=thsSuc;
		}
		var shareInfo_str = window.sessionStorage.getItem("shareInfo");//生产数据
		var params_str = JSON.stringify(options.params);
		var allInfo_str = "";
		if(!shareInfo_str){
			allInfo_str="{"+params_str.substring(1,params_str.length-1)+"}";
		}else{
			allInfo_str="{"+shareInfo_str.substring(1,shareInfo_str.length-1) + "," +params_str.substring(1,params_str.length-1)+"}";
		}
		console.log("请求参数："+allInfo_str,options);
		var allInfo = JSON.parse(allInfo_str);
		return $.ajax({
			url:"192.168.42.26:8088/"+options.url,
			//url:getServerIp(options.status)+options.url,
			dataType:"jsonp",
			contentType: "application/x-www-form-urlencoded;charset=utf-8",
			type:"get",
			jsonp:"jsonpCallback",
			data:allInfo,
			async:true,
			cache: false,//不缓存数据
			success:options.success,
			timeout:9000,
			error:function(XMLHttpRequest,textStatus,errorThrown){
				if(options.fail){
					options.fail(XMLHttpRequest,textStatus,errorThrown);
				}
				$('.'+options.a).html('<p class="errorsTip">数据获取失败，请稍后再试。</p>');
				console.log("XMLHttpRequest:"+XMLHttpRequest.status+"||XMLHttpRequest.readyState:"+XMLHttpRequest.readyState+"||textStatus:"+textStatus+"||errorThrown:"+errorThrown);
			},
			beforeSend: function(){
				//console.log("options.url："+options.url);
				if(options.url!="100001"&&options.url!="100024"&&options.url!="100029"){//01：周边店铺接口；24：团购接口 29:卡券包
					if(document.getElementById("shade")!=undefined){
						$("#shade").show();
					}
				}
			},
			complete:function(){
				if(options.spinner){
					options.spinner.spin();//隐藏 spinner
					if(document.getElementById("shade")!=undefined){
						$("#shade").hide();
					}
				}
			}
		});
	});
};

var isDebug = false;//若在本地调试，改为true,uat或生产环境改为false
if(window.location.hostname === "192.168.42.33"){
	isDebug = true;
}
if(isDebug){
	__cordovaJs = false;
	Android = true;
}
//获取服务器IP地址
var getServerIp=function(status){
	if(isDebug){
		if(status){
			switch(status)
			{
				case "1":
					return serverIP_Oneb;
					break;
				case "2":
					return serverIP_Lic;
					break;
				case "3":
					return serverIP_sy;
					break;
				case "4":
					return serverIP_Mar;
					break;
				case "5":
					return serverIP_act;
					break;
			}
		}else {
			return serverIP_Mar;
		}
	}else{
		if(status){
			switch(status)
			{
				case "1":
					return serverIP_Oneb;
					break;
				case "2":
					return serverIP_Lic;
					break;
				case "3":
					return serverIP_sy;
					break;
				case "4":
					return serverIP_Mar;
					break;
				case "5":
					return serverIP_act;
					break;
			}
		}else {
			return serverIP_Mar;
		}
	}
}

//公用本地存储数据方法
var savePubData = function(key,pubInfo){
	var str_pubInfo = JSON.stringify(pubInfo);
	try{
		window.sessionStorage.setItem(key,str_pubInfo);
	}catch(e){
		showErrorTipCon("该浏览器暂不支持该方法，请使用其他浏览器！");
	}
}
var getPubData = function(key){
	try{
		var obj_pubInfo = JSON.parse(window.sessionStorage.getItem(key));
		return obj_pubInfo; 
	}catch(e){
		showErrorTipCon("该浏览器暂不支持该方法，请使用其他浏览器！");
	}
}

//存储共用字段
var savePubInfo = function(shareInfo){
	var str_shareInfo = JSON.stringify(shareInfo);
	try{
		window.sessionStorage.setItem("shareInfo",str_shareInfo);
		console.log("shareInfo："+window.sessionStorage.getItem("shareInfo"));
	}catch(e){
		showErrorTipCon("该浏览器暂不支持该方法，请使用其他浏览器！");
	}
}


//存储当前地址
var saveCurAddInfo = function(curAddInfo){
	try{
		window.sessionStorage.setItem("curAddInfo",curAddInfo);
	}catch(e){
		showErrorTipCon("该浏览器暂不支持该方法，请使用其他浏览器！");
	}
}
//存储小区地址
var saveHomeAddInfo = function(homeAddInfo){
	try{
		window.sessionStorage.setItem("homeAddInfo",homeAddInfo);
	}catch(e){
		showErrorTipCon("该浏览器暂不支持该方法，请使用其他浏览器！");
	}
}
//存储用户信息
var saveUserInfo = function(userInfo){
	var str_userInfo = JSON.stringify(userInfo);
	try{
		window.sessionStorage.setItem("userInfo",str_userInfo);
		console.log(window.sessionStorage.getItem("userInfo"));
	}catch(e){
		showErrorTipCon("该浏览器暂不支持该方法，请使用其他浏览器！");
	}
}
//获取用户信息并返回用户信息
var getUserInfo = function(suc){
	var userInfoObj = window.sessionStorage.getItem("userInfo");
	//alert("从本地存储获取用户信息："+userInfoObj);
	if(!userInfoObj || userInfoObj.length==0){
		try{
			fuApp.userInfo(function(appUserInfo){
				if(appUserInfo.rspCode == "0000"){
					//alert("用户信息："+JSON.stringify(appUserInfo));
					console.log("用户信息："+JSON.stringify(appUserInfo));
					saveUserInfo(appUserInfo);
					suc(appUserInfo);
				}
				else{
					showErrorTipCon("获取用户信息失败");
				}
			},function(){
				showErrorTipCon("用户信息获取失败");
			});
		}catch(e){
			console.log(e.name + ": " + e.message);
		}
	}
	else{
		//alert("本地有数据");
		suc(JSON.parse(userInfoObj));
	}
}

//记录访问页面次数
var saveRecordTimes = function(recordTimes){
	var str_shareInfo = JSON.stringify(recordTimes);
	try{
		window.sessionStorage.setItem("recordTimes",recordTimes);
		//console.log(window.sessionStorage.getItem("recordTimes"));
	}catch(e){
		showErrorTipCon("该浏览器暂不支持该方法，请使用其他浏览器！");
	}
}

//存储时间
var saveCacheTime = function(curPage,countTimeData){
	var cacheTimeData = window.sessionStorage.getItem("cacheTimeData");
	if(!cacheTimeData){//不存在
		var cacheTimeObj = {"cacheTimes":[countTimeData]};
		window.sessionStorage.setItem("cacheTimeData",JSON.stringify(cacheTimeObj));
	}else{
		var isExit = isExitTimeData(curPage);
		//alert(isExit);
		if(isExit==1){ //已存在
			return;
		}
		else{
			var cachesArr = JSON.parse(cacheTimeData).cacheTimes;
			cachesArr.push(countTimeData);
			var cacheTimeObj = {"cacheTimes":cachesArr};
			window.sessionStorage.setItem("cacheTimeData",JSON.stringify(cacheTimeObj));
		}
		//console.log(window.sessionStorage.getItem("cacheTimeData"));
	}	
}
var isExitTimeData = function(curPage){
	var cacheTimeData = window.sessionStorage.getItem("cacheTimeData");
	//console.log("cacheDomData:"+cacheDomData);
	if(cacheTimeData){
		cacheTimeData = JSON.parse(cacheTimeData);
		for(var m=0;m<cacheTimeData.cacheTimes.length;m++){
			if(curPage == cacheTimeData.cacheTimes[m].index){
				//alert("已存在");
				return 1; //已存在
			}
		}
	}
	return -1; //不存在
}

//存储Json数据
var saveJsonData = function(curPage,jsonData){
	var cacheJsonData = window.sessionStorage.getItem("cacheJsonData");
	if(!cacheJsonData){//不存在
		var cacheJsonObj = {"jsonDatas":[jsonData]};
		window.sessionStorage.setItem("cacheJsonData",JSON.stringify(cacheJsonObj));
	}else{
		var isExit = isExitJsonData(curPage);
		if(isExit==1){ //已存在
			return;
		}
		else{
			var cachesJsonArr = JSON.parse(cacheJsonData).jsonDatas;
			cachesJsonArr.push(jsonData);
			var cacheJsonObj = {"jsonDatas":cachesJsonArr};
			window.sessionStorage.setItem("cacheJsonData",JSON.stringify(cacheJsonObj));
		}
	}
	//console.log(window.sessionStorage.getItem("cacheJsonData"));	
}

var isExitJsonData = function(curPage){
	var cacheJsonData = window.sessionStorage.getItem("cacheJsonData");
	//console.log("cacheDomData:"+cacheDomData);
	cacheJsonData = JSON.parse(cacheJsonData);
	if(cacheJsonData){
		for(var m=0;m<cacheJsonData.jsonDatas.length;m++){
			if(curPage == cacheJsonData.jsonDatas[m].index){
				return 1; //已存在
			}
		}
	}
	return -1; //不存在
}


//清除所有本地存储数据
var clearAllCache = function(){
	window.sessionStorage.clear();
}

//获取地址栏参数
function getAddressParam(name){
	var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if(r!=null)return  unescape(r[2]); return null;
}

var getCurrentTime = function(){
	var date = new Date();
	return date.getHours() + ":" + date.getMinutes();
}

var createLoadingTip = function(){
	var opts = {
		lines: 9, // 花瓣数目
		length: 0,// 花瓣长度
		width: 6,// 花瓣宽度
		radius: 12, // 花瓣距中心半径
		corners: 1,// 花瓣圆滑度 (0-1)
		rotate: 0,// 花瓣旋转角度
		direction: 1,// 花瓣旋转方向 1: 顺时针, -1: 逆时针
		color: '#26bcf9',// 花瓣颜色
		speed: 1,// 花瓣旋转速度
		trail: 85,// 花瓣旋转时的拖影(百分比)
		shadow: false,// 花瓣是否显示阴影
		hwaccel: false,//spinner 是否启用硬件加速及高速旋转     
		className: 'spinner', // spinner css 样式名称
		zIndex: 999,// spinner的z轴 (默认是2000000000)
		top: '50%',// spinner 相对父容器Top定位 单位 px
		left: '50%'// spinner 相对父容器Left定位 单位 px
	};
	var spinner = new Spinner(opts);//实例化loading图案
	var target = $("#loading").get(0);
	spinner.spin(target);
	return spinner;
}

//弹出提示层
var showErrorTipCon = function(content,confirmCallback,cancelCallback){
	var btn_str='';
	if(cancelCallback){
		btn_str = '<div class="cancelBtn" id="cancelBtn">取&nbsp;消</div><div style="width:50%;border-bottom-left-radius:0;" class="errorBtn" id="errorBtn">确&nbsp;定</div>';
	}else{
		btn_str = '<div class="errorBtn" id="errorBtn">确&nbsp;定</div>';
	}
	if($("#errorTipContent").length<=0){
		var html_str = '<div class="errorTipContainer" id="errorTipContent"><div class="errorTip"><div class="errorTitle"><span>提示</span></div><div class="errorContent" id="tipContent">'+content+'</div>'+btn_str+'</div></div>';
		$(document.body).append(html_str);
	}else{
		$("#errorTipContent").css("display","block");
		$("#tipContent").html(content);
	}
	var fun = function(event){
		event.preventDefault();
		event.stopPropagation();
	}
	document.addEventListener('touchmove', fun, false);
	$("#errorBtn").on("click",function(){
		$("#errorTipContent").css("display","none");
		$("#errorBtn").unbind("click");
		document.removeEventListener('touchmove', fun, false);
		if(document.getElementById("shade")!=undefined){
			$("#shade").hide();
		}
		if(confirmCallback){
			confirmCallback();	
		}
	});
	if(cancelCallback){
		$("#cancelBtn").on("click",function(){
			$("#errorTipContent").css("display","none");
			$("#cancelBtn").unbind("click");
			document.removeEventListener('touchmove', fun, false);
			if(document.getElementById("shade")!=undefined){
				$("#shade").hide();
			}
			cancelCallback();	
		});
	}
}


var showErrorTip = function(content,callback){
	$("#errorTipContent").css("display","block");
	$("#tipContent").html(content);
	var fun = function(event){
		event.preventDefault();
		event.stopPropagation();
	}
	if(callback){
		sessionStorage.skiphref=callback;
	}
	document.addEventListener('touchmove', fun, false);
	$("#errorBtn").on("click",function(){
		$("#errorTipContent").css("display","none");
		$("#errorBtn").unbind("click");
		document.removeEventListener('touchmove', fun, false);
		if(sessionStorage.skiphref){
		 window.location.href=sessionStorage.skiphref;
		 sessionStorage.removeItem("skiphref");
		}
		if(document.getElementById("shade")!=undefined){
			$("#shade").hide();
		}
	});
}

var customershowErrorTip=function(fun){
	$("#prompt").css("display","block");
	$("#confirmdelete,#closedelete").on("click",function(e){
		var currentbtn=$(this);
		if(currentbtn.attr("id")=="confirmdelete"){
			fun();
			$("#prompt").css("display","none");
		}else{
			$("#prompt").css("display","none");
		}
	});
}

//注册deviceready事件
var registerDeviceready = function(devicereadyEvent){
	if(isDebug){
		devicereadyEvent();
	}else{
	//	alert("注册事件");
		document.addEventListener("deviceready",function(){
	//		alert("注册事件成功");
			devicereadyEvent();
		});
	}
}

var u = navigator.userAgent, app = navigator.appVersion;
var Android = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
var iOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
//alert('是否是Android：'+isAndroid);
//alert('是否是iOS：'+isiOS);

//var iOS = /(iPad|iPhone|iPod)/g.test(window.navigator.userAgent);
//var Android = /Android/i.test(window.navigator.userAgent);
function registerClickevent(tag,Method){
	if(iOS){
		//$(tag).click(Method);
		tag.onclick = Method;
	}
	else{ 
		if(Android){
			//$(tag).touchstart(Method);
			tag.ontouchstart = Method;	
		}
		else{
			//$(tag).click(Method);
			tag.onclick = Method;
			//alert("pc");
		}
	}
}
var addEvent = (function() {
    if (document.addEventListener) {
        return function(el, type, fn) {
            if (el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            } else {
                el.addEventListener(type, fn, false);
            }
        };
    } else {
        return function(el, type, fn) {
            if (el.length) {
                for (var i = 0; i < el.length; i++) {
                    addEvent(el[i], type, fn);
                }
            } else {
                el.attachEvent('on' + type,
                function() {
                    return fn.call(el, window.event);
                });
            }
        };
    }
})();

$(document).ready(function(){
	if($("header")){
		$("header").after("<div style='height:4rem;'></div>");
	}
	if($("footer")){
		$("footer").before("<div style='width:100%; float:left;height:50px;'></div>");
	}
	detectWebp();
});
function detectWebp () {
    if (!window.sessionStorage || typeof sessionStorage !== 'object') return;
    var name = 'webpa'; // webp available
    if (!sessionStorage.getItem(name) || (sessionStorage.getItem(name) !== 'available' && sessionStorage.getItem(name) !== 'disable')) {
        var img = document.createElement('img');
        img.onload = function () {
            try {
                sessionStorage.setItem(name, 'available');
            } catch (ex) {
            }
        };
        img.onerror = function () {
        try {
                sessionStorage.setItem(name, 'disable');
            } catch (ex) {
            }
        };
        img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA==';
    }
}
exports default = {
	getSessionId:getSessionId,
	ajaxAsync:ajaxAsync,
	getServerIp:getServerIp,
	savePubData:savePubData,
	getPubData:getPubData,
	savePubInfo:savePubInfo,
	saveCurAddInfo:saveCurAddInfo,
	saveHomeAddInfo:saveHomeAddInfo,
	saveUserInfo:saveUserInfo,
	getUserInfo:getUserInfo,
	saveRecordTimes:saveRecordTimes,
	saveCacheTime:saveCacheTime,
	isExitTimeData:isExitTimeData,
	saveJsonData:saveJsonData,
	isExitJsonData:isExitJsonData,
	clearAllCache:clearAllCache,
	getAddressParam:getAddressParam,
	getCurrentTime:getCurrentTime,
	createLoadingTip:createLoadingTip,
	showErrorTipCon:showErrorTipCon,
	showErrorTip:showErrorTip,
	customershowErrorTip:customershowErrorTip,
	registerDeviceready:registerDeviceready,
	registerClickevent:registerClickevent,
	addEvent:addEvent,
	detectWebp:detectWebp
}