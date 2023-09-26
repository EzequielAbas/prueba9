// Carrousel

function startCarousel() {
    const carouselImages = document.querySelector('.carousel-images');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');

    let currentIndex = 0;

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + carouselImages.children.length) % carouselImages.children.length;
        carouselImages.style.transform = `translateX(-${currentIndex * 20}%)`;
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % carouselImages.children.length;
        carouselImages.style.transform = `translateX(-${currentIndex * 20}%)`;
    });

    setInterval(() => {
        currentIndex = (currentIndex + 1) % carouselImages.children.length;
        carouselImages.style.transform = `translateX(-${currentIndex * 20}%)`;
    }, 7200);
}

startCarousel();

// Contenedor de productos
const categoriesContainer = document.querySelector(".categories");
const productsContainer = document.querySelector(".products-container");
const categoryButtons = document.querySelectorAll(".category");
const showMoreBtn = document.querySelector(".btn-load");

//CART
const cartBtn = document.querySelector(".cart-label");
const cartMenu = document.querySelector(".cart");
const menuBtn = document.querySelector(".menu-label");
const barsMenu = document.querySelector(".navbar-list");
const overlay = document.querySelector(".overlay");
const productsCart = document.querySelector(".cart-container");
const total = document.querySelector(".total");
const successModal = document.querySelector(".add-modal");
const buyBtn = document.querySelector(".btn-buy");
const deleteBtn = document.querySelector(".btn-delete");
const cartBubble = document.querySelector(".cart-bubble");

//Categories

// Función para agregar un producto al carrito
const addProductToCart = (product) => {
    const existingCartItem = cart.find((item) => item.id === product.id);
    if (existingCartItem) {
        existingCartItem.quantity++;
    } else {
        cart.push({...product, quantity: 1 });
    }
    console.log("Producto agregado al carrito:", product); // Agrega esta línea para depurar
    updateCartState();
    showSuccessModal("Producto agregado al carrito");
};


// Agregar evento click para botones "Agregar al carrito"
productsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-add")) {
        const productElement = e.target.closest(".product-card");
        const productId = e.target.dataset.productId;
        const productToAdd = productsData.find((product) => product.id === parseInt(productId));
        if (productToAdd) {
            addProductToCart(productToAdd);
        }
    }
});

// Cantidad de productos en display
const productsPerPage = 24;
let currentPage = 0;

//función para averiguar si el índice actual renderizado de la lista de productos es igual al límite de productos
const isProductLimitLess1 = () => {
    return appState.currentProductsIndex === appState.productsLimit - 1;
}

//función para mostrar más productos ante el click del usuario en el botón "ver más"
const showMoreProductsCategories = () => {
    appState.currentProductsIndex += 1;
    let { products, currentProductsIndex } = appState;
    renderProducts(products[currentProductsIndex]);
    if (isProductLimitLess1()) {
        showMoreBtn.classList.add("hidden");
    }

};

//función que me permite el primer renderizado de mi aplicación 
//sin necesidad de escuchar un evento
const renderProducts = (productsList) => {
    productsContainer.innerHTML += productsList
        .map(createProductTemplate)
        .join("");
};



//Función para aplicar el filtro cuando se cliquea el botón de categoría

const applyFilter = ({ target }) => {
    if (!isInactiveFilterBtn(target)) return;
    changeFilterState(target);
    //si vamos a mostrar cosas filtradas tengo que limpiar el div
    productsContainer.innerHTML = '';
    if (appState.activeFilter) {
        renderFilteredProducts();
        appState.currentProductsIndex = 0;
        return;
    }
    renderProducts(appState.products[0]);
};

//renderizar los productos filtrados
const renderFilteredProducts = () => {
    const filteredProducts = productsData.filter(
        (product) => product.category === appState.activeFilter
    );
    renderProducts(filteredProducts);
};

// chequep si el botón que se apretó no es un botón de categoría o ya está activo, no hace nada
const isInactiveFilterBtn = (element) => {
    return (
        element.classList.contains("category") &&
        !element.classList.contains("active")
    );
};

//cambio el estado del filtro
const changeFilterState = (btn) => {
    appState.activeFilter = btn.dataset.category;
    changeBtnActiveState(appState.activeFilter);
    setShowMoreVisibility();
};

//función para cambiar el estado de los botones de categorías
const changeBtnActiveState = (selectedCategory) => {
    const categories = [...categoriesList];
    categories.forEach((categoryBtn) => {
        if (categoryBtn.dataset.category !== selectedCategory) {
            categoryBtn.classList.remove("active");
            return;
        }
        categoryBtn.classList.add("active");
    })
};

