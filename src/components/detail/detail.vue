<template>
	<div>
    <!-- <div class="padding-100"></div> -->
    <div class="container">
      <div class="font28 container-top">
        <div class="container-top-lf">
          <img :src="loanDetail.logoImg" />
        </div>
        <div class="container-top-fr">
          <span class="block people"><b>{{loanDetail.loanName}}</b><label class="fr font24 peopleNum tangerine">本期剩余<strong class="tangerine">{{loanDetail.restNums}}</strong>个名额</label></span>
          <span class="block font24 gray">利率最低：<strong class="tangerine">{{loanDetail.loanRate}}%</strong><label class="fr font24">申请成功：<strong class="tangerine">{{loanDetail.applyNums}}</strong>人</label></span>
        </div>
      </div>
      <div class="vux-1px">
        <flexbox class="list font24">
          <flexbox-item><div class="flex-list vux-1px-r">额度<br><label class="font28">{{loanDetail.amountMin}}-{{loanDetail.amountMax}}</label></div></flexbox-item>
          <flexbox-item><div class="flex-list vux-1px-r">期限<br><label class="font28">{{loanDetail.dueMin}}-{{loanDetail.dueMax}}天</label></div></flexbox-item>
          <flexbox-item><div class="flex-list">日利率
            <!-- <img class="question" src="../../../static/images/question.png" /> --><br><label class="font28">{{loanDetail.loanRate}}%</label></div></flexbox-item>
        </flexbox>
      </div>
      <div class="content font26">
        <p>
          <label class="title">贷 款 金 额</label>
          <span class="fl"><input class="input-money tangerine" type="number" value="0" v-model="money">元<small class="gray">（{{loanDetail.amountMin}}-{{loanDetail.amountMax}}）</small></span>
        </p>
        <p>
          <label class="title">贷 款 期 限</label>
          <span class="fl"><input class="input-day tangerine" type="number" value="0" v-model="day">日<small class="gray">（{{loanDetail.dueMin}}-{{loanDetail.dueMax}}）</small></span>
        </p>
        <p>
          <label class="title">预计还款金额</label>
          <span class="fl"><input class="input-amt tangerine"  v-model="totalInterest"  readonly>元</span>
        </p>
      </div>
      <div class="subContent vux-1px">
        <span class="subTitle block vux-1px-b">
          <label class="subTxt font24">审核说明</label>
        </span>
        <p class="gray">
          审核方式：{{loanDetail.auditMode}}<br>
          审核周期：{{loanDetail.auditTime}}<br>
          放款时间：最快{{loanDetail.giveTime}}放款<br>
          还款方式：{{loanDetail.payMode}}
        </p>
      </div>
      <div class="subContent vux-1px">
        <span class="subTitle block vux-1px-b">
          <label class="subTxt font24">申请条件</label>
        </span>
        <p class="gray">
          {{loanDetail.applyReq}}
        </p>
      </div>
      <div class="subContent vux-1px" style="margin-bottom: 50px">
        <span class="subTitle block vux-1px-b">
          <label class="subTxt font24" :left-options="{backText:''}">详细介绍</label>
        </span>
        <p class="gray">
          {{loanDetail.introduce}}
        </p>
      </div>
    </div>
    <div class="height50"></div>
    <div class="padding-40"></div>
    <button class="submit" :class="{'disabled':!checkAble}" @click="apply">立即申请</button>
    <!-- <x-header :left-options="{backText:''}" style="background: #ffffff;" :headColor="headColor">{{loanDetail.loanName}}</x-header> -->
	</div>
