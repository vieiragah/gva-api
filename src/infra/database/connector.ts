import { connect } from 'mongoose'

export async function connectDatabase() {
    try {
        const database = await connect('mongodb+srv://gabriel_apolinario:<9ni0rv7LGbqpUtLbnp>@gva-api.cfvfezo.mongodb.net/');
        console.log("conecatado ao banco", database.connection.host);
    } catch(error) {
        console.log(error);
    }
}

//gabriel_apolinario
//9ni0rv7LGbqpUtLb