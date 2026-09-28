import { defineConfig } from '@playwright/test';
export default defineConfig({testDir:'./tests',fullyParallel:true,use:{baseURL:'http://127.0.0.1:3000',viewport:{width:390,height:844}},webServer:{stdout:'ignore',stderr:'ignore',command:'python3 -m http.server 3000 --bind 0.0.0.0 --directory out',url:'http://127.0.0.1:3000',reuseExistingServer:!process.env.CI},reporter:'list'});
