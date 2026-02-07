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
        addToCartBtn: "#addToCartBtn",
        tiers: '.js-minicart-tiers',
        tierShipping: '.js-tier-shipping',
        tierShippingText: '.js-tier-shipping-text',
        tierShippingCheck: '.js-tier-shipping-check',
        shippingRemaining: '.js-shipping-remaining',
        shippingBar: '.js-shipping-bar',
        tierDiscount: '.js-tier-discount',
        tierDiscountText: '.js-tier-discount-text',
        tierDiscountBadge: '.js-tier-discount-badge',
        nextDiscount: '.js-next-discount',
        tierSavings: '.js-tier-savings',
        savingsPercent: '.js-savings-percent',
        discountLine: '.js-discount-line',
        discountPercent: '.js-discount-percent',
        discountAmount: '.js-discount-amount'
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
    const addToCartBtn = $(selectors.addToCartBtn);

    // Tier configuration from data attributes
    const tiersEl = $(selectors.tiers);
    const freeThreshold = (tiersEl.data('free-threshold') || 69) * 100;
    const tier2Pairs = tiersEl.data('tier2-pairs') || 2;
    const tier2Discount = tiersEl.data('tier2-discount') || 20;
    const tier3Pairs = tiersEl.data('tier3-pairs') || 3;
    const tier3Discount = tiersEl.data('tier3-discount') || 25;
    const pairTypes = (tiersEl.data('pair-types') || 'Swoveralls,Swovie Shorts,Comfyalls').split(',').map(t => t.trim().toLowerCase());

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

    function countPairs(cart) {
        let pairCount = 0;
        cart.items.forEach(item => {
            const productType = (item.product_type || '').toLowerCase();
            if (pairTypes.includes(productType)) {
                pairCount += item.quantity;
            }
        });
        return pairCount;
    }

    function getCurrentDiscount(pairCount) {
        if (pairCount >= tier3Pairs) {
            return tier3Discount;
        } else if (pairCount >= tier2Pairs) {
            return tier2Discount;
        }
        return 0;
    }

    function getNextTierInfo(pairCount) {
        if (pairCount >= tier3Pairs) {
            return { achieved: true, discount: tier3Discount };
        } else if (pairCount >= tier2Pairs) {
            return {
                pairsNeeded: tier3Pairs - pairCount,
                nextDiscount: tier3Discount,
                currentDiscount: tier2Discount
            };
        } else {
            return {
                pairsNeeded: tier2Pairs - pairCount,
                nextDiscount: tier2Discount,
                currentDiscount: 0
            };
        }
    }

    function updateTiers(cart) {
        if (!tiersEl.length) return;

        const cartSubtotal = cart.items_subtotal_price;
        const pairCount = countPairs(cart);
        const currentDiscount = getCurrentDiscount(pairCount);
        const nextTier = getNextTierInfo(pairCount);

        // Update shipping tier
        const shippingEl = $(selectors.tierShipping);
        const shippingTextEl = $(selectors.tierShippingText);
        const shippingCheckEl = $(selectors.tierShippingCheck);
        const shippingBarEl = $(selectors.shippingBar);
        const shippingRemainingEl = $(selectors.shippingRemaining);

        if (cartSubtotal >= freeThreshold) {
            shippingEl.addClass('achieved');
            shippingTextEl.html('FREE SHIPPING unlocked!');
            shippingCheckEl.show();
            shippingBarEl.css('width', '100%');
        } else {
            shippingEl.removeClass('achieved');
            const remaining = freeThreshold - cartSubtotal;
            shippingRemainingEl.text(Shopify.formatMoney(remaining));
            shippingTextEl.html('Add <span class="js-shipping-remaining">' + Shopify.formatMoney(remaining) + '</span> for FREE SHIPPING');
            shippingCheckEl.hide();
            const progress = Math.min((cartSubtotal / freeThreshold) * 100, 100);
            shippingBarEl.css('width', progress + '%');
        }

        // Update discount tier
        const discountEl = $(selectors.tierDiscount);
        const discountTextEl = $(selectors.tierDiscountText);
        const discountBadgeEl = $(selectors.tierDiscountBadge);
        const savingsEl = $(selectors.tierSavings);
        const savingsPercentEl = $(selectors.savingsPercent);

        if (currentDiscount > 0) {
            discountEl.addClass('achieved');
            savingsEl.show();
            savingsPercentEl.text(currentDiscount + '%');

            if (nextTier.achieved) {
                discountTextEl.html('Maximum savings unlocked!');
                discountBadgeEl.text(currentDiscount + '% OFF').show();
            } else {
                discountTextEl.html('Add ' + nextTier.pairsNeeded + ' more pair' + (nextTier.pairsNeeded > 1 ? 's' : '') + ' to save ' + nextTier.nextDiscount + '%');
                discountBadgeEl.text(currentDiscount + '% OFF').show();
            }
        } else {
            discountEl.removeClass('achieved');
            savingsEl.hide();
            discountBadgeEl.hide();
            discountTextEl.html('Add ' + nextTier.pairsNeeded + ' pair' + (nextTier.pairsNeeded > 1 ? 's' : '') + ' to save <span class="js-next-discount">' + nextTier.nextDiscount + '%</span>');
        }

        // Update checkout discount display
        const discountLineEl = $(selectors.discountLine);
        const discountPercentEl = $(selectors.discountPercent);
        const discountAmountEl = $(selectors.discountAmount);

        if (currentDiscount > 0) {
            const discountValue = Math.round(cartSubtotal * (currentDiscount / 100));
            discountLineEl.show();
            discountPercentEl.text(currentDiscount + '% off');
            discountAmountEl.text('-' + Shopify.formatMoney(discountValue));
        } else {
            discountLineEl.hide();
        }
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

                // Update tier display
                updateTiers(cart);
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

});
