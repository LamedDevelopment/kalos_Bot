import BotWhatsapp from '@bot-whatsapp/bot';

/**
 * Un flujo conversacion que responder a las palabras claves "hola", "buenas", ...
 */
export default BotWhatsapp.addKeyword(['hola', 'buenas'])
    .addAnswer('Hola soy Kalos, Nos encanta tenerte aqui, ¿Como puedo ayudarte el día de hoy 😀?')

