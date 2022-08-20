var express = require('express');
const { app } = require('firebase-admin');
var router = express.Router();
var db = require('../config/firebase-config')
var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken("APP_USR-5349434947659837-081014-8adaee02e62be639b6ff0e2f14318b93-178177205");

var id = ''

/* GET home page. */
// ruta inicial, es asyncrona por que recoge datos de la base de datos

router.get('/', async function(req, res, next) {
    const request = await db.collection('runners').get();
    const { docs } = request;
    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
    var runnersLenght = runners.length;
    res.render('index', { title: 'Mari Menuco Run', runners, runnersLenght });
});

router.get('/pmt', (req, res) => {
    res.render('payment_page');
})

router.get('/distances', (req, res, next) => {
    res.render('distances');
})




router.post("/process_payment", (req, res) => {
    const { body } = req;
    const { payer } = body;
    const runnerDBI = body.runnerDBI;
    const paymentData = {
        transaction_amount: Number(body.transactionAmount),
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
            db.collection('runners').doc(runnerDBI).update(paymentData)
           
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
    const { cat, runnerName, ageSelect, partner_id, runnerEmail, description, runnerID, transactionAmount, genre, birth } = body;

    const request = await db.collection('runners').get();
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
    if(runnerNbr > 100){
        strRunnerNbr = `${runnerNbr+1}`
    }
    else {
        if (runnerNbr > 10){
            strRunnerNbr = `0${runnerNbr+1}`
        }
        else {
            strRunnerNbr = `00${runnerNbr+1}`
        }
    }

    let payment_data = {
        amount: transactionAmount,
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
        runnerBirthDate: birth,
        payment_data: payment_data,

    }

    var _transaction_amount = Number(transactionAmount).toFixed(2).toString()

    


    var runnerDBI;
    // grabamos datos en firebase
    await db.collection('runners').add(newRunner).then((doc) => {
        runnerDBI = doc.id
    }).then(() => {
        res.render('payment_page', { strRunnerNbr, cat, ageSelect, _transaction_amount, description, runnerName, runnerDBI, genre, birth }); // para dirigirnos nuevamente a '/'
    })

    

})

/*GET DELETE RUNNER*/
router.get('/borrar/:id', (req, res) => {
    let id = req.params.id;
    db.collection('runners').doc(id).delete();

    res.redirect('/dashboard') // para dirigirnos nuevamente a '/'    
})

/*GET RUNNER*/
router.get('/runner/:id', async(req, res) => {
    let id = req.params.id;
    const request = await db.collection('runners').doc(id).get();
    const runner = { id: id, data: request.data() }


    res.render('runner', { runner })
})

/*render dashboard*/
router.get('/dashboard', async function(req, res, next) {
    const request = await db.collection('runners').get();
    const { docs } = request;
    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
    res.render('dashboard', { title: 'Panel de Control', runners });
});



module.exports = router