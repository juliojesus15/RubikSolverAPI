const express = require('express')
const puppeteer = require('puppeteer')

const app = express()

// settings
app.set('port', process.env.PORT || 4000);

// Routes
app.get('/', (req, res) => {
  res.send("Rubik's Cube Solver")
})

app.get('/solver/:keys', async (req, res) => {      
  const url = `https://rubikscu.be/solver/?cube=0${req.params.keys}`
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox"]
  })
  const page = await browser.newPage()

  await page.goto(url)
  await page.waitForSelector('[class=thisRotIs0]')
  
  const solver = await page.evaluate( () => {
    const elements = document.querySelectorAll('[id=segedvaltozo] span')
    
    const steps = []            
    for(let element of elements) {      
      steps.push(element.textContent.replace("'", "+"))
    }
    return steps;    
  })  

  solver.shift()    
  await browser.close()

  res.send(JSON.stringify({ 'steps': solver }))
})

// Server
app.listen(app.get('port'), () => {
  console.log(`Server on port ${app.get('port')}`)
})