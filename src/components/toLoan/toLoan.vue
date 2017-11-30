<template>
	<div class="to-loan">
		<div class="padding-100" ref="headPadding"></div>
		<iframe id="toLoan" :src="loanDetail.loanLink" width="100%" frameborder="0"></iframe>
		<x-header :left-options="{backText:''}" style="background: #ffffff;" :headColor="headColor">{{loanDetail.loanName}}</x-header>
		<!-- loanLink -->
	</div>
</template>
<script>
	import { XHeader} from 'vux'
  	import { ajaxAsync } from '../../assets/js/public'
  	import { Bejson } from '../../assets/js/xmltojson'
  	//import {stat_o2o} from '../../assets/js/stat_o2o.js';
	export default{
		components: {XHeader},
		data(){
			return {
				loanDetail:{},
				type:"",
				headColor:'#323232'
			}
		},
		methods:{
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
	                  	}else{
	                    	_this.loanDetail = {};
	                  	}
	              	}
	          	})
	      	}
		},
		mounted(){
			var _height = document.documentElement.clientHeight - $('.padding-100').height();
			document.getElementById("toLoan").height = _height;
		},
		created(){
      		if(this.$route.query.type){
        		this.type = this.$route.query.type;
      		}
      		if(this.type){
        		this.getLoanDetail();
      		}
      		this.$vux.loading.show({
	            text: 'Loading'
	        });
    	}
	}
</script>
<style scoped>
	.padding-100{
	    width:100%;
	    height:1rem;
	}
</style>