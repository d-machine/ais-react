export function getNumber(key: string): number | null {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    const num = Number(item);
    return isNaN(num) ? null : num;
}

export function setNumber(key: string, value: number): void {
    localStorage.setItem(key, value.toString());
}

export function getBoolean(key: string): boolean | null {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    if (item === 'true') return true;
    if (item === 'false') return false;
    return null;
}

export function setBoolean(key: string, value: boolean): void {
    localStorage.setItem(key, value ? 'true' : 'false');
}

export function getString(key: string): string | null {
    return localStorage.getItem(key);
}

export function setString(key: string, value: string): void {
    localStorage.setItem(key, value);
}

export function getJSON<T = any>(key: string): T | null {
    const item = localStorage.getItem(key);
    if (item === null) return null;
    try {
        return JSON.parse(item) as T;
    } catch {
        return null;
    }
}

export function setJSON<T = any>(key: string, value: T): void {
    localStorage.setItem(key, JSON.stringify(value));
}

export function remove(key: string): void {
    localStorage.removeItem(key);
}

export function clear(): void {
    localStorage.clear();
}

export function has(key: string): boolean {
    return localStorage.getItem(key) !== null;
}

export function getAllKeys(substring?: string): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (!substring || key.includes(substring))) {
            keys.push(key);
        }
    }
    return keys;
};
