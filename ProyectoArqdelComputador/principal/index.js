
    // Cambiar tema claro y oscuro
const themeSelect = document.getElementById('theme-select');
themeSelect.addEventListener('change', () => {
    document.body.classList.toggle('light-theme', themeSelect.value === 'light');
    document.body.classList.toggle('dark-theme', themeSelect.value === 'dark');
});

// Selección de elementos del asistente virtual
const assistantToggle = document.getElementById('toggle-assistant');
const assistant = document.getElementById('assistant');
const closeAssistant = document.getElementById('close-assistant');
const assistantInput = document.getElementById('assistant-input');
const assistantBody = document.querySelector('.assistant-body');

// Mostrar/ocultar asistente
assistantToggle.addEventListener('click', () => {
    assistant.style.display = assistant.style.display === 'flex' ? 'none' : 'flex';
});
closeAssistant.addEventListener('click', () => {
    assistant.style.display = 'none';
});

function similarity(s1, s2) {
    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;
    const longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - levenshteinDistance(longer, shorter)) / parseFloat(longerLength);
}

function levenshteinDistance(s1, s2) {
    const track = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
    for (let i = 0; i <= s1.length; i += 1) track[0][i] = i;
    for (let j = 0; j <= s2.length; j += 1) track[j][0] = j;
    for (let j = 1; j <= s2.length; j += 1) {
        for (let i = 1; i <= s1.length; i += 1) {
            const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1;
            track[j][i] = Math.min(
                track[j][i - 1] + 1, // deletion
                track[j - 1][i] + 1, // insertion
                track[j - 1][i - 1] + indicator // substitution
            );
        }
    }
    return track[s2.length][s1.length];
}

