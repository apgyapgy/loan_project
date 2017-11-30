<template>
	<div class="content">
		<div class="padding-100"></div>
		<!-- banner -->
		<swiper dots-position="center" :aspect-ratio="300/800" :auto="true" :loop="true" dots-class="dot">
	      	<swiper-item class="swiper-demo-img" v-for="(item, index) in banner" :key="index">
	      		<img @click.stop="bannerJump(item.link,index,item.bannerName)" :src="item.bannerImg"/>
	      	</swiper-item>
	    </swiper>
	    <div id="toast" :class="{active:showLoanUserFlag}">
			<span class="user">{{loanUser.mobile}}用户</span>
			<span class="couponPrice">在"{{loanUser.loanName}}"成功借款{{loanUser.loanAmount}}元</span>
		</div>
	    <!-- icons -->
	    <grid :cols="4">
	    	<!-- {"id":"1","length":1,"iconName":"极速贷","iconNumber":"1","iconImg":""} -->
	    	<grid-item v-if="index<=3" v-for="(item,index) in icons" :key="index" :link="item.url" :label="item.iconName">
        		<!-- <img slot="icon" :src="item.icon"> -->
        		<img slot="icon" :src="item.iconImg">
      		</grid-item>
	    </grid>
	    <!-- tip -->
	    <div class="tip">已有58家贷款公司入住贷款超市</div>
	    <!-- tabs -->
	    <div class="channel-tabs">
	    	<!-- {"id":"1","length":1,"categoryName":"新渠道","categoryNumber":"1"} -->
	    	<span @click.stop="changeChannel(0)" class="channel-tab" :class="{'active':activeChannel==0}">新渠道</span>
	    	<span @click.stop="changeChannel(1)" class="channel-tab" :class="{'active':activeChannel==1}">热门渠道</span>
	    </div>
	    <!-- 贷款列表 -->
	    <div class="loan-list clear">
	    	<LoanItem v-for="(item,index) in cateProduct" :top="top" :key="index" :idx="index" :item="item"></LoanItem>
	    </div>
	    <!-- header -->
		<x-header :left-options="{showBack: false}" :headColor="headColor" style="background-color:#fff;">贷款超市</x-header>
	</div>
