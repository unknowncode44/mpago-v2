// ## DETECTAR EL TAMANO DE SCREEN

var windowHeight = screen.height
var windowWidth = screen.width

console.log(`W: ${windowWidth} : H: ${windowHeight}`);

function gdc(a, b) {
    return (b == 0) ? a : gdc(b, a % b)
}
var r = gdc(windowWidth, windowHeight)
var aspectRatio = `Aspect Ratio: ${(windowWidth/windowHeight).toFixed()}:${windowHeight/r}`
console.log(aspectRatio);


// ## DROPDOWN MENU ##
let mButton = document.getElementById('m-button')
let menu = document.getElementById('mmenu')
let menuItem = document.getElementById('menu-item-1')

mButton.addEventListener('click', () => {
    if (!menu.classList.contains('m-active')) {
        menu.classList.add('m-active')
    } else {
        menu.classList.remove('m-active')
    }
})

menuItem.addEventListener('click', () => {
    if (menu.classList.contains('m-active')) {
        menu.classList.remove('m-active')
    }
})


// ## EFECTO NAVBAR ON SCROLL ##

window.addEventListener("scroll", function() {
    var header = this.document.querySelector('header');
    header.classList.toggle("sticky", this.window.scrollY > 50);
    menu.classList.remove('m-active')
});

// ## USAR DATOS DE CORREDOR EN DATOS DE PAGO
// var rName = document.getElementById('r-name');
// var rId = document.getElementById('r-id');
// var rEmail = document.getElementById('r-email');


// var sameInfoBtn = document.getElementById('same-info');
// var cHolderName = document.getElementById('form-checkout__cardholderName');
// var cHolderIdNumber = document.getElementById('form-checkout__identificationNumber');
// var cHolderEmail = document.getElementById('form-checkout__cardholderEmail');

// sameInfoBtn.addEventListener("click", function(event) {
//     event.preventDefault();
//     cHolderName.value = rName.value
//     cHolderIdNumber.value = rId.value
//     cHolderEmail.value = rEmail.value
// })

// ## VALIDAR EMAIL
function validateEmail(mail) {
    let val = mail.replace(/\s/g, "")
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(val)) {
        return (true)
    }
    return (false)
}

const cat = document.getElementById('categoriesSelect') // categoria
const catValue = cat.value // valor
var amount = document.getElementById('transactionAmount') // precio





async function getAmount(_cat) {
    switch (_cat) {
        case 'Kids':
            amount.value = Number('1000').toFixed(2).toString();
            break
        case '5k':
            amount.value = Number('4700').toFixed(2).toString();
            break
        case '10k':
            amount.value = Number('5300').toFixed(2).toString();
            break
        case '21k':
            amount.value = Number('5800').toFixed(2).toString();
            break
    }
}

cat.addEventListener('change', () => {
    getAmount(cat.value)
})


// function fillRunnerData() {
//     // let rName = document.getElementById('r-name').value;
//     let rEmail = document.getElementById('r-email').value;
//     let rId = document.getElementById('r-id').value;
//     let rCat = document.getElementById('categoriesSelect').value;
//     let rUID = document.getElementById('runnerUID').value;
//     let rPrice = document.getElementById('transactionAmount').value;
//     let rAge = document.getElementById('ageSelect').value;
//     let club_id = document.getElementById('partner-id').value;

//     // console.log(`##### ${rName}`);

//     document.getElementsByName('cat').value = rCat;
//     document.getElementsByName('runnerName').value = rName;
//     document.getElementsByName('runnerID').value = rCat;
//     document.getElementsByName('price').value = rPrice;
//     document.getElementsByName('platform_cost').value = (Number(rPrice) * 0.01).toString();
//     document.getElementsByName('total_cost').value = ((Number(rPrice) * 0.01) + Number(rPrice)).toString();
//     document.getElementsByName('subtotal').value = ((Number(rPrice) * 0.01) + Number(rPrice)).toString();

// }


// ## slide page form
const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.getElementById('home_btn');
const prevBtnSec = document.querySelector(".prev-2");
const nextBtnSec = document.querySelector(".next-1");
const prevBtnThird = document.querySelector(".prev-2");
const nextBtnThird = document.querySelector(".next-2");
const prevBtnFourth = document.querySelector(".prev-3");
const submitBtn = document.querySelector(".submit");
const progressText = document.querySelectorAll(".step p");
const progressBar = document.querySelectorAll(".step");
const progressBar2 = document.querySelectorAll("step2");
const progressBar3 = document.querySelectorAll(".step3");
const progressCheck = document.querySelectorAll(".step .check");
const bullet = document.querySelectorAll(".step .bullet");
var current = 1;
var rName = document.getElementById('r-name');
var rEmail = document.getElementById('r-email')
var rId = document.getElementById('r-id');
var rCat = document.getElementById('categoriesSelect');
var rUID = document.getElementById('runnerUID');
var rPrice = document.getElementById('transactionAmount');
var rAge = document.getElementById('ageSelect').value;
var club_id = document.getElementById('partner-id');
var genre = document.getElementById('genre');
var birth = document.getElementById('birth');


