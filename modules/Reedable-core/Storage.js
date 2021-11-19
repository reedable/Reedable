export class Sync {

    static async get(...keys) {
        return new Promise(resolve => {
            chrome.storage.sync.get(keys, resolve);
        });
    }

    static async set(values) {
        return new Promise(resolve => {
            chrome.storage.sync.set(values, resolve);
        });
    }
}