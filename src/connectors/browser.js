import puppeteer from 'puppeteer';
import fs from 'fs';

//The default browser class for puppeteer, it can be used to build other clients with puppeteer
class Browser {
    static async window(options) {
        console.log('Making new browser');
        console.log(this._browser);
        if (this._browser) return await this._browser

        if (fs.existsSync("/.dockerenv"))
        {
            options.headless = true
            options.args = (options.args || []).concat(['--no-sandbox', '--disable-setuid-sandbox'])
        }

        const _browser = puppeteer.launch(options);
        return await _browser
    }
}

export class PageUtils {
    page;
    autoLog;
    constructor({ page, autoLog = true }) {
        this.page = page;
        this.autoLog = autoLog;
    }

    async clickButton(buttonName) {
        await this.page.evaluate((selector) => { const v = document.querySelector(selector)
    if (v != undefined && v != null)
        v.click()
    }, buttonName)
}
    
//clicks a selector using the class name's regex
    async clickSelectorClassRegex(selector, classRegex) {
        if (this.autoLog)
            console.log(`Clicking for a ${selector} matching ${classRegex}`);

        await this.page.evaluate((selector, classRegex) => {
            classRegex = new RegExp(classRegex);
            let buttons = Array.from(document.querySelectorAll(selector));
            let enterButton = buttons.find(button => Array.from(button.classList).some(c => classRegex.test(c)));
            if (enterButton) 
                enterButton.click();
        }, selector, classRegex.toString().slice(1, -1));
    }
    //clicks a selector based on their id
    async clickSelectorId(selector, id) {
        if (this.autoLog) console.log(`Clicking for a ${selector} matching ${id}`)
        
        await this.page.evaluate(
          (selector, id) => {
            let matches = Array.from(document.querySelectorAll(selector))
            let singleMatch = matches.find((button) => button.id === id)
            let result
            if (singleMatch && singleMatch.click) {
              console.log('normal click')
              result = singleMatch.click()
            }
            if (singleMatch && !singleMatch.click) {
              console.log('on click')
              result = singleMatch.dispatchEvent(new MouseEvent('click', { bubbles: true }))
            }
            if (!singleMatch) {
              console.log('event click', matches.length)
             if (matches.length > 0) {
                  const m = matches[0]
                  result = m.dispatchEvent(new MouseEvent('click', { bubbles: true }))
              }
            }
          },
          selector,
          id
        )
      }
    //clicks a selector based on their alt value
    async clickSelectorByAlt(selector, title) {
        if (this.autoLog) console.log(`Clicking for a ${selector} matching ${title}`)

        await this.page.evaluate((selector, title) => {
            let matches = Array.from(document.querySelectorAll(selector))
            let singleMatch = matches.find((btn) => btn.alt === title)
            let result
            if (singleMatch && singleMatch.click) {
              console.log('normal click')
              result = singleMatch.click()
            }
            if (singleMatch && !singleMatch.click) {
              console.log('on click')
              result = singleMatch.dispatchEvent(new MouseEvent('click', { bubbles: true }))
            }
            if (!singleMatch) {
              console.log('event click', matches.length)
             if (matches.length > 0) {
                  const m = matches[0]
                  result = m.dispatchEvent(new MouseEvent('click', { bubbles: true }))
              }
            }
        }, selector, title)
    }
    //clicks the first selector it finds of the given type 
    async clickSelectorFirstMatch(selector) {
        if (this.autoLog)
            console.log(`Clicking for first ${selector}`);

        await this.page.evaluate((selector) => {
            let matches = Array.from(document.querySelectorAll(selector));
            let singleMatch = matches[0];
            if (singleMatch)
                singleMatch.click();
        }, selector);
    }
}

export default new Browser()