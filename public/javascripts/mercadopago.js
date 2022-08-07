const mp = new MercadoPago('TEST-6a941031-1068-447c-a42f-fef05ae965a3');

const cat = document.getElementById('categoriesSelect') // categoria
const catValue = cat.value // valor
var amount = document.getElementById('transactionAmount') // precio



async function getAmount(_cat) {
    switch (_cat) {
        case 'Kids':
            amount.value = '1000';
            break
        case '5k':
            amount.value = '2000';
            break
        case '10k':
            amount.value = '15000';
            break
        case '21k':
            amount.value = '17000';
            break
    }
}

cat.addEventListener('change', () => {
    getAmount(cat.value)
})

let hBtn = document.getElementById('home_btn')

hBtn.addEventListener('click', async() => {
    await getAmount().then(() => {
        savePayment(amount.value);
    })
})


const cardNumberElement = mp.fields.create('cardNumber', {
    placeholder: "Número de la tarjeta"
}).mount('form-checkout__cardNumber');
const expirationDateElement = mp.fields.create('expirationDate', {
    placeholder: "MM/AA",
}).mount('form-checkout__expirationDate');
const securityCodeElement = mp.fields.create('securityCode', {
    placeholder: "Cód. Seguridad"
}).mount('form-checkout__securityCode');

function savePayment(_amount) {
    const cardForm = mp.cardForm({
        amount: _amount,
        form: {
            id: "form-checkout",
            cardNumber: {
                id: "form-checkout__cardNumber",
                placeholder: "Numero de tarjeta",
            },
            expirationDate: {
                id: "form-checkout__expirationDate",
                placeholder: "MM/AA",
            },
            securityCode: {
                id: "form-checkout__securityCode",
                placeholder: "Cód. Seguridad",
            },
            cardholderName: {
                id: "form-checkout__cardholderName",
                placeholder: "Titular de la tarjeta",
            },
            issuer: {
                id: "form-checkout__issuer",
                placeholder: "Emisor",
            },
            installments: {
                id: "form-checkout__installments",
                placeholder: "Cuotas",
            },
            identificationType: {
                id: "form-checkout__identificationType",
                placeholder: "Tipo de documento",
            },
            identificationNumber: {
                id: "form-checkout__identificationNumber",
                placeholder: "Número del documento",
            },
            cardholderEmail: {
                id: "form-checkout__cardholderEmail",
                placeholder: "E-mail",
            },
        },
        callbacks: {
            onFormMounted: error => {
                if (error) return console.warn("Form Mounted handling error: ", error);
                console.log("Form mounted");
            },
            onSubmit: (event) => {
                event.preventDefault();

                const {
                    paymentMethodId: payment_method_id,
                    issuerId: issuer_id,
                    cardholderEmail: email,
                    amount,
                    token,
                    installments,
                    identificationNumber,
                    identificationType,
                } = cardForm.getCardFormData();

                fetch("/process_payment", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        issuer_id,
                        payment_method_id,
                        transaction_amount: Number(amount),
                        installments: Number(installments),
                        description: "Descripción del producto",
                        payer: {
                            email,
                            identification: {
                                type: identificationType,
                                number: identificationNumber,
                            },
                        },
                    }),
                }).then((response, event) => {
                    event.preventDefault()
                    console.log(response);
                }).then(
                    (result, event) => {
                        event.preventDefault();
                        if (!result.hasOwnProperty('error_message')) {
                            document.getElementById("payment-status").innerText = result.status;
                        }
                    }
                )
                console.log(response.json());
                event.preventDefault();
                return response.json()

            },
            onFetching: (resource) => {
                console.log("Fetching resource: ", resource);
                return () => {

                };
            }
        },
    });
}
console.log('funciono');