import { userManager } from './auth';

// Simulate network delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// =========================================================================
// SECURITY PROTOCOL CREDENTIALS 
// TODO: Replace PASS_KEY static binding with your precise pre-prod assignment!
// =========================================================================
const API_URL = '/txn-api/encrV4/CBOI/fetch/fetchById';
const ENCR_DECR_KEY = '82gbZpEWVzTcL5qXB+kSKCes7XbqdNxqKjQeDgdnJX0=';
const PASS_KEY = 'c0CKRG7yNFY3OIxY92izqj0YeMk6JPqdOlGgqsv3mhicXmAv';
const mockVPAs = [
  { id: '1', vpa: 'Pabitra.hota@cbin', name: 'Coffee Shop Main', bank: 'Central Bank of India' },
  { id: '2', vpa: '9283032322742bis@cbin', name: 'Retail Store', bank: 'Central Bank of India' },
  { id: '3', vpa: 'Pabitra@cbin', name: 'Staff Tips Collector', bank: 'Central Bank of India' },
];

const mockLanguages = [
  { code: 'en', name: 'English' },
  { code: 'od', name: 'Odia' },
  { code: 'hi', name: 'Hindi' },
];

let currentUserLanguage = 'od';

export const ApiService = {
  fetchById: async () => {
    try {
      // Grab exact raw storage tokens generated natively during the Authentik Callback
      const accessToken = localStorage.getItem('access_token') || '';
      const mobileNumber = localStorage.getItem('mobileNumber') || '';

      // 1. Build your targeted Unencrypted JSON payload with the live mobile number
      const rawPayload = {
        mobile_number: mobileNumber // Map this exact key to match the API doc expectation!
      };

      // 2. Submit to the external Encryption Engine API
      const encrResponse = await fetch('/encr-api/encr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'key': ENCR_DECR_KEY
        },
        body: JSON.stringify(rawPayload)
      });
      const encrData = await encrResponse.json();

      // Extract the 'RequestData' parameter containing the secure string
      const encryptedString = encrData.RequestData || encrData;

      // 3. Mount the secure POST request targeting Pre-Prod
      const mainResponse = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pass_key': PASS_KEY,
          'Authorization': accessToken
        },
        body: JSON.stringify({ RequestData: encryptedString })
      });

      // We expect the PreProd endpoint to return an encrypted response data structure
      const encryptedMainData = await mainResponse.json();
      const stringToDecrypt = encryptedMainData.data || encryptedMainData;

      // 4. Send the returned payload string to the Decryption Engine
      const decrResponse = await fetch('/encr-api/decr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'key': ENCR_DECR_KEY
        },
        body: JSON.stringify({ req: stringToDecrypt.ResponseData }) // using the mandated 'req' wrapper parameter
      });

      const decryptedData = await decrResponse.json();

      // 5. Expose the mapped array to Dashboard.jsx seamlessly
      // Fallback explicitly to mocks if the Decryption endpoint returns a JSON error like { "error": "Access Denied" }
      if (decryptedData && Array.isArray(decryptedData.data)) {
        return decryptedData.data.map((item, index) => ({
          ...item,
          id: item.id || `vpa-${index}`,
          vpa: item.vpa_id || '',
          name: item.merchant_name || 'CBOI Merchant',
          bank: 'Central Bank of India'
        }));
      } else if (Array.isArray(decryptedData)) {
        return decryptedData.map((item, index) => ({
          ...item,
          id: item.id || `vpa-${index}`,
          vpa: item.vpa_id || '',
          name: item.merchant_name || 'CBOI Merchant',
          bank: 'Central Bank of India'
        }));
      } else {
        console.error("API failed to return a valid VPA schema. Received:", decryptedData);
        return mockVPAs; // Keeps the UI alive securely during network failure
      }
    } catch (err) {
      console.error('Secure Remote proxy VPA API Hook Error:', err);
      // Fallback to purely render visual mock data locally if encryption API network drops
      return mockVPAs;
    }
  },

  report: async (startDate, endDate) => {
    try {
      const savedProfile = localStorage.getItem('activeProfileDetails');
      let vpaId = '';
      if (savedProfile) {
         try { 
           const p = JSON.parse(savedProfile);
           vpaId = p.vpa_id || p.vpa || ''; 
         } catch(e) {}
      }

      const payload = {
        startDate: startDate,
        endDate: endDate,
        vpa_id: vpaId,
        mode: "both"
      };

      const response = await fetch('https://services-cboi-uat.isupay.in/CBOI/reports/querysubmit_username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': localStorage.getItem('access_token') || ''
        },
        body: JSON.stringify(payload)
      });

      const json = await response.json();
      
      // Standardize return structure to robust arrays
      if (json && Array.isArray(json.data)) return json.data;
      if (Array.isArray(json)) return json;
      
      console.warn("Unexpected Report JSON Schema:", json);
      return [];
    } catch (err) {
      console.error('Remote report failure:', err);
      return [];
    }
  },

  convertToQRBase64: async (qrString) => {
    try {
      const accessToken = localStorage.getItem('access_token') || '';
      
      // 1. Encrypt Payload
      const encrResponse = await fetch('/encr-api/encr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'key': ENCR_DECR_KEY },
        body: JSON.stringify({ qrString: qrString })
      });
      const encrData = await encrResponse.json();
      const encryptedString = encrData.RequestData || encrData;

      // 2. Transmit to secure Gateway Proxy
      const mainResponse = await fetch('/txn-api/encrV4/CBOI/merchant/qr_convert_to_base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pass_key': PASS_KEY,
          'Authorization': accessToken
        },
        body: JSON.stringify({ RequestData: encryptedString })
      });
      
      const encryptedMainData = await mainResponse.json();
      const stringToDecrypt = encryptedMainData.data || encryptedMainData;

      // 3. Decrypt output securely
      const decrResponse = await fetch('/encr-api/decr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'key': ENCR_DECR_KEY },
        body: JSON.stringify({ req: stringToDecrypt.ResponseData || stringToDecrypt })
      });
      
      const decryptedData = await decrResponse.json();
      
      // Strip exactly what nested parameter stores the base64 sequence directly
      if (decryptedData.base64Image) return decryptedData.base64Image;
      if (decryptedData.data && decryptedData.data.base64Image) return decryptedData.data.base64Image;
      if (decryptedData.base64) return decryptedData.base64;
      if (decryptedData.data && decryptedData.data.qr_base64) return decryptedData.data.qr_base64;
      if (decryptedData.data && decryptedData.data.base64) return decryptedData.data.base64;
      if (decryptedData.qr_base64) return decryptedData.qr_base64;
      if (typeof decryptedData === 'string') return decryptedData;
      if (typeof decryptedData.data === 'string') return decryptedData.data;
      
      return null;
    } catch (err) {
      console.error('Remote base64 QR generation failure:', err);
      return null;
    }
  },

  currentLanguage: async () => {
    await delay(300);
    return mockLanguages.find(l => l.code === currentUserLanguage) || mockLanguages[0];
  },

  fetchAllLanguage: async () => {
    await delay(300);
    return mockLanguages;
  },

  UpdateLanguage: async (langCode) => {
    await delay(500);
    currentUserLanguage = langCode;
    return true;
  },

  createTicket: async (formPayload) => {
    try {
      const accessToken = localStorage.getItem('access_token') || '';
      
      // 1. Encrypt Payload natively via local module Engine
      const encrResponse = await fetch('/encr-api/encr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'key': ENCR_DECR_KEY },
        body: JSON.stringify(formPayload)
      });
      const encrData = await encrResponse.json();
      const encryptedString = encrData.RequestData || encrData;

      // 2. Transmit string payload bypassing CORS through the Vite local proxy routing securely
      const mainResponse = await fetch('/txn-api/encrV4/CBOI/zendesk/v2/createTicket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'pass_key': PASS_KEY,
          'Authorization': accessToken
        },
        body: JSON.stringify({ RequestData: encryptedString })
      });
      
      const encryptedMainData = await mainResponse.json();
      const stringToDecrypt = encryptedMainData.data || encryptedMainData;

      // 3. Decrypt remote proxy response stream back securely to unencrypted text object
      const decrResponse = await fetch('/encr-api/decr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'key': ENCR_DECR_KEY },
        body: JSON.stringify({ req: stringToDecrypt.ResponseData || stringToDecrypt })
      });
      
      return await decrResponse.json();
    } catch (err) {
      console.error('Remote ticket encrypted submission pipeline failure:', err);
      return null;
    }
  }
};
