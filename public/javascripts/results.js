var results = document.getElementById('results_array').textContent;
const tableBody = document.getElementById('table_body');
const uidInput = document.getElementById('res_uid');
const uidInputR = document.getElementById('res_uid_r');
const nameInput = document.getElementById('res_name');
const nameInputR = document.getElementById('res_name_r');
const circuitSelect = document.getElementById('res_cat');
const circuitSelectR = document.getElementById('res_catR');
const sortSelect = document.getElementById('sort_by');
const rfilterresp = document.getElementById('rfilter_resp');
const seeFilters = document.getElementById('seeFilters')
var collapsed = false;
var parsedResults = JSON.parse(results)


//responsive logic
var toAdd = document.createDocumentFragment();
const respUl = document.getElementById('ul_results_table_resp');
var oldLiSelection = ''
var oldLiSecSelection = ''

function showData(i) {
    let liE = document.getElementById(`item${i}`)
    let liSec = document.getElementById(`secondary${i}`)
    var oldSic = document.getElementById(oldLiSelection);
    var oldSic2 = document.getElementById(oldLiSecSelection);
    if (liE.classList.contains('active')) {
        liE.classList.remove('active')
        liSec.classList.remove('active')
    } else {
        liE.classList.add('active')
        liSec.classList.add('active')
    }

    if (oldLiSelection === '') {
        oldLiSelection = `item${i}`;
        oldLiSecSelection = `secondary${i}`;
    } else {
        oldSic.classList.remove('active');
        oldSic2.classList.remove('active');
    }



}

function loadUlData(items) {
    respUl.innerHTML = '';
    for (let i = 0; i < items.length; i++) {
        const e = items[i];
        var liItem = document.createElement('li')
        liItem.id = 'item' + i;
        liItem.innerHTML = `<div class="list-item"> 
            <div class="main-data"> 
                <p><strong>${e.data.dorsal}</strong></p> 
                <p>
                    ${e.data.corredor}
                </p>
                <p>
                    ${e.data.general}
                </p>
                <p onclick="showData(${i})">
                    <ion-icon name="eye"></ion-icon>
                </p>
            </div>
    
            <div id="secondary${i}" class="secondary-data">
                <p><strong>Categoria: </strong><span>${e.data.categoria}<span></p>
                <p><strong>Gral. Sexo: </strong><span>${e.data.gral_sexo}<span></p>
                <p><strong>Tiempo Bruto: </strong><span>${e.data.tiempo_bruto}<span></p>
                <p><strong>Posicion Categ: </strong><span>${e.data.pos_categ}<span></p>
                <p><strong>Posicion Gral: </strong><span>${e.data.pos_general}<span></p>
                <p><strong>Posicion Sexo: </strong><span>${e.data.pos_gral_sexo}<span></p>
                <p><strong>Tiempo Neto: </strong><span>${e.data.tm_neto}<span></p>
            </div>
        </div>`
        respUl.appendChild(liItem)
    }
}

const empty = [{
    id: '',
    data: {
        "dorsal": 'No hay resultados!',
        "corredor": "",
        "general": "",
        "gral_sexo": "",
        "categoria": "",
        "tiempo_bruto": "",
        "pos_categ": '',
        "pos_general": '',
        "pos_gral_sexo": ''
    }
}]

// init sort by time

