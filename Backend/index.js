
import dotenv from 'dotenv';
import connectdb from './db.js';
import app from './app.js';  

dotenv.config({
    path: './.env'
});

connectdb()

    .then(() => {
        app.listen(process.env.PORT || 5000, () => { 
            console.log(`⚙️ Server is running at port: ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => {
        console.log("MONGO db connection failed!!!", err);
    });


