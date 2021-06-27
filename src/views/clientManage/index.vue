<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="IP">
        <el-input v-model="formInline.ip" placeholder="请输入ip地址" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          新增
        </el-button>
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
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{ scope.row.customer_name }}
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
      <el-table-column label="总容量(PB)">
        <template slot-scope="scope">
          {{ scope.row.capacity ? scope.row.capacity.toFixed(1) : ''}}
        </template>
      </el-table-column>
      <el-table-column label="备注">
        <template slot-scope="scope">
          {{ scope.row.comment }}
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <!--        <el-form-item label="Date" prop="timestamp">-->
        <!--          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
        <!--        </el-form-item>-->
        <el-form-item label="名称" prop="customer_name">
          <el-input v-model="temp.customer_name" :disabled="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="ppk" prop="ppk">
          <el-input v-model="temp.ppk" />
        </el-form-item>
        <el-form-item label="fpk" prop="fpk">
          <el-input v-model="temp.fpk" />
        </el-form-item>
        <el-form-item label="容量（PB）">
          <el-input v-model="temp.capacity" />
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="temp.comment" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryDeviceInfo, postDeviceConfigInfo, deleteDeviceInfo } from '@/api/client'
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
      textMap: {
        update: '编辑',
        create: '新增'
      },
      dialogStatus: '',
      formInline: {
        ip: '',
        region: ''
      },
      list: null,
      allList: null,
      listLoading: true,
      dialogTableVisible: false,
      dialogFormVisible: false,
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
      ],
      temp: {
        id: undefined,
        customer_name: '',
        ppk: '',
        fpk: '',
        capacity: '',
        comment: ''
      },
      rules: {
        customer_name: [{ required: true, message: '请填写必填项', trigger: 'change' }],
        ppk: [{ required: true, message: '请填写必填项', trigger: 'change' }],
        fpk: [{ required: true, message: '请填写必填项', trigger: 'change' }],
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          axios.post('/api/v1/customerinfo/save', this.temp, {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          });
        }
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          axios.post('/api/v1/customerinfo/save', this.temp, {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          });
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        customer_name: '',
        ppk: '',
        fpk: '',
        capacity: '',
        comment: ''
      }
    },
    handleEdit(index, row) {
      this.temp = row;
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleDel(index, row) {
      this.$confirm('确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteDeviceInfo({ id: row.id }).then(() => {
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
