/**
*xml对象转json对象
*xmlObj:xml对象
*nodename:节点路径('ROOT/ITEM')
*isarray:true,强制返回数组对象
**/
let Bejson = {
  //xml字符串转xml对象
  loadXml(str) {
    if (str == null) {
      return null;
    }
    var doc = str;
    try{
      doc = createXMLDOM();
      doc.async = false;
      doc.loadXML(str);
    }catch(e){
      doc  = $.parseXML(str);
    }
    return doc;
  },

  /**
   *xml对象转json对象
   *xmlObj:xml对象
   *nodename:节点路径('ROOT/ITEM')
   *isarray:true,强制返回数组对象
   **/
  xmltojson(xmlObj,nodename,isarray){
    var obj=$(xmlObj);
    var itemobj={};
    var nodenames="";
    var getAllAttrs=function(node){//递归解析xml 转换成json对象
      var _itemobj={};
      var notNull=false;
      var nodechilds=node.childNodes;
      var childlenght=nodechilds.length;
      var _attrs=node.attributes;
      var firstnodeName="#text";
      try{
        firstnodeName=nodechilds[0].nodeName;
      }catch(e){}
      if((childlenght>0&&firstnodeName!="#text")||_attrs.length>0){
        var _childs=nodechilds;
        var _childslength=nodechilds.length;
        var _fileName_="";
        if(undefined!=_attrs){
          var _attrslength=_attrs.length;
          for(var i=0; i<_attrslength; i++){//解析xml节点属性
            var attrname=_attrs[i].nodeName;
            var attrvalue=_attrs[i].nodeValue;
            _itemobj[attrname]=attrvalue;
          }
        }
        for (var j = 0; j < _childslength; j++) {//解析xml子节点
          var  _node = _childs[j];
          var  _fildName = _node.nodeName;
          if("#text"==_fildName){break;};
          if(_itemobj[_fildName]!=undefined){//如果有重复的节点需要转为数组格式
            if(!(_itemobj[_fildName] instanceof Array)){
              var a=_itemobj[_fildName];
              _itemobj[_fildName]=[a];//如果该节点出现大于一个的情况 把第一个的值存放到数组中
            }
          }
          var  _fildValue=getAllAttrs(_node);
          try{
            _itemobj[_fildName].push(_fildValue);
          }catch(e){
            _itemobj[_fildName]=_fildValue;
            _itemobj["length"]=1;
          }
        }
      }else{
        _itemobj=(node.textContent==undefined)?node.text:node.textContent;
      }
      return _itemobj;
    };
    if(nodename){
      nodenames=nodename.split("/")
    }
    for(var i=0;i<nodenames.length;i++){
      obj=obj.find(nodenames[i]);
    }
    $(obj).each(function(key,item){
      if(itemobj[item.nodeName]!=undefined){
        if(!(itemobj[item.nodeName] instanceof Array)){
          var a=itemobj[item.nodeName];
          itemobj[item.nodeName]=[a];
        }
        itemobj[item.nodeName].push(getAllAttrs(item));
      }else{
        if(nodenames.length>0){
          itemobj[item.nodeName]=getAllAttrs(item);
        }else{
          itemobj[item.firstChild.nodeName]=getAllAttrs(item.firstChild);
        }
      }
    });
    if(nodenames.length>1){
      itemobj=itemobj[nodenames[nodenames.length-1]];
    }
    if(isarray&&!(itemobj instanceof Array)&&itemobj!=undefined){
      itemobj=[itemobj];
    }
    return itemobj;
  }
}
export {Bejson}
