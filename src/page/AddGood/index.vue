<template>
  <div class="w">
    <div class="form">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-position="top"
        class="demo-ruleForm"
      >
        <div class="lable">
          <i class="ico el-icon-user-solid" />
          个人信息
        </div>
        <div class="flex">
          <el-form-item class="two" label="联系人" prop="name">
            <el-input v-model="ruleForm.name" />
          </el-form-item>
          <el-form-item class="two" label="联系电话" prop="phone">
            <el-input v-model="ruleForm.phone" />
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item class="two" label="看车地址" prop="address">
            <el-cascader
              v-model="ruleForm.address"
              :options="addressOptions"
              :props="{ expandTrigger: 'hover' }"
            />
          </el-form-item>
          <el-form-item class="two" label="是否急售" prop="urgent">
            <el-select v-model="ruleForm.urgent" placeholder="请选择是否急售">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </div>
        <div class="lable">
          <i class="ico el-icon-picture-outline" />
          *图片
        </div>
        <div class="flex">
          <el-form-item class="">
            <el-upload
              ref="pUpload"
              name="avator"
              action="#"
              list-type="picture-card"
              :on-change="upsuccess"
              :file-list="file"
              :auto-upload="false"
            >
              <i slot="default" class="el-icon-plus" />
              <div slot="file">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                >

                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file.url)"
                  >
                    <i class="el-icon-zoom-in" />
                  </span>
                  <!-- <span
                            v-if="!disabled"
                            class="el-upload-list__item-delete"
                            @click="handleDownload(file.url)"
                            >
                            <i class="el-icon-download"></i>
                            </span> -->
                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete" />
                  </span>
                </span>
              </div>
            </el-upload>
          </el-form-item>
        </div>

        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
        <div class="lable">
          <i class="ico el-icon-chat-line-round" />
          *基本信息
        </div>
        <el-form-item label="车辆识别代号(VIN码)" prop="vin">
          <el-input
            v-model="ruleForm.vin"
            maxlength="17"
            show-word-limit
            placeholder="请输入17位vin码"
          />
        </el-form-item>
        <el-form-item label="品牌" prop="brand">
          <el-select v-model="ruleForm.brand" filterable placeholder="请选择">
            <el-option-group
              v-for="group in brandOptions"
              :key="group.label"
              :label="group.label"
            >
              <div style="display:flex;flex-wrap: wrap;width:850px">
                <el-option
                  v-for="item in group.options"
                  :key="item.value"
                  :value="item.value"
                >
                  <div>
                    <img :src="item.brand_logo" alt="" class="logo">
                    {{ item.value }}
                  </div>
                </el-option>
              </div>
            </el-option-group>
          </el-select>
        </el-form-item>
        <div class="flex">
          <el-form-item class="three" label="车辆颜色" prop="color">
            <el-select v-model="ruleForm.color" placeholder="请选择车辆颜色">
              <el-option
                v-for="item in color"
                :key="item.value"
                :label="item.label"
                :value="item.lable"
              >
                <div class="color" :style="{ background: item.value }" />
                <div style="float: left; color: #8492a6; font-size: 13px">
                  {{ item.lable }}
                </div>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="three" label="首次上牌时间" prop="firstTime">
            <el-select
              v-model="ruleForm.firstTime"
              placeholder="请选择首次上牌时间"
            >
              <el-option
                v-for="item in firstOption"
                :key="item.value"
                :value="item.value"
              >
                <span>{{ item.value }}年</span>
              </el-option>
              <el-option value="更早">
                <span>更早</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="three" label="行驶里程" prop="mile">
            <el-input v-model="ruleForm.mile" type="number" />
            <span class="input-text">万公里</span>
          </el-form-item>
        </div>

        <div class="flex" style="align-items:flex-end;width:850px">
          <el-form-item style="width:800px" label="转让价格" prop="price">
            <el-input
              v-model="ruleForm.price"
              style="margin-right:10px"
            />
            <span class="input-text">万元</span>
          </el-form-item>
          <el-form-item>
            <el-checkbox
              v-model="ruleForm.guohuPrice"
            >是否包含过户费</el-checkbox>
          </el-form-item>
        </div>

        <el-form-item class="three" label="车况描述" prop="descrip">
          <el-input v-model="ruleForm.descrip" type="textarea" />
        </el-form-item>
        <div class="lable">
          <i class="ico el-icon-s-comment" />
          更多信息
        </div>
        <div class="flex">
          <el-form-item class="three" label="年检到期" prop="checkYear">
            <el-select
              v-model="ruleForm.checkYear"
              placeholder="请选择年检到期"
            >
              <el-option
                v-for="item in checkOption"
                :key="item.value"
                :value="item.value"
              >
                <span>{{ item.value }}年</span>
              </el-option>
              <el-option value="未检">
                <span>未检</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="three" label="交强险到期" prop="traffic">
            <el-select
              v-model="ruleForm.traffic"
              placeholder="请选择交强险到期"
            >
              <el-option
                v-for="item in trafficOption"
                :key="item.value"
                :value="item.value"
              >
                <span>{{ item.value }}年</span>
              </el-option>
              <el-option value="过保">
                <span>过保</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="three" label="商业险到期" prop="insurance">
            <el-select
              v-model="ruleForm.insurance"
              placeholder="请选择商业险到期"
            >
              <el-option
                v-for="item in insuranceOption"
                :key="item.value"
                :value="item.value"
              >
                <span>{{ item.value }}年</span>
              </el-option>
              <el-option value="无商业险">
                <span>无商业险</span>
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="flex">
          <el-form-item class="three" label="过户次数" prop="times">
            <el-select v-model="ruleForm.times" placeholder="请选择过户次数">
              <el-option
                v-for="item in timeOptions"
                :key="item.value"
                :label="item.value"
                :value="item.value"
              >
                <span>{{ item.value }}次</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="three" label="车辆是否有抵押" prop="diya">
            <el-radio-group v-model="ruleForm.diya" size="medium">
              <el-radio border label="是" />
              <el-radio border label="否" />
            </el-radio-group>
          </el-form-item>
          <el-form-item class="three" label="是否定期4S店保养" prop="baoyang">
            <el-radio-group v-model="ruleForm.baoyang" size="medium">
              <el-radio border label="是" />
              <el-radio border label="否" />
            </el-radio-group>
          </el-form-item>
        </div>
        <el-form-item class="three" label="车辆配置亮点" prop="hightlights">
          <el-input
            v-model="ruleForm.hightlights"
            type="textarea"
            placeholder=""
          />
        </el-form-item>
        <div style="color:orange">
          *温馨提示：请勿发布多条重复信息，被判定重复的信息将不会被展示哦。
        </div>
        <el-checkbox v-model="agreement" class="agree" style="margin-top:10px">
          我已阅读并同意遵守
          <a
            @click="
              open(
                '法律声明',
                '此仅为个人练习开源模仿项目，仅供学习参考，承担不起任何法律问题'
              )
            "
          >法律声明</a>
          和
          <a
            @click="
              open(
                '隐私条款',
                '本网站将不会严格遵守有关法律法规和本隐私政策所载明的内容收集、使用您的信息'
              )
            "
          >隐私条款</a>
        </el-checkbox>
        <el-form-item style="width:280px;margin:30px auto">
          <el-button
            class="submit"
            type="danger"
            @click="submitForm('ruleForm')"
          >提 交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { addgoods, getgoodByid, editgoods } from './../../api/index'
