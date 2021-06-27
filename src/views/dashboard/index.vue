<template>
  <div v-loading="listLoading" class="dashboard-container">
    <!--    <div class="dashboard-text">name: {{ name }}</div>-->
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
// import adminDashboard from './admin/components/PanelGroup'
import PanelGroup from './admin/components/PanelGroup'
import { queryDeviceInfo, queryDeviceStatusInfo } from '@/api/dashboard'

export default {
  name: 'Dashboard',
  components: { PanelGroup },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      currentRole: 'PanelGroup',
      listLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      Promise.all([queryDeviceInfo(), queryDeviceStatusInfo()])
        .then(response => {
          console.log(response)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
