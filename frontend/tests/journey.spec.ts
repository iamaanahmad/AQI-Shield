import { test, expect } from '@playwright/test';
test('city to advisory, Hindi, save, refresh, reopen and remove',async({page})=>{
 await page.goto('/');
 await page.getByLabel('Choose your city').selectOption('mumbai');
 await page.getByRole('button',{name:'Preview air quality'}).click();
 await expect(page.getByRole('heading',{name:'Mumbai',exact:true})).toBeVisible();
 await expect(page.getByText('Sample index · 1–5 scale')).toBeVisible();
 await page.getByRole('button',{name:'हिन्दी',exact:true}).click();
 await expect(page.locator('html')).toHaveAttribute('lang','hi');
 await expect(page.getByRole('heading',{name:'मुंबई',exact:true})).toBeVisible();
 await page.getByRole('button',{name:'नमूना सलाह सहेजें',exact:true}).click();
 await expect(page.getByRole('button',{name:'इस ब्राउज़र में सहेजा गया'})).toBeDisabled();
 await page.getByRole('link',{name:'सहेजी गई सलाह',exact:true}).click();
 await expect(page).toHaveURL(/history/);
 await page.reload();
 await expect(page.locator('.history-list li')).toHaveCount(1);
 await page.getByRole('button',{name:'सलाह खोलें'}).click();
 await expect(page.getByRole('heading',{name:'मुंबई',exact:true})).toBeVisible();
 await page.getByRole('link',{name:'सहेजी गई सलाह',exact:true}).click();
 await page.getByRole('button',{name:'हटाएँ',exact:true}).click();
 await page.reload();
 await expect(page.locator('.history-list li')).toHaveCount(0);
});
test('direct result route has a recovery path',async({page})=>{await page.goto('/result/');await expect(page.getByRole('heading',{name:'Choose a city to begin.'})).toBeVisible();});
test('denied geolocation leaves city selection usable',async({page})=>{
 await page.addInitScript(()=>{navigator.geolocation.getCurrentPosition=(_ok,fail)=>fail?.({code:1,message:'Denied',PERMISSION_DENIED:1,POSITION_UNAVAILABLE:2,TIMEOUT:3});});
 await page.goto('/');await page.getByRole('button',{name:'Use my location'}).click();
 await expect(page.locator('.notice[role=alert]')).toContainText('Choose a city');
 await page.getByRole('button',{name:'Preview air quality'}).click();await expect(page.getByRole('heading',{name:'New Delhi',exact:true})).toBeVisible();
});
test('location selects a supported city without sending coordinates',async({page,context})=>{
 await context.grantPermissions(['geolocation']);await context.setGeolocation({latitude:19.08,longitude:72.88});
 await page.goto('/');await page.getByRole('button',{name:'Use my location'}).click();await expect(page.getByLabel('Choose your city')).toHaveValue('mumbai');
});
test('save failure never claims success',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Preview air quality'}).click();await expect(page.getByRole('heading',{name:'New Delhi',exact:true})).toBeVisible();
 await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new Error('Quota');};});
 await page.getByRole('button',{name:'Save sample advisory'}).click();await expect(page.locator('.notice[role=alert]')).toContainText('could not be saved');await expect(page.getByRole('button',{name:'Save sample advisory'})).toBeEnabled();
});
test('corrupt history is preserved, not overwritten',async({page})=>{
 await page.goto('/');await page.evaluate(()=>localStorage.setItem('aqi-shield.history.v1','broken'));await page.reload();await expect(page.locator('.notice[role=alert]')).toContainText('kept unchanged');
 await page.getByRole('button',{name:'Preview air quality'}).click();await page.getByRole('button',{name:'Save sample advisory'}).click();await expect(page.locator('.notice[role=alert]')).toContainText('could not be saved');expect(await page.evaluate(()=>localStorage.getItem('aqi-shield.history.v1'))).toBe('broken');
});
test('mobile and desktop layouts do not overflow in either language',async({page})=>{
 for(const width of [390,1280]){await page.setViewportSize({width,height:844});await page.goto('/');for(const language of ['हिन्दी','EN']){await page.getByRole('button',{name:language,exact:true}).click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBe(true);}}
});
test('removal failure keeps the saved card',async({page})=>{
 await page.goto('/');await page.getByRole('button',{name:'Preview air quality'}).click();await page.getByRole('button',{name:'Save sample advisory'}).click();await page.getByRole('link',{name:'Saved advisories',exact:true}).click();
 await page.evaluate(()=>{Storage.prototype.setItem=function(){throw new Error('Quota');};});await page.getByRole('button',{name:'Remove',exact:true}).click();await expect(page.locator('.notice[role=alert]')).toContainText('could not be saved');await expect(page.locator('.history-list li')).toHaveCount(1);
});
