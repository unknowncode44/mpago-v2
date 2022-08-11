var express = require('express');
const { app } = require('firebase-admin');
var router = express.Router();
var db = require('../config/firebase-config')
var mercadopago = require('mercadopago');
mercadopago.configurations.setAccessToken("8adaee02e62be639b6ff0e2f14318b93-178177205");



/* GET home page. */
// ruta inicial, es asyncrona por que recoge datos de la base de datos

router.get('/', async function(req, res, next) {
    const request = await db.collection('runners').get();
    const { docs } = request;
    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
    var runnersLenght = runners.length;
    res.render('index', { title: 'Mari Menuco Run', runners, runnersLenght });
});




router.post('/process_payment', async function(req, res, next) {

    const { body } = req;
    const { payer } = body;


    var payment_data = {
        transaction_amount: Number(body.transaction_amount),
        token: body.token,
        description: body.description,
        installments: Number(body.installments),
        payment_method_id: body.payment_method_id,
        issuer_id: body.issuer_id,
        payer: {
            email: payer.email,
            identification: {
                type: payer.identification.type,
                number: payer.identification.number
            }
        }
    };

    await mercadopago.payment.save(payment_data)
        .then(function(response) {

            const { response: data } = response;
            res.status(201).json({
                status: data.status,
                status_detail: data.status_detail,
                id: data.id
            });
            console.log(data.status);
            let runner = {
                runnerInfo: req.body.runnerInfo,
                payment_data: {
                    payment_id: data.id,
                    date_approved: data.date_approved,
                    status: data.status,
                    status_detail: data.status_detail,
                    net_received: data.transaction_details.net_received_amount,
                    amount: data.transaction_details.total_paid_amount,
                }
            }
            db.collection('runners').add(runner);

        }).then(() => {

            console.log('funcionando');
        })
        .catch(function(error) {
            console.error(error)
        });
});



/*POST ADD RUNNER*/
//esta ruta se ejecuta cuando hacemos click en el boton del formulario
// en la etiqueta form del html debemos incluirla en action asi:
// <form action="add-runner" method="post"> (no olvidar method post)
router.post('/add-runner', (req, res) => {
    // creamos objeto runner 
    const runner = {
        name: req.body.runnerName,
        age: req.body.runnerAge,
        email: req.body.runnerEmail,
        category: req.body.categories
    }

    db.collection('runners').add(runner); // grabamos datos en firebase

    // res.redirect('/') // para dirigirnos nuevamente a '/'

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