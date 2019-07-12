import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input, Button } from '@tarojs/components'
import './index.scss'
import md5 from '../../assets/js/md5.js'

const STR1 = 'web';
const STR2 = 'secret';
const STR3 = 'websecret31302991jkharry';
const SHOW_TEXT = '显示'
const HIDE_TEXT = '隐藏'
const Num = 16

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  constructor(props) {
    super(props)
    this.state = {
      codeword: '',
      password: '',
      pwdValue: '',
      show: false
    }
  }

  componentWillMount () { }

  componentDidMount () { }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  onChangePwd = (e) => {
    this.setState({
      password: e.target.value
    })
  }

  onChangeTxt = (e) => {
    this.setState({
      codeword: e.target.value
    })
  }

  toggleShow = () => {
    this.setState({
      show: !this.state.show
    })
  }
  

  generateCode = () => {
    const { codeword, password } = this.state
    if (this.isValid(password) && this.isValid(codeword)) {
      let md5one = md5(password, codeword);
      let md5two = md5(md5one, STR1);
      let md5three = md5(md5one, STR2);
      let rule = md5three.split('')
      let source = md5two.split('')
      // convert to upper case
      for (let i = 0; i < 32; i++) {
        if (Number.isNaN(source[i])) {
          if (STR3.search(rule[i]) > -1) {
            source[i] = source[i].toUpperCase();
          }
        }
      }
      let pwd32 = source.join('');
      let firstChar = pwd32.slice(0, 1);
      let pwd = ''
      // make sure first char is not a number
      if (Number.isNaN(firstChar)) {
        pwd = pwd32.slice(0, Num);
      } else {
        pwd = 'K' + pwd32.slice(1, Num);
      }
      this.setState({
        pwdValue: pwd
      })
      Taro.setClipboardData({
        data: pwd
      }).then(()=>{
        Taro.showToast({
          title: '密码已复制到剪贴板',
          icon: 'success',
          duration: 1500
        })
      })
    } else {
      Taro.showToast({
        title: '记忆密码或区分代号不能为空',
        icon: 'none',
        duration: 1500
      })
    }
  }

  isValid = (item) => {
    return item !== undefined && item !== '';
  }
  

  render () {
    return (
      <View className='index'>
        <Text>记忆密码</Text>
        <Input type='password' placeholder='这是一个密码输入框' onChange={this.onChangePwd} />
        <Text>区分代号</Text>
        <Input type='text' placeholder='这是一个密码输入框' onChange={this.onChangeTxt} />
        <Button plain type='primary' onClick={this.generateCode}>生成密码</Button>
        <Text>密码</Text>
        {
          this.state.show 
          ? <Input type='text' value={this.state.pwdValue} />
          : <Input type='password' value={this.state.pwdValue} />
        }

        <Button plain type='primary' onClick={this.toggleShow}>{
          this.state.show 
          ? HIDE_TEXT
          : SHOW_TEXT
        }</Button>
      </View>
    )
  }
}