</template>
<script>
  import { XHeader, Flexbox, FlexboxItem, XInput, Toast, } from 'vux'
  import { ajaxAsync,updateTitle } from '../../assets/js/public'
  import { Bejson } from '../../assets/js/xmltojson'
  import {stat_o2o} from '../../assets/js/stat_o2o.js';
  export default {
    components: {XHeader,Flexbox,FlexboxItem,XInput,Toast},
    data () {
      return {
        money: '',
        day:'',
        interest:'0.0002',
        totalInterest:'0',
        position: 'default',
        showPositionValue: false,
        headColor:'#323232',
        type:'',
        loanDetail:{},   //贷款详细信息\
        from:'',//来源
        phonePre:[134,135,136,137,138,139,147,150,151,157,158,159,170,178,182,183,184,187,188,130,131,132,145,152,155,156,171,176,185,186,133,134,153,170,177,180,181,189]
      }
    },
    watch:{
      day:'checkDay',
      money:'checkMoney',
    },
    methods: {
      getTotalInterest(){
        if(this.money && this.day && this.interest){
          //this.totalInterest = this.money + this.money * this.day * this.interest;
          this.totalInterest = this.money - 0 + this.money * this.day * (this.loanDetail.loanRate/100);
          //console.log('应付金额：'+this.totalInterest);
        }
      },
      checkDay(){
        if(this.day){
          if(!(/^\+?[1-9][0-9]*$/).test(this.day)){//如果不是整数，改为整数
            this.day = parseInt(this.day);
          }
          if(this.money){
            this.getTotalInterest();
          }
        }
      },
      checkMoney(){
        if(this.money){
          if(!(/^\+?[1-9][0-9]*$/).test(this.money)){//如果不是整数，改为整数
            this.money = parseInt(this.money);
          }
          if(this.day){
            this.getTotalInterest();
          }
        }
      },
      getMoney() {
        var val = this.money-0;
        if(val){
          var _text = '贷款金额应为'+this.loanDetail.amountMin+'-'+this.loanDetail.amountMax+'之间的整数'
          if(val < this.loanDetail.amountMin-0 || val > this.loanDetail.amountMax-0){
            this.$vux.toast.text(_text, 'default');
            return false;
          }
          return true;
        }else {
          this.$vux.alert.show({
            title: '提示',
            content: '贷款金额必须填写',
          });
          return false;
        }
      },
      getDay(){
        var val = this.day-0;
        if(val){
          var _text = '贷款期限应为'+this.loanDetail.dueMin+'-'+this.loanDetail.dueMax+'之间的整数';
          if(val < this.loanDetail.dueMin-0 || val > this.loanDetail.dueMax-0){
            this.$vux.toast.text(_text, 'default');
            return false;
          }
          return true;
        }else {
          this.$vux.alert.show({
            title: '提示',
            content: '贷款期限必须填写',
          });
          return false;
        }
      },
      getLoanDetail:function(){
          var _this = this;
          var _params = '<INF><transNo>0</transNo><action>qryProductDtl</action><loanFlag>1</loanFlag><loanId>'+this.type+'</loanId></INF>';
          ajaxAsync({
              obj:_this,
              params:_params,
              success:function(data){
                  var xmlobj = Bejson.loadXml(data);
                  var data = Bejson.xmltojson(xmlobj);
                  var _data = data.INF;
                  if(_data.rcd == '0000'){
                    _this.loanDetail = _data;
                    updateTitle(_this.loanDetail.loanName);
                    //document.getElementsByTagName("title")[0].innerHTML =_this.loanDetail.loanName;
                  }else{
                    _this.loanDetail = {};
                  }
              }
          })
      },
      accAdd:function(arg1,arg2){ 
        var r1,r2,m; 
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0} 
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0} 
        m=Math.pow(10,Math.max(r1,r2)) 
        return (arg1*m+arg2*m)/m 
      },
      accMul:function(arg1,arg2){ 
        var m=0,s1=arg1.toString(),s2=arg2.toString(); 
        try{m+=s1.split(".")[1].length}catch(e){} 
        try{m+=s2.split(".")[1].length}catch(e){} 
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m) 
      },
      apply:function(){//点立即申请
        $(".input-money").blur();
        $(".input-day").blur();
        if(!this.money || !this.day){
          return;
        }
        if(JSON.stringify(this.loanDetail)=='{}'){
          return;
        }
        if(this.getMoney() && this.getDay()){
          var _this = this;
          var _phone = "";
          var _random = parseInt(Math.random()*this.phonePre.length);
          _phone += this.phonePre[_random]+'1818';
          for(var i = 0;i<4;i++){
            _phone += parseInt(Math.random()*10);
          }
          var _params = '<INF><transNo>0</transNo><action>saveInfo</action><loanFlag>1</loanFlag><loanId>'+this.loanDetail.id+'</loanId><loanMobile>'+_phone+'</loanMobile><loanAmount>'+this.money+'</loanAmount><loanTimes>'+this.day+'</loanTimes><repayAmount>'+this.totalInterest+'</repayAmount></INF>';
          ajaxAsync({
            obj:_this,
            params:_params,
            success:function(data){
              var xmlobj = Bejson.loadXml(data);
              var data = Bejson.xmltojson(xmlobj);
              var _data = data.INF;
              if(_data.rcd == '0000'){
                if(_this.loanDetail.loanLink){
                  location.href = _this.loanDetail.loanLink;
                }
              }
            }
          });
          stat_o2o.oprStat(this.from,'dkcs_apply',"clk",this.type+'-'+this.money+'-'+this.day);
        }        
      }
    },
    computed:{
      checkAble(){
        if(this.day && this.money){
          return true;
        }else{
          return false;
        }
      }
    },
    created:function(){
      if(this.$route.query.type){
        this.type = this.$route.query.type;
      }
      if(this.type){
        this.getLoanDetail();
      }
      var _from = localStorage['dkcsFrom']?localStorage['dkcsFrom']:'';
      this.from = _from;
    }
  }
