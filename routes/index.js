var express = require('express');
const { app } = require('firebase-admin');
require('dotenv').config()
var router = express.Router();
var db = require('../config/firebase-config')
var dbf = require('../public/inscr.json')
var mercadopago = require('mercadopago');
var nodemailer = require("nodemailer")
var datefns = require("date-fns")


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


var firstDay = datefns.format(new Date(2022, 10, 3), 'dd.MM.yy');
var secondDay = datefns.format(new Date(2022, 10, 4), 'dd.MM.yy');
var thirdDay = datefns.format(new Date(2022, 10, 5), 'dd.MM.yy');

var firstDayParsed = datefns.parse(firstDay, 'd.MM.yy', new Date())
var secondDayParsed = datefns.parse(secondDay, 'd.MM.yy', new Date())
var thirdDayParsed = datefns.parse(thirdDay, 'd.MM.yy', new Date())

var firstDayStartTime = datefns.add(firstDayParsed, { hours: 13 });
var secondDayStartTime = datefns.add(secondDayParsed, { hours: 17 });
var thirdDayStartTime = datefns.add(secondDayParsed, { hours: 10 });

let ext = thirdDayStartTime
let ext1 = datefns.add(thirdDayStartTime, { hours: 4 })
let arrext = []

// while (ext < ext1) {
//     let appointment = {
//         date: thirdDay,
//         time: ext.toLocaleTimeString(),
//         status: 'available',
//         runner: 'x',
//         place: 'Sede Club Mari Menuco',
//         address: 'P. Jacinto Stabile 239, Centenario',
//         timeInter: '10hs a 14hs'
//     }
//     arrext.push(appointment)
//     ext = datefns.add(ext, { minutes: 5 })

//     console.log(`++++++  ${ext}`);
// }
// console.log(JSON.stringify(arrext));


// for (let i = 0; i < arrext.length; i++) {
//     const e = arrext[i];
//     loadData(e).then(() => {
//         console.log(`Turno de las ${e.time} cargado correctamente`);
//     })

// }

// console.log(arrext.length);

// async function loadData(runner) {
//     await db.collection('app3').add(runner)
// }

async function getAppointments(day) {
    let apparr = []
    const request = await db.collection(day).get();
    const { docs } = request;
    const getAppointments = docs.map(runner => ({ id: runner.id, data: runner.data() }));
    for (let i = 0; i < getAppointments.length; i++) {
        const e = getAppointments[i];
        if (e.data.place) {
            apparr.push(e)
        } else {
            clean(e.id)
        }
    }
    return apparr
}

// getAppointments('app3').then(async(array) => {
//     for (let i = 0; i < array.length; i++) {
//         const e = array[i];
//         if (e.data.status === 'given') {
//             await resetAppointment(e.id, 'app3').then(() => {
//                 console.log(`${e.id} modificado`);
//             })
//         }
//     }
// })


// getAppointments('app3').then((_app1) => {
//     for (let i = 0; i < _app1.length; i++) {
//         const e = _app1[i];
//         resetAppointment(e.id, 'app3').then(() => console.log('actualizado'))

//     }
// })


async function clean(appointment) {
    await db.collection('app1').doc(appointment).delete()
}


async function giveAppointment(appID, runnerID, day) {
    await db.collection(day).doc(appID).update({ status: 'given', runner: runnerID })
}

async function resetAppointment(appID, day) {
    await db.collection(day).doc(appID).update({ status: 'available', runner: 'x' })
}




//guardando logs

var fs = require('fs');
var util = require('util');
const { json } = require('express');
const { getApp } = require('firebase-admin/app');
const { async } = require('rsvp');

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

// calculando fechas


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
});

