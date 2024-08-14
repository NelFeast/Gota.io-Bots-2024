const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const config = require('../config/config');
const Logger = require('./Logger.js');
const { HttpsProxyAgent } = require('https-proxy-agent');
const { SocksProxyAgent } = require('socks-proxy-agent');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

class Helper {
    static createServer() {
        if (config.server.useHttps) {
            const keyPath = path.join(__dirname, '../certs/key.pem');
            const certPath = path.join(__dirname, '../certs/cert.pem');
            const key = fs.readFileSync(keyPath);
            const cert = fs.readFileSync(certPath);
            return https.createServer({ key, cert });
        } else {
            return http.createServer();
        }
    }
    static generateHeaders(host) {
        return {
            'Accept-Encoding': 'gzip, deflate, br, zstd',
            "Accept-Language": "en-US,en;q=0.9",
            'Cache-Control': 'no-cache',
            'Connection': 'Upgrade',
            'Host': host,
            'Origin': 'https://gota.io',
            'Pragma': 'no-cache',
            'Sec-WebSocket-Extensions': 'permessage-deflate; client_max_window_bits',
            'Sec-WebSocket-Version': '13',
            'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
        }
    }
    static async sendRequest(agent) {
        await fetch('https://gota.io/web/', { 
            agent: agent,
            method: 'GET'
        });
        return true;
    }
    static randomString(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    static async initializeProxies() {
        this.proxies = [];
        if (config.proxy.scrape) {
            await this.scrapeProxies();
        } else {
            this.loadProxiesFromFile();
        }
    }
    static async scrapeProxies() {
        const protocol = config.proxy.protocol;
        const timeout = config.proxy.timeout;
        try {
            const response = await fetch(`https://api.proxyscrape.com/v2/?request=displayproxies&protocol=${protocol}&timeout=${timeout}&country=all&ssl=all&anonymity=all`);
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            const data = await response.text();
            this.proxies = data.split('\n').filter(proxy => proxy.trim() !== '');
            Logger.info(`Scraped ${this.proxies.length} proxies.`);
        } catch (error) {
            Logger.error(`Error scraping proxies: ${error.message}`);
            this.loadProxiesFromFile();
        }
    }
    static loadProxiesFromFile() {
        const filePath = path.join(__dirname, '../proxies.txt');
        try {
            const data = fs.readFileSync(filePath, 'utf-8');
            this.proxies = data.split('\n').filter(proxy => proxy.trim() !== '');
            Logger.info(`Loaded ${this.proxies.length} proxies from proxies.txt.`);
        } catch (error) {
            Logger.error(`Error reading proxies from file: ${error.message}`);
        }
    }
    static getProxy() {
        if (!this.proxies || this.proxies.length === 0) {
            Logger.error('No proxies available.');
            return null;
        }
        const protocol = config.proxy.protocol;
        const proxy = this.proxies.shift();
        this.proxies.push(proxy);
        switch (protocol) {
            case 'http':
            case 'https':
                return new HttpsProxyAgent(`${protocol}://${proxy}`);
            case 'socks4':
            case 'socks5':
                return new SocksProxyAgent(`${protocol}://${proxy}`);
            default:
                return new HttpsProxyAgent(`${protocol}://${proxy}`);
        }
    }
}

module.exports = Helper;