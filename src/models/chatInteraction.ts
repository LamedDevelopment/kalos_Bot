import { Schema, Document, model } from 'mongoose';


interface ChatInteraction extends Document {
    userId: string;
    userName: string;
    userPhoneNumber: string;
    botResponse: string;
    userMessage: string;
    timestamp: Date;
}

const ChatInteractionSchema = new Schema<ChatInteraction>({
    userId: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    botResponse: {
        type: String,
        required: true
    },
    userMessage: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, { collection: 'chatInteractions' });


// Índices para búsqueda eficiente por usuario
ChatInteractionSchema.index({
    'userId': 1
});
ChatInteractionSchema.index({
    'userName': 1
});
ChatInteractionSchema.index({
    'botResponse': 1
});
ChatInteractionSchema.index({
    'userMessage': 1
});

// Método toJSON para devolver el objeto sin el campo __v
ChatInteractionSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object;
});

export default model<ChatInteraction>('ChatInteraction', ChatInteractionSchema);