//función para mostrar u ocultar el botón de "ver más" según corresponsa
const setShowMoreVisibility = () => {
    if (!appState.activeFilter) {
        showMoreBtn.classList.remove("hidden")
        return
    }
    showMoreBtn.classList.add("hidden")
};

// Filtro basado en cada categoría
function filterProducts(category) {
    if (category === "Todas") {
        return productsData;
    }
    return productsData.filter(product => product.category.toLowerCase() === category.toLowerCase());
}

// Desplegado de productos en cards
function createProductTemplate(products) {
    productsContainer.innerHTML = "";
    const startIndex = currentPage * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    for (let i = startIndex; i < endIndex && i < products.length; i++) {
        const product = products[i];
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        productCard.innerHTML = `
        <div class="product">
            <h3>${product.name}</h3>
            <img src="${product.cardImg}" alt="${product.name}">
            <p class="bid">$${product.bid.toFixed(2)}</p>
            <div class="offer-time">
            </div>
            <button class="btn-add" data-productId="${product.id}">Agregar al carrito</button>
        </div>
        `;
        productsContainer.appendChild(productCard);
    }
}

//función para averiguar si el índice actual renderizado de la lista de productos es igual al límite de productos
const isLastIndexOf = () => {
    return appState.currentProductsIndex === appState.productsLimit - 1;
}

//función para mostrar más productos ante el click del usuario en el botón "ver más"
const showMoreProducts = () => {
    appState.currentProductsIndex += 1;
    let { products, currentProductsIndex } = appState;
    renderProducts(products[currentProductsIndex]);
    if (isLastIndexOf()) {
        showMoreBtn.classList.add("hidden");
    }
}

// };

//CATEGORIAS

// // Despliegue inicial de productos
// const allProducts = productsData;
// createProductTemplate(allProducts);

// //habilitar o deshabilitar un botón según corresponda
// //La lógica la comparten, si el carro está vacío, los saco a ambos, si hay algo en el cart los habilito
// const disableBtn = (btn) => {
//     if (!cart.length) {
//         btn.classList.add("disabled");
//     } else {
//         btn.classList.remove("disabled");
//     }
// };

//CART

//Función para actualizar la cantidad de productos que el usuario va guardando en el carrito
const renderCartBubble = () => {
    //acá tenemos que mostrar la suma de los quantitis, por lo tanto aplico un método que se llama reduce
    cartBubble.textContent = cart.reduce((acc, cur) => {
        return acc + cur.quantity;
    }, 0);
};

//función de actualización del carro
const updateCartState = () => {
    // Guardar carrito en LS
    saveCart();
    // Renderizar el carrito
    renderCart();
    // Mostrar el total
    showCartTotal();

    // Usamos la misma función para ambos botones
    disableBtn(buyBtn);
    disableBtn(deleteBtn);

    renderCartBubble();
};


/**
 * Función para manejar el evento click del botón de más de cada producto del carrito.
 */
const handlePlusBtnEvent = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);
    addUnitToProduct(existingCartProduct);
};

/**
 * Función para manejar el evento click del botón de menos de cada producto del carrito.
 */
const handleMinusBtnEvent = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);

    // Si se toco en un item con uno solo de cantidad
    if (existingCartProduct.quantity === 1) {
        if (window.confirm("¿Desea eliminar el producto del carrito?")) {
            removeProductFromCart(existingCartProduct);
        }
        return; // Si no termino confirmando la eliminación, no hace nada, ya que sino la cantidad quedaría en 0, así que cortamos la ejecución.
    }
    substractProductUnit(existingCartProduct);
};

/**
 * Función para quitar una unidad de producto.
 * Se recorre el array del carrito y se busca el producto que se quiere eliminar una unidad. Si el producto pasado como parámetro es igual al producto que se está recorriendo, se le resta una unidad a la propiedad "quantity" y se actualiza el array del carrito. Si eso no ocurre, se retorna el producto que se esta recorriendo tal cual está.
 */
const substractProductUnit = (existingProduct) => {
    cart = cart.map((product) => {
        return product.id === existingProduct.id ? {...product, quantity: Number(product.quantity) - 1 } :
            product;
    });
};

/**
 * Función para eliminar un producto del carrito.
 */
const removeProductFromCart = (existingProduct) => {
    cart = cart.filter((product) => product.id !== existingProduct.id);
    updateCartState();
};

/**
 * Función que maneja los eventos de apretar el botón de más o de menos según corresponda.
 */
