import BotWhatsapp from '@bot-whatsapp/bot';
import { ChatCompletionMessageParam } from 'openai/resources';
import { run, runDetermine } from 'src/services/openai';
import establishmentDetailsFlow from './establishmentDetails.flow';

/**
 * Un flujo conversacion que es por defecto cunado no se contgiene palabras claves en otros flujos
 */
export default BotWhatsapp.addKeyword(BotWhatsapp.EVENTS.WELCOME)
    .addAction(async (ctx, { state, gotoFlow }) => {
        
        try{
            const history = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[]
            const ai = await runDetermine(history)
            const name = ctx?.pushName ?? ''
            const userID = ctx?.from ?? ''

            console.log(`[QUE QUIERES COMPRAR:`, ai.toLowerCase())
            console.log(`[CTX]:`,ctx)

            if(ai.toLowerCase().includes('unknown')){
                return 
            }

            if(ai.toLowerCase().includes('interesa')){
                return gotoFlow(establishmentDetailsFlow)
            }
            

            /**..... */

        }catch(err){
            console.log(`[ERROR]:`,err)
            return
        }
    })
    .addAction(async (ctx, { flowDynamic, state }) => {
        try{
            const newHistory = (state.getMyState()?.history ?? []) as ChatCompletionMessageParam[]
            const name = ctx?.pushName ?? ''
            const userID = ctx?.from ?? ''
    
            console.log(`[CTX]:`, userID)
            console.log(`[HISTORY]:`, newHistory)
            
    
            newHistory.push({
                role: 'user',
                content: ctx.body
            })
    
            const largeResponse = await run(name, newHistory)

            const chunks = largeResponse.split(/(?<!\d)\.\s+/g);
            for (const chunk of chunks) {
                await flowDynamic(chunk)
            }

            newHistory.push({
                role: 'assistant',
                content: largeResponse
            })
        
            await state.update({history: newHistory})
    
        }catch(err){
            console.log(`[ERROR]:`,err)
        }
    })


