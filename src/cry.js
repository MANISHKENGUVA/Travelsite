import CryptoJS from "crypto-js";

const SECRET_KEY = "alphahero"; // Move to .env in real projects

export function encryptUserData(userData) {
  const jsonString = JSON.stringify(userData);
  return CryptoJS.AES.encrypt(jsonString, SECRET_KEY).toString();
}

export function decryptUserData(cipherText) {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
    const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(decryptedText);
  } catch (error) {
    console.error("Failed to decrypt user data:", error);
    return null;
  }
}