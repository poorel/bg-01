<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="IP">
        <el-input v-model="formInline.ip" placeholder="请输入ip地址" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      row-class-name="minStyle"
      highlight-current-row
    >
      <el-table-column align="center" label="IP">
        <template slot-scope="scope">
          {{ scope.row.ipaddr }}
        </template>
      </el-table-column>
      <el-table-column label="错误">
        <template slot-scope="scope">
          <p :class="[scope.row.error ? 'BGRed' : 'BGGreen']">{{ scope.row.error }}</p>
        </template>
      </el-table-column>
      <el-table-column label="CPU使用率">
        <template slot-scope="scope">
          {{ scope.row.cpuuse }}
        </template>
      </el-table-column>
      <el-table-column label="进程数">
        <template slot-scope="scope">
          {{ scope.row.pid_count }}
        </template>
      </el-table-column>
      <el-table-column label="已完成图数量">
        <template slot-scope="scope">
          {{ scope.row.finishtimes }}
        </template>
      </el-table-column>
      <el-table-column label="目标盘使用率">
        <template slot-scope="scope">
          <!--          :class="[ scope.row.dstuse > -1 ? 'BGYellow' : '']"-->
          <p>{{ scope.row.dstuse }}</p>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            slot="reference"
            size="mini"
            @click="handleDel(scope.row, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { queryDeviceStatusInfo, deleteDeviceInfo } from '@/api/api'

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
      formInline: {
        ip: ''
      },
      list: null,
      allList: null,
      listLoading: true
    }
  },
  created() {
    this.fetchData()
    setInterval(() => {
      this.fetchData()
    }, 1000 * 60 * 2)
  },
  methods: {
    handleDel(index, row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeviceInfo({ mac: row.mac }).then(() => {
          this.fetchData()
        })
      })
    },
    onSubmit() {
      const ip = this.formInline.ip;
      if (!ip) {
        this.list = this.allList;
        return;
      }
      this.list = this.allList.filter((item) => {
        if (item.ipaddr.indexOf(ip) > -1) {
          return true
        }
        return false
      })
      console.log('submit!');
    },
    fetchData() {
      this.listLoading = true
      queryDeviceStatusInfo().then(response => {
        this.list = response.data
        this.allList = response.data
        this.listLoading = false
      })
    }
  }
}
</script>
<style>
.BGRed{
  color: red;
}
.BGGreen{
  color: green;
}
.BGYellow{
  color: yellow;
}
.minStyle{
  background: rebeccapurple;
}
.el-table td, .el-table th{
  padding: 0!important;
}
</style>
