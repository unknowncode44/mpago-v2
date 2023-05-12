var express = require('express');
require('dotenv').config()
var router = express.Router();

//! configutacion db, quiza convenga solo importar constante db desde otro modulo
var db = require('../config/firebase-config')

//! Mercado pago, quiza convenga moverlo al controlador de la ruta de pagos
// importamos mercado pago, desde la SDK que instalamos con nodemon
var mercadopago = require('mercadopago');

//! NodeMailer, quiza convenga crear un cotrolador
var nodemailer = require("nodemailer")

//! en ruta xxx se usa date
var datefns = require("date-fns")


mercadopago.configurations.setAccessToken(process.env.TOKEN); //Token MP - La cuenta vendedora
//* token ejemplo
// mercadopago.configurations.setAccessToken('TEST-5195066021992733-073114-bc76bf9a1232db75e73471a5602d017b-65060542');


//! metodo para obtener turnos, colocar en controller de turnos, se usa en ruta '/turnos'

async function getAppointments(day) {
    let apparr = [] // array que retornaremos
    const request = await db.collection(day).get(); // hacemos la consulta a la DB
    const { docs } = request; // desestructuracion de los datos que obtenemos de DB

    // creamos un array que va a recolectar los datos que obtenemos de docs
    // asignando un un objeto con el id del turno y los datos (lugar, fecha, hora, etc.)
    const getAppointments = docs.map(runner => ({ id: runner.id, data: runner.data() }));

    // luego corremos un for para agregar cada objeto al array que retornaremos
    for (let i = 0; i < getAppointments.length; i++) {
        const e = getAppointments[i];
        // para asegurar que es un turno valido, aseguramos que cuente
        // con el atributo "place"
        if (e.data.place) {
            apparr.push(e)
        } else {
            // caso contrario lo borramos
            clean(e.id)
        }
    }
    // retornamos un array fresco con datos correctos
    return apparr
}


// metodo auxiliar para borrar turnos que no sean correctos
async function clean(appointment) {
    await db.collection('app1').doc(appointment).delete()
}

// metodo auxiliar para asignar un turno
async function giveAppointment(appID, runnerID, day) {
    await db.collection(day).doc(appID).update({ status: 'given', runner: runnerID })
}

// metodo auxiliar para restablecer un turno tomado a disponible
async function resetAppointment(appID, day) {
    await db.collection(day).doc(appID).update({ status: 'available', runner: 'x' })
}



//! esto lo hacemos para tener un registro de errores
//guardando logs
var fs = require('fs'); // usamos la libreria fs y util
var util = require('util');


// creamos un archivo que guardara los errores
var log_file_err = fs.createWriteStream('./logs/error.log', { flags: 'a' });

// si hay Excepciones Desconocidas las guardamos
process.on('uncaughtException', function(err) {
    console.log('Caught exception: ' + err);
    log_file_err.write(util.format('Caught exception: ' + err) + '\n');
});

// si hay registro con errores de Referencia las guardamos
process.on('ReferenceError', function(err) {
    console.log('Reference Error: ' + err);
    log_file_err.write(util.format('Caught exception: ' + err) + '\n');
});

// fin guardando logs


//! MAILER, mover a controlador o archivo auxiliar?
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


/* GET home page. */
// ruta inicial, es asyncrona por que recoge datos de la base de datos
router.get('/', async function(req, res, next) {
    const request = await db.collection('runners2').get();
    const { docs } = request;
    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
    var runnersLenght = runners.length;
    res.render('index', { title: 'Mari Menuco Run', runners, runnersLenght });
});


/* GET PAGINA DE TURNOS. RENDERIZA 'appointments' y pasa array con turnos para los 3 dias  */
router.get('/turnos', async(req, res) => {
    // obtenemos turnos disponibles desde la bd
    const app1 = await getAppointments('app1')
    const app2 = await getAppointments('app2')
    const app3 = await getAppointments('app3')

    //definimos y completamos un array por cada uno de los dias de turnos
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
    //obtenemos los corredores desde la bd 
    const requestRunners = await db.collection('runners2').get();
    const { docs } = requestRunners;
    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));

    // variable que contendra los usuarios que estan aprobados
    let approvedRunnersArray = []

    // comprobamos si los mismos son usuarios que ya han pagado
    for (let i = 0; i < runners.length; i++) {
        const e = runners[i];

        if (e.data.status == 'approved') {
            approvedRunnersArray.push(e)
            lenght++
        }

    }

    // ordenando turnos por fecha/hora
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

    // renderizamos la pagina, y pasamos los array, junto a otro array con la lista de usuarios aprobados
    res.render('appointments', { appointments1, appointments2, appointments3, approvedRunnersArray })
})

