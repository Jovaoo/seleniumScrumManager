const { BasePhpTest } = require("./BasePhpTest.js");
const { By, until } = require("selenium-webdriver");
const assert = require('assert');

class MyTest extends BasePhpTest {
    async test() {
        // Test LOGIN CORRECTE usuari predefinit
        //////////////////////////////////////////////////////
        await this.driver.get("https://scrummanager.ieti.site/login/");
        await this.driver.findElement(By.id("username")).sendKeys("test_selenium@gmail.com");
        await this.driver.findElement(By.id("password")).sendKeys("Hola@123");
        await this.driver.findElement(By.xpath("//input[@type='submit']")).click();

        // Debugging step to check if form submission works
        console.log("Iniciando sesión...");
        // Verify alert message is correct
        try {
                await this.driver.wait(until.elementLocated(By.className("notification__body")), 10000, "ERROR TEST: después del login debe aparecer un div con la clase 'notification__body'.");
                const alert = await this.driver.findElement(By.className("notification__body"));
                const alertText = await alert.getText();
                const assertMessage = "¡Inicio de sesión correcto!";

                assert.strictEqual(alertText, assertMessage, `ERROR TEST: l'usuari admin@admin.com/Hola@123 hauria d'entrar amb el missatge '${assertMessage}' en un alert.`);
                console.log("¡Inicio de sesión correcto!");
        } catch (e) {
                console.error("Mensaje no encontrado o error inesperado: ", e);
        }


        // Test Crear Grupo y crear proyecto
        
        console.log("Creando grupo...");
        await this.driver.get("https://scrummanager.ieti.site/crear_grupo/");
        await this.driver.findElement(By.id("name-company")).sendKeys("Esteve Terradas");
        await this.driver.findElement(By.id("password")).sendKeys("3sT3v3T3rr4d4s");
        await this.driver.findElement(By.xpath("//input[@type='submit']")).click();
        try {
            await this.driver.wait(until.elementLocated(By.className("notification__body")), 10000, "ERROR TEST: después del login debe aparecer un div con la clase 'notification__body'.");
            const alert = await this.driver.findElement(By.className("notification__body"));
            const alertText = await alert.getText();
            const assertMessage = "¡Grupo creado correctamente!";
            assert.strictEqual(alertText, assertMessage, `ERROR TEST: No se ha creado el grupo correctamente`);
            console.log("¡Grupo creado correctamente!");
        } catch (e) {
            console.error("Mensaje no encontrado o error inesperado: ", e);
        }


        // Crear proyecto
        console.log("Creando proyecto...");
        await this.driver.get("https://scrummanager.ieti.site/dashboard/");

        // Buscar el boton que contenga por className "btn btn-primary"
        await this.driver.findElement(By.className("bg-primary text-white font-bold py-2 px-4 rounded-lg bg-blue-500 hover:bg-blue-600")).click();
        
        await this.driver.findElement(By.id("project-name")).sendKeys("Proyecto selenium");
        // date input
        await this.driver.findElement(By.id("start-date")).sendKeys("13/06/2024");
        await this.driver.findElement(By.className("inline-flex items-center justify-center whitespace-nowrap rounded-md text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-gray-50")).click();
        
        try {
            await this.driver.wait(until.elementLocated(By.className("notification__body")), 10000, "ERROR TEST: después del login debe aparecer un div con la clase 'notification__body'.");
            const alert = await this.driver.findElement(By.className("notification__body"));
            const alertText = await alert.getText();
            const assertMessage = "¡Proyecto creado correctamente!";
            assert.strictEqual(alertText, assertMessage, `ERROR TEST: No se ha creado el grupo correctamente`);
            console.log("¡Proyecto creado correctamente!");
        } catch (e) {
            console.error("Mensaje no encontrado o error inesperado: ", e);
        }


        // Buscar el proyecto creado
        console.log("Buscando proyecto creado...");
        await this.driver.get("https://scrummanager.ieti.site/dashboard/");
        // Buscar el h2 que contenga el nombre del proyecto
        try {
            await this.driver.wait(until.elementLocated(By.className("text-3xl font-semibold")), 10000, "ERROR TEST: después del login debe aparecer un div con la clase 'notification__body'.");
            const alert = await this.driver.findElement(By.className("text-3xl font-semibold"));
            const alertText = await alert.getText();
            const assertMessage = "Proyecto selenium";
            assert.strictEqual(alertText, assertMessage, `ERROR TEST: No se ha encontrado el proyecto creado`);
            console.log("¡Proyecto encontrado correctamente!");
        } catch (e) {
            console.error("Mensaje no encontrado o error inesperado: ", e);
        }












    }
}

(async function test_example() {
    const test = new MyTest();
    await test.run();
    console.log("END");
})();
