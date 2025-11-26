import { HOST } from '../config/constants.js';

export class SaveProject {
    constructor(ConversationRepo, Whatsapp, Conversations, OpenAiApi, OptionsEnum, Prompts, PhoneNumber, NameBot) {
        this.conversationRepo = ConversationRepo;
        this.whatsapp = Whatsapp;
        this.conversations = Conversations;

        this.roleBot = "bot";
        this.roleUser = "user";
        this.phoneNumberBot = PhoneNumber;
        this.nameBot = NameBot;
        this.host = HOST;

        this.startInactiveUserWatcher();
    }

    /**
     * FLUJO PRINCIPAL
     */
    async execute(profile, message) {
        console.log(message);

        const from = message.from;
        const profileName = profile?.name || "";
        let text = message.text?.body?.trim() || "";
        let button_id = "";
        switch (message.type) {
            case "text":
                text = message.text?.body?.trim() || "";
                break;
            case "interactive":
                switch (message.interactive.type) {
                    case 'button_reply':
                        text = message.interactive?.button_reply?.title.trim() || "";
                        button_id = message.interactive?.button_reply?.id || "";
                        break;
                    case 'list_reply':
                        text = message.interactive?.list_reply?.title.trim() || "";
                        button_id = message.interactive?.list_reply?.id || "";
                        break;
                    default:
                        text = message.text?.body?.trim() || "";
                        break;
                }
                break;
            default:
                text = message.text?.body?.trim() || "";
                break;
        }

        try {
            // Crear conversación en memoria si no existe
            if (!this.conversations[from]) {
                return await this.startNewConversation(from, profileName, text);
            }

            // SIEMPRE guardar el mensaje entrante del usuario
            await this.saveIncomingMessage(from, profileName, text, message.id, message.type, message.timestamp);

            // Continuar flujo
            console.log('button_id', button_id);

            return await this.continueConversation(from, text, button_id);

        } catch (error) {
            console.error("Error SaveProject:", error);
            return true;
        }
    }

    /**
     * ENVÍA un mensaje por WhatsApp y lo GUARDA en MongoDB
     */
    // Dentro de SaveProject class — reemplaza sendAndSave actual
    async sendAndSave(to, text, options = null, extra = {}, media = null) {
        console.log("sendAndSave:", to, text, options);

        let waIdBot = null;
        try {
            const { buttonText = "Opciones", headerText = null, footerText = null } = extra;

            // 1) Si no hay opciones -> texto simple
            if (!options || (Array.isArray(options) && options.length === 0)) {
                waIdBot = await this.whatsapp.sendMessage(to, text);
            } else {
                if (Array.isArray(options)) {
                    // options es array plano [{id,title}, ...]
                    if (options.length > 3) {
                        // convertir a sections
                        const sections = [
                            {
                                rows: options.map(o => ({
                                    id: o.id,
                                    title: o.title
                                }))
                            }
                        ];

                        waIdBot = await this.whatsapp.sendMessageListMessage(
                            to,
                            text,
                            sections,
                            buttonText,
                            headerText,
                            footerText
                        );
                    } else {
                        // 1..3 -> botones
                        waIdBot = await this.whatsapp.sendMessageButtons(
                            to,
                            text,
                            options.map((o, i) => ({
                                id: o.id || `btn_${i + 1}`,
                                title: o.title
                            }))
                        );
                    }
                } else {
                    // Si options tiene otro formato (defensivo)
                    console.warn("Formato de options inesperado, enviando como texto.");
                    waIdBot = await this.whatsapp.sendMessage(to, text);
                }
            }

            if (media) {
                if (Array.isArray(media) && media.length) {
                    for (const m of media) {

                        const { type, file, mimeType, caption, filename } = m;

                        let mediaResult = null;

                        // Si viene filePath local
                        if (file) {
                            const absPath = path.join(process.cwd(), "public", "media", file);

                            mediaResult = await this.whatsapp.sendMedia(to, {

                                type: type,
                                url: null,
                                filePath: absPath,
                                mimeType: mimeType,
                                caption: caption,
                                filename: filename
                            });
                        }

                        // Si viene URL pública
                        else if (m.url) {
                            mediaResult = await this.whatsapp.sendMedia(to, {
                                type: type,
                                url: media.url,
                                filePath: null,
                                mimeType: mimeType,
                                caption: caption,
                                filename: filename
                            });
                        }

                        console.log("MEDIA ENVIADO:", mediaResult);
                    }
                } else {

                    const { type, file, mimeType, caption, filename } = media;

                    let mediaResult = null;

                    // Si viene filePath local
                    if (file) {
                        const absPath = path.join(process.cwd(), "public", "media", file);

                        mediaResult = await this.whatsapp.sendMedia(to, {
                            type: type,
                            url: null,
                            filePath: absPath,
                            mimeType: mimeType,
                            caption: caption,
                            filename: filename
                        });
                    }

                    // Si viene URL pública
                    else if (media.url) {
                        mediaResult = await this.whatsapp.sendMedia(to, {
                            type: type,
                            url: media.url,
                            filePath: null,
                            mimeType: mimeType,
                            caption: caption,
                            filename: filename
                        });

                        // await this.whatsapp.sendMedia(from, { type: 'image', url: this.host + '/media/imagen-prueba.png', filePath: null, mimeType: 'png', caption: "Imagen png tec", filename: "Imagen tec png" })
                        // await this.whatsapp.sendMedia(to, { type: 'document', url: this.host + '/media/documento-prueba.pdf', filePath: null, mimeType: 'pdf', caption: "Imagen pdf tec", filename: "Imagen tec pdf" })
                    }

                    console.log("MEDIA ENVIADO:", mediaResult);
                }
            }

            // Guardar conversacion
            try {
                await this.conversationRepo.saveMessage(
                    to,
                    this.nameBot,
                    this.roleBot,
                    text,
                    waIdBot,
                    "sent",
                    options ? "interactive" : "text",
                    Date.now()
                );
            } catch (saveError) {
                console.error("❌ Error guardando mensaje en conversationRepo:", saveError);
            }

            return waIdBot;

        } catch (error) {
            console.error("❌ Error al enviar en sendAndSave (SaveProject):", error.response?.data || error.message || error);
            return null;
        }
    }