/* GET RUTA PARA ENCONTRAR USUARIO CON TURNO ASIGNADO. */
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


/* GET RUTA RENDERIZA LOS RESULTADOS DE LA CARRERA. renderiza 'positions' */
router.get('/results', async(req, res) => {
    // obtenemos los resultados desde la bd
    var request = await db.collection('results_final').get();
    const { docs } = request
    var results = docs.map(result => ({ id: result.id, data: result.data() }));

    // los ordenamos por tiempo bruto
    results.sort((a, b) => {
        let fa = a.data.tiempo_bruto;
        let fb = b.data.tiempo_bruto;
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })

    // renderizamos posiciones
    res.render('positions', { results })


})


/* POST RUTA QUE SE USA PARA CONFIRMAR TURNOS */
router.post('/turnos/confirm', async(req, res) => {
    // obtenemos los datos desde el body de la peticion
    const { appID, userID, age, dob, email, day, rApp } = req.query

    // usando el id del corredor, lo buscamos en la db
    var doc = await db.collection('runners2').doc(userID).get()

    // creamos variables con los datos obtenidos
    var _age = doc._fieldsProto.runnerAge.stringValue
    var _email = doc._fieldsProto.email.stringValue
    var _dob = doc._fieldsProto.runnerBirthDate.stringValue


    // corroboramos que el usuario no tiene un turno ya asignado
    if (rApp !== '') {
        // obtenemos todos los turnos de la base de datos
        const app1 = await getAppointments('app1')
        const app2 = await getAppointments('app2')
        const app3 = await getAppointments('app3')

        //usamos arrays para almacenar los turnos con la fecha parseada
        var appointments1 = []
        for (let i = 0; i < app1.length; i++) {
            const e = app1[i];
            var f = e;
            // quitamos los segundos, no los necesitamos
            f.data.time = e.data.time.slice(0, -3);
            appointments1.push(f);
        }

        var appointments2 = []
        for (let i = 0; i < app2.length; i++) {
            const e = app2[i];
            var f = e;
            // quitamos los segundos, no los necesitamos
            f.data.time = e.data.time.slice(0, -3);
            appointments2.push(f);
        }

        var appointments3 = []
        for (let i = 0; i < app3.length; i++) {
            const e = app3[i];
            var f = e;
            // quitamos los segundos, no los necesitamos
            f.data.time = e.data.time.slice(0, -3);
            appointments3.push(f);
        }

        // unimos todos los turnos en un solo array
        appointments1.concat(appointments2)
        appointments1.concat(appointments3)

        // iteramos para verificar si ya tiene un turno asignado
        // recordemos que los usuarios contienen el uid de usuario
        // por eso usamos eso en la comprobacion
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

            // si ya tiene un turno, y quiere otro, restablecemos el primero a disponible
            if (rApp === e.data.runner) {
                // cambiamos el estado del turno de available a available
                db.collection(dayR).doc(e.id).update({ runner: 'x', status: 'available' })
                break
            }


        }

    }

    // si el email de ese usuario estaba sin completar enla BD lo actualizamos con los datos que obtenemos
    if (_email === '-') {

        await db.collection('runners2').doc(userID).update({ email: email });
    }

    // si la edad de ese usuario estaba sin completar enla BD lo actualizamos con los datos que obtenemos
    if (_age === '-') {
        console.log('reemplazar age');
        await db.collection('runners2').doc(userID).update({ runnerAge: age });
    }

    // si la fecha de nacimiento de ese usuario estaba sin completar enla BD lo actualizamos con los datos que obtenemos
    if (_dob === '-') {
        console.log('reemplazar dob');
        await db.collection('runners2').doc(userID).update({ runnerBirthDate: dob });
    }

    // una vez completada esa informacion, pasamos a asignar el turno

    // creamos un campo en la base de datos para el turno y lo fusionamos con los datos existentes
    await db.collection('runners2').doc(userID).set({ apppointment: appID }, { merge: true })
        .then(async() => {
            //hacemos lo propio en el objeto turno de la BD
            var appDoc = await db.collection(day).doc(appID).get();
            await giveAppointment(appID, userID, day)
                .then(async() => {
                    // mandamos confirmacion por mail
                    await sendAppConfirmation(email, appDoc._fieldsProto)
                        // devolvemos un 200
                }).then(() => {
                    res.sendStatus(200)
                });

        })


})

