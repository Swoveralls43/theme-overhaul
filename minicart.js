$(document).ready(async function() {
    const selectors = {
        minicart: '.js-minicart',
        minicartOpen: '[data-toggle-bag]',
        headerCount: '[data-cart-count]',
        minicartClose: '.js-close-minicart',
        minicartOverlay: '.js-minicart-overlay',
        minicartLoader: '.js-minicart-loader',
        minicartWrapper: '.js-minicart-items',
        minicartSubtotalCount: '.js-cart-count',
        minicartSubtotalEnding: '.js-cart-count-ending',
        minicartSubtotal: '.js-minicart-subtotal-price',
        minicartBar: '.js-minicart-progress-bar',
        minicartBarText: ".js-bar-progress-text",
        addToCartBtn: "#addToCartBtn"
    }

    const disableBodyScroll = bodyScrollLock.disableBodyScroll;
    const clearAllBodyScrollLocks = bodyScrollLock.clearAllBodyScrollLocks;

    const minicart = $(selectors.minicart);
    const headerCount = $(selectors.headerCount);
    const minicartOpen = $(selectors.minicartOpen);
    const minicartClose = $(selectors.minicartClose);
    const minicartOverlay = $(selectors.minicartOverlay);
    const minicartLoader = $(selectors.minicartLoader);
    const minicartWrapper = $(selectors.minicartWrapper);
    const count = $(selectors.minicartSubtotalCount);
    const ending = $(selectors.minicartSubtotalEnding);
    const subtotal = $(selectors.minicartSubtotal);
    const bar = $(selectors.minicartBar);
    const barText = $(selectors.minicartBarText);
    const addToCartBtn = $(selectors.addToCartBtn);

    let treshold = barText.data('treshold') * 100;
    let progressText = barText.data('processText');
    let successText = barText.data('successText');

    function openCart() {
        minicart.addClass('open');
        minicartOverlay.addClass('visible');
        disableBodyScroll(minicart[0]);
    }

    function closeCart() {
        minicart.removeClass('open');
        minicartOverlay.removeClass('visible');
        clearAllBodyScrollLocks();
    }

    minicartOpen.click(function(e) {
        e.preventDefault();
        openCart();
    })

    minicartClose.click(function(e) {
        e.preventDefault();
        closeCart();
    })

    $(document).on("click", selectors.addToCartBtn, function(e) {
        e.preventDefault();
        if ($(selectors.addToCartBtn).attr('data-right-drawer-renderer')) {
            return
        }
        addItem(state.id);
    });

    async function getProducts() {
        minicartWrapper[0].innerHTML = await fetch('/cart?view=ajax')
            .then(function(response) {
                return response.text();
            })
            .then(function(html) {
                let parser = new DOMParser();
                let content = parser.parseFromString(html, "text/html");
                let items = content.querySelector('.minicart-ajax-template').innerHTML;
                minicartLoader.removeClass('visible');
                return items;
            })
            .catch(function(err) {
                console.log('Failed to fetch page: ', err);
            });
    }

    async function addItem(variantID) {
        minicartLoader.addClass('visible');

        let data = {
            "id": String(variantID),
            "quantity": '1'
        }

        fetch('/cart/add.js', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                response.json();
            })

        .then(function() {
                getProducts();
                getCart();
                openCart();
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }

    async function updateItem(variantID, quantity) {
        minicartLoader.addClass('visible');

        let data = {
            "id": String(variantID),
            "quantity": String(quantity)
        }

        fetch('/cart/change.js', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                response.json();
            })
            .then(function() {
                getProducts();
                getCart();
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }

    async function removeItem(variantID) {
        minicartLoader.addClass('visible');

        let data = {
            "id": String(variantID),
            "quantity": "0"
        }

        fetch('/cart/change.js', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(response => {
                response.json();
            })
            .then(function() {
                getProducts();
                getCart();
            })
            .catch((error) => {
                console.error('Error:', error);
            })
    }

    async function getCart() {
        $.getJSON('/cart.js', function(cart) {
            if (cart.item_count === 0) {
                minicart.addClass('empty');
            } else {
                minicart.removeClass('empty');
                count.text(cart.item_count);
                subtotal.text(Shopify.formatMoney(cart.items_subtotal_price));
                cart.item_count > 1 ? ending.addClass('active') : ending.removeClass('active');

                if (bar) {
                    let barProgressPercent = cart.items_subtotal_price * 100 / treshold;
                    bar.css('width', `${barProgressPercent}%`)

                    if (cart.items_subtotal_price < treshold) {
                        barText.text(`${Shopify.formatMoney(treshold - cart.items_subtotal_price)} ${progressText}`);
                    } else {
                        barText.text(successText);
                    }
                }
            }

            headerCount.text(cart.item_count);
        });
    }

    await getCart();
    await getProducts();

    async function changeQuantity(container) {
        let variantId = container.parents('.minicart-item').data('variantId');
        let quantity = container.val();
        await updateItem(variantId, quantity);
    }

    async function removeProduct(container) {
        let variantId = container.parents('.minicart-item').data('variantId');
        await removeItem(variantId);
    }

    async function addUpsellProduct(container) {
        let select = container.parents('.minicart-upsell-item').find($('.js-upsell-variant'));
        let variantId = select.val();

        if (variantId) {
            await addItem(variantId);
        } else {
            select.addClass('error');
            setTimeout(function() {
                select.removeClass('error');
            }, 1000)
        }
    }

    $(document).on('change', '.js-minicart-item-quantity', function() {
        changeQuantity($(this));
    });

    $(document).on('click', '.minicart-item__btn-remove', function() {
        removeProduct($(this));
    });

    $(document).on('click', '.js-upsell-btn', function() {
        addUpsellProduct($(this));
    });

    //PLP grid 
    $('.js-product-grid').on('change', '.js-quick-add-input', function() {
        addItem(parseInt($(this).val()));
        openCart();
    });

    $('.js-product-grid').on('click', '.js-quick-add', function() {
        console.log(parseInt($(this).attr('data-variant')));
        addItem(parseInt($(this).attr('data-variant')));
        openCart();
    });

    const cartDrawer = document.querySelector('#nvd-cart div');

    if (cartDrawer) {
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.attributeName === 'class') {
                    getCart();
                }
            }
        });

        observer.observe(cartDrawer, { attributes: true });
    }
});