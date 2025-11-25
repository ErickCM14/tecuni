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
            // console.log('✅ Mensaje enviado:', JSON.stringify(response.data));
            // console.log(response);
            // console.log("---id");
            // console.log(response.data.messages[0].id);
            // console.log("---endid");
            return response.data.messages[0].id;
        } catch (error) {
            console.error('❌ Error al enviar mensaje:', error.response?.data || error.message);
        }
    }

    sendMessageButtons = async (to, message, buttons = []) => {
        try {
            const url = `${this.url}${this.phone_number_id}/messages`;

            const response = await axios.post(
                url,
                {
                    messaging_product: 'whatsapp',
                    to,
                    type: 'interactive',
                    interactive: {
                        type: 'button',
                        body: {
                            text: message
                        },
                        action: {
                            buttons: buttons.map((btn, i) => ({
                                type: "reply",
                                reply: {
                                    id: btn.id || `btn_${i + 1}`,
                                    title: btn.title
                                }
                            }))
                        }
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.whatsapp_token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data.messages[0].id;

        } catch (error) {
            console.error("❌ Error al enviar botones:", error.response?.data || error.message);
        }
    }

    sendMessageListMessage = async (to, bodyText, sections, buttonText = 'Opciones', headerText = null, footerText = null) => {
        try {
            const url = `${this.url}${this.phone_number_id}/messages`;

            const payload = {
                messaging_product: "whatsapp",
                to,
                type: "interactive",
                interactive: {
                    type: "list",
                    body: {
                        text: bodyText
                    },
                    action: {
                        button: buttonText,
                        sections
                    }
                }
            };

            if (headerText) {
                payload.interactive.header = {
                    type: "text",
                    text: headerText
                };
            }

            if (footerText) {
                payload.interactive.footer = {
                    text: footerText
                };
            }

            const response = await axios.post(
                url,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${this.whatsapp_token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data.messages[0].id;

        } catch (error) {
            console.error("❌ Error al enviar list message:", error.response?.data || error.message);
        }
    };
}