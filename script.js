const inputText = document.getElementById('input-text');
const textareaEncriptada = document.getElementById('textarea-encriptada');

// Secret key for AES (must be kept secure)
const secretKey = crypto.getRandomValues(new Uint8Array(16)); // Generate a random 128-bit secret key

// Function to encrypt text using AES
async function encrypt(text, key) {
    const encoder = new TextEncoder();
    const encodedText = encoder.encode(text);

    const algorithm = {
        name: 'AES-GCM',
        iv: crypto.getRandomValues(new Uint8Array(12)),
    };

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-GCM' },
        false,
        ['encrypt']
    );

    const encryptedText = await crypto.subtle.encrypt(
        algorithm,
        cryptoKey,
        encodedText
    );

    return encryptedText;
}

// Function to decrypt text using AES
async function decrypt(encryptedText, key) {
    const algorithm = {
        name: 'AES-GCM',
        iv: encryptedText.slice(0, 12),
    };

    const cryptoKey = await crypto.subtle.importKey(
        'raw',
        key,
        { name: 'AES-GCM' },
        false,
        ['decrypt']
    );

    const decryptedText = await crypto.subtle.decrypt(
        algorithm,
        cryptoKey,
        encryptedText.slice(12)
    );

    const decoder = new TextDecoder();
    const originalText = decoder.decode(decryptedText);

    return originalText;
}

// Update encrypted textarea as input is typed
inputText.addEventListener('input', async () => {
    const text = inputText.value;
    const encryptedText = await encrypt(text, secretKey);
    textareaEncriptada.value = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedText)));
});

// Decrypt text on page load (if necessary)
window.onload = async () => {
    const encryptedText = textareaEncriptada.value;
    if (encryptedText) {
        const decryptedText = await decrypt(Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0)), secretKey);
        inputText.value = decryptedText;
    }
};
