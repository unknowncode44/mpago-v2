var express = require('express');
const { app } = require('firebase-admin');
var router = express.Router();
var db = require('../config/firebase-config')
var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken("APP_USR-5195066021992733-073114-08b54514069ebb6401a70a2ac982212f-65060542");



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
    console.log('fetch');
    // const price = req.body.price
    // const platformPrice = Number(price) * 0.01
    // const cat = req.body.cat
    // const publicKey = ''
    res.render('payment_page');
})




router.post("/process_payment", (req, res) => {
    const { body } = req;
    const { payer } = body;
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
router.post('/add-runner', (req, res) => {
    console.log(req.body);
    // creamos objeto runner 
    // const runner = {
    //     name: req.body.runnerName,
    //     age: req.body.runnerAge,
    //     email: req.body.runnerEmail,
    //     category: req.body.cat,
    //     runner_id: req.body.runnerID,
    //     platform_cost: req.body.platform_cost,
    //     price: req.body.price,
    //     total_cost: req.body.total_cost,
    // }

    // db.collection('runners').add(runner); // grabamos datos en firebase

    res.redirect('pmt') // para dirigirnos nuevamente a '/'

})

/*GET DELETE RUNNER*/
router.get('/borrar/:id', (req, res) => {
    let id = req.params.id;
    db.collection('runners').doc(id).delete();

    res.redirect('/') // para dirigirnos nuevamente a '/'    
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
    console.log(runners[0].data.runnerInfo.runnerID);
    res.render('dashboard', { title: 'Panel de Control', runners });
});



module.exports = router