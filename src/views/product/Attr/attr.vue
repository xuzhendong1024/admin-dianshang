<template>
  <div>
    <el-card style="margin: 20px 0" shadow="hover">
      <category-select />
    </el-card>
    <el-card shadow="hover"></el-card>
  </div>
</template>

<script>
  import CategorySelect from "@/components/CategorySelect";
  export default {
    name: "attr",
    components: {
      CategorySelect
    },

  }
</script>

<style scoped>

</style>
