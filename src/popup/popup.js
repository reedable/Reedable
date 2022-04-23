import {App} from "../../modules/Reedable-core/ui/App";
import {Main} from "./Main";

const app = new App(document);

app.start({
    "main": (n) => new Main(n)
});