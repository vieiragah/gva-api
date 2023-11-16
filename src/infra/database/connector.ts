import { connect } from 'mongoose'

export async function connectDatabase() {
    try {
        const database = await connect(process.env.DATABASE_URL ?? '');
        console.log("conecatado ao banco", database.connection.host);
    } catch(error) {
        console.log(error);
    }
}

//gabriel_apolinario
//9ni0rv7LGbqpUtLb