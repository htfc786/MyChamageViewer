<template>
  <div class="setting-wrapper">
    <el-row :gutter="20">
      <el-col :span="10">
        <SettingCard
          :title="'文件夹穿透'"
          :status="config.function.penetrate"
          @change="function (v) {
            config.function.penetrate = v
            saveChange()
          }"/>
      </el-col>
      <el-col :span="10">
        <SettingCard
          :title="'拖拽阻尼效果'"
          :status="config.common.animation.move"
          @change="function (v) {
            config.common.animation.move = v
            saveChange()
          }"/>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="10">
        <SettingCard
          :title="'启用换页按钮'"
          :status="config.common.interface.enableChangePageBtn"
          @change="function (v) {
            config.common.interface.enableChangePageBtn = v
            saveChange()
          }"/>
      </el-col>
      <el-col :span="10">
        <SettingCard
          :title="'启用缩放提示'"
          :status="config.common.interface.enableScaleInfo"
          @change="function (v) {
            config.common.interface.enableScaleInfo = v
            saveChange()
          }"/>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="10">
        <SettingCard
          :title="'自动隐藏底部工具栏'"
          :status="config.common.interface.enableAutoHideBottomToolBar"
          @change="function (v) {
            config.common.interface.enableAutoHideBottomToolBar = v
            saveChange()
          }"/>
      </el-col>
    </el-row>
  </div>
  <!-- <el-col :span="6">
    <SettingCard
      :title="'启用底部按钮'"
      :status="config.common.interface.enableBottomToolBar"
      @change="function (v) {
        config.common.interface.enableBottomToolBar = v
        saveChange()
      }"/>
  </el-col> -->
</template>

<script>
import { ipcRenderer } from 'electron'
import SettingCard from '@/views/setting/components/SettingCard'

export default {
  name: 'index',
  components: {
    SettingCard
  },
  data () {
    return {
      config: { // 默认配置
        common: {
          interface: {
            enableChangePageBtn: true,
            enableScaleInfo: true,
            enableBottomToolBar: true,
            enableAutoHideBottomToolBar: false, // 自动隐藏底部工具栏
          },
          animation: {
            move: true
          }
        },
        function: {
          penetrate: true
        }
      }
    }
  },
  mounted () {
    this.config = ipcRenderer.sendSync('setting', { event: 'load' })
  },
  methods: {
    saveChange () {
      ipcRenderer.send('setting', { event: 'save', config: JSON.stringify(this.config) })
    }
  }
}
</script>

<style scoped>
.setting-wrapper {
  width: 100%;
  padding: 20px;
}
.setting-wrapper .el-row {
  margin-bottom: 8px;
}
.setting-wrapper .el-row:last-child {
  margin-bottom: 0;
}
</style>
