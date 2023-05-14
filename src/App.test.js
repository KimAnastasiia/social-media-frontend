import { render, screen } from '@testing-library/react';
import App from './App';
const puppeteer = require('puppeteer');
jest.setTimeout(60000)

/*
test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
 */
describe('Test main website load properly', () => {
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

  test('Test main website load properly', async () => {
    await new Promise(r => setTimeout(r, 2000))
    
    const elements = await page.$x('//p[contains(text(), "Penguin for mobile devices")]'); //XPATH
    
    //expect(elements.length).toBeGreaterThan(0) 
    //same
    expect(elements.length != 0).toBe(true);

  });

});


describe('Test login', () => {
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

  test('do login', async () => {
        // Fill in the name input
        await new Promise(r => setTimeout(r, 1000))

        await page.type('#email', 'a');
        await new Promise(r => setTimeout(r, 1000))
        await page.click('#login');
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#password', '1234567');
        // Click the submit button
        await new Promise(r => setTimeout(r, 1000))
        await page.click('#continue');
        await new Promise(r => setTimeout(r, 1000))
        const publications = await page.$x('//p[contains(text(), "publications")]'); //XPATH
        expect( publications.length!=0).toBe(true);
  });

});
describe('Test wrong email in login', () => {
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

  test('log in without existing email', async () => {
        // Fill in the name input
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#email', 'Alina');
        await new Promise(r => setTimeout(r, 1000))
        await page.click('#login');
        // Click the submit button
        await new Promise(r => setTimeout(r, 1000))
        const alert = await page.$x('//div[contains(text(), "There is no account with this email")]'); //XPATH
        expect( alert.length!=0).toBe(true);
  });

});
describe('Registration', () => {
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

  test('registration with correct data', async () => {
        // Fill in the name input
        await page.click('#registration');
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#name', 'Ali');
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#uniqueName', 'Ali43');
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#surname', 'Al');
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#password', '12345678');
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#passwordCheck', '12345678');
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#number', '897676878878787');
        await new Promise(r => setTimeout(r, 1000))
        await page.type('#email', 'ghdf32g@gmail.com');
        await new Promise(r => setTimeout(r, 1000))
        await page.click('#continue');
        // Click the submit button
        await new Promise(r => setTimeout(r, 1000))
        const uniqueName = await page.$x('//p[contains(text(), "Ali43")]'); //XPATH
        expect( uniqueName.length!=0).toBe(true);
  });

});

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
        await page.click('#message');
        await new Promise(r => setTimeout(r, 1000))
        const input = await page.$x('//input[@id="inputChats"]'); //XPATH
        expect( input.length!=0).toBe(true);
        const text = await page.$x('//p[contains(text(), "You dont have any chat yet")]'); //XPATH
        expect( text.length!=0).toBe(true);
  });

});