function handleSocket(io) {
    const opcionesMenu = [
        'Contar un chiste',
        'Consejo del día',
        'Chismear',
        'Nada'
    ];

    const generarMenu = () => {
        return `${opcionesMenu.map((opcion, index) => `${index + 1}. ${opcion}`).join('<br>')}`;
    };

    io.on('connection', (socket) => {
        socket.emit('respuesta-bot', [`¿En qué puedo ayudar? <br> ${generarMenu()}`]);
        let bandera = false;
        const realizarProceso = async (proceso) => {
            if (bandera) return;
            bandera = true;
            switch (proceso.toLowerCase()) {
                case opcionesMenu[0].toLowerCase():
                    await contarChiste(socket);
                    break;
                case opcionesMenu[1].toLowerCase():
                    await darConsejo(socket);
                    break;
                case opcionesMenu[2].toLowerCase():
                    await chismear(socket);
                    break;
                case opcionesMenu[3].toLowerCase():
                    await nada(socket);
                    break;
                default:
                    socket.emit('respuesta-bot', ['No entendí la opción.', 'Por favor escríbela tal cual como está en el menú.']);
            }
            bandera = false;
            socket.emit('respuesta-bot', [`¿En qué más puedo ayudar? <br> ${generarMenu()}`]);
        };
        socket.on('respuesta', (opcion) => {
            realizarProceso(opcion);
        });
    });

    const contarChiste = async (socket) => {
        await socket.emit('respuesta-bot', ['¡Aquí tienes un chiste!', 'Si se muere una pulga, ¿a dónde va?', 'Vamos piensa', '...', 'Al pulgatorio.', 'Puedes solicitar otra opción del menú si lo deseas']);
    };

    const darConsejo = async (socket) => {
        await socket.emit('respuesta-bot', ['Aquí tienes un consejo del día:', 'Hazlo aunque tengas miedo', 'Que tengas lindo día', 'Puedes solicitar otra opción del menú si lo deseas']);
    };

    const chismear = async (socket) => {
        await socket.emit('respuesta-bot', ['Yo no tengo chismes, pero tú cuéntame uno']);
        await esperarRespuesta(socket);
        await socket.emit('respuesta-bot', ["Nooooo, en serio, bueno era de esperarse", "Cuentame más"]);
        await esperarRespuesta(socket);
        await socket.emit('respuesta-bot', ['Estuvo interesante eso', 'Puedes solicitar otra opción del menú si lo deseas']);
    };
    
    const nada = async (socket) => {
        await socket.emit('respuesta-bot', ['¿No tienes ninguna pregunta?','(Responde Si o No)']);
        const respuesta = await esperarRespuesta(socket);
        if (respuesta.toLowerCase() === 'si') {
            await socket.emit('respuesta-bot', ['Vale entonces... ']);
        } else if (respuesta.toLowerCase() === 'no') {
            await socket.emit('respuesta-bot', ['Entonces, ¿para qué me buscas si no quieres hablar?', 'Solo me utilizan', '😡😡','Solo por cortesia le volvere a mostrar el menú']);
        } else {
            await socket.emit('respuesta-bot', ['No entendí tu respuesta.']);
            await nada(socket);
        }
    };
    
    const esperarRespuesta = (socket) => {
        return new Promise(resolve => {
            socket.once('respuesta', (respuesta) => {
                resolve(respuesta);
            });
        });
    };
    
}

module.exports = handleSocket;
