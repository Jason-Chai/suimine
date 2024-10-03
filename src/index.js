const fs = require('fs');
const puppeteer = require('puppeteer');
const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'
const url = 'https://suimine.xyz/#/tokens/fomo'
const mineButton = '.items-center.justify-center.bg-green-600.text-xl.font-bold'

const options = {
    headless: false,
    args: [`--window-size=1280,720`],
    defaultViewport: {
        timeout: 5000,
        width: 1280,
        height: 720
    },
}

function getDate(){const now = new Date();
    const year = now.getFullYear(); //得到年份
    const month = now.getMonth()+1;//得到月份
    const date = now.getDate();//得到日期
    const hour= now.getHours();//得到小时数
    const minute= now.getMinutes();//得到分钟数
    const second= now.getSeconds();//得到秒数
    return year+"-"+month+"-"+date+" "+hour+":"+minute+":"+second;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

async function main() {
    const browser = await puppeteer.launch(options);
    const page = await browser.newPage();
    await page.setUserAgent(userAgent)
    page.on('load', async () => {
        setTimeout(async () => {
            await page.click('header button')
            console.log('准备点击 Generate')
            await sleep(1000)
            await page.click('[role=dialog] button:first-child')
            const privateKey = await page.$eval('#privateKey',(el)=>{
                el.type = 'text'
                return el.value
            })
            const publicKey = await page.$eval('#publicKey',(el)=>{
                el.type = 'text'
                return el.value
            })
            console.log('privateKey',privateKey)
            console.log('publicKey',publicKey)
            // fs.writeFileSync('./key.txt',`privateKey:${privateKey} , publicKey:${publicKey}`)
            fs.appendFileSync('./key.txt',`time: ${getDate()} ,privateKey:${privateKey} / publicKey:${publicKey} \r\n`, 'utf8')
            console.log('已经写入key ./key.txt')
            await sleep(1000 * 60 )
            await page.click('[role=dialog] button:nth-child(3)')
            console.log('等待30秒')
            await sleep(1000 * 60 * 3)
            console.log('点击挖矿 1')
            await page.click(mineButton)

            sleep(1000 * 60 * 3).then(()=>{
                setInterval(async () => {
                    console.log('点击挖矿')
                    await page.click(mineButton)
                }, 1000); // 每1000毫秒（1秒）点击一次
            })

        }, 2000)
    })
    await page.goto(url);
    // setTimeout(async () => {
    //   await browser.close();
    // }, 500000)
}

main().then(() => {
    console.log('main')
}).catch((e) => {
    console.log('error')
    console.log(e)
})


//
// // 登录逻辑
// async function login(page) {
//   console.log('开始登录')
//   const changeEmailLoginBtnPath = '.login-tabs-pane-list-flex-shrink>div:nth-child(2)' // 切换邮箱登录按钮路径
//   const inputEmailPath = '#login_email_username_id' // 输入邮箱路径
//   const nextStepBtnPath = '#login-submit-btn' // 下一步按钮路径
//   const inputPasswordPath = '#login_email_password_id' // 输入密码路径
//   // 流程
//   // await page.waitForSelector(changeEmailLoginBtnPath)
//   await sleep(3000)
//   console.log('点击切换邮箱登录')
//   await page.click(changeEmailLoginBtnPath)
//   await sleep(500)
//   console.log('输入账号')
//   // await page.$eval(inputEmailPath, (el) => el.value = '825437373@qq.com')
//   await page.focus(inputEmailPath);
//   for (let i = 0; i < userEmail.length; i++) {
//     await page.keyboard.press(userEmail[i]);
//   }
//   await sleep(500)
//   await page.click(nextStepBtnPath)
//   await sleep(3000)
//   console.log('输入密码')
//   // await page.$eval(inputPasswordPath, (el) => el.value = 'Chai!1234')
//   await page.focus(inputPasswordPath);
//   for (let i = 0; i < userPassword.length; i++) {
//     await page.keyboard.press(userPassword[i]);
//   }
//   await sleep(3000)
//   console.log('点击登录')
//   await page.click(nextStepBtnPath)
//   console.log('登录成功')
// }
//
// // 跳转到带单列表
// async function toOrderList(browser) {
//   const page = await browser.newPage();
//   await page.setUserAgent(userAgent)
//   page.on('load', async () => {
//     const dialog = await page.$('.okui-dialog')
//     if (dialog) {
//       await page.click('.okui-dialog-window button:nth-child(1)')
//     }
//     getOrderList(page)
//   })
//   await page.goto(orderListUrl);
// }
//
// // 获取当前页面列表
// async function getOrderList(page) {
//   const orderListPath = 'div[class^="index_wrapper"] > div[class^="index_list"] > div[class^="index_cardBox"]'
//   var orderList = []
//   var orderListDom = await page.$$(orderListPath)
//   console.log('列表长度', orderListDom.length)
//
//   async function getOrderItemInfo() {
//     if (orderListDom.length === 0) {
//       return
//     }
//     const orderItem = orderListDom.shift()
//     const id = await orderItem.$eval('a[class^="index_petName"]', el => el.href) // 用户id https://www.okx.com/cn/copy-trading/trader/B58877964014FB39
//     const userName = await orderItem.$eval('a[class^="index_petName"]', el => el.innerHTML) // 用户名字
//     const scale = await orderItem.$eval('[class^="index_count"]', el => el.innerHTML) // 规模
//     const yieldRate = await orderItem.$eval('[class^="index_percent"]', el => el.innerHTML) // 用户收益率
//     const profitNum = await orderItem.$eval('[class^="index_profit"]', el => el.innerHTML) // 用户盈利金额
//     const winRate = await orderItem.$eval('[class^="index_emphasis"]', el => el.innerHTML) // 胜率
//     const allDate = await orderItem.$eval('[class^="index_value"]', el => el.innerHTML) // 带单总天数
//     const allMoney = await orderItem.$eval('[class^="index_aumBox"] span', el => el.innerHTML) // 带单总金额
//
//
//     const userDetail = await getOrderDetail()
//
//     orderList.push({id, userName, scale, yieldRate, profitNum, winRate, allDate, allMoney, userDetail})
//
//     await getOrderItemInfo()
//   }
//
//   await getOrderItemInfo()
//   console.log(orderList)
// }
//
// // 获取当前带单详情
// async function getOrderDetail(url) {
//   const page = await browser.newPage();
//   await page.setUserAgent(userAgent)
//   await page.goto('https://www.okx.com' + url)
//   // BTCUSDT 永续 全仓 买 14.00x 2023/10/21 14:41:40
//   // 持仓量 0.5 FIL
//   // 标记价格 34437.2 USDT
//
//   // 保证金 1216.07 USDT
//   // 开仓均价 34050 USDT
//   // 收益率
//   // 保证金率  1335.06%
//   // 预估强平价 0.000 USDT
//
//   // https://zhuanlan.zhihu.com/p/354337880
//   return {}
// }

