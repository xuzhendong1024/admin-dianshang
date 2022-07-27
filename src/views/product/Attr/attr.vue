<template>
  <div>
    <el-card style="margin: 20px 0" shadow="hover">
      <category-select @getCategoryId="getCategoryId"/>
    </el-card>
    <el-card shadow="hover">
      <div v-show="isShowTable">
        <el-button type="primary" icon="el-icon-plus" :disabled="!category3Id" @click="isShowTable = false">添加属性
        </el-button>
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
              <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateAttr(row)">修改</el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
            </slot>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="!isShowTable">
        <el-form :inline="true">
          <el-form-item label="属性名">
            <el-input v-model="attrInfo.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button type="primary" icon="el-icon-plus" :disabled="!attrInfo.attrName" @click="addAttrValue">添加属性值
        </el-button>
        <el-button @click="cancelAddAttr">取消</el-button>
        <el-table
          style="width: 100%; margin-bottom: 20px"
          :data="attrInfo.attrValueList">
          <el-table-column
            prop="index"
            label="序号"
            width="180">
          </el-table-column>
          <el-table-column
            prop="name"
            label="属性值名称"
            width="width">
            <template slot-scope="{row, $index}">
              <!--切换input和span标签-->
              <!--@blur:失去焦点；@keyup.native.enter：切换原生事件，enter键触发-->
              <el-input
                v-model="row.valueName"
                placeholder="请输入属性值"
                size="mini"
                style="width: 80%"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="toLook(row)"
                :ref="$index"
              ></el-input>
              <span v-else @click="toEdit(row,$index)" style="display: block">{{row.valueName}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="operation"
            label="操作"
            width="180">
            <template slot-scope="{row, $index}">
              <el-popconfirm :title="`确定删除 ${row.valueName}?`" @onConfirm="deleteAttrValue($index)">
                <el-button size="mini" icon="el-icon-delete" type="danger" slot="reference"></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary">保存</el-button>
        <el-button @click="cancelAddAttr">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
  import CategorySelect from "@/components/CategorySelect/CategorySelect";
  import cloneDeep from 'lodash/cloneDeep'

  export default {
    name: "attr",
    data() {
      return {
        category1Id: '',
        category2Id: '',
        category3Id: '',
        //接受后端返回数组（属性值）
        attrList: [],
        isShowTable: true,
        //收集新增属性/修改属性(根据后端需要字段)
        attrInfo: {
          attrName: '',
          attrValueList: [],
          categoryId: 0,
          categoryLevel: 3,
          id: '',
        },
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
        // console.log(result)
        if (result.code === 200) {
          this.attrList = result.data;
        }
      },
      //添加属性值函数
      addAttrValue() {
        this.attrInfo.attrValueList.push({
          flag: true,
          attrId: this.attrInfo.id, //修改属性的时候，在已有的属性值基础上新增，带上属性id
          valueName: '',
        });
        this.$nextTick(() => {
          this.$refs[this.attrInfo.attrValueList.length-1].focus();
        })
      },
      cancelAddAttr() {
        this.isShowTable = true
        this.attrInfo = {
          attrName: '',
          attrValueList: [],
          categoryId: this.category3Id,
          categoryLevel: 3,
        };
      },
      //  修改属性
      updateAttr(row) {
        // console.log(row,"row")
        this.isShowTable = false;
        //每个相应的属性值添加flag
        // row.attrValueList.forEach(item => {
        //   item.flag = true;
        // });
        this.attrInfo = cloneDeep(row);
        //或者--添加flag
        this.attrInfo.attrValueList.forEach(item => {
          //item.flag = true;不会跟着变化---flag不是响应式数据
          //因为vue无法探测普通的新增property
          //第一个参数：对象；第二个参数：添加新的响应式的属性； 第三个参数：新的属性的属性值
          this.$set(item, 'flag', false)
        })
      },
      //输入框失焦后的回调
      toLook(row) {
        // console.log(row)
        //检测输入为空
        if (row.valueName.trim() === '') {
          this.$message({
            type: "warning",
            message: "请输入非空属性值",
          });
          return;
        }
        //检测属性重复 !!!!
        let isRepeat = this.attrInfo.attrValueList.some(item => {
          if (row !== item) {
            return row.valueName === item.valueName;
          }
        })
        if (isRepeat) {
          this.$message({
            type: "warning",
            message: "属性值输入重复",
          });
          return;
        }
        //形参row是当前用户添加的最新的属性值
        //当前input切换为span
        row.flag = false;
      },
      //  点击span，自动聚焦光标函数
      toEdit(row, index) {
        row.flag = true;
        //  refs[index]获取input节点，点击span切换为input需要时间，所以需要$nextTick()
        //  当节点渲染完成了去执行
        this.$nextTick(() => {
          this.$refs[index].focus();
        })
      },
      deleteAttrValue(index) {
        this.attrInfo.attrValueList.splice(index, 1);
      }
    }
  }
</script>

<style scoped>

</style>
