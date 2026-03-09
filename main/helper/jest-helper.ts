/**
 * Determines if we're currently running in Jest
 * @returns
 */
export function runningInJest(): boolean {
    try {
        return typeof (expect as any).extend === 'function';
    } catch (e) {
        return false;
    }
}
