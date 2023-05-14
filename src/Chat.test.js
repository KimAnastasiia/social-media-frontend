import { render, screen } from '@testing-library/react';
import App from './App';
const puppeteer = require('puppeteer');
jest.setTimeout(60000)


describe('checking the empty chat page', () => {
  let browser;
  let page;
  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: false,
      args:['--start-maximized']
    });
    page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080});
    await page.goto('http://localhost:3000');
  });
  afterAll(async () => {
    await browser.close();
  });
  test('empty chat page', async () => {
        await page.type('#email', 'withoutChats');
        await new Promise(r => setTimeout(r, 1000))
        await page.click('#login');
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#password', '1234567');
        await new Promise(r => setTimeout(r, 1000))
        await page.click('#continue');
        await new Promise(r => setTimeout(r, 1000))
        await page.click('#messages');
        await new Promise(r => setTimeout(r, 1000))
        const input = await page.$x('//input[@id="inputChats"]'); //XPATH
        expect( input.length!=0).toBe(true);
        const text = await page.$x('//p[contains(text(), "You dont have any chat yet")]'); //XPATH
        expect( text.length!=0).toBe(true);
  });

});