<template>
  <div>
    <!--按钮-->
    <el-button type="primary" icon="el-icon-plus" @click="showDialog">添加</el-button>

    <!--表格组件-->
    <el-table
      :data="list"
      border
      style="width: 100%; margin-top: 10px">
      <el-table-column
        type="index"
        label="序号"
        width="50"
        align="center">
      </el-table-column>
      <el-table-column
        prop="tmName"
        label="品牌名称"
        width="width"
        align="center">
      </el-table-column>
      <el-table-column
        prop="logo"
        label="品牌logo"
        width="width"
        align="center">
        <templtae slot-scope="{row, $index}">
          <img :src="row.logoUrl" alt="" style="width: 100px; height: 100px;">
        </templtae>
      </el-table-column>
      <el-table-column
        prop="operation"
        label="操作">
        <template slot-scope="{row, $index }">
          <el-button type="warning" icon="el-icon-edit" size="mini" @click="updateTradeMark(row)">修改</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--  分页器-->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="[5, 10, 20, 100]"
        :page-size="limit"
        :current-page="current"
        layout="prev, pager, next, -> ,total, sizes"
        :total="total"
        class="pagination">
      </el-pagination>
    </div>

    <!--对话框-->
    <el-dialog :title="form.id ? '修改品牌' : '添加品牌'" :visible.sync="dialogFormVisible">
      <el-form :model="form" style="width: 75%">
        <el-form-item label="品牌名称" :label-width="formLabelWidth">
          <el-input v-model="form.tmName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" :label-width="formLabelWidth">
          <!--不能使用v-model收集数据
          action：设置图片上传地址
          -->
          <el-upload
            class="avatar-uploader"
            action="http://gmall-h5-api.atguigu.cn/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="form.logoUrl" :src="form.logoUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload_tip">只能上传jpg文件，且不超过500kb</div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="AddOrUpdate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "tradeMark",
    data() {
      return {
        page: 1,
        limit: 5,
        total: 1,
        current: 1,
        list: [],
        dialogFormVisible: false,
        //收集品牌信息字段
        form: {
          tmName: '',
          logoUrl: '',
          id: null,
        },
        formLabelWidth: '120px'
      }
    },
    mounted() {
      this.getPageList();
    },
    methods: {
      //发请求
      async getPageList() {
        const {page, limit} = this;
        let result = await this.$API.tradeMark.reqTradeMarkList(page, limit);
        // console.log(result, '11')
        if (result.code === 200) {
          this.total = result.data.total;
          this.page = result.data.pages;
          this.list = result.data.records;
        }
      },
      //添加事件
      showDialog() {
        //展开对话框
        this.dialogFormVisible = true;
        //清除对话框中的内容
        this.form.tmName = '';
        this.form.logoUrl = '';
        this.form.id = null;
      },
      //分页器--改变页数
      handleSizeChange(val) {
        this.limit = val;
        this.getPageList();
      },
      //分页器--改变当前页
      handleCurrentChange(pager) {
        this.page = pager;
        this.getPageList();
      },
      //上传图片成功函数
      handleAvatarSuccess(res, file) {
        //上传成功后服务器返回图片地址，保存到表单中
        this.form.logoUrl = res.data;
        // this.form.imageUrl = URL.createObjectURL(file.raw);
      },
      //上传图片之前检查图片
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      //  确定事件
      async AddOrUpdate() {
        this.dialogFormVisible = false;
        //  发请求
        let result = await this.$API.tradeMark.reqAddOrUpdateTradeMark(this.form);
        if (result.code === 200) {
          //  弹出添加信息/修改信息
          this.$message({
            message: this.form.id ? '修改成功' : `添加成功`,
            type: 'success'
            }
            );
          await this.getPageList();
        }
      },
      //修改
      updateTradeMark(row) {
        this.dialogFormVisible = true;
        //赋值给form,使用浅拷贝，不要直接操作表单数据
        this.form = {...row};

      }
    },

  }
</script>

<style>
  .pagination {
    margin-top: 20px;
    text-align: center;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