</template>
<script>
	import { Swiper,SwiperItem,Grid,GridItem,XHeader} from 'vux';
	import LoanItem from '@/components/loanItem/loanItem';
  	import { ajaxAsync } from '../../assets/js/public';
  	import { Bejson } from '../../assets/js/xmltojson';
  	import {stat_o2o} from '../../assets/js/stat_o2o.js';
	export default{
	    data () {
	      return {
	        banner:[],//'./static/images/banner.png','./static/images/banner.png'
	        headColor:'#fe5502',
	        icons:[// {icon:'./static/images/icon1.png',name:'秒审核'}
	        ],
	        activeChannel:0,
	        banner:{},
	        categorys:[],
	        cateProduct:[], //贷款列表 
	        top:3, //前几个显示top标识
	        loanUsers:[],
	        loanUser:{},
	        loanIndex:0,
	        showLoanUserFlag:false,
	        from:''
	      }
	    },
		components: {
		    Swiper,SwiperItem,Grid,GridItem,LoanItem,XHeader
    	},
		methods: {
			changeChannel:function(n){
				this.activeChannel = n;
				this.getLoanList();
				var _channel = n==0?'new-channel':'hot-hannel';
				stat_o2o.oprStat(this.from,'dkcs_channel',"clk",_channel);
			},
		    initData:function () {//获取banner icon等信息
		    	var _this = this;
		        var params = '<INF><transNo>0</transNo><action>qryLoanIndex</action><loanFlag>1</loanFlag></INF>';
		        ajaxAsync({
		        	obj:_this,
		          	params:params,
		          	success:function(data){
		          		//console.log("data:",data);
		            	var xmlobj = Bejson.loadXml(data);
		            	var  data = Bejson.xmltojson(xmlobj);
		            	console.log("index data:",data);
		            	if(data){
		            		var _data = data.INF;
		            		if(_data.banners.banner){
			            		if(_data.banners.banner.length == 1){
		    						_this.banner.push(_data.banners.banner); 
		    					}else{
		    						_this.banner = _data.banners.banner;
		    					}
		    				}else{
		    					_this.banner = [];
		    				}
		            		var _icons = _data.icons.icon;
		            		localStorage['dkcs_icons'] = JSON.stringify(_icons);
		            		for(var key in _icons){
		            			_icons[key].url = '/list?type='+_icons[key].id+'&idx='+key;
		            		}
		            		_this.icons = _icons;
		            		_this.categorys = _data.categorys.category;
		            		if(_data.loanUsers.user){
		            			if(_data.loanUsers.user.length == 1){
		            				_this.loanUsers.push(_data.loanUsers.user);
		            			}else{
		            				_this.loanUsers = _data.loanUsers.user;
		            			}
		            			_this.showLoanUsers();
		            		}
		            		_this.getLoanList();
		            	}
		          	}
		        });
		    },
		    getLoanList:function(){//获取贷款列表 
		    	this.cateProduct = [];
		    	var _this = this;
		    	var _params = '<INF><transNo>0</transNo><action>qryCateProducts</action><loanFlag>1</loanFlag><categoryId>'+this.categorys[this.activeChannel].id+'</categoryId></INF>';
		    	ajaxAsync({
		    		obj:_this,
		    		params:_params,
		    		success:function(data){
		    			var xmlobj = Bejson.loadXml(data);
		    			var data = Bejson.xmltojson(xmlobj);
		    			var _data = data.INF.list;
		    			console.log("_data:",_data)
		    			if(_data){
			    			if(_data.cateProduct.length){
			    				if(_data.cateProduct.length == 1){
			    					_this.cateProduct.push(_data.cateProduct);
			    				}else{
			    					_this.cateProduct = _data.cateProduct;
			    				}
			    			}else{
			    				_this.cateProduct=[];
			    			}
		    			}
		    		}
		    	})
		    },
		    showLoanUsers:function(){//显示用户贷款弹窗
		    	var _this = this;
		    	if(!_this.loanUsers){
		    		return;
		    	}
		    	var _timer = setInterval(function(){
		    		if(_this.loanIndex >= _this.loanUsers.length){
		    			clearInterval(_timer);
		    			return;
		    		}
		    		var _user = _this.loanUsers[_this.loanIndex];
		    		_user.mobile = _user.mobile.substring(0,3)+'****'+_user.mobile.substring(7);
		    		_this.loanUser = _user;
		    		_this.loanIndex++;
		    		_this.showLoanUserFlag = true;
		    		setTimeout(function(){
		    			_this.showLoanUserFlag = false;
		    		},2000)
		    	},5000);
		    },
		    bannerJump:function(_url,_index,_bannerName){//点banner跳转
		    	stat_o2o.oprStat(this.from,'dkcs_banner',"clk",_bannerName);
		    	if(_url){
		    		this.$router.push({path:_url});
		    	}
		    }
		},
    	mounted () {
      		this.initData();
	    },
	    created:function(){
	    	var _from = '';
	      	if(this.$route.query.from){
	        	_from = this.$route.query.from?this.$route.query.from:'';
	      	}
	      	localStorage.dkcsFrom = _from;
	      	this.from = _from;
	    }
	}
</script>
<style scoped>
	/*toast*/
	#toast{
		position:fixed;
		top:1.1rem;
		left:.1rem;
		/*width:3.5rem;*/
		height:.78rem;
		border:1px solid #f7f3f0;
		color:#fff;
		font-size:.22rem;
		line-height:.30rem;
		border-radius:.2rem;
		background:rgba(0,0,0,.6);
		transition: all 2s ease-in-out;
		z-index:10;
		opacity:0;
	}
	#toast.active{
		opacity:1;
	}
	#toast span{
		display:block;
		padding-left:.2rem;
		padding-right:.2rem;
		height:.32rem;
		line-height:.32rem;
		text-align:left;
	}
	#toast span.user{
		margin-top:.05rem;
	}
	#toast span b{
		font-weight:normal;
	}

	.padding-100{
		width:100%;
		height:1rem;
	}
	/*tabs*/
	.channel-tabs{
		padding:0 .25rem;
		width:100%;
		height:.66rem;
		background:#fff;
		text-align:center;
		box-sizing: border-box;
	}
	.channel-tabs .channel-tab{
		float:left;
		width:50%;
		height:.66rem;
		background:#ffece3;
		color:#393837;
		font-size:.26rem;
		line-height:.66rem;
		text-align:center;
	}
	.channel-tabs .channel-tab.active{
		background:#fe5502;
		color:#fff;
	}
	/*改些插件的样式 */
	.vux-swiper-item.swiper-demo-img img{
		width:100%;
	}
	.content .vux-indicator{
		position:relative;
	}
	.weui-grid:before,
	.weui-grid:after,
	.weui-grids:before{
		display:none;
	}
	.weui-grids{
		padding:10px 5px;
	}
	.weui-grid .weui-grid__icon{
		width:40px;
		height:40px;
	}
	.dot{
		bottom:5px;
	}
	/*tip*/
	.tip{
		width:100%;
		height:.6rem;
		line-height:.6rem;
		background:#fff1f0;
		color:#ed2144;
		font-size:.3rem;
		text-indent:.4rem;
	}
</style>
