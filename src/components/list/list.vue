<template>
	<div class="content">
		<div class="padding-100"></div>
		
		<div class="loan-list clear">
			<LoanItem v-for="(item,index) in typeProduct" :key="index" :idx="index" :top="top" :item="item"></LoanItem>
		</div>
		<x-header :left-options="{backText:''}" :title="title" :headColor="headColor" 
			style="background-color:#fff;"></x-header>
	</div>
</template>
<script>
	import { XHeader} from 'vux';
	import LoanItem from '@/components/loanItem/loanItem';
	import { ajaxAsync } from '../../assets/js/public';
  	import { Bejson } from '../../assets/js/xmltojson';
  	import {stat_o2o} from '../../assets/js/stat_o2o.js';
	export default{
		data(){
			return{
				headColor:"#5b5b5b",
		      	type:'',
		      	typeProduct:[],  //贷款列表 
		      	top:3,  //前几个显示top标识
		      	idx:0,  //点第几个icon进来的
		      	from:'',
		      	title:''
			}
		},
		methods:{
			getLoanList:function(){//获取icon中贷款列表 
				var _this = this;
				this.typeProduct = [];
		    	var _params = '<INF><transNo>0</transNo><action>qryTypeProducts</action><loanFlag>1</loanFlag><loanType>'+this.type+'</loanType></INF>';
		    	ajaxAsync({
		    		obj:_this,
		    		params:_params,
		    		success:function(data){
		    			var xmlobj = Bejson.loadXml(data);
		    			var data = Bejson.xmltojson(xmlobj);
		    			if(data){
			    			data = data.INF;
			    			if(data.list){
			    				var _data = data.list;
			    				if(_data.typeProduct){
			    					if(_data.typeProduct.length == 1){
			    						_this.typeProduct.push(_data.typeProduct); 
			    					}else{
			    						_this.typeProduct = _data.typeProduct;
			    					}
			    					
			    				}
			    				console.log("typeProduct:",_this.typeProduct)
			    			}
			    		}
		    		}
		    	})
			}
		},
		components:{
			XHeader,LoanItem
		},
		created:function(){
			//获取地址栏参数
			if(this.$route.query.type){
				this.type = this.$route.query.type;
			}
			//埋点点击哪个icon
			var _from = localStorage['dkscFrom']?localStorage['dkscFrom']:'';
			this._from = _from;
			if(this.$route.query.idx){  
				var _idx = this.$route.query.idx+1;
				stat_o2o.oprStat(this.from,'dkcs_icon',"clk",_idx);
			}
			//获取title
			var _icons = localStorage['dkcs_icons']?localStorage['dkcs_icons']:'';
			var _title = '';
			if(_icons){
				_icons = JSON.parse(_icons);
				for(var key in _icons){
					if(this.type == _icons[key].id){
						_title = _icons[key].iconName;
						break;
					}
				}
			}
			this.title = _title;
			//获取贷款列表 
			if(this.type){
				this.getLoanList();
			}
		}
	}
</script>
<style scoped>
	.loan-list{
		background:#fff;
	}
	.padding-100{
		width:100%;
		height:1rem;
	}
</style>