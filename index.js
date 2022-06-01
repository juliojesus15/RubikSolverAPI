const express = require('express')
const puppeteer = require('puppeteer')

const app = express()

// settings
app.set('port', process.env.PORT || 4000);


app.get('/', (req, res) => {
  res.send('Rubik Cube Solver - API')
})

app.get('/solver/:keys', async (req, res) => {  
  //https://rubikscu.be/solver/?cube=0656612513251322441454634341112543236523251413235666645
  //656612513251322441454634341112543236523251413235666645
  const keysParams = req.params.keys
  url = `https://rubikscu.be/solver/?cube=0${keysParams}`
  console.log(url)
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto(url)
  //await page.screenshot({path: 'test1.jpg'})

  //Wait for thisRotIs0  
  await page.waitForSelector('[class=thisRotIs0]')
  //await page.screenshot({path: 'test2.jpg'})

  //to get segedvaltozo
  const solver = await page.evaluate( () => {
    const elements = document.querySelectorAll('[id=segedvaltozo] span')

    const steps = []
    for(let element of elements) {
      content = element.textContent
      step = content.replace("'", "+");
      steps.push(step)
    }
    return steps;

  })  
  solver.shift()
    
  await browser.close()

  res.send(JSON.stringify({ 'Solver': solver }))
})

// starting the server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`)
})