import {content} from "./content";
import {errors} from "./errors";
import {test} from "./test";
import {ui} from "./ui";

import {Debounce} from "./Debounce";
import {deep} from "./deep";
import {Porxy} from "./Porxy";
import {Storage} from "./Storage";
import {Throttle} from "./Throttle";
import {When} from "./When";

export const core = {
    content,
    errors,
    test,
    ui,
    Debounce,
    deep,
    Porxy,
    Sync: Storage,
    Throttle,
    When
};
