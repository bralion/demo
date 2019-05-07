import axios from 'axios'
import qs from 'qs'
let baseUrl = ''

if (process.env.NODE_ENV === 'development') {
    baseUrl = 'http://172.27.8.175:5099/' // 本地
} else if (process.env.NODE_ENV === 'production') {
    baseUrl = '/' // 本地
}

export {baseUrl}

// 公共方法
let utils = {
    install (Vue
			 /* options */) {
    // 获取用户信息，验证是否登录
        Vue.prototype.getUserInfo = () => {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'))
            return (userInfo.id)
        }

        /**
		 * http请求
		 * @param  {String}   options.url  [接口地址]
		 * @param  {Object}   options.data [请求体参数]
		 * @param  {String || Bolean}   successText  [成功提示]
		 * @param  {String}   failedText} [失败提示]
		 * @param  {Function} cb           [回调函数]
		 */

        Vue.prototype.request = function ({
			                                  type = '',
			                                  url = '',
			                                  data = {},
			                                  successText,
			                                  failedText,
			                                  headers = {},
			                                  formData,
			                                  form = {}
		                                  } = {}, cb, failCallback = () => {}) {
            if (form.loading) { form.loading = true }
            let _this = this
            let response
            if (type) {
                switch (type) {
                    // 删除请求
                    case 'delete':
                        response = axios.delete(baseUrl + url, formData || qs.stringify(data), headers)
                        break
                        // 修改请求
                    case 'put':
                        response = axios.put(baseUrl + url, formData || qs.stringify(data), headers)
                        break
                        // 新增请求
                    case 'put':
                        response = axios.post(baseUrl + url, formData || qs.stringify(data), headers)
                        break
                        // 查询请求
                    case 'get':
                        response = axios.get(baseUrl + url, formData || qs.stringify(data), headers)
                        break
                }
            } else {
                response = axios.post(baseUrl + url, formData || qs.stringify(data), headers)
            }
            return response.then(response => { // 状态码200-300
                if (form.loading) { form.loading = false }
               cb(response.data)
            }).catch(e => {
                if (form.loading) { form.loading = false }
                failCallback(e)// 回滚函数

                if (!(e.response)) {
                    console.error(e)
                    this.$message({message: e, type: 'error'})
                } else if (response.status === '500') {
                    this.$message({
                        message: '服务器异常！',
                        type: 'error'
                    })
                } else if (response.status === '404') {
                    this.$message({
                        message: '接口未找到！',
                        type: 'error'
                    })
                } else if (response.status === '400') {
                    this.$message({
                        message: response.data.msg || '参数错误！',
                        type: 'error'
                    })
                } else if (e.response.status == 401) {
                    // 登录过时后台返回 status 401, 此时返回登录页面
                    function unauthorizedConfirm () {
                        sessionStorage.setItem('userInfo', null)
                        _this.$alert('登录失效，请重新登录！', '提示', {
                            confirmButtonText: '确定',
                            callback: (/* action */) => {
                                _this
                                    .$router
                                    .push('/login')
                            }
                        })
                    }

                    if (unauthorizedList.length < 1) {
                        unauthorizedList.push(unauthorizedConfirm)
                        setTimeout(() => {
                            unauthorizedList[0]()
                            unauthorizedList = []
                        }, 1000)
                    }
                } else {
                    this.$message({message: '网络异常', type: 'error'})
                }
            })
        }
        Vue.prototype.transformTime = function (a, b, c) {
            let _date = new Date(c)
            let year = _date.getFullYear()
            let month = _date.getMonth() + 1
            let day = _date.getDate()
            if (day < 10) {
                day = '0' + day
            }
            if (month < 10) {
                month = '0' + 'month'
            }
            return year + '-' + month + '-' + day
        },

        /**
			 * 当前页面下载文件
			 * @param  {String} url [下载地址 get格式]
			 * @return {none}
			 */
        Vue.prototype.downloadUrl = function (url) {
            let iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.src = baseUrl + url
            iframe.domain = document.domain
            // iframe.onload = function() {   console.log(iframe)   //
            // document.body.removeChild(iframe) }
            document
                .body
                .appendChild(iframe)

            // 获取返回值
            iframe.onload = () => {
                // let text =
                // iframe.contentWindow.window.docuemnt.getElementsByTagName('pre')[0].innerHTML
                let text = iframe
                    .contentDocument
                    .getElementsByTagName('pre')[0]
                    .innerHTML

                text = JSON.parse(text) // 获取返回结果
                if (text.code === 1) {
                    this.$message({type: 'error', message: text.msg})
                }
                document
                    .body
                    .removeChild(iframe)
            }
        }

        /**
		 * 格式化时间，可选择转换格式
		 * @param  {[String || Date]} time [时间数据]
		 * @param  {String} fmt  [转换格式]
		 * @return {[String]}      [转换后数据]
		 */
        Vue.prototype.formatDate = function (date, fmt = 'YYYY-MM-DD hh:mm:ss') {
            date = new Date(date)
            let options = {
                'M+': date.getMonth() + 1 + '', // 月份
                'D+': date.getDate() + '', // 日
                'h+': date.getHours() + '', // 小时
                'm+': date.getMinutes() + '', // 分
                's+': date.getSeconds() + '', // 秒
                'q+': Math.floor((date.getMonth() + 3) / 3) + '', // 季度
                'S': date.getMilliseconds() + '' // 毫秒
            }
            // 判断年
            if (/(Y+)/.test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
            }

            for (let key in options) {
                if (new RegExp(`(${key})`).test(fmt)) {
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1)
                        ? (options[key])
                        : ((`00${options[key]}`).substr(options[key].length)))
                }
            }
            return fmt
        }

        // 格式化JSON
        Vue.prototype.formatJson = function (obj) {
            return qs.stringify(obj)
        }

        // 格式化JSON to String
        Vue.prototype.formatJsonToString = function (obj) {
            let str = JSON.stringify(obj)
            return str
        }

        // 表单验证
        Vue.prototype.formValid = function (formName) {
            let res = null
            this
                .$refs[formName]
                .validate((valid) => {
                    res = valid
                })
            return res
        }

        // 表单重置
        Vue.prototype.resetFormVaild = function (formName) {
            this
                .$refs[formName]
                .resetFields()
        }

        // 确认删除
        Vue.prototype.delConfirm = async function (url, data, cb
		                                           // failCallback = () => { }
        ) {
            try {
                await this.$confirm('确认删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                this
                    .$store
                    .commit('START_PROGRESS')
                this.request({
                    url,
                    data,
                    successText: true
                }, () => {
                    cb()
                    this
                        .$store
                        .commit('END_PROGRESS')
                }, () => {
                    this
                        .$store
                        .commit('END_PROGRESS')
                })
            } catch (e) {
                console.error(e)
                this.$message({type: 'info', message: '已取消删除'})
            }
        }

        // 确认下载
        Vue.prototype.downloadFileConfirm = async function (url) {
            try {
                await this.$confirm('确认下载?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })

                this.downloadUrl(url)
            } catch (e) {
                console.error(e)
                this.$message({type: 'info', message: '已取消下载'})
            }
        }

        // 数据单位转换
        Vue.prototype.formatBytes = function (byte) {
            let EB = Math.pow(1024, 6)
            let PB = Math.pow(1024, 5)
            let TB = Math.pow(1024, 4)
            let GB = Math.pow(1024, 3)
            let MB = Math.pow(1024, 2)
            let KB = Math.pow(1024, 1)

            let arr = {
                EB,
                PB,
                TB,
                GB,
                MB,
                KB
            }

            let res
            for (let unit in arr) {
                if (byte / arr[unit] > 1 && byte / arr[unit] < 1024) {
                    res = `${(byte / arr[unit]).toFixed(2)} ${unit}`
                    return res
                }
            }
        }

        // 随机颜色
        Vue.prototype.getRandomColor = function (/* byte */) {
            function randomColor () {
                return parseInt(Math.random() * 255)
            }
            return `rgb(${randomColor()}, ${randomColor()}, ${randomColor()})`
        }

        // 深拷贝
        Vue.prototype.deepClone = function (obj) {
            let newobj
            if (obj) {
                newobj = obj.constructor === Array
                    ? []
                    : {}
                for (let key in obj) {
                    newobj[key] = typeof obj[key] === 'object'
                        ? this.deepClone(obj[key])
                        : obj[key]
                }
                return newobj
            } else {
                return obj
            }
        }

        /**
		 * 还原树状图数据
		 * @param {Array} dataArr [扁平数组]
		 * @return {Array} [树状图数据]
		 */
        Vue.prototype.formatFileField = function (dataArr) {
            let treeData = []

            dataArr.forEach(child => {
                this.creatNode(treeData, child)
            })

            return treeData
        },

        // 构建结构
        Vue.prototype.creatNode = function (treeData, child) {
            let parentLabels = child.parent
            if (parentLabels.length === 0) {
                treeData.push(child)
                return
            }

            let parent = treeData.filter(treeItem => treeItem.label === parentLabels[0])

            if (parent.length !== 0) {
                parentLabels.shift()
                if (!parent[0].children) {
                    parent[0].children = []
                }
                this.creatNode(parent[0].children, child)
            } else {
                let treeItem = {
                    label: parentLabels[0],
                    children: []
                }
                treeData.push(treeItem)
                parentLabels.shift()
                this.creatNode(treeItem.children, child)
            }
        }

        // 扁平化树状图数据
        Vue.prototype.formatTreeData = function (fatherArr) {
            return fatherArr.reduce((resArr, childItem) => {
                if (!!childItem.children && childItem.children.length !== 0) {
                    childItem
                        .children
                        .forEach(child => {
                            let fatherLabel = childItem.label
                            let fatherParent = childItem.parent
                            child.parent = fatherParent
                                ? [
                                    ...fatherParent,
                                    fatherLabel
                                ]
                                : [fatherLabel]
                        })
                    return resArr.concat(this.formatTreeData(childItem.children))
                } else {
                    return resArr.concat(childItem)
                }
            }, [])
        }

        /**
		 *
		 * @param {Array} array
		 * @param {*} item
		 */
        Vue.prototype.toggleArrayItem = function (array, item, itemKey) {
            if (array instanceof Array) {
                if (itemKey) {
                    let itemExist = false
                    array.forEach((arrayItem, index) => {
                        if (arrayItem[itemKey] === item[itemKey]) {
                            array.splice(index, 1)
                            itemExist = true
                        }
                    })

                    if (!itemExist) {
                        array.push(item)
                    }
                } else {
                    let index = array.indexOf(item)
                    if (index !== -1) {
                        array.splice(index, 1)
                    } else {
                        array.push(item)
                    }
                }
            } else {
                console.error(array, 'is not array')
            }
        }
    }
}

export default utils

// 数组最小值
Object.defineProperty(Array.prototype, 'min', {
    configurable: true,
    enumerable: false,
    writable: true,
    value () {
        let min = this[0]
        let len = this.length
        for (let i = 1; i < len; i++) {
            if (this[i] < min) {
                min = this[i]
            }
        }
        return min
    }
})

// 数组最小值
/* Array.prototype.min = function () {
  let min = this[0];
  let len = this.length;
  for (let i = 1; i < len; i++) {
    if (this[i] < min) {
      min = this[i];
    }
  }
  return min;
} */

// 数组最小值
Object.defineProperty(Array.prototype, 'max', {
    configurable: true,
    enumerable: false,
    writable: true,
    value () {
        let max = this[0]
        let len = this.length
        for (let i = 1; i < len; i++) {
            if (this[i] > max) {
                max = this[i]
            }
        }
        return max
    }
})

// 数组最大值
/* Array.prototype.max = function () {
  let max = this[0];
  let len = this.length;
  for (let i = 1; i < len; i++) {
    if (this[i] > max) {
      max = this[i];
    }
  }
  return max;
} */
