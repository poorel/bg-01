<template>
  <div class="app-container">
    <!--    <el-divider content-position="left">标题说明位置（可以不用）</el-divider>-->
    <el-transfer v-model="value" :titles="['IP列表', '已选IP列表']" :data="IPData" />
    <el-input
      v-model="ppk"
      class="mgr20"
      :rows="2"
      placeholder="请输入内容"
    >
      <template slot="prepend">PPK</template>
    </el-input>
    <el-input
      v-model="fpk"
      :rows="2"
      placeholder="请输入内容"
    >
      <template slot="prepend">FPK</template>
    </el-input>
    <el-row class="txc">
      <el-button type="primary" :disabled="!this.ppk || !this.fpk || !value.length" @click="save">保存</el-button>
    </el-row>

  </div>
</template>

<script>
import { queryDeviceInfo, saveDevicePPKConfigInfo } from '@/api/api'
import axios from 'axios'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      IPData: [],
      value: [],
      ppk: '',
      fpk: ''
    };
  },
  created() {
    this.fetchData()
  },
  methods: {
    save() {
      const macs = this.value.join(',');
      const ppk = this.ppk;
      const fpk = this.fpk;
      // if (!this.ppk || !this.fpk || !macs) {
      //   this.$message.error('ppk,fpk,ip军需');
      // }
      axios.post('/api/v1/deviceconfig/saveDevicePPKConfigInfo', { macs, fpk, ppk }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then(() => {
        this.$message({
          message: '保存成功',
          type: 'success'
        });
      })
    },
    fetchData() {
      this.listLoading = true
      queryDeviceInfo().then(response => {
        this.list = response.data
        if (response.data) {
          response.data.forEach(item => {
            this.IPData.push({
              key: item.mac,
              label: item.ip
            })
          })
        }
        console.log(this.IPData);
        this.listLoading = false
      })
    }
  }
}
</script>
<style>
.mgr20{
  margin: 20px 0;
}
.txc{
  text-align: center;
  margin-top: 20px;
}
</style>
