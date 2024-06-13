const { Builder, Browser, By, Key, until } = require("selenium-webdriver");
const chrome = require('selenium-webdriver/chrome');
const { spawn } = require("child_process");
const assert = require('assert');
const path = require('path');

class BasePhpTest {

    constructor() {
        console.log("Constructing...")
        this.headless = process.env.HEADLESS == "false" ? false : true;
        this.browser = "chrome"; // forcing the browser to be chrome
        this.cmd = null;
        this.driver = null;
    }

    async setUp() {
        console.log("HEADLESS:" + this.headless);
        console.log("BROWSER:" + this.browser);

        // run server and setup driver
        const batchFilePath = path.resolve(__dirname, '..', 'run.bat');
        await this.runServer(batchFilePath, []); // Adjusted for Windows batch file
        await this.setupDriver();
        // allow time for the server to start
        await this.driver.sleep(5000); // Increased wait time for the server to start
    }

    async tearDown() {
        console.log("Closing PHP server...");
        // stop server
        await this.stopServer();
        // allow time for processes to close
        await this.driver.sleep(2000);
        // close browser
        console.log("Closing Selenium driver...");
        await this.driver.quit();
    }

    async run() {
        await this.setUp();
        try {
            await this.test();
        } finally {
            await this.tearDown();
        }
    }

    async test() {
        console.log("Empty test!");
    }

    async setupDriver() {
        let chromeOptions = new chrome.Options();
        if (this.headless) {
            console.log("Running Headless Tests...");
            chromeOptions.addArguments('--headless=new');
        }

        this.driver = await new Builder()
            .forBrowser(Browser.CHROME)
            .setChromeOptions(chromeOptions)
            .build();
    }

    runServer(command, options) {
        // Start server with the APP
        if (process.platform == "win32") {
            this.cmd = spawn(command, options, { shell: true });
        } else {
            // linux, macos (darwin), or other
            this.cmd = spawn(command, options);
        }

        this.cmd.stdout.on("data", data => {
            console.log(`stdout: ${data}`);
        });
        this.cmd.stderr.on("data", data => {
            console.log(`stderr: ${data}`);
        });
        this.cmd.on('error', (error) => {
            console.log(`error: ${error.message}`);
        });
        this.cmd.on("close", code => {
            console.log(`child process exited with code ${code}`);
        });
    }

    async stopServer() {
        // stop server
        if (process.platform == "win32") {
            spawn("taskkill", ["/pid", this.cmd.pid, '/f', '/t']);
        } else {
            // Linux, MacOS or other
            await this.cmd.kill("SIGHUP");
        }
    }
}

exports.BasePhpTest = BasePhpTest;