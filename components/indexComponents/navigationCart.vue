<template>
	<view id="navigationCart">
		<slot></slot>
	</view>
</template>

<script>
	export default {
    name: "NavigationCart",
		data() {
			return {
				
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
  #navigationCart{
    display: flex;
    flex-flow:row wrap;
    align-content: flex-start;
    // background-color: #f6f6f6;
    padding: 0 5%;
    padding-top: 50rpx;
    //box-shadow: 0 -1px 1px rgba(100, 100,100, 0.2);
  }
</style>

