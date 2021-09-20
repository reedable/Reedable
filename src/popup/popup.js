import App from "./Reedable/App.js";
import Main from "./Main.js";

const app = new App(document);

const [main] = await app.start({
    "main": (n) => new Main(n),
});