<!--三级联动组件-->
<template>
  <div>
    <el-form :inline="true" :model="threeForm" label-width="80px">
      <el-form-item label="一级分类">
        <el-select v-model="threeForm.category1Id" placeholder="请选择" @change="handler1">
          <el-option
            v-for="item in category1List"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="threeForm.category2Id" placeholder="请选择" @change="handler2">
          <el-option
            v-for="item in category2List"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select v-model="threeForm.category3Id" placeholder="请选择">
          <el-option
            :key="category3List.id"
            :label="category3List.name"
            :value="category3List.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    name: "CategorySelect",
    data() {
      return {
        threeForm: {
          category1Id: '',
          category2Id: '',
          category3Id: '',
        },
        category1List: [],
        category2List: [],
        category3List: '',
      }
    },
    mounted() {
      this.getCategory();
    },
    methods: {
      async getCategory() {
        let result = await this.$API.attr.reqCategory1List();
        if (result.code === 200) {
          this.category1List = result.data
        }
      },
      async handler1() {
        this.category2List = [];
        const {category1Id} = this.threeForm;
        let result = await this.$API.attr.reqCategory2List(category1Id);
        if (result.code === 200) {
          this.category2List = result.data
        }
      },
    async  handler2() {
        const {category2Id} = this.threeForm;
        let result = await this.$API.attr.reqCategory3List(category2Id);
        console.log(result)
        if (result.code === 200) {
          this.category3List = result.data
        }
      }
    },
  }
</script>

<style scoped>

</style>