const handleQuantity = (e) => {
    if (e.target.classList.contains("down")) {
        handleMinusBtnEvent(e.target.dataset.id);
    } else if (e.target.classList.contains("up")) {
        handlePlusBtnEvent(e.target.dataset.id);
    }
    //Para todos los casos
    updateCartState();
};

/**
 * Función para vaciar el carrito.
 */
const resetCartItems = () => {
    cart = [];
    updateCartState();
};

/**
 * Función para completar la compra o vaciar el carrito.
 */
const completeCartAction = (confirmMsg, successMsg) => {
    if (!cart.length) return; //Si el carrito está vacío, no hace nada.
    if (window.confirm(confirmMsg)) {
        resetCartItems();
        alert(successMsg);
    }
};

/**
 * Función para disparar el mensaje de compra exitosa y su posterior mensaje de exito en caso de darse la confirmación.
 */
const completeBuy = () => {
    completeCartAction("¿Desea completar su compra?", "¡Gracias por su compra!");
};

/**
 * Función para disparar el mensaje de vaciado de carrito y su posterior mensaje de exito en caso de darse la confirmación.
 */
const deleteCart = () => {
    completeCartAction(
        "¿Desea vaciar el carrito?",
        "No hay productos en el carrito"
    );
};

//esta función tiene que hacer un par de cosas
//togglea el cart y si el menú está abierto, lo cierra. Finalmente, muestra el overlay si no había nada abierto y se está abriendo el carrito.
const toggleCart = () => {
    //aca le digo a cartMenu que cada vez que el user haga click, va a tener la clase open-cart 
    cartMenu.classList.toggle("open-cart");

    //chequear si el menu hamburguesa esta abierto, lo cierro y retorno
    if (barsMenu.classList.contains("open-menu")) {
        barsMenu.classList.remove("open-menu");
        return; //si ya habia algo abierto, no se togglea el overlay
    }
    //si está cerrado, entro a la clase y la cambiamos con un toggle
    overlay.classList.toggle("show-overlay");

};

//función para mostrar u ocultar el menú hamburguesa y el overlay, según corresponda
const toggleMenu = () => {
    barsMenu.classList.toggle("open-menu");
    if (cartMenu.classList.contains("open-cart")) {
        cartMenu.classList.remove("open-cart");
        return; //si ya había algo abierto, no se togglea el overlay, por eso el return
    }
    overlay.classList.toggle("show-overlay");
};

//hacemos una función para cerrar el menú hamburguesa o el carrito y ocultar el overlay cuando el usuario scrolee
const closeOnScroll = () => {
    if (!barsMenu.classList.contains("open-menu") &&
        !cartMenu.classList.contains("open-cart")
    ) {
        return
    };
    barsMenu.classList.remove("open-menu");
    cartMenu.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
};

//función para cerrar el menú hamburguesa y el overlay cuando se hace click en un link
const closeOnClick = (e) => {
    //chequeo que sea un click en el link
    if (!e.target.classList.contains("navbar-link")) {
        return
    };
    //si estoy efectivamente haciendo click en una etiqueta a
    barsMenu.classList.remove("open-menu");
    overlay.classList.remove("show-overlay");
};

//función para cerrar el menú hamburguesa o el carrito y ocultar el overlay cuando el usuario hace clik en el overlay
const closeOnOverlayClick = () => {
    barsMenu.classList.remove("open-menu");
    cartMenu.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
}

//RENDERIZAR EL CARRITO
//nuestro carrito será un arreglo de objetitos y vamos a aplicarle una lógica parecida al todoList

//setear el carrito vacío o lo que esté en LS
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));

    updateCartState();
    renderCart();
    saveCart();
    showCartTotal();
};

//ya tenemos el carrito guardado, ahora hay que armar la lógica del renderizado 
// hacer una función para renderizar los productos del carrito o enviar el msg "no hay productos"
const renderCart = () => {
    const cartContainer = document.querySelector(".cart-container");
    cartContainer.innerHTML = ""; // Limpiamos el contenido anterior

    if (!cart.length) {
        cartContainer.innerHTML = "<p>No hay productos en el carrito</p>";
        return;
    }

    cart.forEach((product) => {
        const cartProductTemplate = createCartProductTemplate(product);
        cartContainer.innerHTML += cartProductTemplate;
    });
};

