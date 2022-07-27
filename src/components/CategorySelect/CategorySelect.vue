<!--三级联动组件-->
<template>
  <div>
    <el-form :inline="true" :model="threeForm" label-width="80px" >
      <el-form-item label="一级分类" >
        <el-select v-model="threeForm.category1Id" placeholder="请选择" @change="handler1" :disabled="show">
          <el-option
            v-for="item in category1List"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select v-model="threeForm.category2Id" placeholder="请选择" @change="handler2" :disabled="show">
          <el-option
            v-for="item in category2List"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类" >
        <el-select v-model="threeForm.category3Id" placeholder="请选择" @change="handler3" :disabled="show">
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
    props: ['show'],
    mounted() {
      this.getCategory();
    },
    methods: {
      //获取一级分类函数
      async getCategory() {
        let result = await this.$API.attr.reqCategory1List();
        if (result.code === 200) {
          this.category1List = result.data
        }
      },
      //获取二级分类函数
      async handler1() {
        //清空二三级分类
        this.category2List = [];
        this.category3List = [];
        this.threeForm.category2Id = '';
        this.threeForm.category3Id = '';
        //结构id
        const {category1Id} = this.threeForm;
        //传值给父组件
        this.$emit("getCategoryId",{categoryId: category1Id, level: 1})
        let result = await this.$API.attr.reqCategory2List(category1Id);
        if (result.code === 200) {
          this.category2List = result.data
        }
      },
      //获取三级分类函数
      async  handler2() {
        //清除三级分类
        this.category3List = [];
        this.threeForm.category3Id = '';
        //结构id
        const {category2Id} = this.threeForm;
        //传值给父组件
        this.$emit("getCategoryId",{categoryId: category2Id, level: 2})
        let result = await this.$API.attr.reqCategory3List(category2Id);
        // console.log(result)
        if (result.code === 200) {
          this.category3List = result.data
        }
      },
      handler3() {
        //传值给父组件
        const {category3Id} = this.threeForm;
        this.$emit("getCategoryId",{categoryId: category3Id, level: 3})
      }
    },
  }
</script>

<style scoped>

</style>
