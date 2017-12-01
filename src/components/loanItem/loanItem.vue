<template>
	<div class="loan-item" @click.stop="jumpInfo(item.loanId)">
		<div class="loan-item-top">
			<div class="loan-icon">
				<div v-if="idx<=top-1" class="top"></div>
				<img :src="item.logoImg?item.logoImg:'./static/images/loan-icon.png'" alt="">
			</div>
			<div class="loan-info">
				<span class="loan-title">{{item.loanName}}</span>
				<span class="loan-max-quota">最高额度:  {{item.amountMax>10000?parseInt(item.amountMax/1000)/10+'万':item.amountMax}}元</span>
				<span class="loan-min-rate">利率最低:  <b>{{item.loanRate}}%</b></span>
				<span class="loan-apply-success-num">申请成功:  <b>{{item.applyNums}}</b>人</span>
			</div>
			<div class="remaining-quota">本期剩余{{item.restNums}}个名额</div>
		</div>
		<div class="loan-item-bottom">{{item.keyWords}}</div>
	</div>
</template>
<script>
	import {stat_o2o} from '../../assets/js/stat_o2o.js';
	export default{
		props:{
			idx:Number,
			item:Object,
			top:Number
		},
		methods:{
			jumpInfo:function(_id){
				var _from = localStorage['dkcsFrom'];
				stat_o2o.oprStat(_from,'dkcs_list',"clk",_id);
				this.$router.push({
					path:'/detail?type='+_id
				});
			}
		},
		created(){
			var _from = localStorage['dkcsFrom']?localStorage['dkcsFrom']:'';
		}
	}
</script>
<style scoped>
	.loan-item{
		margin:.15rem auto 0;
		width:6.9rem;
		height:1.9rem;
		background:#fff;
	}
	.loan-item-top{
		position:relative;
		width:100%;
		height:1.3rem;
	}
	.loan-item-top .loan-icon{
		position:relative;
		margin-top:.2rem;
		margin-left:.2rem;
		float:left;
		width:1rem;
		height:1rem;
	}
	.loan-item-top .loan-icon img{
		float:left;
		width:100%;
		height:100%;
	}
	.loan-item-top .loan-icon .top{
		position:absolute;
		top:-0.2rem;
		left:-0.2rem;
		width:.7rem;
		height:.7rem;
		background:url("../../../static/images/top.png") no-repeat center;
		background-size:.7rem auto;
	}
	.loan-item-bottom{
		width:100%;
		height:.5rem;
		background:#fcf7f4;
		color:#5b5b5b;
		font-size:.22rem;
		line-height:.5rem;
		text-indent:.15rem;
		box-shadow:-3px 3px 4px #f4e5dd;
		text-align:left;
		overflow:hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
	.loan-info{
		float:left;
		margin-left:.6rem;
		width:5.1rem;
		height:1.3rem;
	}
	.loan-info>span{
		float:left;
		width:100%;
		height:.34rem;
		line-height:.34rem;
		font-size:.24rem;
		color:#9b9b9b;
		text-align:left;
	}
	.loan-info .loan-min-rate,
	.loan-info .loan-apply-success-num{
		margin-top:.1rem;
		width:50%;
	}
	.loan-info .loan-min-rate b,
	.loan-info .loan-apply-success-num b{
		color:#fe5502;
		font-weight:normal;
	}
	.loan-info .loan-title{
		margin-top:.12rem;
		height:.34rem;
		line-height:.34rem;
		font-size:.26rem;
		color:#2b2b2b;
	}
	.remaining-quota{
		position:absolute;
		right:0;
		top:0;
		padding:0 .15rem;
		height:.4rem;
		line-height:.4rem;
		font-size:.22rem;
		color:#fe5502;
		border:1px solid #ffbb9a;
		border-bottom:2px solid #ffdbc9;
		box-sizing: content-box;
	}
</style>