parsedResults.sort((a, b) => {
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

// change name of category

parsedResults.forEach(item => {
    switch (item.data.categoria) {
        case "master a1":
            item.data.categoria = "21K"
            break;
        case "master a2":
            item.data.categoria = "21k"
            break;
        case "master b1":
            item.data.categoria = "10K"
            break;
        case "master b2":
            item.data.categoria = "10K"
            break;
        case "master c1":
            item.data.categoria = "5K"
            break;
        case "master c2":
            item.data.categoria = "5K"
            break;
        case "elite":
            item.data.categoria = "Kids"
            break;
        case "juveniles":
            item.data.categoria = "Kids"
            break;
        default:
            item.data.categoria = item.data.categoria;
            break;
    }

});

// filtering
function filterByRUid() {
    let _value = uidInput.value
    console.log(_value.value);
    if (_value === '') {
        alert('Ingresa Numero')
    } else {
        var filtered = parsedResults.filter(item => (
            item.data.dorsal.toString() === _value
        ));
        if (filtered.length === 0) {

            loadTableData(empty)
        } else {

            loadTableData(filtered)
        }
    }

}

function filterByRUidR() {
    let _value = uidInputR.value
    if (_value === '') {
        alert('Ingresa Numero')
    } else {
        var filtered = parsedResults.filter(item => (
            item.data.dorsal.toString() === _value
        ));
        if (filtered.length === 0) {
            loadUlData(empty)

        } else {
            loadUlData(filtered)

        }
    }
    collapseMenu();

}

function filterByName() {
    let _value = nameInput.value
    let val = _value.toLowerCase();
    console.log(_value);
    if (_value === '') {
        alert('Ingresa Nombre Completo')
    } else {
        var filtered = parsedResults.filter(item => (
            item.data.corredor.toLowerCase().indexOf(val) > -1
        ));
        if (filtered.length === 0) {
            loadTableData(empty)
        } else {
            loadTableData(filtered)
        }
    }

}

function filterByNameR() {
    let _value = nameInputR.value
    let val = _value.toLowerCase();
    console.log(val);
    if (_value === '') {
        alert('Ingresa Nombre Completo')
    } else {
        let filtered = parsedResults.filter(item => (
            item.data.corredor.toString().toLowerCase().indexOf(val) > -1
        ));
        if (filtered.length === 0) {
            loadUlData(empty)
        } else {
            loadUlData(filtered)
        }
    }
    collapseMenu()

}

function filterByCircuit() {
    let _value = circuitSelect.value
    console.log(_value);
    if (_value === '') {
        alert('Circuito no puede quedar vacio')
    } else {
        var filtered = parsedResults.filter(item => (
            item.data.general === _value
        ));
        if (filtered.length === 0) {
            loadTableData(empty)
        } else {
            loadTableData(filtered)
        }
    }

}

function filterByCircuitR() {
    let _value = circuitSelectR.value
    console.log(_value);
    if (_value === '') {
        alert('Circuito no puede quedar vacio')
    } else {
        var filtered = parsedResults.filter(item => (
            item.data.general === _value
        ));
        if (filtered.length === 0) {
            loadUlData(empty)
        } else {
            loadUlData(filtered)
        }
    }
    collapseMenu()

}



//clean table

function cleanTable() {
    tableBody.innerHTML = ''
    loadTableData(empty)
}

// sorting

function sortBy() {
    switch (sortSelect.value) {
        case "ta":
            sortByTimeA()
            collapseMenu()
            break;
        case "td":
            sortByTimeD()
            collapseMenu()
            break;
        case "rua":
            sortByRunnerUIDA()
            collapseMenu()
            break;
        case "rud":
            sortByRunnerUIDD()
            collapseMenu()
            break;
        case "nom":
            sortByNameA()
            collapseMenu()
            break;
        case "cit":
            sortByCity()
            collapseMenu()
            break;
        case "gena":
            sortByPosGA()
            collapseMenu()
            break;
        case "gend":
            sortByPosGD()
            collapseMenu()
            break;
        case "gencata":
            sortByPosCA()
            collapseMenu()
            break;
        case "gencatd":
            sortByPosCD()
            collapseMenu()
            break;
        case "gensexa":
            sortByPosSA()
            collapseMenu()
            break;
        case "gensexd":
            sortByPosSD()
            collapseMenu()
            break;
    }

}

function sortByTimeA() {
    parsedResults.sort((a, b) => {
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
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByTimeD() {
    parsedResults.sort((a, b) => {
        let fa = a.data.tiempo_bruto;
        let fb = b.data.tiempo_bruto;
        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByPosGA() {
    parsedResults.sort((a, b) => {
        let fa = a.data.pos_general;
        let fb = b.data.pos_general;
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByPosGD() {
    parsedResults.sort((a, b) => {
        let fa = a.data.pos_general;
        let fb = b.data.pos_general;
        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByPosCA() {
    parsedResults.sort((a, b) => {
        let fa = a.data.pos_categ;
        let fb = b.data.pos_categ;
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByPosCD() {
    parsedResults.sort((a, b) => {
        let fa = a.data.pos_categ;
        let fb = b.data.pos_categ;
        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByPosSA() {
    parsedResults.sort((a, b) => {
        let fa = a.data.pos_gral_sexo;
        let fb = b.data.pos_gral_sexo;
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByPosSD() {
    parsedResults.sort((a, b) => {
        let fa = a.data.pos_gral_sexo;
        let fb = b.data.pos_gral_sexo;
        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByRunnerUIDA() {
    parsedResults.sort((a, b) => {
        let fa = a.data.dorsal;
        let fb = b.data.dorsal;
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByRunnerUIDD() {
    parsedResults.sort((a, b) => {
        let fa = a.data.dorsal;
        let fb = b.data.dorsal;
        if (fa > fb) {
            return -1;
        }
        if (fa < fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByNameA() {
    parsedResults.sort((a, b) => {
        let fa = a.data.corredor;
        let fb = b.data.corredor;
        fa.replace(/\g/g, "");
        fb.replace(/\g/g, "");
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}

function sortByCity() {
    parsedResults.sort((a, b) => {
        let fa = a.data.localidad;
        let fb = b.data.localidad;
        if (fa < fb) {
            return -1;
        }
        if (fa > fb) {
            return 1;
        }
        return 0;
    })
    tableBody.innerHTML = ''
    respUl.innerHTML = ''
    loadUlData(parsedResults)
    loadTableData(parsedResults)
}


// load data main function
function loadTableData(items) {
    tableBody.innerHTML = ''
    items.forEach(item => {
        let row = tableBody.insertRow();
        let runnerUID = row.insertCell(0);
        runnerUID.innerHTML = item.data.dorsal;
        let runner = row.insertCell(1);
        runner.innerHTML = item.data.corredor;
        let general = row.insertCell(2);
        general.innerHTML = item.data.general;
        let cat = row.insertCell(3)
        cat.innerHTML = item.data.categoria;
        let catSex = row.insertCell(4)
        catSex.innerHTML = item.data.gral_sexo
        let tiempo_bruto = row.insertCell(5);
        tiempo_bruto.innerHTML = item.data.tiempo_bruto;
        let posCateg = row.insertCell(6);
        posCateg.innerHTML = item.data.pos_categ;
        let gral = row.insertCell(7);
        gral.innerHTML = item.data.pos_general;
        let gralSexo = row.insertCell(8);
        gralSexo.innerHTML = item.data.pos_gral_sexo;
        let tiempoNeto = row.insertCell(9);
        tiempoNeto.innerHTML = item.data.tm_neto;
    });

}

// reset
function reset() {
    parsedResults = JSON.parse(results);
    tableBody.innerHTML = '';
    loadTableData(parsedResults);
    loadUlData(parsedResults)

}

loadTableData(parsedResults);

loadUlData(parsedResults);

function collapseMenu() {
    seeFilters.style.display = 'block'
    rfilterresp.classList.add('active')
}

function showMenu() {
    reset()
    seeFilters.style.display = 'none'
    rfilterresp.classList.remove('active')
}