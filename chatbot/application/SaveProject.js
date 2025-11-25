export class SaveProject {
    constructor(ConversationRepo, Whatsapp, Conversations, OpenAiApi, OptionsEnum, Prompts, PhoneNumber, NameBot) {
        this.conversationRepo = ConversationRepo;
        this.whatsapp = Whatsapp;
        this.conversations = Conversations;

        this.roleBot = "bot";
        this.roleUser = "user";
        this.phoneNumberBot = PhoneNumber;
        this.nameBot = NameBot;

        this.startInactiveUserWatcher();
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

    /**
     * ENVÍA un mensaje por WhatsApp y lo GUARDA en MongoDB
     */
    // Dentro de SaveProject class — reemplaza sendAndSave actual
    async sendAndSave(to, text, options = null, extra = {}) {
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

            // Guardar en mongo (como tenías originalmente)
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

            // await this.conversationRepo.saveMessage(
            //     to,
            //     this.nameBot,
            //     this.roleBot,
            //     text,
            //     waIdBot,
            //     "sent",
            //     "text",
            //     Date.now()
            // );

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

        // Guardar último mensaje en DB
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
            // SIEMPRE guardar el mensaje entrante del usuario
            await this.saveIncomingMessage(from, profileName, text, message.id, message.type, message.timestamp);

            // Crear conversación en memoria si no existe
            if (!this.conversations[from]) {
                return await this.startNewConversation(from, profileName);
            }

            // Continuar flujo
            console.log('button_id', button_id);

            return await this.continueConversation(from, text, button_id);

        } catch (error) {
            console.error("Error SaveProject:", error);
            return true;
        }
    }


    /**
     * CONVERSACIÓN NUEVA
     */
    async startNewConversation(from, profileName) {
        const dbConversation = await this.conversationRepo.findOne({ phone: from });

        // if (!dbConversation) {
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
                // {
                // rows: [
                { id: "si", title: "Si" },
                { id: "no", title: "No" },
                // ]
                // }
            ],
            // 'interactive',
            // // 'list',
        );

        return true;
    }

    /**
     * FLUJO POR STEPS
     */
    async continueConversation(from, text, id = null) {
        const user = this.conversations[from];

        switch (user.step) {

            // 🟤 0 — ¿Continuar o modificar?
            case 0:
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
                    // await this.sendAndSave(from, "El bachillerato en línea estará disponible pronto 😀");
                    // return true;
                }

                user.step = 120;

                await this.sendAndSave(
                    from,
                    "Perfecto 😄 Entonces puedes elegir entre tres programas presenciales, según tu ritmo y disponibilidad:\n\n" +
                    "a) 📘 *Bachillerato en 18 meses* - Lunes a jueves\nCon clases de *hasta 3 horas diarias*, ideal si quieres terminar más rápido 🏃‍♀️\n" +
                    "b) 📗 *Bachillerato sabatino* - 18 meses\nQue es perfecto si trabajas entre semana o tienes poco tiempo, con solo *6 horas fijas los sábados* ⏰\n" +
                    "c) 📙 *Bachillerato en 24 meses* - Lunes a jueves\nDiseñado para chavos de *15 a 17 años*, con clases de *4 horas diarias* 🎓\n",
                    [
                        { id: "program_option_a", title: "📘 Programa a" },
                        { id: "program_option_b", title: "📗 Programa b" },
                        { id: "program_option_c", title: "📙 Programa c" },
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
                    "Te dejo una infografía para que la revises con calma y elijas la opción que mejor se adapte a ti 👇" +
                    "¿Va?",
                    [
                        { id: "va", title: "Va" },
                    ]
                );
                // await this.sendAndSave(
                //     from,
                //     "Antes de continuar, quiero comentarte que tus datos serán tratados conforme a nuestro *Aviso de PrivacidadA, que puedes consultar aquí 👉 [link]\n\n" +
                //     "¿Me compartes tu *nombre* por favor? 😊"
                // );

                return true;

            case 130:
                if (!["va"].includes(text.toLowerCase())) {
                    await this.sendAndSave(from, "Opción invalida");
                    return true;
                }
                user.step = 140;

                await this.sendAndSave(
                    from,
                    "Antes de continuar, quiero comentarte que tus datos serán tratados conforme a nuestro *Aviso de Privacidad*, que puedes consultar aquí 👉 [link]\n\n" +
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
                    "Aquí te dejo un videito para que conozcas las instalaciones ▶️(link)\n\n" +
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
                    "Te dejo un documento con los detalles de los costos para que los revises con calma. (link)",
                    [
                        { id: "vale", title: "Vale" },
                    ]
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
                );

                return true;

            case 220:
                if (!["ver infografía", "ver infografia", "ver_info"].includes(text.toLowerCase())) {
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
                    "Aquí puedes consultar nuestro Aviso de Privacidad 👉 [link al aviso]."
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
                    "Te dejo el detalle de precios para que lo revises con calma 📄"
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



            // DEFAULT
            default:
                await this.sendAndSave(from, "No entendí, ¿puedes repetir?");
                return true;
        }
    }
}