</script>
<style scoped>
  .padding-40{
    width:100%;
    height:40px;
  }
  .header{
    background: #FFFFFF;
  }
  .padding-100{
    width:100%;
    height:1rem;
  }
  .container{
    margin: .25rem;
  }
  .container-top{
    display: flex;
    margin-bottom: .1rem;
  }
  .container-top-lf{
    width: 20%;
    float: left
  }
  .container-top-fr{
    width: 80%;
    float: left;
    padding: .1rem 0;
  }
  .people{
    margin-bottom: .05rem;
    text-align:left;
  }
  .peopleNum{
    border: 1px solid #ffc3a6;
    background: #fff7f4;
    padding:.05rem;
    line-height: .26rem;
  }
  .list{
    padding:.20rem;
  }
  .flex-list {
    text-align: center;
    font-size: .24rem;
    line-height: .40rem;
  }
  .question{
    margin-left: 5px
  }
  .content{
    text-align: center;
    margin: .3rem 0;
    line-height: .6rem;
    width: 100%;
    float: left;
  }
  .content input{
    border-bottom: 1px solid #eee;
    margin: 0 .05rem;
    padding: 0 .05rem;
    line-height: .4rem;
    width: 1.5rem;
    text-align: center;
  }
  .content input.input-amt{
    border-bottom: 0;
  }
  .content .title{
    width:40%;
    float: left;
    text-align: right
  }
  .subContent{
    width: 100%;
    float: left;
    padding: .1rem;
    line-height: .4rem;
    margin-bottom: .15rem;
    font-size:.26rem;
    text-align:left;
  }
  .subTitle{
    padding: .05rem;
  }
  .subTxt{
    border-left:2px solid #fe5502;
    padding-left: .05rem;
    font-weight: bold;
  }
  .subContent p{
    margin: .1rem;
  }
  .weui-cell{
    font-size: .26rem;
  }
  .weui-dialog__hd{
    padding: 0;
  }
  .submit{
    position: fixed;
    bottom: 0;
    width: 100%;
    height:40px;
    display: block;
    background: #1AAD19;
    color: #ffffff;
    line-height:40px;
    font-size: .4rem;
  }
  .submit.disabled{
    background:#ccc;
  }
  .height50{
    width: 100%;
    height: 50px;
  }
  .block{
    text-align:left;
  }
</style>
