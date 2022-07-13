//品牌管理模块请求封装
import requests from '@/api/request'

//获取品牌
export const reqTradeMarkList = (page, limit) => requests({
  url: `/admin/product/baseTrademark/${page}/${limit}`,
  method: "get"
})

//修改品牌&添加品牌
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  if (tradeMark.id) {
    return requests({url: '/admin/product/baseTrademark/update', method: 'put', data: tradeMark})
  } else {
    return requests({url: '/admin/product/baseTrademark/save', method: 'post', data: tradeMark})
  }
}

//删除品牌
export const reqDeleteTradeMark = (id) => requests({url: `/admin/product/baseTrademark/remove/${id}`, method: 'delete'})
