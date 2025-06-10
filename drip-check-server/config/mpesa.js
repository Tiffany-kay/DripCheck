const axios = require('axios');

class MPESAService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL;
    this.baseUrl = 'https://sandbox.safaricom.co.ke'; // Use sandbox for testing
  }

  // Generate access token
  async getAccessToken() {
    try {
      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Error getting M-PESA access token:', error.response?.data || error.message);
      throw new Error('Failed to get M-PESA access token');
    }
  }

  // Generate timestamp for M-PESA
  generateTimestamp() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }

  // Generate password for STK Push
  generatePassword(timestamp) {
    const data = `${this.shortcode}${this.passkey}${timestamp}`;
    return Buffer.from(data).toString('base64');
  }

  // Initiate STK Push
  async initiateSTKPush({ phoneNumber, amount, accountReference, transactionDesc }) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      // Clean phone number (remove +, spaces, ensure 254 format)
      let cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/^\+/, '');
      if (cleanPhone.startsWith('0')) {
        cleanPhone = '254' + cleanPhone.substring(1);
      }
      if (!cleanPhone.startsWith('254')) {
        cleanPhone = '254' + cleanPhone;
      }

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: parseInt(amount),
        PartyA: cleanPhone,
        PartyB: this.shortcode,
        PhoneNumber: cleanPhone,
        CallBackURL: this.callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      };

      console.log('STK Push Request:', JSON.stringify(requestBody, null, 2));

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('STK Push Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('STK Push Error:', error.response?.data || error.message);
      throw error;
    }
  }

  // Query STK Push status
  async querySTKPushStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const timestamp = this.generateTimestamp();
      const password = this.generatePassword(timestamp);

      const requestBody = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        requestBody,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('STK Push Query Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

// Legacy function for backward compatibility
async function initiateMpesaStkPush(phone, amount, reference) {
  const mpesaService = new MPESAService();
  return await mpesaService.initiateSTKPush({
    phoneNumber: phone,
    amount: amount,
    accountReference: reference,
    transactionDesc: `DripCheck Payment - ${reference}`
  });
}

module.exports = { 
  MPESAService: new MPESAService(),
  initiateMpesaStkPush 
};