    /**
     * GUARDAR SIEMPRE los mensajes del usuario entrantes
     */
    async saveIncomingMessage(from, profileName, message, messageId, messageType, messageTimestamp) {
        const now = Date.now();

        // Guardar último mensaje
        await this.conversationRepo.saveMessage(
            from,
            profileName,
            this.roleUser,
            message || "",
            messageId,
            "received",
            messageType,
            messageTimestamp
        );

        if (this.conversations[from]) {
            this.conversations[from].lastActivity = now;
        }
    }

    /**
     * CONVERSACIÓN NUEVA
     */
    async startNewConversation(from, profileName, text) {

        const lower = text.toLowerCase();

        if (lower.includes("bachillerato")) {
            // Nuevo usuario
            this.conversations[from] = {
                step: 100,
                data: { phone: from, name: profileName }
            };

            await this.sendAndSave(
                from,
                "¡Hola! 👋 Soy *Fernanda* del team *Tec Universitario*.\n\n" +
                "Que gusto tenerte por aquí 💛\n\n" +
                "Gracias por darnos la oportunidad de contarte las opciones que tenemos para ti en *Bachillerato* 👇\n\n" +
                "¿Vives en la Ciudad de México? 🇲🇽",
                [
                    { id: "si", title: "Si" },
                    { id: "no", title: "No" },
                ],
            );

            return true;
        }

        if (lower.includes("licenciatura")) {
            this.conversations[from] = {
                step: 300,
                data: { phone: from, name: profileName }
            };

            await this.sendAndSave(
                from,
                "¡Hola! 👋 Soy *Fernanda* del team *Tec Universitario*.\n\n" +
                "Que gusto saludarte 💛\n\n" +
                "Gracias por tu interés en nuestras Licenciaturas. Aquí vas a encontrar opciones increíbles para continuar tu formación profesional en un ambiente dinámico y moderno 🎓\n\n" +
                "Cuéntame algo rápido, ¿vives en la Ciudad de México? 🇲🇽",
                [
                    { id: "si", title: "Si" },
                    { id: "no", title: "No" },
                ],
            );

            return true;
        }

        this.conversations[from] = {
            step: 1,
            data: { phone: from, name: profileName }
        };

        await this.sendAndSave(
            from,
            "¡Hola! 👋 Soy *Fernanda* del team *Tec Universitario*.\n\n" +
            "Que gusto tenerte por aquí 💛\n\n" +
            "Gracias por el interés y darnos la oportunidad de contarte las opciones que tenemos para ti 👇\n\n" +
            "¿Qué te interesa estudiar?",
            [
                { id: "bachillerato", title: "Bachillerato" },
                { id: "licenciatura", title: "Licenciatura" }
            ]
        );

        return true;
    }

