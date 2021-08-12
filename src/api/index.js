import ajax from './ajax'

// 1. 定义基础路径
const BASE_URL = 'http://192.168.43.16:3000';

// 2. 请求的方法
// 7. 用户名和密码登录
export const pwdLogin = (params)=> ajax(BASE_URL + '/login', {...params}, 'POST');
export const email = (params) => ajax(BASE_URL + '/email',params, 'POST')
export const captchaLogin = (params)=> ajax(BASE_URL + '/captchaLogin', {...params}, 'POST');
export const addgoods = (params) => ajax(BASE_URL + '/addgoods',params, 'POST')
export const gettask = () => ajax(BASE_URL + '/gettask')
export const getCartinfo = () => ajax(BASE_URL + '/getCartinfo')
export const getgoodByid = (params) => ajax(BASE_URL + '/getgoodByid',{...params},'POST')
export const addcollect = (params) => ajax(BASE_URL + '/addcollect',{...params},'POST')
export const getcollect = (params) => ajax(BASE_URL + '/getcollect',{...params},'POST')
export const delcollect = (params) => ajax(BASE_URL + '/delcollect',{...params},'POST')
export const delcollects = (params) => ajax(BASE_URL + '/delcollects',{...params},'POST')
export const edituser = (params) => ajax(BASE_URL + '/edituser',params,'POST')
export const getgoodbyuser = (params) => ajax(BASE_URL + '/getgoodbyuser',params,'POST')
export const editgoodstatus = (params) => ajax(BASE_URL + '/editgoodstatus',{...params},'POST')
export const getGoodsinfo = (params) => ajax(BASE_URL + '/getGoodsinfo',{...params},'POST')
export const getgoodcount = () => ajax(BASE_URL + '/getgoodcount')
export const getuser = (params) => ajax(BASE_URL + '/getuser',{...params},'POST')
export const modifyPsd = (params) => ajax(BASE_URL + '/modifyPsd',{...params},'POST')
export const getwarning = ()=> ajax(BASE_URL + '/getwarning');
export const delgood = (params) => ajax(BASE_URL + '/delgood',{...params},'POST')
export const register = (params) => ajax(BASE_URL + '/register',{...params},'POST')
export const getimg = (params) => ajax(BASE_URL + '/getimg',params,'POST')
export const editgoods = (params) => ajax(BASE_URL + '/editgoods',params,'POST')
export const addsuggest = (params) => ajax(BASE_URL + '/addsuggest',params,'POST')
export const getseach = (params) => ajax(BASE_URL + '/getseach',params,'POST')
export const headgoods = (params) => ajax(BASE_URL + '/headgoods',params,'POST')
