window.indexedDbStorage = (() => {
    const dbName = "MySoundboardDb";
    const storeName = "appState";
    const sectionsKey = "sections";

    function openDb(version) {
        return new Promise((resolve, reject) => {
            const request = version === undefined
                ? indexedDB.open(dbName)
                : indexedDB.open(dbName, version);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(storeName)) {
                    db.createObjectStore(storeName);
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    async function openDbEnsuringStore() {
        let db = await openDb();

        if (db.objectStoreNames.contains(storeName)) {
            return db;
        }

        const upgradeVersion = db.version + 1;
        db.close();
        db = await openDb(upgradeVersion);
        return db;
    }

    async function loadSections() {
        const db = await openDbEnsuringStore();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readonly");
            const store = tx.objectStore(storeName);
            const request = store.get(sectionsKey);

            request.onsuccess = () => resolve(request.result ?? []);
            request.onerror = () => reject(request.error);
        });
    }

    async function saveSections(sections) {
        const db = await openDbEnsuringStore();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(storeName, "readwrite");
            const store = tx.objectStore(storeName);
            store.put(sections, sectionsKey);

            tx.oncomplete = () => resolve();
            tx.onerror = () => reject(tx.error);
            tx.onabort = () => reject(tx.error);
        });
    }

    return {
        loadSections,
        saveSections
    };
})();
