# 后端集合
开发语言：javascript

技术：vue

功能说明：erp+商城手机端+商城后台

开发部署：
1、安装依耐
npm install

2、商城手机端运行：
npm run shop
访问
localhost:8200

3、商城后台运行：
npm run admin
访问
localhost:8100

4、erp后台运行：
npm run erp
访问
localhost:8000


代码规范：
文件名采用小写加下划线命名，因为有些系统对大写开头的文件名不敏感。
变量采用驼峰，小写字母开头
函数采用驼峰，小写字母开头
类 采用大写字母开头 



需求修改：
1、erp增加同步物流单号功能，能将物流单号同步到商城
2、商城后台可以修改订单价格（总价）
3、手机上传图片报错问题处理
4、商城的所有图片定好图片大小在后台编辑页面显示
5、商城收货地址自动填充功能问题处理
6、导航问题处理，商城页面，前进刷新页面，后退不刷新
7、支付页面，增加复制功能，可以复制支付码
8、erp增加配货页面，显示配货后的订单，并能修改他的物流单号，可同步到商城
9、erp优化：加快页面刷新速度
10、商城批量导入增加用户账号字段
11、微信pc版本订单页面显示异常的不兼容问题
12、商城页面增加导入模板下载功能
13、特殊标识为空，导出erp报错问题处理



2018.07.14：
1、erp批量修改物流单号功能

问题：
1、新增商品时，商品类型不填，会报错