//función para crear el template de un producto del carrito
const createCartProductTemplate = (cartProduct) => {
    const { id, name, bid, img, quantity } = cartProduct;
    return `
        <div class="cart-item">
            <img src="${img}" alt="Nft del carrito" />
            <div class="item-info">
                <h3 class="item-title">${name}</h3>
                <p class="item-bid">Current bid</p>
                <span class="item-price">${bid} ETH</span>
            </div>
            <div class="item-handler">
                <span class="quantity-handler down" data-id="${id}">-</span>
                <span class="item-quantity">${quantity}</span>
                <span class="quantity-handler up" data-id="${id}">+</span>
            </div>
        </div>
    `;

};


//función para mostrar el total de la compra
const showCartTotal = () => {
    //acá voy a necesitar una función auxiliar que me traiga el total del carrito
    total.innerHTML = `${getCartTotal().toFixed(2)} ARS`;
};

//función para obtener el total de la compra
const getCartTotal = () => {
    return cart.reduce((acc, cur) => acc + Number(cur.bid) * cur.quantity, 0)
};


//ahora pasamos a la lógica para agregar al carrito
// Función para crear un objeto con la info del producto que quiero agregar al carrito o bien agregar una unidad de un producto ya incorporado en mi carrito
const addProduct = (e) => {
    // Primero mi función recibe el evento y después tengo que saber si el click proviene del botón del producto
    if (!e.target.classList.contains("btn-add")) { return; }
    // Ahora vamos a la otra lógica y acá me voy a guardar el dataset del producto que estoy agregando para luego revisar si existe o no en el carrito (para saber si agrego la card o la cantidad de ese producto)

    // Llamo a la función para desestructurar lo que necesito utilizar 
    const product = createProductData(e.target.dataset);
    // Comprobar si el producto ya está en el carro
    if (isExistingCartProduct(product)) {
        addUnitToProduct(product);
        // Mostrar un feedback
        showSuccessModal("Se agregó un producto al carrito");
    } else {
        // Creamos el producto en el carrito y dar feedback al usuario
        createCartProduct(product);
        showSuccessModal("El producto se ha agregado al carrito");
    }

    updateCartState();
};

// función desestructuradora
const createProductData = (product) => {
    const { id, name, bid, cardImg } = product;
    return { id, name, bid, cardImg };
};

//función que comprueba si el producto ya fue agregado al carrito
const isExistingCartProduct = (product) => {
    return cart.find((item) => item.id === product.id);
};

//función para agregar una unidad al producto que ya tengo en el cart
const addUnitToProduct = (product) => {
    cart = cart.map((cartProduct) =>
        cartProduct.id === product.id ? {...cartProduct, quantity: cartProduct.quantity + 1 } :
        cartProduct
    );
};

//función para darle una devolución al usuario
const showSuccessModal = (msg) => {
    successModal.classList.add("active-modal");
    successModal.textContent = msg;
    setTimeout(() => {
        successModal.classList.remove("active-modal")
    }, 1500);
};

//creamos un objeot con la info del producto que queremos agregar
const createCartProduct = (product) => {
    cart = [...cart, {...product, quantity: 1 }];
};

//CATEGORIAS

// función inicializadora para categorías
categoryButtons.forEach(button => {
    button.addEventListener("click", () => {
        categoryButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        const selectedCategory = button.dataset.category;
        const filteredProducts = filterProducts(selectedCategory);
        currentPage = 0;
        createProductTemplate(filteredProducts);
    });
});

showMoreBtn.addEventListener("click", () => {
    const selectedCategory = document.querySelector(".category.active").dataset.category;
    const filteredProducts = filterProducts(selectedCategory);
    currentPage++;
    createProductTemplate(filteredProducts);
    if (currentPage * productsPerPage >= filteredProducts.length) {
        showMoreBtn.style.display = "none";
    }
});



//CART and categories

// Otras funciones iniciadoreas o para cart menu

const init = () => {
    renderProducts(appState.products[0]);
    showMoreBtn.addEventListener("click", showMoreProducts);
    categoriesContainer.addEventListener("click", applyFilter);
    cartBtn.addEventListener("click", toggleCart);
    menuBtn.addEventListener("click", toggleMenu);
    window.addEventListener("scroll", closeOnScroll);
    barsMenu.addEventListener("click", closeOnClick);
    overlay.addEventListener("click", closeOnOverlayClick);
    document.addEventListener("DOMContentLoaded", renderCart);
    document.addEventListener("DOMContentLoaded", showCartTotal);
    productsContainer.addEventListener("click", addProduct);
    productsCart.addEventListener("click", handleQuantity);
    buyBtn.addEventListener("click", completeBuy);
    deleteBtn.addEventListener("click", deleteCart);
    disableBtn(buyBtn);
    disableBtn(deleteBtn);
    renderCartBubble(cart);
};

init();