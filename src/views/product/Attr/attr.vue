<template>
  <div>
    <el-card style="margin: 20px 0" shadow="hover">
      <category-select @getCategoryId="getCategoryId"/>
    </el-card>
    <el-card shadow="hover">
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="isShowTable = false">添加属性</el-button>
        <el-table
          :data="attrList"
          stripe
          style="width: 100%">
          <el-table-column
            type="index"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="attrName"
            label="属性名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="attrValueList"
            label="属性值列表"
            width="width">
            <slot slot-scope="{row, $index}">
              <el-tag
                type="success"
                v-for="(item , index ) in row.attrValueList"
                :key="item.id"
                style="margin-right: 10px;"
              >
                {{item.valueName}}
              </el-tag>
            </slot>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            width="251">
            <slot slot-scope="{row, $index}">
              <el-button type="warning" icon="el-icon-edit" size="mini">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            </slot>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus">添加属性值</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
        <el-table
          style="width: 100%; margin-bottom: 20px">
          <el-table-column
            prop="index"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="属性值名称"
            width="width">
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            width="180">
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import CategorySelect from "@/components/CategorySelect/CategorySelect";

  export default {
    name: "attr",
    data() {
      return {
        category1Id: '',
        category2Id: '',
        category3Id: '',
        attrList: [{
          attrName: '',
        }],
        isShowTable: true,
      }
    },
    components: {
      CategorySelect,
    },
    methods: {
      getCategoryId({categoryId, level}) {
        // console.log(categoryId, level,1 )
        if (level === 1) {
          this.category1Id = categoryId;
          this.category2Id = '';
          this.category3Id = '';
        } else if (level === 2) {
          this.category2Id = categoryId;
          this.category3Id = '';
        } else {
          this.category3Id = categoryId;
          this.getAttrList();
        }
      },
      async getAttrList() {
        const {category1Id, category2Id, category3Id} = this;
        let result = await this.$API.attr.reqBaseMange(category1Id, category2Id, category3Id);
        console.log(result)
        if (result.code === 200) {
          this.attrList = result.data;
        }
      }
    }
  }
</script>

<style scoped>

</style>
