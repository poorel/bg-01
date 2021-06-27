<template>
  <div class="app-container">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="IP">
        <el-input v-model="formInline.ip" placeholder="请输入ip地址" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
          配置客户
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column align="center" label="IP">
        <template slot-scope="scope">
          {{ scope.row.ip }}
        </template>
      </el-table-column>
      <el-table-column label="客户名称">
        <template slot-scope="scope">
          {{ scope.row.customer_name }}
        </template>
      </el-table-column>
      <!--      <el-table-column label="操作">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            size="mini"-->
      <!--            @click="handleEdit(scope.$index, scope.row)"-->
      <!--          >编辑</el-button>-->
      <!--          <el-button-->
      <!--            slot="reference"-->
      <!--            size="mini"-->
      <!--            @click="handleDel(scope.row, scope.row)"-->
      <!--          >删除</el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="width: 400px; margin-left:50px;">
        <!--        <el-form-item label="Date" prop="timestamp">-->
        <!--          <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="Please pick a date" />-->
        <!--        </el-form-item>-->
        <el-form-item label="客户名称" prop="customer_name">
          <el-select v-model="temp.customer_name" placeholder="请选择" clearable class="filter-item" style="width: 130px">
            <el-option v-for="item in calendarTypeOptions" :key="item.id" :label="item.customer_name" :value="item.customer_name" />
          </el-select>
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
import { queryDeviceInfo, queryCustomerinfo } from '@/api/orderManage'
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
        create: '配置IP'
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
      multipleSelection: [],
      gridData: [
        {
          name: 'dev/mvm',
          value: 0
        }
      ],
      calendarTypeOptions: [],
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
        fpk: [{ required: true, message: '请填写必填项', trigger: 'change' }]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
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
          const macs = this.multipleSelection.map(item => item.mac).join(',');
          const customer_name = this.temp.customer_name
          axios.post('/api/v1/device/updateDeviceCustomer', { macs, customer_name }, {
            headers: {
              'Content-Type': 'application/json; charset=UTF-8'
            }
          }).then(() => {
            this.fetchData()
            this.dialogFormVisible = false
            this.$message({
              message: '修改成功',
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
      this.resetTemp();
      const arr = this.multipleSelection;
      if (arr.length === 0) {
        this.$message({
          message: '请选择要配置的IP',
          type: 'warn'
        });
        return
      }
      this.dialogFormVisible = true
      this.dialogStatus = 'create'
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
      queryCustomerinfo().then(response => {
        this.calendarTypeOptions = response.data
      })
    }
  }
}
</script>
