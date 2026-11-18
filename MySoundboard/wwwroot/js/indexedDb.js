const databaseName = "MySoundboardDb";
const databaseVersion = 1;
const soundStoreName = "sounds";

let databasePromise = null;

function openDatabase() {
    if (databasePromise) {
        return databasePromise;
    }

    databasePromise = new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName, databaseVersion);

        request.onupgradeneeded = event => {
            const database = event.target.result;

            if (!database.objectStoreNames.contains(soundStoreName)) {
                const store = database.createObjectStore(
                    soundStoreName,
                    { keyPath: "id" }
                );

                store.createIndex("name", "name", { unique: false });
                store.createIndex("position", "position", { unique: false });
                store.createIndex("createdAt", "createdAt", { unique: false });
            }
        };

        request.onsuccess = event => {
            resolve(event.target.result);
        };

        request.onerror = event => {
            databasePromise = null;
            reject(event.target.error);
        };

        request.onblocked = () => {
            databasePromise = null;
            reject(
                new Error(
                    "Die IndexedDB-Datenbank ist durch eine andere Registerkarte blockiert."
                )
            );
        };
    });

    return databasePromise;
}

function requestAsPromise(request) {
    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

function transactionAsPromise(transaction) {
    return new Promise((resolve, reject) => {
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
        transaction.onabort = () => reject(transaction.error);
    });
}

export async function initialize() {
    await openDatabase();
    return true;
}

export async function getAllSounds() {
    const database = await openDatabase();

    const transaction = database.transaction(
        soundStoreName,
        "readonly"
    );

    const store = transaction.objectStore(soundStoreName);
    const records = await requestAsPromise(store.getAll());

    return records
        .map(record => ({
            id: record.id,
            name: record.name,
            fileName: record.fileName,
            contentType: record.contentType,
            fileSize: record.fileSize,
            color: record.color,
            volume: record.volume,
            position: record.position,
            createdAt: record.createdAt
        }))
        .sort((left, right) => left.position - right.position);
}

export async function deleteSound(id) {
    const database = await openDatabase();

    const transaction = database.transaction(
        soundStoreName,
        "readwrite"
    );

    transaction.objectStore(soundStoreName).delete(id);

    await transactionAsPromise(transaction);
}

export async function clearSounds() {
    const database = await openDatabase();

    const transaction = database.transaction(
        soundStoreName,
        "readwrite"
    );

    transaction.objectStore(soundStoreName).clear();

    await transactionAsPromise(transaction);
}

export async function updateMetadata(metadata) {
    const database = await openDatabase();

    const readTransaction = database.transaction(
        soundStoreName,
        "readonly"
    );

    const existingRecord = await requestAsPromise(
        readTransaction
            .objectStore(soundStoreName)
            .get(metadata.id)
    );

    if (!existingRecord) {
        throw new Error("Der Sound wurde nicht gefunden.");
    }

    const updatedRecord = {
        ...existingRecord,
        name: metadata.name,
        color: metadata.color,
        volume: metadata.volume,
        position: metadata.position
    };

    const writeTransaction = database.transaction(
        soundStoreName,
        "readwrite"
    );

    writeTransaction
        .objectStore(soundStoreName)
        .put(updatedRecord);

    await transactionAsPromise(writeTransaction);
}

export async function playSound(id, volume) {
    const database = await openDatabase();

    const transaction = database.transaction(
        soundStoreName,
        "readonly"
    );

    const record = await requestAsPromise(
        transaction.objectStore(soundStoreName).get(id)
    );

    if (!record || !record.audioBlob) {
        throw new Error("Die Audiodatei wurde nicht gefunden.");
    }

    const objectUrl = URL.createObjectURL(record.audioBlob);
    const audio = new Audio(objectUrl);

    audio.volume = Math.max(0, Math.min(1, volume ?? 1));

    audio.addEventListener(
        "ended",
        () => URL.revokeObjectURL(objectUrl),
        { once: true }
    );

    audio.addEventListener(
        "error",
        () => URL.revokeObjectURL(objectUrl),
        { once: true }
    );

    await audio.play();
}

export async function importFiles(inputElement) {
    if (!inputElement?.files?.length) {
        return [];
    }

    const database = await openDatabase();
    const importedSounds = [];

    for (const file of inputElement.files) {
        if (!file.type.startsWith("audio/")) {
            continue;
        }

        const id = crypto.randomUUID();

        const record = {
            id: id,
            name: removeExtension(file.name),
            fileName: file.name,
            contentType: file.type,
            fileSize: file.size,
            color: "#2563eb",
            volume: 1,
            position: 0,
            createdAt: new Date().toISOString(),
            audioBlob: file
        };

        const transaction = database.transaction(
            soundStoreName,
            "readwrite"
        );

        transaction.objectStore(soundStoreName).put(record);

        await transactionAsPromise(transaction);

        importedSounds.push({
            id: record.id,
            name: record.name,
            fileName: record.fileName,
            contentType: record.contentType,
            fileSize: record.fileSize,
            color: record.color,
            volume: record.volume,
            position: record.position,
            createdAt: record.createdAt
        });
    }

    inputElement.value = "";

    return importedSounds;
}

function removeExtension(fileName) {
    const lastDot = fileName.lastIndexOf(".");

    if (lastDot <= 0) {
        return fileName;
    }

    return fileName.substring(0, lastDot);
}