var originalPrice = amount.value;


nextBtnFirst.addEventListener("click", async () => {
    if(rName.value === ''){
        alert('Campo Nombre es obligatorio')
    }
    else {
        if(club_id.value === ''){
            alert('Campo Numero de Socio es obligatorio')
        }
        else {
            if(rEmail.value === ''){
                alert('Campo Email es obligatorio')
            }
            else {
                if (birth.value == '') {
                    alert('Fecha de nacimiento es obligatoria!')
                } else {
                    if (genre.value == '') {
                        alert('Debes indicar un genero!')
                    } else {
                        if(rCat.value == 'Kids' && Number(rAge.value) > 12){
                            alert('Categoria Kids es hasta 12 años')
                        } else {
                            var validEmail = validateEmail(rEmail.value)
                            if (validEmail) {
                                var partnerName = '';
                                var discount = 0;
                                
                                var partners = await readPartnersJson()
                                
                                    partners.map(partner => {
                                        if(partner.socio == club_id.value) {
                                            partnerName = 'SI'
                                            document.getElementById('partnerID').value = partnerName.toString();
                                            discount = Number(rPrice.value)*0.2
                                            originalPrice = `${(rPrice.value).toString()}.00`;
                                            rPrice.value = (Number(rPrice.value)*0.8).toString();
                                            
                                        }
                                        else {
                                            document.getElementById('partnerID').value = 'NO'; 
                                        }
                                        
                                    })
                                document.getElementById('cat').value = rCat.value;
                                document.getElementById('runnerName').value = rName.value;
                                document.getElementById('runnerID').value = rId.value;
                                document.getElementById('price').value = originalPrice;
                                document.getElementById('platform_cost').value = `-${(discount.toFixed(2)).toString()}`;
                                document.getElementById('total_cost').value = ` ${(Number(rPrice.value).toFixed(2)).toString()}`;
                    
                    
                    
                                slidePage.style.marginLeft = "-100%";
                                progressBar[current - 1].classList.add("active");
                                bullet[current - 1].classList.add("active");
                                progressCheck[current - 1].classList.add("active");
                                progressText[current - 1].classList.add("active");
                                current += 1;
                    
                            } else {
                                alert('El email es invalido!!')
                            }
                        }
                    }
                }
            } 
            
        }
    }
});
const url = '/add-runner'
const newRunner = {
    cat: document.getElementById('cat').value,
    runnerName: document.getElementById('runnerName').value,
    runnerID: document.getElementById('runnerID').value,
    price: document.getElementById('price').value,
    platform_cost: document.getElementById('platform_cost').value,
    total_cost: document.getElementById('total_cost').value,
}
const params = {
    body: newRunner,
    method: "POST"

};


async function readPartnersJson(){
    var list = [] 
    await fetch('/javascripts/docs/socios2.json').then(
        response => {
            return response.json();
        }
    ).then(jsondata => {
        list = jsondata
    })
    return list
}



// submitBtn.addEventListener('click',
//     (event) => {
//         event.preventDefault();
//         fetch(url, params)
//     })



// nextBtnSec.addEventListener("click", () => {

//     let price = '10'
//     let cat = '21k'
//     fetch('/pmt', {
//         method: "get",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             price: price,
//             cat: cat
//         })
//     });
//     // slidePage.style.marginLeft = "-200%";
//     // progressBar[current - 1].classList.add("active");
//     // bullet[current - 1].classList.add("active");
//     // progressCheck[current - 1].classList.add("active");
//     // progressText[current - 1].classList.add("active");
//     // current += 1;
// });

// submitBtn.addEventListener("click", function() {
//     bullet[current - 1].classList.add("active");
//     progressCheck[current - 1].classList.add("active");
//     progressText[current - 1].classList.add("active");
//     current += 1;
//     // setTimeout(function() {
//     //     alert("Your Form Successfully Signed up");
//     //     location.reload();
//     // }, 800);
// });

prevBtnSec.addEventListener("click", function(event) {
    event.preventDefault();
    rPrice.value = originalPrice;
    document.getElementById('partnerID').value = ''; 
    slidePage.style.marginLeft = "0%";
    bullet[current - 2].classList.remove("active");
    progressCheck[current - 2].classList.remove("active");
    progressText[current - 2].classList.remove("active");
    current -= 1;
});
// prevBtnThird.addEventListener("click", function(event) {
//     event.preventDefault();
//     slidePage.style.marginLeft = "-100%";
//     bullet[current - 2].classList.remove("active");
//     progressCheck[current - 2].classList.remove("active");
//     progressText[current - 2].classList.remove("active");
//     current -= 1;
// });





// ## Crear Categorias ##
var categories = ['Kids', '5k', '10k', '21k'] // listamos las categorias
var select = document.getElementById('categoriesSelect') // identificamos el elemento select del html


