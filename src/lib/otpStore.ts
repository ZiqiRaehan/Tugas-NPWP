// Simple in-memory store for OTPs
// In production, use a Database (Redis, Postgres, etc.)
// This is used because we cannot set up a real DB in this environment without credentials

type OTPData = {
    code: string;
    expiresAt: number;
};

// Global map to store OTPs
/* eslint-disable no-var */
declare global {
    var otpStore: Map<string, OTPData>;
}

if (!global.otpStore) {
    global.otpStore = new Map();
}

export const saveOTP = (email: string, code: string) => {
    const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
    global.otpStore.set(email, { code, expiresAt });
};

export const verifyOTP = (email: string, code: string): boolean => {
    const data = global.otpStore.get(email);

    if (!data) return false;

    if (Date.now() > data.expiresAt) {
        global.otpStore.delete(email);
        return false;
    }

    if (data.code === code) {
        global.otpStore.delete(email);
        return true;
    }

    return false;
};
