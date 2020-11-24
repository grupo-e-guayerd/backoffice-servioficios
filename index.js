/* DEPENDECIES */
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const mercadopago = require("mercadopago")
const URL_DB_BACKOFFICE = require("./config"); 
const { response } = require("express");

// APP 
const app = express();

// MIDDLEWARES 
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// SETTINGS 
app.set("port", process.env.PORT || 3001);

/* ENDPOINTS */
app.use(require("./api/professionals"));
app.use(require("./api/pendings"));
app.use(require("./api/admins"));
app.use(require("./api/categories"));
app.use(require("./api/zones"));



app.get("/mercadopago" , (req , res) => {
    
    let preference = {
        items: [
        {  
            title: "Un prodructo",
            unit_price: 1000,
            quantity: 1
        }
        ]
        /* back_urls: {
            success: "https://servi-oficios.vercel.app/"
        }*/
    } 
    
    mercadopago.preferences.create(preference)
    .then( response =>  {
        return res.status(200).send({init_point:response.body.init_point})
    })
    .catch( error => console.log(error))
})



// DATABASE AND SERVER CONECTION
mongoose.connect(URL_DB_BACKOFFICE, { useNewUrlParser: true, useUnifiedTopology: true }, (error) => {
    if (error) { console.log("Error on try connect database.\n") }
    else {
        console.log("Database conected.\n")

        app.listen(app.get("port"), (error) => {
            if(!error){
                console.log(`Server running in port ${app.get("port")}\n`)
               
                mercadopago.configure({
                    access_token: "TEST-1523691645272520-112421-432fc7e39348bba6890a1196d55b5487-677364570"
                })
            } 
            else {
                console.log("Error at trying to run Backserver.")
            }
                
            
            
        })
    }
})
