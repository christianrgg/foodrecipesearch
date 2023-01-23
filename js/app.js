function iniciarApp(){
    
    const selectCategorias = document.querySelector(`#categorias`);
    selectCategorias.addEventListener(`change`, seleccionarCategoria);

    const resultado = document.querySelector(`#resultado`);
    const modal = new bootstrap.Modal(`#modal`, {});

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

    function seleccionarCategoria(e) {
        const categoria = e.target.value;
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${categoria}`
        fetch(url)
             .then(respuesta => respuesta.json())
             .then(resultado => mostrarRecetas(resultado.meals))

    }

    function mostrarRecetas(recetas = []){
        
        limpiarHTML(resultado);

        const heading = document.createElement(`h2`);
        heading.classList.add(`text-center`,`text-black`,`my-5`);
        heading.textContent = recetas.length ? `Resultados`: `No hay resultados`;
        resultado.appendChild(heading);

        //Iterar en los comentarios
        recetas.forEach(receta =>{
            
            const {idMeal, strMeal, strMealThumb} = receta;
            const recetaContenedor = document.createElement(`div`);
            recetaContenedor.classList.add(`col-md-4`);

            const recetaCard = document.createElement(`div`);
            recetaCard.classList.add(`card`, `mb-4`);

            const recetaImagen = document.createElement(`img`);
            recetaImagen.classList.add(`card-img-top`);
            recetaImagen.alt = `Imagen de la receta ${strMeal}`
            recetaImagen.src = strMealThumb;

            const recetaCardBody = document.createElement(`div`);
            recetaCardBody.classList.add(`card-body`);

            const recetaHeading = document.createElement(`h3`);
            recetaHeading.classList.add(`card-title`, `mb-3`);
            recetaHeading.textContent = strMeal;

            const recetaButton = document.createElement(`button`);
            recetaButton.classList.add(`btn`, `btn-danger`, `w-100`);
            recetaButton.textContent = `Ver Receta`;
            // recetaButton.dataset.bsTarget = "#modal";
            // recetaButton.dataset.bsToggle = "modal";
            recetaButton.onclick = function(){
                seleccionarReceta(idMeal)
            }

            //Inyectar en el codigo HTML
            recetaCardBody.appendChild(recetaHeading);
            recetaCardBody.appendChild(recetaButton);

            recetaCard.appendChild(recetaImagen);
            recetaCard.appendChild(recetaCardBody);

            recetaContenedor.appendChild(recetaCard);

            resultado.appendChild(recetaContenedor);
   
        })

    }

    function seleccionarReceta(id){
        const url = `https://themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
        fetch(url)
            .then(respuesta => respuesta.json())
            .then(resultado => mostrarRecetasModal(resultado.meals[0]))
    }

    function mostrarRecetasModal(receta){
        
        const {idMeal, strInstructions, strMeal, strMealThumb} = receta;
        
        //Añadir contenido al modal
        const modalTitle = document.querySelector(`.modal .modal-title`);
        const modalBody = document.querySelector(`.modal .modal-body`);

        modalTitle.textContent = strMeal;
        modalBody.innerHTML = `
            <img class="img-fluid" src="${strMealThumb}" alt="receta ${strMeal}" />
            <h3 clas="my-3">Instrucciones</h3>
            <p>${strInstructions}</p>
            <h3 class="my-3">Ingredientes y cantidades</h3>
        `;


        const listGroup = document.createElement(`ul`);
        listGroup.classList.add(`list-group`);
        //Mostrar ingredientes y cantidades
        for (let i = 1; i<=20; i++){
            
            if(receta[`strIngredient${i}`]){
                const ingrediente = receta[`strIngredient${i}`];
                const cantidad = receta[`strMeasure${i}`];

                const ingredienteLi = document.createElement(`li`);
                ingredienteLi.classList.add(`list-group-item`);
                ingredienteLi.textContent = `${ingrediente} - ${cantidad}`;

                listGroup.appendChild(ingredienteLi);
            }
        }

        modalBody.appendChild(listGroup);

        const modalFooter = document.querySelector(`.modal-footer`);
        limpiarHTML(modalFooter);


        //Botones de cerrar y favoritos 
        const btnFavorito = document.createElement(`button`);
        btnFavorito.classList.add(`btn`, `btn-danger`, `col`);
        btnFavorito.textContent = "Guardar Favorito";

        //boton local storage
        btnFavorito.onclick = function(){
            
            if(existeStorage(idMeal)){
                return
            }

            agregarFavorito({
                id: idMeal,
                titulo: strMeal,
                img: strMealThumb
            });
        }

        const btnCerrarModal = document.createElement(`button`);
        btnCerrarModal.classList.add(`btn`, `btn-secondary`, `col`);
        btnCerrarModal.textContent = "Cerrar";
        btnCerrarModal.onclick = function(){
            modal.hide();
        }
       
        modalFooter.appendChild(btnFavorito);
        modalFooter.appendChild(btnCerrarModal);


        //Muestra el modal
        modal.show();
    }

    function agregarFavorito(receta){
        const favoritos = JSON.parse(localStorage.getItem(`favoritos`)) ?? [];
        localStorage.setItem(`favoritos`, JSON.stringify([...favoritos, receta]));
    }

    function existeStorage(id){
        const favoritos = JSON.parse(localStorage.getItem(`favoritos`)) ?? [];
        return favoritos.some(favorito => favorito.id === id);
    }

    function limpiarHTML(selector){
        while(selector.firstChild){
            selector.removeChild(selector.firstChild);
        }
    }

    
}

document.addEventListener(`DOMContentLoaded`, iniciarApp);