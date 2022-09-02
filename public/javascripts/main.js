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
var amountP = document.getElementById('transactionP')

// MODAL TALLES

const openEls = document.querySelectorAll("[data-open]");
var isVisible = "is-visible";
 
for(const el of openEls) {
  el.addEventListener("click", function() {
    const modalId = this.dataset.open;
    document.getElementById(modalId).classList.add(isVisible);
  });
}

const closeEls = document.querySelectorAll("[data-close]");

 
for (const el of closeEls) {
  el.addEventListener("click", function() {
    this.parentElement.parentElement.parentElement.classList.remove(isVisible);
  });
}


document.addEventListener("click", e => {
  if (e.target == document.querySelector(".modal.is-visible")) {
    document.querySelector(".modal.is-visible").classList.remove(isVisible);
  }
});

//* MODAL TALLES *//


// GET PRICES

async function getAmount(_cat) {
    switch (_cat) {
        case 'Kids':
            amount.value = '1000';
            amountP.textContent = '1000';
            break
        case '5k':
            amount.value = '4700';
            amountP.textContent = '4700';
            break
        case '10k':
            amount.value = '5300';
            amountP.textContent = '5300';
            break
        case '21k':
            amount.value = '5800';
            amountP.textContent = '5800';
            break
    }
}

cat.addEventListener('change', () => {
    getAmount(cat.value)
})

//* GET PRICES */

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
var tsize = document.getElementById('t-size');
var rCat = document.getElementById('categoriesSelect');
var rUID = document.getElementById('runnerUID');
var rPrice = document.getElementById('transactionAmount');
var rAge = document.getElementById('ageSelect').value;
var club_id = document.getElementById('partner-id');
var genre = document.getElementById('genre');
var birth = document.getElementById('birth');





nextBtnFirst.addEventListener("click", async () => {
    var originalPrice = amount.value;
    if(rName.value === ''){
        alert('Campo Nombre es obligatorio')
    }
    else {
        if(club_id.value === ''){
            club_id.value = 0;
        }
        
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
                    if(rCat.value == ''){
                        alert('Debes Elegir una Distancia!')
                    } else {
                        var validEmail = validateEmail(rEmail.value)
                        if (validEmail) {
                            var partnerName = 'No';
                            var discount = 0;
                            
                            var partners = await readPartnersJson()


                            
                                partners.map(partner => {
                                    if(partner.socio == club_id.value) {
                                        partnerName = 'SI'
                                        rPrice.value = originalPrice
                                        discount = Number(rPrice.value)*0.1
                                        originalPrice = `${(rPrice.value).toString()}`;
                                        rPrice.value = (Number(rPrice.value)*0.9).toString();   
                                    }
                                })

                            document.getElementById('cat').value = rCat.value;
                            document.getElementById('partnerID').value = partnerName.toString();
                            document.getElementById('runnerName').value = rName.value;
                            document.getElementById('runnerID').value = rId.value.toUpperCase();
                            document.getElementById('tsize').value = tsize.value;
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
    await fetch('/javascripts/docs/socios3.json').then(
        response => {
            return response.json();
        }
    ).then(jsondata => {
        list = jsondata
    })
    return list
}

prevBtnSec.addEventListener("click", function(event) {
    event.preventDefault();
    rCat.value = ''; 
    document.getElementById('partnerID').value = ''; 
    slidePage.style.marginLeft = "0%";
    bullet[current - 2].classList.remove("active");
    progressCheck[current - 2].classList.remove("active");
    progressText[current - 2].classList.remove("active");
    current -= 1;
});

// ## Crear Categorias ##
var categories = ['', 'Kids', '5k', '10k', '21k'] // listamos las categorias
var select = document.getElementById('categoriesSelect') // identificamos el elemento select del html


// corremos un bucle para todos los items de la lista y los agregamos al select
for (let i = 0; i < categories.length; i++) {
    const e = categories[i];
    var el = document.createElement('option'); // creamos un elemento option
    el.textContent = e; // el contenido del texto sera el texto del item
    el.value = e; // los valores seran los mismos que el texto
    select.appendChild(el) // se los anexamos al select
}

// ## Crear edades ##
var ages = []; // creamos una lista de edades
var ageCounter = 4;
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