router.get('/turnos', async(req, res) => {
    const app1 = await getAppointments('app1')
    const app2 = await getAppointments('app2')
    const app3 = await getAppointments('app3')



    var appointments1 = []
    for (let i = 0; i < app1.length; i++) {
        const e = app1[i];
        var f = e;
        f.data.time = e.data.time.slice(0, -3);
        appointments1.push(f);
    }

    var appointments2 = []
    for (let i = 0; i < app2.length; i++) {
        const e = app2[i];
        var f = e;
        f.data.time = e.data.time.slice(0, -3);
        appointments2.push(f);
    }

    var appointments3 = []
    for (let i = 0; i < app3.length; i++) {
        const e = app3[i];
        var f = e;
        f.data.time = e.data.time.slice(0, -3);
        appointments3.push(f);
    }

    const requestRunners = await db.collection('runners2').get();
    const { docs } = requestRunners;
    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
    let approvedRunnersArray = []
    let lenght = 0
    for (let i = 0; i < runners.length; i++) {
        const e = runners[i];

        if (e.data.status == 'approved') {
            approvedRunnersArray.push(e)
            lenght++
        }

    }

    appointments1.sort((a, b) => {
        let fa = a.data.time;
        let fb = b.data.time;
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });

    appointments2.sort((a, b) => {
        let fa = a.data.time;
        let fb = b.data.time;
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });

    appointments3.sort((a, b) => {
        let fa = a.data.time;
        let fb = b.data.time;
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    });

    console.log(lenght.toString())

    res.render('appointments', { appointments1, appointments2, appointments3, approvedRunnersArray })
})

router.get('/turnos/findUser', async(req, res) => {
    const { userID, appointmentID, day } = req.query;
    var appointment = await db.collection(day).doc(appointmentID).get();
    var user = await db.collection('runners2').doc(userID).get();

    if (appointment && user) {
        res.status(200).json({ appointment: appointment, user: user })
    } else {
        res.status(404)
    }

})



