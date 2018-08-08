<template>
	<div :style="{width:contentWidth,height:contentHeight}" class="mapControllerBox">
		<Button type="primary" shape="circle" icon="close" title="关闭" class="closeBtn" @click="goBack"></Button>
		<div id="map" ref="map" :style="{height:contentHeight}"></div>
	</div>
</template>
<script>
import { getNewMapConfig, getNewMapJson } from '@/api/mapConfig-service'
export default {
	data() {
		return {
			isShow: false,
			url: 'http://zhsq.digitalcq.com/D2CJsonV2/',
			jsonUrl: '',
			contentHeight: document.body.clientHeight + 'px',
			contentWidth: document.body.clientWidth + 'px'
		}
	},
	created() {
		this.jsonUrl = this.url + this.$store.state.mapInfo.dataPath
		this.getMapJsonAndImg()
	},
	mounted() {
		const that = this
		window.onresize = () => {
			that.contentHeight = document.body.clientHeight + 'px'
			that.contentWidth = document.body.clientWidth + 'px'
		}
	},
	destroyed() {
		d2cMap.remove()
		window.d2cMap = ''
	},
	methods: {
		// 获取影像option中的 layer 和 source
		getLayerAndSourceFromOption(option) {
			let res = {};
			if (option && option.layers && option.sources) {
				res["layers"] = option.layers;
				res["sources"] = option.sources;
			} else {
				res["layers"] = '';
				res["sources"] = '';
			}
			return res;
		},
		// 规范底图style数据格式
		getConfig(data) {
			return {
				container: data.container || 'map',
				center: [106.60033668586209, 29.65436210813256],
				bearing: 0,
				zoom: 7,
				maxzoom: data.maxzoom || 18,
				minzoom: data.minzoom || 0,
				localIdeographFontFamily: "'微软雅黑'",
				style: {
					version: data.version || 8,
					glyphs: data.glyphs,
					sprite: data.sprite,
					sources: data.sources,
					layers: data.layers,
					metadata: data.metadata
				}
			}
		},
		//获取底图Json
		getMapJsonAndImg() {
			getNewMapConfig().then(res => {
				for (var i in res.data) {
					if (res.data[i].m_order == 1) {
						getNewMapJson(res.data[i].m_url).then(res => {
							this.loadThisMap(res)
						})
					}
				}
			})
		},
		//加载地图
		loadThisMap(data) {
			window.d2cMap = new window.d2c.map({
				...this.getConfig(data),
				localIdeographFontFamily: "'Noto Sans', 'Noto Sans CJK SC', sans-serif"
			})
			d2cMap.getCanvas().style.cursor = "default"
			getNewMapJson(this.jsonUrl).then(res => {
				this.addLayer(res)
			})
		},
		//加载图层
		addLayer(data) {
			if (d2cMap) {
				for (let i in data.sources) {
					d2cMap.addSource(i, data.sources[i])
				}
				data.layers.map(v => {
					d2cMap.addLayer(v)
				})
			} else {
				this.$Message.info('地图尚未加载完成，请等待')
				setTimeout(function () {
					for (let i in data.sources) {
						d2cMap.addSource(i, data.sources[i])
					}
					data.layers.map(v => {
						d2cMap.addLayer(v)
					})
				}, 1000)
			}
		},
		//返回
		goBack() {
			this.$router.go(-1)
		}
	}
}
</script>

<style>
.mapControllerBox {
  position: absolute;
  left: 0;
  top: 0px;
  z-index: 950;
  background-color: #fff;
}
.closeBtn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
  cursor: pointer;
}
#map canvas {
}
</style>
