import { WHATSAPP_TOKEN, PHONE_NUMBER_ID, URL_META_WHATSAPP } from '../../config/constants.js';
import axios from 'axios';
import fs from "fs";
import FormData from "form-data";

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

    sendImage = async (to, imageUrl, caption = "") => {
        try {
            const url = `${this.url}${this.phone_number_id}/messages`;

            const response = await axios.post(
                url,
                {
                    messaging_product: "whatsapp",
                    to,
                    type: "image",
                    image: {
                        link: imageUrl,
                        caption
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.whatsapp_token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data.messages[0].id;

        } catch (error) {
            console.error("❌ Error al enviar imagen:", error.response?.data || error.message);
        }
    };

    sendVideo = async (to, videoUrl, caption = "") => {
        try {
            const url = `${this.url}${this.phone_number_id}/messages`;

            const response = await axios.post(
                url,
                {
                    messaging_product: "whatsapp",
                    to,
                    type: "video",
                    video: {
                        link: videoUrl,
                        caption
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.whatsapp_token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data.messages[0].id;

        } catch (error) {
            console.error("❌ Error al enviar video:", error.response?.data || error.message);
        }
    };

    sendDocument = async (to, fileUrl, filename = "archivo.pdf", caption = "") => {
        try {
            const url = `${this.url}${this.phone_number_id}/messages`;

            const response = await axios.post(
                url,
                {
                    messaging_product: "whatsapp",
                    to,
                    type: "document",
                    document: {
                        link: fileUrl,
                        filename,
                        caption
                    }
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.whatsapp_token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            return response.data.messages[0].id;

        } catch (error) {
            console.error("❌ Error al enviar documento:", error.response?.data || error.message);
        }
    };

    sendMedia = async (to, {
        type,          // "image", "video", "document", "audio", "sticker"
        url = null,    // archivo o recurso en internet 
        filePath = null, // archivo local
        mimeType = null, // requerido si filePath
        caption = "",
        filename = null
    }) => {
        try {
            const endpoint = `${this.url}${this.phone_number_id}/messages`;
            let mediaPayload = {};

            // Caso 1: Archivo local → se sube a Meta
            if (filePath) {
                if (!mimeType) throw new Error("mimeType es obligatorio cuando usas filePath");
                const mediaId = await this.uploadMedia(filePath, mimeType);
                console.log("mediaId");
                console.log(mediaId);


                mediaPayload = { id: mediaId };
            }

            // Caso 2: Archivo por URL
            else if (url) {
                mediaPayload = { link: url };
            }

            // Caso 3: solo texto + link con vista previa
            else {
                throw new Error("Debes enviar url o filePath");
            }

            // Agrega caption si aplica al tipo
            if (caption && ["image", "video", "document"].includes(type)) {
                mediaPayload.caption = caption;
            }

            // Nombre del archivo para documentos
            if (filename && type === "document") {
                mediaPayload.filename = filename;
            }

            const payload = {
                messaging_product: "whatsapp",
                to,
                type,
                [type]: mediaPayload
            };

            const response = await axios.post(endpoint, payload, {
                headers: {
                    Authorization: `Bearer ${this.whatsapp_token}`,
                    "Content-Type": "application/json"
                }
            });

            return response.data.messages[0].id;

        } catch (error) {
            console.error("❌ Error en sendMedia:", error.response?.data || error.message);
        }
    };

    uploadMedia = async (filePath, mimeType) => {
        try {
            const url = `${this.url}${this.phone_number_id}/media`;

            const formData = new FormData();
            formData.append("file", fs.createReadStream(filePath));
            formData.append("type", mimeType);

            const response = await axios.post(url, formData, {
                headers: {
                    Authorization: `Bearer ${this.whatsapp_token}`,
                    ...formData.getHeaders()
                }
            });

            return response.data.id; // media_id

        } catch (error) {
            console.error("❌ Error al subir media:", error.response?.data || error.message);
        }
    };


}