router.post('/turnos/confirm', async(req, res) => {
    console.log(req.query)
    const { appID, userID, age, dob, email, day, rApp } = req.query
    var doc = await db.collection('runners2').doc(userID).get()

    var _age = doc._fieldsProto.runnerAge.stringValue
    var _email = doc._fieldsProto.email.stringValue
    var _dob = doc._fieldsProto.runnerBirthDate.stringValue

    if (rApp !== '') {
        const app1 = await getAppointments('app1')
        const app2 = await getAppointments('app2')
        const app3 = await getAppointments('app3')



        var appointments1 = []
        for (let i = 0; i < app1.length; i++) {
            const e = app1[i];
            var f = e;
            f.data.time = e.data.time.slice(0, -3);
            appointments1.push(f);
        }

        var appointments2 = []
        for (let i = 0; i < app2.length; i++) {
            const e = app2[i];
            var f = e;
            f.data.time = e.data.time.slice(0, -3);
            appointments2.push(f);
        }

        var appointments3 = []
        for (let i = 0; i < app3.length; i++) {
            const e = app3[i];
            var f = e;
            f.data.time = e.data.time.slice(0, -3);
            appointments3.push(f);
        }

        appointments1.concat(appointments2)
        appointments1.concat(appointments3)
        console.log(appointments1.length);

        for (let i = 0; i < appointments1.length; i++) {
            const e = appointments1[i];
            let dayR = '';
            for (let t = 0; t < app1.length; t++) {
                const y = app1[t];
                if (y.id === e.id) {
                    dayR = 'app1'
                    break
                }
            }
            for (let t = 0; t < app2.length; t++) {
                const y = app2[t];
                if (y.id === e.id) {
                    dayR = 'app2'
                    break
                }
            }
            for (let t = 0; t < app3.length; t++) {
                const y = app3[t];
                if (y.id === e.id) {
                    dayR = 'app3'
                    break
                }
            }
            if (rApp === e.data.runner) {
                console.log('encontrado');
                db.collection(dayR).doc(e.id).update({ runner: 'x', status: 'available' })
                break
            }


        }

    }

    if (_email === '-') {
        console.log('reemplazar email');
        await db.collection('runners2').doc(userID).update({ email: email });
    }

    if (_age === '-') {
        console.log('reemplazar age');
        await db.collection('runners2').doc(userID).update({ runnerAge: age });
    }

    if (_dob === '-') {
        console.log('reemplazar dob');
        await db.collection('runners2').doc(userID).update({ runnerBirthDate: dob });
    }

    await db.collection('runners2').doc(userID).set({ apppointment: appID }, { merge: true })
        .then(async() => {
            var appDoc = await db.collection(day).doc(appID).get();
            await giveAppointment(appID, userID, day)
                .then(async() => {
                    await sendAppConfirmation(email, appDoc._fieldsProto)
                }).then(() => {
                    res.sendStatus(200)
                });

        })


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
            let arr = [];
            await getAppointments('app1').then((array) => {
                array.sort((a, b) => {
                    let fa = a.data.time;
                    let fb = b.data.time;
                    if (fa < fb) {
                        return -1;
                    }
                    if (fa > fb) {
                        return 1;
                    }
                    return 0;
                })
                arr = array
            }).then(async() => {
                await getAppointments('app2').then((array2) => {
                    array2.sort((a, b) => {
                        let fa = a.data.time;
                        let fb = b.data.time;
                        if (fa < fb) {
                            return -1;
                        }
                        if (fa > fb) {
                            return 1;
                        }
                        return 0;
                    })
                    for (let i = 0; i < array2.length; i++) {
                        const e = array2[i];
                        arr.push(e)
                    }
                })
            }).then(async() => {
                await getAppointments('app3').then((array3) => {
                    array3.sort((a, b) => {
                        let fa = a.data.time;
                        let fb = b.data.time;
                        if (fa < fb) {
                            return -1;
                        }
                        if (fa > fb) {
                            return 1;
                        }
                        return 0;
                    })
                    for (let i = 0; i < array3.length; i++) {
                        const e = array3[i];
                        arr.push(e)
                    }
                }).then(() => {
                    const { docs } = request;
                    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
                    runners.sort((a, b) => {
                        let fa = a.data.runnerUID;
                        let fb = b.data.runnerUID;
                        if (fa < fb) {
                            return -1;
                        }
                        if (fa > fb) {
                            return 1;
                        }
                        return 0;
                    })
                    res.render('dashboard', { title: 'Panel de Control', runners, arr });
                })
            })




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
    // var runnersLenght = runners.length;

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
            transaction_amount = '1150';
            break
        case '5k':
            transaction_amount = '5405';
            break
        case '10k':
            transaction_amount = '6095';
            break
        case '21k':
            transaction_amount = '6670';
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

async function sendAppConfirmation(email, appointment) {

    try {
        await transporter.sendMail({
            from: `"Mari Menuco Run" <${process.env.EMAIL}>`,
            to: email,
            subject: "Confirmacion de Turno",
            text: 'Confirmación de turno',
            html: `<div class="flex-container">
            <div class="flex-items">
                <h3>Turno Confirmado</h3>
            </div>
            <div class="flex-items">
                <h4>Tu Turno esta confirmado!</h4>
            </div>
            <div class="flex-items horizontal-flex">
                <div class="hflex-items">
                </div>
                <div class="hflex-items">
                    <p>
                        Hola, confirmamos tu turno para retirar el kit para el dia: ${appointment.date.stringValue} a las ${appointment.time.stringValue} en ${appointment.place.stringValue}, ${appointment.address.stringValue}.
                        <br><br>
                        <span>Equipo de <a href="mmrun.com.ar">Mari Menuco Run</a></span>
                    </p>
                </div>
                <div class="hflex-items">
    
                </div>
            </div>
            <br><br>
            <br><br>
            <div class="flex-items">
                <div class="flex-footer-container">
    
                    <div class="flex-footer-items">
                        <img src="cid:mmrun" alt="" width="200px">
                    </div>
    
                    <div class="flex-footer-items">
                        <p>Desarrollado por <strong><a href="https://www.facebook.com/HighValleyDevelopers">HV Devs</a></strong></p>
                    </div>
                </div>
            </div>
        </div>`
        })

    } catch (error) {
        console.log(error);
    }
}


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