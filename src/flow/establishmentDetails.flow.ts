import BotWhatsapp from '@bot-whatsapp/bot';
import chatInteraction from 'src/models/chatInteraction';

/**
 * Un flujo conversacion que responder a las palabras claves "me Interesa", ...
 */
export default BotWhatsapp.addKeyword(['interesa'])
    .addAnswer('Me puede proporcionar su email',{capture:true}, 
        async (ctx, { state, fallBack }) => {        
        if(!ctx.body.includes('@')){
            return fallBack('Esta respuesta parece no tener el formato de un email. 📧')
        }
        await state.update({email:ctx.body.toLowerCase()})
    })
    .addAnswer('Nombre del Establecimiento? ',{capture:true})
    .addAnswer('Cuantos Colaboradores tiene Actualmente?', { capture: true }, async (ctx, { state, fallBack }) => {
        const num = parseInt(ctx.body);
        const name = ctx?.pushName ?? ''
        const userID = ctx?.from ?? ''
        if (isNaN(num)) {
            return fallBack('Por favor, ingrese un número válido para la cantidad de colaboradores.');
        }
        
        // Aquí puedes realizar cualquier acción necesaria con el número ingresado
        await state.update({ numColaboradores: num });
    })
    .addAnswer('Cual es el valor Promedio de sus servicios?', { capture: true }, async (ctx, { state, fallBack }) => {
        const name = ctx?.pushName ?? ''
        const userID = ctx?.from ?? ''
        const regex = /^(?:\$?\s?)?\d{1,3}(?:[.,]?\d{3})*(?:[.,]\d{1,2})?$/;
        if (!regex.test(ctx.body)) {
            return fallBack('Por favor, ingrese un valor monetario válido sin puntos (.) ni comas (,).');
        }
        // Aquí puedes realizar cualquier acción necesaria con el valor monetario ingresado
        const numColaboradores = state.get('numColaboradores');
        const vlrProm = parseInt(ctx.body);
        const valorMesCol = vlrProm * 300
        const facturaMes = numColaboradores * valorMesCol
        await state.update({
            valorPromedio: ctx.body,
            valorMesCol,
            facturaMes
        });
    })
    .addAction(async (ctx, { flowDynamic, state }) => {
        const name = ctx?.pushName ?? ''
        const userID = ctx?.from ?? ''
        const email = state.get('email');
        const nombreEstablecimiento = state.get('nombreEstablecimiento');
        const numColaboradores = state.get('numColaboradores');
        const valorPromedio = state.get('valorPromedio');
        const valorMesCol = state.get('valorMesCol');
        const facturaMes = state.get('facturaMes');
        
        const message = `Gracias por proporcionar la siguiente información:
        - Email: ${email}
        - Nombre del Establecimiento: ${nombreEstablecimiento || 'No proporcionado'}
        - Cantidad de Colaboradores: ${numColaboradores}
        - Valor Promedio de los Servicios: ${valorPromedio}
        - Valor Mensual por Colaborador: ${valorMesCol}
        - Factura Mensual Estimada: ${facturaMes}
        `;

        // Crear una instancia del modelo ChatInteraction
        const chatInteractionDB = new chatInteraction({
            userId: userID, // Suponiendo que ctx.from.id es el userId
            userName: name, // Suponiendo que ctx.from.first_name es el userName // Suponiendo que ctx.from.phone_number es el userPhoneNumber
            botResponse: message, // El mensaje que vas a enviar al cliente
            userMessage: ctx.body, // El mensaje del usuario
            timestamp: new Date(), // La fecha y hora actual
        });

        // Guardar la instancia en la base de datos
        await chatInteractionDB.save();
    
        const messageClient = `Gracias por proporcionar la siguiente información:
        - Email: ${email}
        - Nombre del Establecimiento: ${nombreEstablecimiento || 'No proporcionado'}
        - Cantidad de Colaboradores: ${numColaboradores}
        - Valor Promedio de los Servicios: ${valorPromedio}
        `;
    
        // Envía el mensaje al cliente
        await flowDynamic(messageClient);
    })


