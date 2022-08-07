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

// ## EFECTO NAVBAR ON SCROLL ##

window.addEventListener("scroll", function() {
    var header = this.document.querySelector('header');
    header.classList.toggle("sticky", this.window.scrollY > 0);
});

// ## USAR DATOS DE CORREDOR EN DATOS DE PAGO
var rName = document.getElementById('r-name');
var rId = document.getElementById('r-id');
var rEmail = document.getElementById('r-email');
var sameInfoBtn = document.getElementById('same-info');
var cHolderName = document.getElementById('form-checkout__cardholderName');
var cHolderIdNumber = document.getElementById('form-checkout__identificationNumber');
var cHolderEmail = document.getElementById('form-checkout__cardholderEmail');

sameInfoBtn.addEventListener("click", function(event) {
    event.preventDefault();
    cHolderName.value = rName.value
    cHolderIdNumber.value = rId.value
    cHolderEmail.value = rEmail.value
})

// ## VALIDAR EMAIL
function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    return (false)
}


// ## slide page form
const slidePage = document.querySelector(".slide-page");
const nextBtnFirst = document.querySelector(".firstNext");
const prevBtnSec = document.querySelector(".prev-1");
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
let current = 1;

nextBtnFirst.addEventListener("click", function(event) {
    event.preventDefault();
    var validEmail = validateEmail(rEmail.value)
    if (validEmail) {
        slidePage.style.marginLeft = "-100%";
        progressBar[current - 1].classList.add("active");
        bullet[current - 1].classList.add("active");
        progressCheck[current - 1].classList.add("active");
        progressText[current - 1].classList.add("active");
        current += 1;
    } else {
        alert('El email es invalido!!')
    }
});
nextBtnSec.addEventListener("click", function(event) {
    event.preventDefault();
    slidePage.style.marginLeft = "-200%";
    progressBar[current - 1].classList.add("active");
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1;
});

submitBtn.addEventListener("click", function() {
    bullet[current - 1].classList.add("active");
    progressCheck[current - 1].classList.add("active");
    progressText[current - 1].classList.add("active");
    current += 1;
    setTimeout(function() {
        alert("Your Form Successfully Signed up");
        location.reload();
    }, 800);
});

prevBtnSec.addEventListener("click", function(event) {
    event.preventDefault();
    slidePage.style.marginLeft = "0%";
    bullet[current - 2].classList.remove("active");
    progressCheck[current - 2].classList.remove("active");
    progressText[current - 2].classList.remove("active");
    current -= 1;
});
prevBtnThird.addEventListener("click", function(event) {
    event.preventDefault();
    slidePage.style.marginLeft = "-100%";
    bullet[current - 2].classList.remove("active");
    progressCheck[current - 2].classList.remove("active");
    progressText[current - 2].classList.remove("active");
    current -= 1;
});





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