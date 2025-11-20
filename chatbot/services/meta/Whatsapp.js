import { WHATSAPP_TOKEN, PHONE_NUMBER_ID, URL_META_WHATSAPP } from '../../config/constants.js';
import axios from 'axios';

export class Whatsapp {
    constructor() {
        this.url = URL_META_WHATSAPP;
        this.whatsapp_token = WHATSAPP_TOKEN;
        this.phone_number_id = PHONE_NUMBER_ID;
    }

    sendMessage = async (to, message) => {
        try {
            const url = `${this.url}${this.phone_number_id}/messages`;

            const response = await axios.post(
                url,
                {
                    messaging_product: 'whatsapp',
                    to,
                    type: 'text',
                    text: { body: `${message}` }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.whatsapp_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            // console.log('✅ Mensaje enviado:', response.data);
        } catch (error) {
            console.error('❌ Error al enviar mensaje:', error.response?.data || error.message);
        }
    }
}