import goods from '../../serve/goods.json'
import { count } from '../../serve/count.js'
import addressCount from '../../serve/address'
import { cartjson } from '../../serve/cart'
import { getStore } from '../../utils/storage'
export default {
  data() {
    var validatePhone = (rule, value, callback) => {
      var reg = /^1[3456789]\d{9}$/
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码!'))
      } else {
        callback()
      }
    }
    return {
      file: [],
      param: '',
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      fileList: [],
      id: '',
      userName: '',
      agreement: false,
      ruleForm: {
        url: [],
        name: '',
        phone: '',
        address: '',
        urgent: '',
        vin: '',
        brand: '',
        color: '',
        firstTime: '',
        mile: '',
        guohuPrice: false,
        price: '',
        descrip: '',
        checkYear: '',
        traffic: '',
        insurance: '',
        diya: '',
        baoyang: '',
        hightlights: '',
        times: ''
      },
      addressOptions: addressCount,
      color: goods.color,
      brandOptions: [],
      firstOption: count(false, 25),
      timeOptions: count(true, 11, 0),
      checkOption: count(true, 7),
      trafficOption: count(true, 2),
      insuranceOption: count(true, 2),
      options: [
        {
          value: '是',
          lable: 'Y'
        },
        {
          value: '否',
          lable: 'N'
        }
      ],
      rules: {
        name: [{ required: true, message: '请输入联系人', trigger: 'blur' }],
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        urgent: [
          { required: true, message: '请选择是否急售', trigger: 'change' }
        ],
        brand: [
          { required: true, message: '请选择汽车品牌', trigger: 'change' }
        ],
        address: [
          { required: true, message: '请选择看车地址', trigger: 'change' }
        ],
        color: [
          { required: true, message: '请选择汽车颜色', trigger: 'change' }
        ],
        firstTime: [
          { required: true, message: '请选择首次上牌时间', trigger: 'change' }
        ],
        mile: [
          { required: true, message: '请填写公里数', trigger: 'blur' }
          // { type: 'number', message: '必须为数字值',trigger: 'blur'}
        ],
        price: [
          { required: true, message: '请填写价格', trigger: 'blur' }
          // { type: 'number', message: '必须为数字值',trigger: 'blur'}
        ],
        checkYear: [
          { required: true, message: '请选择年检到期', trigger: 'change' }
        ],
        traffic: [
          { required: true, message: '请选择交强险到期', trigger: 'change' }
        ],
        insurance: [
          { required: true, message: '请选择商业险到期', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.id = this.$route.query.goods_id
    if (this.id) {
      this.getgood(this.id)
    }
    this.userName = getStore('userName')
    var n = cartjson()
    this.brandOptions = n
  },
  methods: {
    upsuccess(file) {
      this.file.push(file)
    },
    handleRemove(file) {
      for (var i = 0; i < this.file.length; i++) {
        if (this.file[i].url === file.url) {
          this.file.splice(i, 1)
        }
      }
    },
    handlePictureCardPreview(url) {
      this.dialogImageUrl = url
      this.dialogVisible = true
    },
    submitForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          if (!this.agreement) {
            this.$message({
              message: '您未勾选同意我们的相关注册协议',
              type: 'error'
            })
            return false
          }
          var param = new FormData()
          this.ruleForm.guohuPrice = this.ruleForm.guohuPrice ? 0 : 1
          for (var m in this.ruleForm) {
            param.append(m, this.ruleForm[m])
          }
          if (this.id) {
            var picture = ''
            for (let i = 0; i < this.file.length; i++) {
              if (this.file[i].status == 'success') {
                picture += this.file[i].url + '#'
              } else if (this.file[i].status == 'ready') {
                param.append('files', this.file[i].raw)
              }
            }
            param.append('picture', picture)
            editgoods(param).then(res => {
              if (res.code == 200) {
                // this.$router.push({
                //     path: '/'
                // })
                this.$message({
                  message: '修改成功',
                  type: 'success'
                })
              }
            })
          } else {
            param.append('userName', this.userName)
            for (let i = 0; i < this.file.length; i++) {
              param.append('files', this.file[i].raw)
            }
            addgoods(param).then(res => {
              if (res.code == 200) {
                this.$router.push({
                  path: '/'
                })
                this.$message({
                  message: '发布成功',
                  type: 'success'
                })
              }
            })
          }
        }
      })
    },

    getgood(goods_id) {
      var params = { goods_id }
      getgoodByid(params).then(res => {
        this.ruleForm = res.data[0]
        this.ruleForm.address = res.data[0].address.split(',')
        var result = res.data[0].goods_picture
        var arr = result.split('#')
        var urlarr = []
        for (var i = 0; i <= arr.length - 1; i++) {
          var obj = {
            url: arr[i]
          }
          urlarr.push(obj)
        }
        this.file = urlarr
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.w {
  padding-top: 60px;
}
.form {
  .el-form-item {
    margin-left: 20px;
  }
  width: 850px;
  margin: 50px 0;
  .el-select,
  .el-cascader {
    width: 100%;
  }
  .flex {
    display: flex;

    .two {
      width: 420px;
    }
    .three {
      width: 270px;
    }
    /deep/ .el-input__inner {
      position: inherit;
    }
    .input-text {
      color: #555;
      position: absolute;
      right: 15px;
      top: 0;
    }
  }
  .submit {
    width: 300px;
    height: 50px;
    margin: 0 auto;
    font-size: 20px;
    font-weight: bold;
  }
}
.lable {
  font-size: 18px;
  margin: 10px 0;
  font-weight: 800;
  .ico {
    color: orange;
    padding-right: 10px;
  }
}
.color {
  width: 20px;
  height: 20px;
  float: left;
  border: 1px solid #e6e6fa;
  margin-right: 4px;
  position: relative;
  top: 6px;
}
.logo {
  width: 20px;
  height: 20px;
  position: relative;
  top: 5px;
}
</style>
