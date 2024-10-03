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





