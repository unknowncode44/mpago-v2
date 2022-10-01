var express = require('express');
const { app } = require('firebase-admin');
require('dotenv').config()
var router = express.Router();
var db = require('../config/firebase-config')
var dbf = require('../public/inscr.json')
var mercadopago = require('mercadopago');
var nodemailer = require("nodemailer")

mercadopago.configurations.setAccessToken(process.env.TOKEN); //Token MP - La cuenta vendedora
// mercadopago.configurations.setAccessToken('TEST-5195066021992733-073114-bc76bf9a1232db75e73471a5602d017b-65060542');

// for (let i = 0; i < dbf.length; i++) {
//     const e = dbf[i];
//     loadData(e).then(() => {
//         console.log(`${e.name} cargado correctamente`);
//     })

// }

// async function loadData(runner) {
//     await db.collection('runners2').add(runner)
// }


//guardando logs

var fs = require('fs');
var util = require('util');

var log_file_err = fs.createWriteStream('./logs/error.log', { flags: 'a' });

process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    log_file_err.write(util.format('Caught exception: ' + err) + '\n');
});

process.on('ReferenceError', function(err) {
    console.log('Reference Error: ' + err);
    log_file_err.write(util.format('Caught exception: ' + err) + '\n');
});

// fin guardando logs

// mailer

const transporter = nodemailer.createTransport({
    host: process.env.SMTP,
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL, // Email
        pass: process.env.PASSWORD, // Contraseña
    }
})

transporter.verify().then(() => {
    console.log("Mailer Online");
})






// fin mailer

var id = ''

/* GET home page. */
// ruta inicial, es asyncrona por que recoge datos de la base de datos

router.get('/', async function(req, res, next) {
    const request = await db.collection('runners2').get();
    const { docs } = request;
    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
    var runnersLenght = runners.length;
    res.render('index', { title: 'Mari Menuco Run', runners, runnersLenght });
});

router.get('/pmt', (req, res) => {
    res.render('payment_page');
})

router.get('/test', async(req, res) => {
    res.render('mail')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/check-mail', async(req, res) => {

    let { mail, password } = req.body
    if (mail === process.env.MAILSECURE) {
        if (password === process.env.PASSWORDSECURE) {
            const request = await db.collection('runners2').get();
            const { docs } = request;
            const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
            res.render('dashboard', { title: 'Panel de Control', runners });
        } else {
            res.render('error')
        }

    } else {
        res.render('error')
    }

})


router.get('/distances', (req, res, next) => {
    res.render('distances');
})

// router.get('/mail', async(req, res) => {
//     sendMail('matiaz.orellana@gmail.com', 'Matias', '21k', '099').then(() => {
//         console.log('hello world');
//     });

// })

router.post("/process_payment", (req, res) => {
    const { body } = req;
    const { payer } = body;
    const runnerDBI = body.runnerDBI;
    const runnerEmail2 = body.runnerEmail;
    const runnerNam3 = body.runnerNam3;
    const runnerDistance = body.runnerDistance;
    const runnerNumber = body.strRunnerNbr;

    let transaction_amount

    console.log(runnerDistance);

    const paymentData = {
        transaction_amount: body.transactionAmount,
        token: body.token,
        description: body.description,
        installments: Number(body.installments),
        payment_method_id: body.paymentMethodId,
        issuer_id: body.issuerId,
        payer: {
            email: payer.email,
            identification: {
                type: payer.identification.docType,
                number: payer.identification.docNumber
            }
        }
    };

    mercadopago.payment.save(paymentData)
        .then(function(response) {
            const { response: data } = response;

            var paymentData = {
                status: data.status,
                status_detail: data.status_detail,
                id: data.id
            }
            db.collection('runners2').doc(runnerDBI).update(paymentData)

            if (data.status == 'approved') { // Si el pago es aprovado...
                sendMail(runnerEmail2, runnerNam3, runnerDistance, runnerNumber) //Envia el mail
            }

            res.status(201).json({
                detail: data.status_detail,
                status: data.status,
                id: data.id
            });


        })

    .catch(function(error) {
        console.log(error);
        const { errorMessage, errorStatus } = validateError(error);
        res.status(errorStatus).json({ error_message: errorMessage });
    });
});

function validateError(error) {
    let errorMessage = 'Unknown error cause';
    let errorStatus = 400;

    if (error.cause) {
        const sdkErrorMessage = error.cause[0].description;
        errorMessage = sdkErrorMessage || errorMessage;

        const sdkErrorStatus = error.status;
        errorStatus = sdkErrorStatus || errorStatus;
    }

    return { errorMessage, errorStatus };
}





