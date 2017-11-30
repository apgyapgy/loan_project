/**
 * Created by user on 2017/11/22.
 */
//环境
let localhostDev = false;
//如果是本地开发，就把localhostDev 设置成true，连接就是拼成‘http://localhost:8080/api/test’
//生产环境，就把localhostDev 设置成false，连接就是拼成‘http://xxx.com/api/test’
//let _host= localhostDev ? 'http://192.168.8.29:29030/kdy/courier-pre/courierAction' : 'https://o2omch.fuiou.com/';
let _host = localhostDev ? 'http://192.168.8.29:29030/kdy/courier-pre/courierAction' : 'http://sjbkdy.fuiou.com:18916/kdy/courier-pre/courierAction';
// let _hrefUrl = localhostDev ? '/#/' : 'https://static.fuiou.com/sys/ds/o2oh5/mch/#/';
// let _imgHost ='https://static.fuiou.com/';
var ajaxAsync = function(options){/*url,params,success,fail,spinner*/
    if(options.obj){
        options.obj.$vux.loading.show({
            text: 'Loading'
        });
    }
    return $.ajax({
        type:"POST",
            url:_host,
            data:"reqData="+options.params,
            datatype: "xml",//"xml", "html", "script", "json", "jsonp", "text".
            //在请求之前调用的函数
            //beforeSend:function(){$("#msg").html("logining");},
            //成功返回之后调用的函数
            success:options.success,
            //调用执行后调用的函数
            complete: function(XMLHttpRequest, textStatus){
                //alert(XMLHttpRequest.responseText);
                //alert(textStatus);
                //HideLoading();
                if(options.obj){
                    setTimeout(function(){
                        options.obj.$vux.loading.hide();
                    },200)
                    
                }
            },
            //调用出错执行的函数
            error: function(){
                //请求出错处理
            }
        });
};

export { ajaxAsync }