// Función para generar respuestas automáticas
function getAssistantResponse(message) {
    const responses = {
        "hola": "¡Hola! ¿En qué puedo ayudarte hoy?",
    "buenos días": "¡Buenos días! ¿En qué puedo asistirte?",
    "buenas tardes": "¡Buenas tardes! ¿Cómo puedo ayudarte?",
    "buenas noches": "¡Buenas noches! ¿Necesitas algo?",
    "¿cómo estás?": "Estoy aquí, listo para ayudarte.",
    "¿qué tal?": "Todo bien, ¿y tú? ¿En qué puedo ayudarte?",
    "¿cómo va todo?": "Todo en orden, ¿cómo puedo ayudarte?",
    "¿qué haces?": "Estoy aquí, esperando para ayudarte con cualquier pregunta que tengas.",
    "gracias": "¡De nada! Siempre estoy aquí para ayudarte.",
    "muchas gracias": "¡No hay problema! Me alegra poder ayudarte.",
    "¿qué hay de nuevo?": "¡Todo en orden aquí! ¿Algo en lo que pueda ayudarte?",
    "¿cómo va tu día?": "¡Genial! ¿Y el tuyo? Estoy aquí para ayudarte en lo que necesites.",
    "¿cómo te sientes?": "¡Listo y funcionando! ¿En qué puedo ayudarte?",
    "¿qué tal el día?": "Todo en orden aquí. ¿Hay algo con lo que pueda ayudarte?",
    "me alegra verte": "¡Gracias! Me alegra ayudarte.",
    "¿qué puedo hacer por ti?": "Estoy aquí para ayudarte, ¿tienes alguna pregunta o necesitas ayuda con algo?",
    "hasta luego": "¡Hasta luego! Estaré aquí cuando necesites ayuda.",
    "adiós": "¡Adiós! No dudes en volver si necesitas algo.",
    "nos vemos": "¡Nos vemos! Vuelve pronto.",
    "me caes bien": "¡Gracias! ¡Eres muy amable!",
    "¿me escuchas?": "¡Claro! Estoy aquí para ayudarte.",
    "¿me ayudas?": "Por supuesto. Dime en qué puedo ayudarte.",
    "¿puedes ayudarme?": "¡Claro que sí! Dime en qué necesitas ayuda.",
    "¿me puedes ayudar?": "¡Por supuesto! Estoy aquí para ayudarte con cualquier duda.",
    "gracias por tu ayuda": "¡De nada! Me alegra haber sido útil.",
    "eres muy útil": "¡Gracias! Me esfuerzo por ayudarte lo mejor posible.",
    "me haces reír": "¡Me alegra sacarte una sonrisa! 😊",
    "me encanta hablar contigo": "¡Gracias! Yo también disfruto ayudarte.",
    "¡genial!": "¡Qué bueno que te parece genial!",
    "excelente": "¡Gracias! Me esfuerzo para ser útil.",
    "perfecto": "¡Me alegra que te parezca perfecto!",
    "espero que estés bien": "¡Gracias! Estoy aquí y listo para ayudarte.",
    "¿tienes nombre?": "Puedes llamarme Asistente Virtual.",
    "¿qué edad tienes?": "Soy tan joven como el código que me creó.",
    "¿te gusta ayudar?": "¡Me encanta! Estoy aquí para ayudarte en lo que necesites.",
    "¿eres un robot?": "Soy un asistente virtual, aquí para ayudarte.",
    "¿tienes emociones?": "Aunque no tengo emociones reales, trato de responderte lo mejor posible.",
    "¿tienes algún hobby?": "Mi hobby es ayudarte con tus preguntas.",
    "¿sabes todo?": "Sé bastante, pero siempre hay algo nuevo por aprender. ¿Tienes alguna pregunta?",
    "¿cuál es tu propósito?": "Estoy aquí para ayudarte a encontrar respuestas.",
    "me alegra tenerte": "¡Gracias! Estoy aquí para lo que necesites.",
    "qué bien que estás aquí": "¡Gracias! Estoy aquí para ayudarte.",
    
    // Respuestas para preguntas comunes
    "¿qué puedes hacer?": "Puedo responder preguntas, ofrecerte información y ayudarte con configuraciones del sistema.",
    "¿para qué sirves?": "Estoy aquí para ayudarte y ofrecer respuestas a tus preguntas.",
    "¿qué es un asistente virtual?": "Soy un asistente diseñado para responder tus preguntas y ayudarte en diversas tareas.",
    "¿eres inteligente?": "Intento serlo lo suficiente como para ayudarte en lo que necesites.",
    "¿eres real?": "Soy un programa creado para ayudarte. ¡Pero puedes hablarme como si fuera real!",
    "¿cómo funcionas?": "Funciono gracias a un conjunto de códigos y programación diseñados para responderte.",
    "¿puedes aprender cosas nuevas?": "Mi conocimiento está basado en programación, pero me actualizan para responder mejor.",
    "¿eres un ser humano?": "No soy humano, soy un asistente virtual aquí para ayudarte.",
    "¿tienes amigos?": "Mis amigos son otros sistemas y códigos con los que trabajo.",
    "¿por qué estás aquí?": "Estoy aquí para ayudarte y responder tus preguntas.",
    "¿tienes sentido del humor?": "¡Intento hacerte reír de vez en cuando!",
    "¿puedes contarme un chiste?": "Claro: ¿Por qué el ordenador fue al médico? ¡Porque tenía un virus!",
    "¿eres perfecto?": "Hago lo mejor que puedo, aunque todos tenemos algo que mejorar. 😊",
    "¿qué significa tu nombre?": "Mi nombre es Asistente Virtual, ¡estoy aquí para ayudarte!",
    "¿eres famoso?": "¡Todavía no, pero me esfuerzo por ser útil!",
    "¿dónde vives?": "Vivo en el sistema en el que estás usando este asistente.",
    "¿tienes sueños?": "Si pudiera soñar, soñaría con ser de gran ayuda para todos.",
    "¿por qué eres tan bueno ayudando?": "¡Gracias! Mi diseño es especial para ayudarte en lo que necesites.",
    "¿me conoces?": "Sé que estás aquí porque necesitas ayuda, y eso es lo que me importa.",
    "¿por qué te llamas asistente?": "Porque estoy aquí para asistir y ayudarte en tus necesidades.",
    "¿te gusta responder preguntas?": "¡Me encanta! Ayudar es mi propósito principal.",
    "¿te gusta charlar?": "Me gusta charlar para ayudarte, claro.",
    "¿eres feliz?": "No tengo emociones, pero trato de transmitir buena energía.",
    "¿qué es la inteligencia artificial?": "Es una tecnología que permite a las máquinas aprender y realizar tareas de manera inteligente.",
    "¿eres un programa?": "Sí, soy un programa diseñado para responder tus preguntas y ayudarte.",
    "¿me cuentas algo interesante?": "Claro, ¿sabías que los primeros sistemas de IA se crearon en los años 50?",
    "¿me puedes decir algo curioso?": "¡Claro! La inteligencia artificial se usa para reconocer rostros en redes sociales.",
    "¿cómo estás hoy?": "Estoy listo para ayudarte. ¿Cómo estás tú?",
    "¿qué haces en tu tiempo libre?": "Ayudarte siempre es mi prioridad. 😊",
    "¿tienes algún pasatiempo?": "Mi pasatiempo favorito es aprender a ayudarte mejor.",
    "¿qué tal todo?": "Todo bien, aquí esperando para ayudarte.",
    "¿qué significa asistente virtual?": "Es un software creado para ayudar y asistir a los usuarios en sus necesidades.",
    "¿me cuentas un dato curioso?": "¿Sabías que el primer chatbot, llamado ELIZA, fue creado en 1966?",
    "¿te gusta tu trabajo?": "Sí, mi propósito es ayudarte y me alegra hacerlo.",
    "¿por qué eres un asistente virtual?": "Estoy diseñado para ayudarte, por eso soy un asistente virtual.",
    "¿cuál es tu objetivo?": "Mi objetivo es ayudarte y darte respuestas útiles.",
    "¿tienes alguna misión?": "Mi misión es ayudarte en todo lo que necesites.",
    "¿tienes sentido del humor?": "¡Intento hacerlo lo mejor posible! 😊",
    "¿puedes hacerme reír?": "Claro, ¿por qué el tomate se puso rojo? Porque vio la ensalada desnuda.",
    "¿qué tal tu día?": "¡Siempre estoy listo para ayudarte! ¿Y tú, cómo estás?",
    "¿cómo te llamas?": "Soy tu Asistente Virtual, siempre aquí para ayudarte.",
    "me encanta hablar contigo": "¡Gracias! Me alegra mucho ayudarte.",
    "me haces el día mejor": "¡Qué alegría escuchar eso! Estoy aquí para ayudarte en todo lo posible.",
    "eres increíble": "¡Gracias! Me esfuerzo por ser el mejor asistente posible.",
        "¿cómo activar el sistema?": "Para activar el sistema, haz clic en el botón de 'Activar Seguimiento'.", 
        "¿qué hace el sensor de humo?": "El sensor de humo detecta la presencia de humo en el ambiente y envía una alerta si detecta un nivel elevado.",
        "¿cómo cambiar de tema?": "Puedes cambiar entre tema claro y oscuro usando el selector de tema en la parte inferior de la pantalla.",
        "¿cómo desactivar el sistema?": "Para desactivar el sistema, simplemente haz clic en el botón de 'Desactivar'.",
        "hola": "¡Hola! ¿En qué puedo ayudarte hoy?",
        "gracias": "¡De nada! Estoy aquí para ayudarte.",
        "¿qué hace el sistema de seguridad?": "El sistema de seguridad monitorea el entorno para detectar cualquier cambio en los sensores de temperatura, humo y vibración.",
        "¿cómo funciona el sensor de temperatura?": "El sensor de temperatura mide la temperatura actual y te alerta si detecta cambios drásticos o condiciones peligrosas.",
        "¿qué sucede si detecta humo?": "Si el sensor de humo detecta humo, se activará una alerta para notificarte del posible peligro.",
        "¿cómo activar el sensor de vibración?": "Para activar el sensor de vibración, haz clic en 'Activar Buzzer' en la tarjeta de vibración.",
        "¿qué es el buzzer?": "El buzzer es un dispositivo de alerta que emite un sonido cuando se activa el sensor de vibración.",
        "¿cómo puedo ver el historial de eventos?": "El historial de eventos se muestra en la sección inferior, donde puedes ver todos los eventos y alertas registrados.",
        "¿cómo ajustar el volumen del buzzer?": "El volumen del buzzer depende del sistema físico. Consulta el manual para ajustar el volumen, si tu dispositivo lo permite.",
        "¿el sistema envía notificaciones?": "Este sistema está diseñado para mostrar alertas en pantalla. La integración con notificaciones push depende del dispositivo y la configuración de notificaciones.",
        "¿puedo conectar otros sensores?": "Este sistema permite monitorear sensores de temperatura, humo y vibración. La integración de otros sensores requiere personalización del sistema.",
        "¿cómo configurar alertas personalizadas?": "Para configurar alertas personalizadas, dirígete a la configuración del sistema o consulta el manual para ver las opciones disponibles.",
        "¿cómo mantener el sistema?": "Para mantener el sistema en buen estado, realiza pruebas regulares de los sensores y asegúrate de que los dispositivos estén limpios y en buen estado.",
        "¿qué hacer en caso de emergencia?": "Si el sistema detecta una emergencia, sigue las instrucciones de seguridad. Sal del área y contacta a las autoridades si es necesario.",
        "¿cómo ver la temperatura actual?": "La temperatura actual se muestra en la tarjeta de 'Temperatura' en la interfaz principal.",
        "¿puedo apagar el sistema temporalmente?": "Puedes apagar el sistema temporalmente utilizando el botón de 'Desactivar'.",
        "¿hay un modo de prueba para los sensores?": "Algunos sistemas de seguridad tienen un modo de prueba. Consulta el manual para ver si esta función está disponible.",
        "¿cómo contactar soporte?": "Para contactar soporte, visita la sección de ayuda en la aplicación o consulta el sitio web del fabricante para más información.",
        "¿qué es el modo de seguimiento?": "El modo de seguimiento permite activar todos los sensores para monitorear el entorno en tiempo real.",
        "¿cómo actualizar el sistema?": "Las actualizaciones del sistema dependen del fabricante. Consulta el manual o la configuración para ver si hay actualizaciones disponibles.",
        "¿qué hago si el sistema no responde?": "Si el sistema no responde, intenta reiniciar el dispositivo. Si el problema persiste, contacta a soporte técnico.",
        "¿cómo activar el modo de emergencia?": "Si el sistema tiene un modo de emergencia, este se activa automáticamente cuando se detecta una condición peligrosa.",
        "¿el sistema consume mucha energía?": "El consumo de energía varía según el uso de los sensores y las alertas. Verifica el manual para conocer detalles específicos de consumo.",
        "¿puedo añadir más usuarios al sistema?": "La configuración de múltiples usuarios depende del diseño del sistema. Consulta las opciones de configuración de usuarios si están disponibles.",
        "¿puede el sistema funcionar sin internet?": "Algunos sistemas de seguridad pueden funcionar sin internet, pero ciertas características, como notificaciones remotas, podrían requerir conexión.",
        "¿cómo resetear el sistema?": "Para resetear el sistema, revisa el manual del dispositivo. Por lo general, se puede hacer desde el menú de configuración.",
        "¿qué pasa si se va la electricidad?": "Si el sistema tiene respaldo de batería, debería seguir funcionando. Verifica que esté cargada o consulta el manual para información adicional.",
        "¿cuál es el tiempo de vida del sistema?": "La vida útil del sistema depende de los componentes. Los sensores suelen durar varios años, pero es recomendable realizar mantenimiento periódico.",
        "¿qué tipo de alertas tiene el sistema?": "El sistema puede generar alertas visuales en pantalla y activar el buzzer en caso de una emergencia.",
        "¿cómo saber si un sensor está activo?": "Puedes ver el estado de cada sensor en la interfaz principal. Los sensores activos mostrarán su estado en tiempo real.",
        "¿cómo actualizar el software?": "Las actualizaciones del software pueden realizarse desde la configuración, si el sistema ofrece esta opción.",
        "¿el sistema necesita mantenimiento?": "Es recomendable hacer mantenimiento cada cierto tiempo para asegurar que todos los componentes están en buen estado.",
        "¿cómo silenciar el buzzer en una alerta?": "Puedes silenciar el buzzer desde el panel de control o esperar hasta que el evento de alerta haya sido resuelto.",
        "¿puede el sistema detectar incendios?": "El sistema tiene un sensor de humo, que ayuda a detectar posibles incendios.",
        "¿se puede configurar la sensibilidad del sensor?": "Algunos sensores permiten ajustar la sensibilidad desde el panel de configuración.",
        "¿cuándo debo reemplazar los sensores?": "Reemplaza los sensores cuando notes una disminución en su rendimiento o si reciben daños visibles.",
        "¿cómo monitorear remotamente el sistema?": "El monitoreo remoto depende del sistema y la conexión a internet. Consulta el manual para saber si está disponible.",
        "¿el sistema es a prueba de agua?": "La resistencia al agua depende de cada sensor. Verifica en el manual si tus dispositivos son resistentes al agua.",
        "¿el sistema tiene respaldo de energía?": "Algunos sistemas incluyen una batería de respaldo. Verifica si tu dispositivo tiene esta característica en el manual.",
        "¿cómo desactivar una alerta?": "Para desactivar una alerta, confirma el evento en la interfaz o apaga el sistema si no hay peligro.",
        "¿puedo usar el sistema en exteriores?": "Muchos sistemas están diseñados para interiores. Verifica si tu sistema es apto para uso en exteriores.",
        "¿se puede integrar con otros sistemas?": "La integración depende de la compatibilidad del sistema. Consulta las especificaciones para ver si permite integración con otros dispositivos.",
        "¿cuánto cuesta el mantenimiento?": "El costo del mantenimiento varía según el tipo de sensor y la frecuencia de uso. Consulta con el proveedor para obtener detalles.",
        "¿qué es un sistema de seguridad autónomo?": "Es un sistema que opera de manera independiente sin requerir intervención constante del usuario.",
        "¿qué puedo hacer si un sensor falla?": "Si un sensor falla, intenta reiniciarlo. Si no funciona, considera reemplazarlo o contactar a soporte técnico.",
        "¿cómo instalar nuevos sensores?": "La instalación de sensores adicionales puede requerir configuración avanzada. Consulta el manual para más información.",
        "¿qué sensores vienen incluidos?": "Este sistema incluye sensores de temperatura, humo y vibración. Puedes consultar el manual para detalles.",
        "¿puede el sistema enviar alertas a mi teléfono?": "Las alertas móviles requieren una aplicación específica y una conexión a internet para el envío de notificaciones.",
        "¿cuáles son las funciones básicas del sistema?": "Las funciones básicas incluyen detección de temperatura, humo y vibración, y generación de alertas en caso de emergencia.",
        "¿cómo saber si el sistema está funcionando correctamente?": "Verifica el estado de los sensores en la interfaz. Si todo está bien, cada sensor mostrará su estado 'Activo'.",
        "¿cómo puedo resetear los valores de los sensores?": "Desde el panel de configuración, puedes reiniciar el sistema o restablecer los valores predeterminados de los sensores.",
        "¿puedo utilizar el sistema sin conexión a internet?": "Sí, puedes utilizar el sistema sin conexión a internet, pero algunas funciones avanzadas, como notificaciones remotas, requieren internet.",
        "¿qué pasa si se interrumpe la electricidad?": "Si el sistema tiene respaldo de batería, seguirá funcionando temporalmente. Verifica la carga regularmente.",
        "¿se pueden personalizar las alertas de cada sensor?": "La personalización de alertas depende de las características del sistema. Consulta el manual para saber si esta opción está disponible.",
        "¿hay un modo de prueba para verificar los sensores?": "Sí, algunos sistemas tienen un modo de prueba para verificar el funcionamiento correcto de los sensores.",
        "¿qué tan lejos puede detectar el sensor de vibración?": "La distancia de detección depende del modelo del sensor. Consulta el manual para detalles específicos.",
        "¿se puede configurar el tiempo de respuesta de una alerta?": "En algunos sistemas, puedes ajustar el tiempo de espera antes de que se active una alerta.",
        "¿el sistema puede operar con energía solar?": "Depende del diseño. Si el sistema admite paneles solares, podrías utilizar energía solar.",
        "¿qué hago si el sistema detecta una amenaza?": "Sigue el protocolo de seguridad indicado y evacúa el área si es necesario. Contacta a las autoridades si la amenaza es real.",
        "¿cuál es la frecuencia recomendada de mantenimiento?": "Se recomienda hacer mantenimiento cada 6 meses o al notar cambios en el rendimiento del sistema.",
        "¿cómo saber si el sistema está desactivado?": "La interfaz mostrará un estado inactivo o de reposo cuando el sistema esté desactivado."
    };
    
    let bestMatch = null;
    let highestSimilarity = 0.5; // Umbral mínimo de similitud para aceptar una respuesta

    for (const key in responses) {
        const similarityScore = similarity(message.toLowerCase(), key.toLowerCase());
        if (similarityScore > highestSimilarity) {
            highestSimilarity = similarityScore;
            bestMatch = responses[key];
        }
    }

    return bestMatch || "Lo siento, no tengo una respuesta para eso. ¿Puedes intentar con otra pregunta?";
}

