import "dotenv/config"
import BotWhatsapp from '@bot-whatsapp/bot'
import QRPortalWeb  from '@bot-whatsapp/portal'
import { MockAdapter, MongoAdapter} from './database';
import provider from './provider';
import flow  from './flow';
import { initServer } from "./services/http";

/**
 * Funcion principal del bot
 */

const MONGO_DB_URI = 'mongodb+srv://lameddev:Santiago23@cluster0.sqoen9c.mongodb.net'
const MONGO_DB_NAME = 'Emet' 


const main = async () => {

    const adapterDB = new MongoAdapter({
        dbUri: MONGO_DB_URI,
        dbName: MONGO_DB_NAME,
    })

    // const database = adapterDB
    const database = new MockAdapter()
    console.log(database)

    const botFLow = BotWhatsapp.addKeyword('hola').addAnswer('Buenas!') as any

    // console.log(botFLow.toJson())
    console.log( flow.options )

    const botInstance = await BotWhatsapp.createBot({
        database,
        provider,
        flow
    })

    initServer(botInstance)
    QRPortalWeb()
}


main()