/*POST ADD RUNNER*/
//esta ruta se ejecuta cuando hacemos click en el boton del formulario
// en la etiqueta form del html debemos incluirla en action asi:
// <form action="add-runner" method="post"> (no olvidar method post)
router.post('/add-runner', async function(req, res) {
    console.log(req.body);
    const { body } = req;
    const { cat, runnerName, ageSelect, partner_id, runnerEmail, description, runnerID, transactionAmount, genre, birth, tShirtSize } = body;

    const request = await db.collection('runners2').get(); //
    const { docs } = request;
    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
    var runnersLenght = runners.length;




    let runnerNbrs = [];

    for (let i = 0; i < runners.length; i++) {
        const e = runners[i];
        runnerNbrs.push(Number(e.data.runnerUID));
    }

    let runnerNbr = Math.max(...runnerNbrs);
    console.log(runnerNbr);
    let strRunnerNbr = '';
    if (runnerNbr > 100) {
        strRunnerNbr = `${runnerNbr+1}`
    } else {
        if (runnerNbr > 10) {
            strRunnerNbr = `0${runnerNbr+1}`
        } else {
            strRunnerNbr = `00${runnerNbr+1}`
        }
    }

    let transaction_amount = null

    switch (cat) {
        case 'Kids':
            transaction_amount = '1000';
            break
        case '5k':
            transaction_amount = '4700';
            break
        case '10k':
            transaction_amount = '5300';
            break
        case '21k':
            transaction_amount = '5800';
            break
    }

    let payment_data = {
        amount: transaction_amount,
    };


    let newRunner = {

        name: runnerName,
        email: runnerEmail,
        catValue: cat,
        runnerAge: ageSelect,
        partnerID: partner_id,
        runnerUID: strRunnerNbr,
        runnerID: runnerID,
        runnerGenre: genre,
        tshirtSize: tShirtSize,
        runnerBirthDate: birth,
        payment_data: payment_data,

    }

    var _transaction_amount = Number(transaction_amount).toFixed(2).toString()




    var runnerDBI;
    // grabamos datos en firebase
    await db.collection('runners2').add(newRunner).then((doc) => {
        runnerDBI = doc.id
    }).then(() => {
        res.render('payment_page', { strRunnerNbr, runnerEmail, cat, ageSelect, _transaction_amount, description, runnerName, runnerDBI, genre, birth }); // para dirigirnos nuevamente a '/'
    })



})

/*GET DELETE RUNNER*/
// router.get('/borrar/:id', (req, res) => {
//     let id = req.params.id;
//     db.collection('runners').doc(id).delete().then(async() => {
//         const request = await db.collection('runners2').get();
//         const { docs } = request;
//         const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
//         res.render('dashboard', { title: 'Panel de Control', runners });
//     });
// })

/*GET RUNNER*/
router.get('/runner/:id', async(req, res) => {
    let id = req.params.id;
    const request = await db.collection('runners2').doc(id).get();
    const runner = { id: id, data: request.data() }


    res.render('runner', { runner })
})

/*render dashboard*/
// router.get('/dashboard', async function(req, res, next) {
//     const request = await db.collection('runners2').get();
//     const { docs } = request;
//     const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
//     res.render('dashboard', { title: 'Panel de Control', runners });
// });


async function sendMail(email, name, distance, runnerNbr) {
    let htmlConfirmMail = fs.createReadStream('./views/mail2.html')
    try {
        await transporter.sendMail({
            from: `"Mari Menuco Run" <${process.env.EMAIL}>`,
            to: email,
            subject: "Confirmacion de Inscripcion",
            // adjuntos

            attachments: [{
                    filename: 'checkmark-circle-outline.svg',
                    path: './public/images/checkmark-circle-outline.svg',
                    cid: 'check'
                },
                {
                    filename: 'MMR-Isotipo-Negativo.png',
                    path: './public/images/MMR2022/MMR-Isotipo-Potivo-PNG.png',
                    cid: 'mmrun'
                },
                {
                    filename: 'HV Devs - SVG-02.svg',
                    path: './public/images/HV Devs - SVG-02.svg',
                    cid: 'hvdevs'
                },
            ],

            text: 'Confirmación',
            html: `<div class="flex-container">
            <div class="flex-items">
                <h4>Pago Confirmado!</h4>
            </div>
            <div class="flex-items">
                <h4>Gracias por participar! Tu inscripcion esta completa</h4>
            </div>
            <div class="flex-items horizontal-flex">
                <div class="hflex-items">
                </div>
                <div class="hflex-items">
                    <p>
                        Hola <b>${name}</b> tu inscripción a la distancia de <b>${distance}</b> se realizo con éxito, tu número de corredor es <b>${runnerNbr}</b>
                        <br><br>
                        <span>Equipo de <a href="mmrun.com.ar">Mari Menuco Run</a></span>
                    </p>
                </div>
                <div class="hflex-items">
    
                </div>
            </div>
            <div class="flex-items">
                <div class="flex-footer-container">
    
                    <div class="flex-footer-items">
                        <img src="cid:mmrun" alt="" width="200px">
                    </div>
    
                    <div class="flex-footer-items">
                        <img src="cid:hvdevs" alt="">
                    </div>
                </div>
            </div>
        </div>`

        })
    } catch (error) {

    }



}



module.exports = router