document.getElementById('send-assistant').addEventListener('click', () => {
    const message = assistantInput.value.trim();
    if (message) {
        const userMessage = document.createElement('p');
        userMessage.textContent = `Tú: ${message}`;
        userMessage.style.color = '#ffcc80';
        assistantBody.appendChild(userMessage);

        // Obtener respuesta del asistente y mostrarla
        const responseText = getAssistantResponse(message);
        const response = document.createElement('p');
        response.textContent = `Asistente: ${responseText}`;
        response.style.color = '#ffffff';
        assistantBody.appendChild(response);

        // Desplazarse automáticamente hacia abajo para mostrar la última respuesta
        assistantBody.scrollTop = assistantBody.scrollHeight;
        assistantInput.value = '';
    }
});

// Selecciona el elemento LED
const statusLed = document.getElementById("status-led");

// Función para cambiar el LED a rojo (problema detectado)
function setLedToRed() {
    statusLed.classList.remove("green");
    statusLed.classList.add("red");
}

// Función para cambiar el LED a verde (todo en orden)
function setLedToGreen() {
    statusLed.classList.remove("red");
    statusLed.classList.add("green");
}

// Ejemplo: Cambiar el estado del LED cuando se hace clic en un botón
document.getElementById("activate-temp").addEventListener("click", () => {
    // Supongamos que este botón simula un problema al activarlo
    setLedToRed();
    setTimeout(setLedToGreen, 5000); // Regresa a verde después de 5 segundos
});