    /**
     * FLUJO POR STEPS
     */
    async continueConversation(from, text, id = null) {
        const user = this.conversations[from];

        switch (user.step) {

            case 0:
                user.step = 1;

                await this.sendAndSave(
                    from,
                    "¡Hola! 👋 Soy *Fernanda* del team *Tec Universitario*.\n\n" +
                    "Que gusto tenerte por aquí 💛\n\n" +
                    "Gracias por el interés y darnos la oportunidad de contarte las opciones que tenemos para ti 👇\n\n" +
                    "¿Qué te interesa estudiar?",
                    [
                        { id: "bachillerato", title: "Bachillerato" },
                        { id: "licenciatura", title: "Licenciatura" }
                    ]
                );

                return true;

            // 🟤 1 — Bachillerato / Licenciatura
            case 1:
                if (!["bachillerato", "licenciatura"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Por favor selecciona una opción 😊");
                    return true;
                }

                if (text.toLowerCase().includes("bachillerato")) {
                    user.step = 100;

                    await this.sendAndSave(
                        from,
                        "¡Hola!👋 Soy *Fernanda* del team *Tec Universitario*.\n\n" +
                        "Que gusto tenerte por aquí 💛\n\n" +
                        "Gracias por darnos la oportunidad de contarte las opciones que tenemos para ti en *Bachillerato* 👇\n\n" +
                        "¿Vives en la Ciudad de México? 🇲🇽",
                        [
                            { id: "si", title: "Si" },
                            { id: "no", title: "No" },
                        ],
                    );

                    return true;
                }

                if (text.toLowerCase().includes("licenciatura")) {

                    user.step = 300;

                    await this.sendAndSave(
                        from,
                        "¡Hola! 👋 Soy *Fernanda* del team *Tec Universitario*.\n\n" +
                        "Que gusto saludarte 💛\n\n" +
                        "Gracias por tu interés en nuestras Licenciaturas. Aquí vas a encontrar opciones increíbles para continuar tu formación profesional en un ambiente dinámico y moderno 🎓\n\n" +
                        "Cuéntame algo rápido, ¿vives en la Ciudad de México? 🇲🇽",
                        [
                            { id: "si", title: "Si" },
                            { id: "no", title: "No" },
                        ],
                    );

                    return true;
                }

                break;
            // 🟢 100 — ¿Vives en CDMX?
            case 100:
                if (!["si", "no"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Opción invalida. Por favor responde: SI o NO.");
                    return true;
                }

                user.data.livesInCDMX = text.toLowerCase();

                // ❗ NUEVO FLUJO: BACHILLERATO EN LÍNEA
                if (text.toLowerCase() === "no") {

                    user.step = 210;

                    await this.sendAndSave(
                        from,
                        "¡Hola! 👋 Soy *Fernanda*, del equipo del *Tec Universitario*.\n" +
                        "Qué gusto saludarte 💛\n\n" +
                        "Para ti que estás fuera de la CDMX, tenemos una opción perfecta: " +
                        "un *Bachillerato 100% en línea* pensado para que estudies desde donde estés 🌎 y a tu propio ritmo.\n\n" +
                        "¿Te cuento cómo funciona?",
                        [{ id: "si_claro", title: "Sí, claro" }],
                    );

                    return true;
                }

                user.step = 110;

                await this.sendAndSave(
                    from,
                    "¿En qué modalidad quisieras cursar tu bachillerato?",
                    [
                        { id: "presencial", title: "Presencial" },
                        { id: "en linea", title: "En línea" },
                    ]
                );

                return true;

            // 🟣 110 — Modalidad
            case 110:
                if (!["presencial", "en línea"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Elige Presencial o En línea.");
                    return true;
                }

                user.data.modality = text.toLowerCase() === "presencial" ? "Presencial" : "En línea";

                if (text.toLowerCase() === "en línea") {
                    user.step = 210;

                    await this.sendAndSave(
                        from,
                        "¡Hola! 👋 Soy *Fernanda*, del equipo del *Tec Universitario*.\n" +
                        "Qué gusto saludarte 💛\n\n" +
                        "Para ti que estás fuera de la CDMX, tenemos una opción perfecta: " +
                        "un *Bachillerato 100% en línea* pensado para que estudies desde donde estés 🌎 y a tu propio ritmo.\n\n" +
                        "¿Te cuento cómo funciona?",
                        [{ id: "si_claro", title: "Sí, claro" }],
                    );

                    return true;
                }

                user.step = 120;

                await this.sendAndSave(
                    from,
                    "Perfecto 😄 Entonces puedes elegir entre tres programas presenciales, según tu ritmo y disponibilidad:\n\n" +
                    "A) 📘 *Bachillerato en 18 meses* - Lunes a jueves\nCon clases de *hasta 3 horas diarias*, ideal si quieres terminar más rápido 🏃‍♀️\n" +
                    "B) 📗 *Bachillerato sabatino* - 18 meses\nQue es perfecto si trabajas entre semana o tienes poco tiempo, con solo *6 horas fijas los sábados* ⏰\n" +
                    "C) 📙 *Bachillerato en 24 meses* - Lunes a jueves\nDiseñado para chavos de *15 a 17 años*, con clases de *4 horas diarias* 🎓\n",
                    [
                        { id: "program_option_a", title: "📘 Programa A" },
                        { id: "program_option_b", title: "📗 Programa B" },
                        { id: "program_option_c", title: "📙 Programa C" },
                    ]
                );

                return true;

            // 🟣 120 — Programa presencial
            case 120:
                console.log(id);

                if (!["program_option_a", "program_option_b", "program_option_c"].includes(id.toLowerCase())) {
                    await this.sendAndSave(from, "Elige uno de los programas.");
                    return true;
                }

                const programs = {
                    "program_option_a": "📘 *Bachillerato en 18 meses* - Lunes a jueves\nCon clases de *hasta 3 horas diarias*, ideal si quieres terminar más rápido 🏃‍♀️",
                    "program_option_b": "📗 *Bachillerato sabatino* - 18 meses\Que es perfecto si trabajas entre semana o tienes poco tiempo, con solo *6 horas fijas los sábados* ⏰",
                    "program_option_c": "📙 *Bachillerato en 24 meses* - Lunes a jueves\Diseñado para chavos de *15 a 17 años*, con clases de *4 horas diarias* 🎓",
                };

                user.data.program = programs[id];
                user.step = 130;

                await this.sendAndSave(
                    from,
                    "Te dejo una infografía para que la revises con calma y elijas la opción que mejor se adapte a ti 👇",
                    null,
                    {},
                    {
                        type: "document",
                        url: this.host + "/media/documento-prueba.pdf",
                        filePath: null,  // SIEMPRE null cuando usas url pública
                        mimeType: "document/pdf",
                        filename: "Infografia-tec-universitario.pdf",
                        caption: "Infografía Tec Universitario"
                    }
                );
                await this.sendAndSave(
                    from,
                    "¿Va?",
                    [
                        { id: "va", title: "Va" },
                    ]
                );

                return true;

            case 130:
                if (!["va"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Opción invalida");
                    return true;
                }
                user.step = 140;

                await this.sendAndSave(
                    from,
                    `Antes de continuar, quiero comentarte que tus datos serán tratados conforme a nuestro *Aviso de Privacidad*, que puedes consultar aquí 👉 https://tecuniversitario.net/wp-content/uploads/2021/07/AVISO-DE-PRIVACIDAD.pdf \n\n` +
                    "¿Me compartes tu *nombre* por favor? 😊"
                );
                return true;

            // 🟢 140 — Nombre
            case 140:
                if (!text || text.length < 3) {
                    await this.sendAndSave(from, "Escribe un nombre válido.");
                    return true;
                }

                user.data.name = text;
                user.step = 150;

                await this.sendAndSave(from, "¿Cuántos años tienes? 🎂");
                return true;

            // 🟣 150 — Edad
            case 150:
                if (!/^\d+$/.test(text)) {
                    await this.sendAndSave(from, "Escribe tu edad en números.");
                    return true;
                }

                user.data.age = Number(text);
                user.step = 160;

                await this.sendAndSave(from, "Gracias, " + user.data.name + ' 🙌');

                await this.sendAndSave(
                    from,
                    "Te cuento que las clases son *presenciales* y se imparten en nuestro *campus Central de la colonia Juárez*, súper céntrico y de muy fácil acceso 🚇\n\n" +
                    "Aquí te dejo un videito para que conozcas las instalaciones ▶️ https://youtu.be/R2OoD4Jc8W8\n\n" +
                    "Por fa, dime qué plan de estudios te interesa más:\n\n" +
                    "1. Lunes a jueves - 3 hrs diarias (18 meses) con dos horarios.\n" +
                    "2. Sábados - 6 hrs (18 meses) con un solo horario.\n" +
                    "3. Lunes a jueves - 4 hrs diarias (24 meses / 15 a 17 años)\n",
                    [
                        { id: "plan_option_1", title: "Opción 1" },
                        { id: "plan_option_2", title: "Opción 2" },
                        { id: "plan_option_3", title: "Opción 3" },
                    ]
                );

                return true;

            // 🟡 160 — Plan
            case 160:
                if (!["plan_option_1", "plan_option_2", "plan_option_3"].includes(id.toLowerCase())) {
                    await this.sendAndSave(from, "Elige una de las opciones");
                    return true;
                }

                const plan = {
                    "plan_option_1": "Lunes a jueves - 3 hrs diarias (18 meses) con dos horarios",
                    "plan_option_2": "Sábados - 6 hrs (18 meses) con un solo horario",
                    "plan_option_3": "Lunes a jueves - 4 hrs diarias (24 meses / 15 a 17 años)",
                };

                user.data.plan = plan[id];
                user.step = 170;

                await this.sendAndSave(
                    from,
                    "Perfecto, ¡gran elección! 👏"
                );

                await this.sendAndSave(
                    from,
                    "Ahora te comparto nuestros costos, que están increíbles 👇\n\n" +
                    "💰 *Inscripción*:  La inscripción es totalmente gratis.\n💸 *Mensualidad*: $2,045 MX congelada, por los 18 meses.\n 🎉 Además, este mes tenemos *50% de descuento en las dos primeras mensualidades* y una *mochila de bienvenida*, si te inscribes antes del *20 de diciembre* 🎒\n\n" +
                    "¿Cool, no? 😎\n\n" +
                    "Te dejo un documento con los detalles de los costos para que los revises con calma.",
                    [
                        { id: "vale", title: "Vale" },
                    ],
                    {},
                    {
                        type: "document",
                        url: this.host + "/media/documento-prueba.pdf",
                        filePath: null,  // SIEMPRE null cuando usas url pública
                        mimeType: "document/pdf",
                        filename: "Costos-tec-universitario.pdf",
                        caption: "Costos inscripción Tec Universitario"
                    }
                );

                return true;

            // 🟠 170 — Confirmar
            case 170:
                if (text.toLowerCase() !== "vale") {
                    await this.sendAndSave(from, "Escribe 'Vale' para continuar.");
                    return true;
                }

                user.step = 180;

                await this.sendAndSave(
                    from,
                    "¿Quieres que un asesor te llame para avanzar con tu inscripción? ☎️\nO si lo prefieres, ¿Te gustaría visitar nuestras instalaciones? 🏫",
                    [
                        { id: "hablar con un asesor", title: "Hablar con un asesor" },
                        { id: "visitar las instalaciones", title: "Visitar" },
                    ]
                );

                return true;

            // 🔴 180 — Elegir asesor o visita
            case 180:
                if (!["hablar con un asesor", "visitar"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Opción invalida");
                    return true;
                }

                if (text.toLowerCase() === "hablar con un asesor") {
                    await this.sendAndSave(from, "¡Listo! Un asesor te llamará pronto 😀");
                    delete this.conversations[from];
                    return true;
                }

                user.step = 190;

                await this.sendAndSave(
                    from,
                    "¿Cómo se te hace más fácil venir, entre semana o en sábado?",
                    [
                        { id: "entre semana", title: "Entre semana" },
                        { id: "sábado", title: "Sábado" },
                    ]
                );

                return true;

            // 🔵 190 — Día visita
            case 190:
                if (!["entre semana", "sábado", "sabado"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Responde: entre semana / sábado");
                    return true;
                }

                user.data.visitDay = text;
                user.step = 200;

                await this.sendAndSave(
                    from,
                    "¿A qué hora te queda mejor?",
                    [
                        { id: "10:00", title: "10:00" },
                        { id: "11:00", title: "11:00" },
                        { id: "12:00", title: "12:00" },
                        { id: "13:00", title: "13:00" },
                        { id: "14:00", title: "14:00" },
                    ]
                );

                return true;

            // 🔵 200 — Hora visita
            case 200:
                const validHours = ["10:00", "11:00", "12:00", "13:00", "14:00"];

                if (!validHours.includes(text)) {
                    await this.sendAndSave(
                        from,
                        "Elige una hora válida:\n10:00 / 11:00 / 12:00 / 13:00 / 14:00"
                    );
                    return true;
                }

                user.data.visitHour = text;

                // CONFIRMAR CITA
                await this.sendAndSave(
                    from,
                    `¡Listo, ${user.data.name}! 😄  
Tu cita quedó para:

📅 *${user.data.visitDay}*  
⏰ *${user.data.visitHour}*  
📍 Campus Central, Colonia Juárez.

Aquí tienes la dirección 👉 https://maps.app.goo.gl/campus-central`
                );

                // ENVIAR DOCUMENTOS AUTOMÁTICAMENTE (sin preguntar)
                await this.sendAndSave(
                    from,
                    `Porfa ve preparando estos documentos, que los vamos a necesitar pronto:

🧾 Acta de nacimiento  
🆔 CURP  
📄 Identificación  
🎓 Certificado de secundaria  
🏠 Comprobante de domicilio  

Nos vemos pronto, ${user.data.name}.  
✨ ¡Te va a encantar el campus y todo lo que vas a lograr aquí! 💛`
                );

                // Conversación finalizada
                delete this.conversations[from];

                return true;

            case 210:
                if (!["sí, claro", "si claro", "si_claro", "sí claro"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 220;

                await this.sendAndSave(
                    from,
                    "Perfecto 😄 Mira, el programa está buenísimo:\n\n" +
                    "📆 *Duración:* 15 meses\n" +
                    "💻 *Modalidad:* 100% en línea\n" +
                    "🕒 *Horarios:* Libres y a tu ritmo\n\n" +
                    "Te dejo una infografía para que veas todos los detalles 👇",
                    [{ id: "ver_info", title: "Ver infografía" }],
                    {},
                    {
                        type: "image",
                        url: this.host + "/media/tecuni.png",
                        filePath: null,  // SIEMPRE null cuando usas url pública
                        mimeType: "image/png",
                        filename: "Infografia-tec-universitario.png",
                        caption: "Infografía Tec Universitario"
                    }
                );

                return true;

            case 220:
                if (!["ver infografía", "ver infografia", "ver_info", "ver", "gracias", "ok"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Toca el botón para ver la información 😊");
                    return true;
                }

                user.step = 230;

                await this.sendAndSave(
                    from,
                    "Oye, antes de seguir, ¿me compartes tu *nombre* y *edad*?\n" +
                    "Así puedo acompañarte mejor y contarte todo según tu perfil 😊"
                );

                return true;

            case 230:
                if (!text || text.length < 3) {
                    await this.sendAndSave(from, "Por favor escribe tu nombre y edad.\nEj: Juan, 17");
                    return true;
                }

                // Extraer edad si viene al final
                const match = text.match(/(.+)[, ]+(\d{1,2})$/);
                if (!match) {
                    await this.sendAndSave(from, "Por favor escribe: Nombre, Edad\nEjemplo: Ana, 16");
                    return true;
                }

                user.data.name = match[1].trim();
                user.data.age = Number(match[2]);

                user.step = 240;

                await this.sendAndSave(
                    from,
                    `¡Gracias, ${user.data.name}! 🙌\n\n` +
                    "Y para que estés tranquila(o), tus datos están protegidos.\n" +
                    `Aquí puedes consultar nuestro Aviso de Privacidad 👉 https://tecuniversitario.net/wp-content/uploads/2021/07/AVISO-DE-PRIVACIDAD.pdf`
                );

                await this.sendAndSave(
                    from,
                    "Ahora te paso la información de costos, que está bastante accesible 💰\n\n" +
                    "📅 *Mensualidad:* $2,045\n" +
                    "🎉 *Promoción activa:* Al hacer tu proceso por este medio, tu inscripción es gratis\n" +
                    "Además, si completas tu registro esta semana, te damos acceso anticipado a la primera materia, 📚",
                    [{ id: "perfecto", title: "Perfecto" }]
                );

                return true;

            case 240:
                if (!["perfecto", "¡perfecto!", "perfecto!", "¡perfecto"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 250;

                // Aquí envías el archivo como lo haces normalmente
                await this.sendAndSave(
                    from,
                    "Te dejo el detalle de precios para que lo revises con calma 📄",
                    null,
                    {},
                    {
                        type: "document",
                        url: this.host + "/media/documento-prueba.pdf",
                        filePath: null,  // SIEMPRE null cuando usas url pública
                        mimeType: "document/pdf",
                        filename: "precios.pdf",
                        caption: "Precios Tec Universitario"
                    }
                );
                await this.sendAndSave(
                    from,
                    "¿Va?",
                    [{ id: "va", title: "Va" }]
                );

                return true;

            case 250:
                if (!["va", "¡va!", "va!", "¡va"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 260;

                await this.sendAndSave(
                    from,
                    "¿Quieres que te agende una llamada con un asesor para resolver cualquier duda y ayudarte a iniciar tu inscripción? 👩‍💻",
                    [
                        { id: "asesor_si", title: "Sí" },
                        { id: "asesor_no", title: "No" }
                    ],
                );

                return true;

            case 260:
                if (!["sí", "si", "asesor_si", "no", "asesor_no"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Elige una opción: Sí / No");
                    return true;
                }

                if (["no", "asesor_no"].includes(text.toLowerCase())) {
                    delete this.conversations[from];
                    await this.sendAndSave(from, "Perfecto 😊 Si necesitas algo, aquí estoy.");
                    return true;
                }

                user.step = 260;

                await this.sendAndSave(
                    from,
                    "Excelente 😄\nTe reservo tu espacio y te mando el enlace de contacto 👇\n" +
                    "📅 [Link al calendario o WhatsApp institucional]"
                );

                delete this.conversations[from];

                return true;

            // 300 - LICENCIATURA
            case 300:

                if (!["si", "no"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Opción invalida. Por favor responde: SI o NO.");
                    return true;
                }

                user.data.livesInCDMX = text.toLowerCase();

                // ❗ NUEVO FLUJO: LICENCIATURA EN LÍNEA
                if (text.toLowerCase() === "no") {

                    user.step = 410;

                    await this.sendAndSave(
                        from,
                        "¡Hola! 👋 Soy *Fernanda*, del equipo del *Tec Universitario*.\n" +
                        "Qué gusto saludarte 💛\n\n" +
                        "Para ti que estás fuera de la CDMX, tenemos una opción increíble: nuestras Licenciaturas 100% en línea, pensadas para que estudies desde donde estés y a tu propio ritmo 🎓",
                        [{ id: "continuar", title: "Continuar" }],
                    );

                    return true;
                }

                user.step = 310;

                await this.sendAndSave(
                    from,
                    "¿En qué modalidad quisieras cursar tu licenciatura?",
                    [
                        { id: "presencial", title: "Presencial" },
                        { id: "en linea", title: "En línea" },
                    ]
                );

                return true;

            case 310:
                if (!["presencial", "en línea"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Elige Presencial o En línea.");
                    return true;
                }

                user.data.modality = text.toLowerCase() === "presencial" ? "Presencial" : "En línea";

                if (text.toLowerCase() === "en línea") {
                    user.step = 410;

                    await this.sendAndSave(
                        from,
                        "¡Hola! 👋 Soy *Fernanda*, del equipo del *Tec Universitario*.\n" +
                        "Qué gusto saludarte 💛\n\n" +
                        "Para ti que estás fuera de la CDMX, tenemos una opción increíble: nuestras Licenciaturas 100% en línea, pensadas para que estudies desde donde estés y a tu propio ritmo 🎓",
                        [{ id: "continuar", title: "Continuar" }],
                    );

                    return true;
                }

                user.step = 320;

                await this.sendAndSave(
                    from,
                    "Perfecto 😄 Te voy a enviar un brochure con el detalle de cada una de nuestras Licenciaturas para que veas cuál se adapta mejor a lo que buscas 👇\n\n" +
                    "📘 Administración\n" +
                    "📗 Derecho\n" +
                    "📙 Mercadotecnia y Publicidad\n" +
                    "📕 Producción de TV y Plataformas Digitales\n",
                    [
                        { id: "ver brochure", title: "Ver brochure" },
                    ]
                );

                return true;

            case 320:
                if (!["ver brochure"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 330;

                await this.sendAndSave(
                    from,
                    "Te cuento cómo están organizadas nuestras clases 🕒\n\n" +
                    "1️⃣ *Lunes a jueves:* 3 horas diarias\n" +
                    "2️⃣ *Sabatino:* 6 horas solo los sábados\n\n" +
                    "Todas las clases son presenciales en nuestro campus de la Zona Rosa, que está súper bien ubicado 🚇\n" +
                    "Te pongo un video para que conozcas nuestro campus.",
                    [
                        { id: "perfecto", title: "Perfecto" },
                    ]
                );

                return true;

            case 330:
                if (!["perfecto"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 340;

                await this.sendAndSave(
                    from,
                    "Cada Licenciatura tiene una duración de 3 años, divididos en cuatrimestres.\n" +
                    "Así puedes titularte rápido y comenzar a trabajar en lo que te gusta 💼",
                    [
                        { id: "continuar", title: "Continuar" },
                    ]
                );

                return true;

            case 340:
                if (!["continuar"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 350;

                await this.sendAndSave(
                    from,
                    "Te comparto también la información de precios 💰\n" +
                    "Nuestros precios están pensados para que estudiar sea accesible y práctico:\n\n" +
                    "💵 *Inscripción:* $0\n" +
                    "📅 *Mensualidad:* $2,940 pesos\n" +
                    "🎉 Además, este mes tenemos *50 % de descuento en la inscripción* y una *mochila de bienvenida* si completas tu proceso antes del 20 de diciembre 🎒",
                    [
                        { id: "continuar", title: "Continuar" },
                    ]
                );

                return true;

            case 350:
                if (!["continuar"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 360;

                await this.sendAndSave(
                    from,
                    "Ahora que ya viste las opciones, ¿cuál carrera te gustaría estudiar? 😄\n" +
                    "A) 📘 Administración\n" +
                    "B) 📗 Derecho\n" +
                    "C) 📙 Mercadotecnia y Publicidad\n" +
                    "D) 📕 Producción de TV y Plataformas Digitales\n",
                    [
                        { id: "lic_option_a", title: "📘 Opción A" },
                        { id: "lic_option_b", title: "📗 Opción B" },
                        { id: "lic_option_c", title: "📙 Opción C" },
                        { id: "lic_option_d", title: "📕 Opción D" },
                    ]
                );

                return true;

            case 360:
                console.log(id);

                if (!["lic_option_a", "lic_option_b", "lic_option_c", "lic_option_d"].includes(id.toLowerCase())) {
                    await this.sendAndSave(from, "Elige una de las opciones");
                    return true;
                }

                const degree = {
                    "lic_option_a": "Administración",
                    "lic_option_b": "Derecho",
                    "lic_option_c": "Mercadotecnia y Publicidad",
                    "lic_option_d": "Producción de TV y Plataformas Digitales",
                };

                user.data.program = degree[id];
                user.step = 370;

                await this.sendAndSave(
                    from,
                    "Excelente elección 👏 Te va a encantar la Licenciatura en " + user.data.program,
                    [{ id: "seguir", title: "Seguir" }]
                );

                return true;

            // 370 — Seguir
            case 370:
                if (text.toLowerCase() !== "seguir") {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 380;

                await this.sendAndSave(
                    from,
                    "¿Quieres venir al campus para conocer las instalaciones y platicar con un asesor académico?\n" +
                    "Puedes elegir el día y la hora que mejor te acomoden.\n\n" +
                    "🗓️ Días disponibles: Lunes a viernes y sábados\n" +
                    "🕒 Horarios: 11:00, 12:00, 13:00, 14:00, 15:00",
                    [{ id: "agendar cita", title: "Agendar cita" }],
                );

                return true;

            // 380 — Agendar cita
            case 380:
                if (!["agendar cita", "agendar"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Opción invalida");
                    return true;
                }

                user.step = 390;

                await this.sendAndSave(
                    from,
                    "¿Qué día de la semana se te hace más fácil venir?",
                    [
                        { id: "lunes", title: "Lunes" },
                        { id: "martes", title: "Martes" },
                        { id: "miércoles", title: "Miércoles" },
                        { id: "jueves", title: "Jueves" },
                        { id: "viernes", title: "Viernes" },
                        { id: "sábado", title: "Sábado" },
                    ]
                );

                return true;

            // 390 — Día visita
            case 390:
                if (!["lunes", "martes", "miércoles", "miercoles", "jueves", "viernes", "sábado", "sabado"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Elige un día de la semana");
                    return true;
                }

                user.data.visitDay = text;
                user.step = 400;

                await this.sendAndSave(
                    from,
                    "¿A qué hora te queda mejor?",
                    [
                        { id: "11:00", title: "11:00" },
                        { id: "12:00", title: "12:00" },
                        { id: "13:00", title: "13:00" },
                        { id: "14:00", title: "14:00" },
                        { id: "15:00", title: "15:00" },
                    ]
                );

                return true;

            // 400 — Hora visita
            case 400:
                const validHoursLic = ["11:00", "12:00", "13:00", "14:00", "15:00"];

                if (!validHoursLic.includes(text)) {
                    await this.sendAndSave(
                        from,
                        "Elige una hora válida:\n11:00 / 12:00 / 13:00 / 14:00 / 15:00"
                    );
                    return true;
                }

                user.data.visitHour = text;

                // CONFIRMAR CITA
                await this.sendAndSave(
                    from,
                    `¡Perfecto, ${user.data.name}! 😄  
Tu cita quedó registrada para el

📅 *${user.data.visitDay}*  
⏰ *${user.data.visitHour}*  
📍  Campus Zona Rosa - 👉 https://maps.app.goo.gl/campus-central`
                );

                // ENVIAR DOCUMENTOS AUTOMÁTICAMENTE (sin preguntar)
                await this.sendAndSave(
                    from,
                    `🧾 Toma en cuenta estos documentos que necesitarás para tu inscripción: 

🧾 Acta de nacimiento  
🆔 CURP  
📄 Identificación oficial  
🎓 Certificado de estudios

Nos vemos pronto. ¡te va a encantar el campus! 💛`
                );

                // Conversación finalizada
                delete this.conversations[from];

                return true;

            case 410:
                if (!["continuar"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 420;

                await this.sendAndSave(
                    from,
                    "Te voy a enviar un brochure con el detalle de cada una de nuestras Licenciaturas online para que conozcas el plan de estudios, los requisitos y las ventajas de cada una 👇\n\n" +
                    "📘 Administración\n" +
                    "📗 Derecho\n" +
                    "📙 Mercadotecnia y Publicidad\n" +
                    "📕 Producción de TV y Plataformas Digitales\n",
                    [{ id: "ver brochure", title: "Ver brochure" }]
                );

                return true;

            case 420:
                if (!["ver brochure"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 430;

                await this.sendAndSave(
                    from,
                    "Nuestras clases en línea están diseñadas para adaptarse a tus tiempos 🕒\n\n" +
                    "Podrás conectarte desde cualquier lugar, con sesiones virtuales  y materiales disponibles las 24 horas en nuestra plataforma 📱💻\n\n" +
                    "Además, tendrás asesorías personalizadas y acceso directo a tus profesores para resolver dudas cuando las necesites 🙌",
                    [{ id: "perfecto", title: "Perfecto" }]
                );

                return true;

            case 430:
                if (!["perfecto"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 440;

                await this.sendAndSave(
                    from,
                    "Cada Licenciatura tiene una duración de 3 años, divididos en cuatrimestres.\n\n" +
                    "Avanzarás a buen ritmo, combinando teoría y práctica profesional para desarrollar las habilidades que buscan las empresas 💼",
                    [{ id: "seguir", title: "Seguir" }]
                );

                return true;

            case 440:
                if (!["seguir"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 450;

                await this.sendAndSave(
                    from,
                    "Te comparto también la información de precios 💰\n" +
                    "Estudiar online con nosotros es flexible y accesible:\n\n" +
                    "💵 Inscripción: $0 pesos \n" +
                    "📅 Mensualidad: desde $2,940 pesos\n" +
                    "🎉 Además, este mes tenemos 50 % de descuento en la inscripción y un curso gratuito de desarrollo profesional online si completas tu proceso antes del 20 de diciembre 🎓",
                    [{ id: "continuar", title: "Continuar" }]
                );

                return true;

            case 450:
                if (!["continuar"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 460;

                await this.sendAndSave(
                    from,
                    "Ahora que ya viste las opciones, ¿cuál carrera te gustaría estudiar? 😄\n" +
                    "A) 📘 Administración\n" +
                    "B) 📗 Derecho\n" +
                    "C) 📙 Mercadotecnia y Publicidad\n" +
                    "D) 📕 Producción de TV y Plataformas Digitales\n",
                    [
                        { id: "lic_option_a", title: "📘 Opción A" },
                        { id: "lic_option_b", title: "📗 Opción B" },
                        { id: "lic_option_c", title: "📙 Opción C" },
                        { id: "lic_option_d", title: "📕 Opción D" },
                    ]
                );

                return true;

            case 460:
                console.log(id);

                if (!["lic_option_a", "lic_option_b", "lic_option_c", "lic_option_d"].includes(id.toLowerCase())) {
                    await this.sendAndSave(from, "Elige una de las opciones");
                    return true;
                }

                const degreeOnline = {
                    "lic_option_a": "Administración",
                    "lic_option_b": "Derecho",
                    "lic_option_c": "Mercadotecnia y Publicidad",
                    "lic_option_d": "Producción de TV y Plataformas Digitales",
                };

                user.data.program = degreeOnline[id];
                user.step = 470;

                await this.sendAndSave(
                    from,
                    "Excelente elección 👏  La Licenciatura en " + user.data.program + " tiene un enfoque práctico y actual, ideal para estudiar en línea. ",
                    [{ id: "seguir", title: "Seguir" }]
                );

                return true;

            // 470 — Seguir
            case 470:
                if (text.toLowerCase() !== "seguir") {
                    await this.sendAndSave(from, "Presiona el botón para continuar 😊");
                    return true;
                }

                user.step = 480;

                await this.sendAndSave(
                    from,
                    "¿Te gustaría agendar una llamada con un asesor académico para resolver tus dudas y ayudarte con tu proceso de inscripción? 💬\n" +
                    "🗓️ Días disponibles: Lunes a viernes y sábados\n" +
                    "🕒 Horarios: 11:00, 12:00, 13:00, 14:00, 15:00",
                    [{ id: "agendar llamada", title: "Agendar llamada" }],
                );

                return true;

            // 480 — Agendar llamada
            case 480:
                if (!["agendar llamada", "agendar"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Opción invalida");
                    return true;
                }

                user.step = 490;

                await this.sendAndSave(
                    from,
                    "¿Qué día de la semana se te hace más fácil atender la llamada?",
                    [
                        { id: "lunes", title: "Lunes" },
                        { id: "martes", title: "Martes" },
                        { id: "miércoles", title: "Miércoles" },
                        { id: "jueves", title: "Jueves" },
                        { id: "viernes", title: "Viernes" },
                        { id: "sábado", title: "Sábado" },
                    ]
                );

                return true;

            // 490 — Día de llamada
            case 490:
                if (!["lunes", "martes", "miércoles", "miercoles", "jueves", "viernes", "sábado", "sabado"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Elige un día de la semana");
                    return true;
                }

                user.data.visitDay = text;
                user.step = 500;

                await this.sendAndSave(
                    from,
                    "¿A qué hora te queda mejor?",
                    [
                        { id: "11:00", title: "11:00" },
                        { id: "12:00", title: "12:00" },
                        { id: "13:00", title: "13:00" },
                        { id: "14:00", title: "14:00" },
                        { id: "15:00", title: "15:00" },
                    ]
                );

                return true;

            // 500 — Hora de llamada
            case 500:
                const validHoursLicOnline = ["11:00", "12:00", "13:00", "14:00", "15:00"];

                if (!validHoursLicOnline.includes(text)) {
                    await this.sendAndSave(
                        from,
                        "Elige una hora válida:\n11:00 / 12:00 / 13:00 / 14:00 / 15:00"
                    );
                    return true;
                }

                user.data.visitHour = text;

                // CONFIRMAR CITA
                await this.sendAndSave(
                    from,
                    `¡Perfecto, ${user.data.name}! 😄  
Tu llamada quedó registrada para el

📅 *${user.data.visitDay}*  
⏰ *${user.data.visitHour}*  
📩 En la fecha y hora uno de nuestros asesores se comunicará contigo.`
                );

                // ENVIAR DOCUMENTOS AUTOMÁTICAMENTE (sin preguntar)
                await this.sendAndSave(
                    from,
                    `Ten a la mano estos documentos que necesitarás para completar tu inscripción. 

🧾 Acta de nacimiento  
🆔 CURP  
📄 Identificación oficial  
🎓 Certificado de estudios

Nos vemos pronto en línea 💛 ¡Va a ser una gran experiencia!`
                );

                // Conversación finalizada
                delete this.conversations[from];

                return true;

            // DEFAULT
            default:
                await this.sendAndSave(from, "No entendí, ¿puedes repetir?");
                user.step = 0;
                return true;
        }
    }

    startInactiveUserWatcher() {
        // Revisa cada 5 minutos
        // setInterval(() => this.checkInactiveUsers(), 0.5 * 60 * 1000);
    }

    async checkInactiveUsers() {
        const now = Date.now();
        const oneHour = 1 * 60 * 1000;

        for (const [from, user] of Object.entries(this.conversations)) {
            if (user.lastActivity && now - user.lastActivity >= oneHour && !user.reminderSent) {
                await this.sendAndSave(
                    from,
                    "¿Un asesor va a ponerse en contacto contigo para ayudarte con tu inscripción? ☎️"
                );
                user.reminderSent = true;
            }
        }
    }
}
