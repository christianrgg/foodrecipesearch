function iniciarApp(){
    
    const selectCategorias = document.querySelector(`#categorias`);



    obtenerCategorias();

    function obtenerCategorias(){
        const url = `https://www.themealdb.com/api/json/v1/1/categories.php`;
        fetch(url)
             .then(respuesta => respuesta.json())
             .then(resultado => mostrarCategorias(resultado.categories))
    }

    function mostrarCategorias(categorias = []) {
        categorias.forEach(categoria => {
            const option = document.createElement(`OPTION`);
            const {strCategory} = categoria;
            option.value = categoria.strCategory;
            option.textContent = strCategory;
            selectCategorias.appendChild(option);


        })
    }
}

document.addEventListener(`DOMContentLoaded`, iniciarApp);