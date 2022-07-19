//发送请求
import requests from "@/api/request";

//获取一/二/三级分类
export const reqCategory1List = ()=> requests({url: `/admin/product/getCategory1`, method: 'get'})
export const reqCategory2List = (category1Id)=> requests({url: `/admin/product/getCategory2/${category1Id}`, method: 'get'})
export const reqCategory3List = (category2Id)=> requests({url: `/admin/product/get/category1/${category2Id}`, method: 'get'})

//获取商品基础属性接口
export const reqBaseMange = (category1Id,category2Id, category3Id) => requests({url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: 'get'})
