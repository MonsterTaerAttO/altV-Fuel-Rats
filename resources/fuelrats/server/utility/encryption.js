import * as alt from 'alt';
import sjcl from 'sjcl';

/**
 * Hash a password with pbkdf2
 * @param password
 */
export function encryptPassword(password) {
    const saltBits = sjcl.random.randomWords(2, 0);
    const salt = sjcl.codec.base64.fromBits(saltBits);
    const key = sjcl.codec.base64.fromBits(sjcl.misc.pbkdf2(password, saltBits, 2000, 256));
    return `${key}$${salt}`;
}

/**
 * Verify a password hash matches
 * @param {*} password
 * @param {*} passwordHash
 */
export function verifyPassword(password, passwordHash) {
    const [_key, _salt] = passwordHash.split('$');
    const saltBits = sjcl.codec.base64.toBits(_salt);
    const derivedKey = sjcl.misc.pbkdf2(password, saltBits, 2000, 256);
    const derivedBaseKey = sjcl.codec.base64.fromBits(derivedKey);
    if (_key != derivedBaseKey) {
        return false;
    }
    return true;
}

/**
 * Generate a hash based on string.
 * @param data
 */
export function generateHash(data) {
    let hashBytes = sjcl.hash.sha256.hash(data + Math.random(0, 900000000));
    return sjcl.codec.hex.fromBits(hashBytes);
}

export function persistentHash(data) {
    let hashBytes = sjcl.hash.sha256.hash(data);
    return sjcl.codec.hex.fromBits(hashBytes);
}