/* GET PARA RENDERIZAR EL LOGIN QUE DA ACCESO AL PANEL DE ADMINISTRADOR */
router.get('/login', (req, res) => {
    res.render('login')
})

/* POST RUTA QUE VERIFICA LOS DATOS DEL LOGIN Y RENDERIZA EL PANEL DE CONTROL */
router.post('/check-mail', async(req, res) => {

    // obtenemos los datos del body
    let { mail, password } = req.body

    // si el mail y la contrasena son correctos
    if (mail === process.env.MAILSECURE) {
        if (password === process.env.PASSWORDSECURE) {

            // obtenemos los usuarios 
            const request = await db.collection('runnersTest').get();
            let arr = [];

            // y los turnos y los ordenamos
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

                    // ordenamos los usuarios
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

                    // renderizamos y pasamos todo
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

/* GET QUE RENDERIZA LA PAGINA CON LAS DISTANCIAS */
router.get('/distances', (req, res, next) => {
    res.render('distances');
})

/* POST QUE PROCESA EL PAGO USA MERCADO PAGO */
router.post("/process_payment", (req, res) => {
    // Obtiene los datos del body
    const { body } = req;
    const { payer } = body;
    const runnerDBI = body.runnerDBI;
    const runnerEmail2 = body.runnerEmail;
    const runnerNam3 = body.runnerNam3;
    const runnerDistance = body.runnerDistance;
    const runnerNumber = body.strRunnerNbr;


    // creamos el objeto payment_data que pasaremos usando SDK de Mercado Pago
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

    // guardamos el pago en mercado pago, pasamo el objeto payment data
    mercadopago.payment.save(paymentData)
        .then(function(response) {
            const { response: data } = response;

            var paymentData = {
                status: data.status,
                status_detail: data.status_detail,
                id: data.id
            }
            db.collection('runners2').doc(runnerDBI).update(paymentData)

            if (data.status == 'approved') { // Si el pago es aprobado...
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

// funcion auxiliar para validar los errores de mercado pago
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
// renderiza pagina de pago
router.post('/add-runner', async function(req, res) {
    // obtenemos los datos del corredor del body 
    const { body } = req;

    // los desestructuramos
    const { cat, runnerName, ageSelect, partner_id, runnerEmail, description, runnerID, genre, birth, tShirtSize } = body;

    // solicitamos todos los usuarios en la db
    const request = await db.collection('runners2').get();
    const { docs } = request;

    // los almacenamos en un array
    const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));

    // obtenemos el numero del ultimo corredor
    let runnerNbrs = [];

    for (let i = 0; i < runners.length; i++) {
        const e = runners[i];
        runnerNbrs.push(Number(e.data.runnerUID));
    }

    // y definimos el siguiente numero de usuario
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

    // el monto a abonar va a depender de la distancia
    let transaction_amount = null

    // por lo que hacemos un switch que nos dira cual precio es el correcto
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

    // actualizamos ese monto en los datos de pago
    let payment_data = {
        amount: transaction_amount,
    };


    // creamos el objeto newRunner con toda la informacion que recolectamos
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

    // pasamos el monto a pagar a numero
    var _transaction_amount = Number(transaction_amount).toFixed(2).toString()


    var runnerDBI;
    // grabamos datos en firebase
    await db.collection('runners2').add(newRunner).then((doc) => {
        runnerDBI = doc.id
    }).then(() => {

        // rendirizamos la pagina de pago, pasamos todos los datos a mostrar
        res.render('payment_page', { strRunnerNbr, runnerEmail, cat, ageSelect, _transaction_amount, description, runnerName, runnerDBI, genre, birth }); // para dirigirnos nuevamente a '/'
    })



})

/*GET DELETE RUNNER*/
router.get('/borrar/:id', (req, res) => {
    let id = req.params.id;
    db.collection('runners').doc(id).delete().then(async() => {
        const request = await db.collection('runners2').get();
        const { docs } = request;
        const runners = docs.map(runner => ({ id: runner.id, data: runner.data() }));
        res.render('dashboard', { title: 'Panel de Control', runners });
    });
})

/*GET RUNNER*/
router.get('/runner/:id', async(req, res) => {
    let id = req.params.id;
    const request = await db.collection('runners2').doc(id).get();
    const runner = { id: id, data: request.data() }


    res.render('runner', { runner })
})


// email a enviar si el turno se confirma
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

// email a enviar confirmacion de pago
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