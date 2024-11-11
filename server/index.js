const express = require('express')
const app = express()
const cors = require('cors');
const { validateToken } = require('./auth/controller/validate');

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const allowedOrigins = [
    'http://localhost:3000',  // Frontend locale (sviluppo)
    'http://localhost:8080',  // Swagger locale (sviluppo)
    'https://currence.web.app',  // Dominio Firebase (produzione)
];

app.use(cors({
    origin: function (origin, callback) {
        // Permette richieste da qualsiasi origin in local se non definito
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        } else {
            return callback(new Error('Not allowed by CORS'));
        }
    }
}));

app.use(express.json());

//update DB
const User = require('./model/User');


const authRouter = require('./auth/endpoint');
app.use('/v1/auth', validateToken, authRouter);

app.use('/specs', swaggerUi.serve);
app.get('/specs', swaggerUi.setup(swaggerDocument));

app.get('/', function (req, res) {
    const html = `
        <!DOCTYPE html>
        <html style="height: 100%;"><head>
                <title>Currence API</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="height: 100%;position: relative;margin: 0;font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;display: flex;flex-direction: column;justify-content: center;align-items: center;font-size: 19px;padding: 0 15px;">
                <div style="width: 100%;margin: 2rem 1rem;max-width: 569px;border-radius:15px;padding: 3.5rem 5rem;border: 1px solid #f1f1f1;box-shadow: 5px 5px 15px #e1e1e1;">
                    <h1 style="height: 2.4em;font-weight: 200;border-bottom: 1px solid #bcbcbc;text-align: center;padding-bottom: 15px;margin: 15px auto 40px;font-size: 33px;">
                        <img src="https://currence.web.app/static/media/logo-b-ng.3de968fc8c8ea92b5526ea414d31b73a.svg" style="height: 3.2rem;margin-right: -7px;position: relative;top: -8px;margin-right: 3px;" alt="Currence"> API
                    </h1>
                    <h3 style="color: #0052ff;font-weight: 600;">Welcome to Currence API</h3>
                    <p style="font-weight: 300;">Your finance, made easy. Access the information about your credit: UbiShop has been created to help retail customers to be more independent and autonomous in their purchase experiences, by tracking all the relevant information about products, supporting the local shops with the goods provision and the customization of service.</p>                    
                    
                    
                    <a href="/specs" style="display: block;color: #ffffff;background-color: #000080;text-decoration: none;font-weight: 600;width: 254px;text-align: center;padding: 1.3rem;border: 1px solid #000080;border-radius: 41px;font-size: 14px;margin-top: 37px;">OPEN THE SWAGGER</a>
                </div>
            
        
    </body></html>
    `;
    res.setHeader('content-type', 'text/html; charset=utf-8')
    res.send(html);

});


app.listen(8080, () => {
    console.log('Currence API gateway listening on port 8080');
});