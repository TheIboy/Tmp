<template>
<view class='window' v-show="showdetail">
	<view class="window-bg" @click="windowhidden"></view>
	<view class="window-content">
		<view class="window-content-inner">
			<slot></slot>
		</view>
	</view>
</view>
</template>

<script>

export default {
	props:{
		showdetail: {
			type: Number,
			default: '',
			require: true
		},
	},
	methods: {
		windowhidden(){
			let show = 0
			this.$emit('window',show)
		}
	}
}
</script>
<style lang='scss' scoped>
.window{
	&-bg{
		position: fixed;
		width: 100%;
		height: 100%;
		opacity: 0.7;
		filter: alpha(opacity=70);
		top: 0;
		left: 0;
		z-index: 99;
		background-color: #444343;
	}
	&-content{
		position: fixed;
		font-size: 20px;
		width: 72%;
		background-color: #ffffff;
		border-radius: 0.25rem;
		top: 55%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 100;
		height: auto;
		&-inner{
			font-size: 13px;
		}
	}
}

</style>