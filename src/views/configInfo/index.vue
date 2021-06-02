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
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.row.id }}
        </template>
      </el-table-column>
      <el-table-column label="IP">
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column label="CPU数量">
        <template slot-scope="scope">
          {{ scope.row.cpu_num }}
        </template>
      </el-table-column>
      <el-table-column label="CPU型号">
        <template slot-scope="scope">
          {{ scope.row.cpu_model }}
        </template>
      </el-table-column>
      <el-table-column label="硬盘数量">
        <template slot-scope="scope">
          {{ scope.row.harddisks_num }}
        </template>
      </el-table-column>
      <el-table-column label="PPK">
        <template slot-scope="scope">
          {{ scope.row.ppk }}
        </template>
      </el-table-column>
      <el-table-column label="FPK">
        <template slot-scope="scope">
          {{ scope.row.fpk }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)"
          >编辑</el-button>
          <el-button
            slot="reference"
            size="mini"
            @click="handleDel(scope.row, scope.row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="'IP:' + gridDataIP" :visible.sync="dialogTableVisible">
      <el-table :data="gridData">
        <el-table-column label="硬盘">
          <template slot-scope="scope2">
            <span style="margin-left: 10px">{{ scope2.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型">
          <template slot-scope="scope2">
            <el-select v-model="scope2.row.value" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </template>

        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogTableVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDeviceInfo, postDeviceConfigInfo, deleteDeviceInfo } from '@/api/api'
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
      formInline: {
        ip: '',
        region: ''
      },
      list: null,
      allList: null,
      listLoading: true,
      dialogTableVisible: false,
      gridDataIP: '',
      editData: '',
      gridData: [
        {
          name: 'dev/mvm',
          value: 0
        }
      ],
      options: [
        {
          label: '请选择',
          value: 0
        },
        {
          label: '目标盘',
          value: 1
        },
        {
          label: '缓存盘',
          value: 2
        }
      ]
    }
  },
  created() {
    this.fetchData()
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
        if (item.ip.indexOf(ip) > -1) {
          return true
        }
        return false
      })
      console.log('submit!');
    },
    save() {
      console.log(this.gridData);

      const cachdisklistArr = [];
      const harddisksArr = [];
      const dstdisklistArr = [];
      this.gridData.forEach((item) => {
        if (item.value === 1) {
          dstdisklistArr.push(item.name)
        }
        if (item.value === 0) {
          harddisksArr.push(item.name)
        }
        if (item.value === 2) {
          cachdisklistArr.push(item.name)
        }
      })
      if (dstdisklistArr.length > 3) {
        this.$message({
          message: '目标盘数量不可以超过3个',
          type: 'warn'
        });
        return;
      }
      const { id, ipaddr } = this.editData;
      const cachdisknum = cachdisklistArr.length;
      const dstdisknum = dstdisklistArr.length;
      const harddistnum = harddisksArr.length;
      const harddisks = harddisksArr.join(',');
      const cachdisklist = cachdisklistArr.join(',')
      const dstdisklist = dstdisklistArr.join(',')
      axios.post('/api/v1/deviceconfig/saveDeviceConfigInfo', {
        id, ip: ipaddr, cachdisknum, dstdisknum, cachdisklist, dstdisklist, harddistnum, harddisks
      }, {
        headers: {
          'Content-Type': 'application/json; charset=UTF-8'
        }
      }).then((res) => {
        if (res.data.code === '0') {
          this.$message({
            message: '编辑成功',
            type: 'success'
          });
        } else {
          this.$message({
            message: res.data.msg,
            type: 'warn'
          });
        }
        this.dialogTableVisible = false;
      })
    },
    handleEdit(index, row) {
      this.dialogTableVisible = true;
      this.gridDataIP = row.ip
      this.gridData = [];
      postDeviceConfigInfo({ mac: row.mac }).then((res) => {
        this.editData = res;
        if (res.cachdisklist) {
          res.cachdisklist.split(',').forEach((item) => {
            this.gridData.push({
              name: item,
              value: 2
            })
          })
        }
        if (res.harddisks) {
          res.harddisks.split(',').forEach((item) => {
            this.gridData.push({
              name: item,
              value: 0
            })
          })
        }
        if (res.dstdisklist) {
          res.dstdisklist.split(',').forEach((item) => {
            this.gridData.push({
              name: item,
              value: 1
            })
          })
        }
        console.log(res)
      })
    },
    fetchData() {
      this.listLoading = true
      queryDeviceInfo().then(response => {
        this.list = response.data
        this.allList = response.data
        this.listLoading = false
      })
    }
  }
}
</script>
