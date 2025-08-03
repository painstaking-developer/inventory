const decodeBase64 = (b64) => {
    try {
        return atob(decodeURIComponent(b64));
    } catch {
        return '*Invalid base64 input*';
    }
};

const base64EncodeUnicode = (str) => {
    try {
        const bytes = new TextEncoder().encode(str);
        let binary = '';
        bytes.forEach((b) => (binary += String.fromCharCode(b)));
        return encodeURIComponent(btoa(binary));
    } catch {
        return '';
    }
};

export { decodeBase64, base64EncodeUnicode };