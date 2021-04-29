	// On tap bai storage
	const CART_KEY = "MY_WEB_STORAGE";
	const GUEST_USER = "GUEST";

	const getProductsFromCart = () => {
	    const jsonValue = localStorage.getItem(CART_KEY);
	    if (jsonValue) return JSON.parse(jsonValue);
	    return null;
	};

	const getProductsFromCartByUser = (user = GUEST_USER) => {
	    const jsonValue = localStorage.getItem(CART_KEY);
	    if (jsonValue) return JSON.parse(jsonValue)[user];
	    return null;
	};

	const findProductIdByName = (name, user = GUEST_USER) => {
	    const products = getProductsFromCartByUser(user);
	    if (!products) return null;
	    const existedPrd = products.find((product) => product.name === name);
	    if (!existedPrd) return null;
	    return existedPrd.id;
	};

	const mergeDuplicateProduct = (products, newProduct) => {
	    const isExisted = products
	        .map((product) => product.id)
	        .includes(newProduct.id);
	    console.log("products", newProduct);
	    if (isExisted) {
	        return products.map((product) =>
	            product.id === newProduct.id ?
	            {
	                ...product,
	                quantity: product.quantity + newProduct.quantity
	            } :
	            product
	        );
	    }
	    return [...products, newProduct];
	};

	const addToCart = (product, user = GUEST_USER) => {
	    const products = getProductsFromCart(user);
	    let jsonValue = {};
	    // VALIDATE PRODUCT IF NECESSARY
	    if (products) {
	        jsonValue = {
	            ...products
	        };
	    }
	    if (products && products[user]) {
	        jsonValue[user] = mergeDuplicateProduct(products[user], product);
	    } else {
	        jsonValue[user] = [product];
	    }
	    localStorage.setItem(CART_KEY, JSON.stringify(jsonValue));
	};

	const removeProductFromCart = (productId, user = GUEST_USER) => {
	    const products = getProductsFromCart(user);
	    if (products) {
	        const jsonValue = {
	            ...products,
	            [user]: products[user].filter(
	                (product) => product.id !== productId
	            ),
	        };
	        localStorage.setItem(CART_KEY, JSON.stringify(jsonValue));
	    }
	};

	const compose = (...fns) =>
	    fns.reduce((f, g) => (...args) => f(g(...args)));

	const createNewDataDom = (data) => {
	    let tableData = document.createElement("td");
	    tableData.innerText = data;
	    return tableData;
	};

	const onDeleteClicked = (productId) => {
	    removeProductFromCart(productId);
	    displayCart();
	};

	const createDeleteDataDom = (productId) => {
	    let tableData = document.createElement("td");
	    let button = document.createElement("button");
	    button.innerText = "Xóa";
	    button.addEventListener("click", () => onDeleteClicked(productId));
	    tableData.append(button);
	    return tableData;
	};

	const displayCart = () => {
	    const tableBodyArr = document.getElementsByTagName("tbody");
	    const products = getProductsFromCartByUser();
	    if (!tableBodyArr.length || !products) return;
	    const tableBody = tableBodyArr[0];
	    tableBody.innerHTML = "";
	    products.forEach((element) => {
	        const tableRow = document.createElement("tr");
	        const {
	            id,
	            quantity,
	            name
	        } = element;
	        const appendValueToRow = (node) => tableRow.append(node);
	        compose(appendValueToRow, createNewDataDom)(id);
	        compose(appendValueToRow, createNewDataDom)(name);
	        compose(appendValueToRow, createNewDataDom)(quantity);
	        compose(appendValueToRow, createDeleteDataDom)(id);

	        tableBody.append(tableRow);
	    });
	};

	const onEditClicked = () => {
	    const nameInp = document.getElementById("name-edt-inp"),
	        qttInp = document.getElementById("quantity-edt-inp");
	    const name = nameInp.value.trim().toLowerCase(),
	        quantity = Number(qttInp.value);
	    const id = findProductIdByName(name);
	    if (name && quantity >= 1 && id) {
	        removeProductFromCart(id);
	        addToCart({
	            id,
	            quantity,
	            name
	        });
	        displayCart();
	        nameInp.value = "";
	        qttInp.value = 1;
	        nameInp.focus();
	    }
	};

	const onAddClicked = () => {
	    const nameInp = document.getElementById("name-inp"),
	        qttInp = document.getElementById("quantity-inp");
	    const name = nameInp.value.trim().toLowerCase(),
	        quantity = Number(qttInp.value);
	    if (name && quantity >= 1) {
	        const id = findProductIdByName(name) || new Date().getTime();
	        addToCart({
	            id,
	            quantity,
	            name
	        });
	        displayCart();
	        nameInp.value = "";
	        qttInp.value = 1;
	        nameInp.focus();
	    }
	};
	displayCart();

	const clearCart = () => {
	    localStorage.clear();
	};