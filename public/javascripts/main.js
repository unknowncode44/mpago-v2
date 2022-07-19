// ## DETECTAR EL TAMANO DE SCREEN



var windowHeight = screen.height
var windowWidth = screen.width

console.log(windowHeight + '+' + windowWidth);

const topRow = document.getElementById('top-row')
const navBar = document.getElementById('nav-items')
if (windowWidth <= 420) {
    console.log('menor que 420');
    topRow.removeChild(navBar)
}



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