// corremos un bucle para todos los items de la lista y los agregamos al select
for (let i = 0; i < categories.length; i++) {
    const e = categories[i];
    var el = document.createElement('option'); // creamos un elemento option
    el.textContent = e; // el contenido del texto sera el texto del item
    el.value = e; // los valores seran los mismos que el texto
    select.appendChild(el) // se los anexamos al select
}

// // ## Crear Tipos de DNI ##
// var idTypes = ['DNI', 'LE', 'Pasaporte', 'Otro'] // listamos los tipos
// var idTypeSelect = document.getElementById('form-checkout__identificationType') // identificamos el elemento select del html

// // corremos un bucle para todos los items de la lista y los agregamos al select
// for (let i = 0; i < idTypes.length; i++) {
//     const e = idTypes[i];
//     var el = document.createElement('option'); // creamos un elemento option
//     el.textContent = e; // el contenido del texto sera el texto del item
//     el.value = e; // los valores seran los mismos que el texto
//     idTypeSelect.appendChild(el) // se los anexamos al select
// }


// ## Crear edades ##
var ages = []; // creamos una lista de edades
var ageCounter = 7;
while (ageCounter <= 90) {
    ages.push(ageCounter.toString())
    ageCounter++
}
var agesSelect = document.getElementById('ageSelect') // identificamos el elemento select del html


// corremos un bucle para todos los items de la lista y los agregamos al select
for (let i = 0; i < ages.length; i++) {
    const e = ages[i];
    var el = document.createElement('option'); // creamos un elemento option
    el.textContent = e; // el contenido del texto sera el texto del item
    el.value = e; // los valores seran los mismos que el texto
    agesSelect.appendChild(el) // se los anexamos al select
}

// const cat = document.getElementById('categoriesSelect') // categoria
// const catValue = cat.value // valor
// var amount = document.getElementById('transactionAmount') // precio





// async function getAmount(_cat) {
//     switch (_cat) {
//         case 'Kids':
//             amount.value = '10';
//             break
//         case '5k':
//             amount.value = '12';
//             break
//         case '10k':
//             amount.value = '15';
//             break
//         case '21k':
//             amount.value = '17';
//             break
//     }
// }

// cat.addEventListener('change', () => {
//     getAmount(cat.value)
// })


// function fillRunnerData() {
//     let rName = document.getElementById('r-name').value;
//     let rEmail = document.getElementById('r-email').value;
//     let rId = document.getElementById('r-id').value;
//     let rCat = document.getElementById('categoriesSelect').value;
//     let rUID = document.getElementById('runnerUID').value;
//     let rPrice = document.getElementById('transactionAmount').value;
//     let rAge = document.getElementById('ageSelect').value;
//     let club_id = document.getElementById('partner-id').value;

//     console.log(`##### ${rName}`);

//     document.getElementsByName('cat').value = rCat;
//     document.getElementsByName('runnerName').value = rName;
//     document.getElementsByName('runnerID').value = rCat;
//     document.getElementsByName('price').value = rPrice;
//     document.getElementsByName('platform_cost').value = (Number(rPrice) * 0.01).toString();
//     document.getElementsByName('total_cost').value = ((Number(rPrice) * 0.01) + Number(rPrice)).toString();
//     document.getElementsByName('subtotal').value = ((Number(rPrice) * 0.01) + Number(rPrice)).toString();

// }












// ## Crear meses para CC
// var months = [];
// var monthCounter = 1;
// while (monthCounter <= 12) {
//     if (monthCounter > 9) {
//         months.push(monthCounter.toString())
//     } else {
//         let mstr = `0${monthCounter}`;
//         months.push(mstr)
//     }
//     monthCounter++
// }
// var ccMonthSelect = document.getElementById('form-checkout__cardExpirationMonth')
// corremos un bucle para todos los items de la lista y los agregamos al select
// for (let i = 0; i < months.length; i++) {
//     const e = months[i];
//     var el = document.createElement('option'); // creamos un elemento option
//     el.textContent = e; // el contenido del texto sera el texto del item
//     el.value = e; // los valores seran los mismos que el texto
//     ccMonthSelect.appendChild(el) // se los anexamos al select
// }

// ## Crear years para CC
// var ccYears = [];
// var yearCounter = 22;
// while (yearCounter <= 42) {
//     ccYears.push(yearCounter.toString())
//     yearCounter++
// }
// var ccYearSelect = document.getElementById('form-checkout__cardExpirationYear')
//     // corremos un bucle para todos los items de la lista y los agregamos al select
// for (let i = 0; i < ccYears.length; i++) {
//     const e = ccYears[i];
//     var el = document.createElement('option'); // creamos un elemento option
//     el.textContent = e; // el contenido del texto sera el texto del item
//     el.value = e; // los valores seran los mismos que el texto
//     ccYearSelect.appendChild(el) // se los anexamos al select
// }