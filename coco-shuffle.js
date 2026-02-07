class CocoShuffle extends HTMLElement {
    constructor() {
        super();
        this.selectedProduct = null;
    }

    connectedCallback() {
        this.products = JSON.parse((this.dataset.productsJson).replace(/[\n\r]/g, '').replace(/\\/g, '\\\\'));
        this.selectedProduct = this.products.find(({ handle }) => window.location.pathname.split(`/`).includes(handle)); 
        this.currentVariant = this.selectedProduct.variants
            .find(({ default_selected }) => default_selected);
        this.addDelegatedClickListeners();
        this.createCustomEvents();
        document.addEventListener('DOMContentLoaded', () => {
            // any elements that might not exist yet when the ACE gets added to the DOM
            this.imagesWrapper = this.querySelector('[data-product-images]');
            this.displayPrice = this.querySelector('[data-display-price]');
            this.displayOptionsnew = this.querySelector('.sizesel_new');
            this.displayTitle = this.querySelector('[data-display-title]');
            this.displayDiscountMessage = this.querySelector('[data-discount-message]');
            this.displayDescription = this.querySelector('[data-display-description]');
            this.displayModel = this.querySelector('[data-display-model]');
            this.mainSelect = this.querySelector('[data-main-select]');
            
            

      this.ancupdateEventListeners();
            this.checkAtcButton();
        });
      
    }
ancupdateEventListeners() {
this.myselnew = this.querySelectorAll('.sizesel_new li');
          
if (this.myselnew) {
        this.myselnew.forEach((element, index) => {
          if (!(index === 0) ){
    element.addEventListener('click', () => {
        const dataOptionValue = element.getAttribute('data-option');
      
        this.currentVariant = this.selectedProduct.variants.find(({ options }) => options.find((x) => x === dataOptionValue));
        this.populateSelectedProductPrice();
       var preorderNotifications = document.querySelectorAll('.preorder_notification');
      preorderNotifications.forEach(function(element) {
    if (element.getAttribute('var-id') === this.currentVariant.id.toString()) {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}, this);
        this.mainSelect.value = this.currentVariant.id;
        history.replaceState(this.selectedProduct.title, '', this.currentVariant.url);
        this.checkAtcButton();
        window.dispatchEvent(this.variantUpdatedEvent);
    });
          }
});
    }

}
    getLineItemPropertiesObj(clickedElement) {
        let lineItemAndValues = {
            properties: {}
        };

        try {
            const formElem = clickedElement.closest('form');
            const lineItemProps = formElem.querySelectorAll('[data-linepropertyname]');
            lineItemProps.forEach(x => {
                lineItemAndValues.properties[x.dataset.linepropertyname] = x.value;
            });
        } catch (e) {
            console.error(e);
        }

        return lineItemAndValues;
    }

    addDelegatedClickListeners() {
        this.addEventListener('click', (e) => {
            const clickedElement = e.target.closest('[data-action]');
            if (!clickedElement)
                return;

            const {
                action,
                productId,
                option
            } = clickedElement.dataset;

            switch (action) {
                case 'add-to-cart':
                    let data = {
                        'id': this.currentVariant.id,
                        'quantity': parseInt(document.querySelector('.product-qty').value)
                    };
       
                    data = {
                        ...data,
                        ...this.getLineItemPropertiesObj(clickedElement)
                    };

                    fetch('/cart/add.js', {
                        body: JSON.stringify(data),
                        credentials: 'same-origin',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-Requested-With': 'xmlhttprequest'
                        },
                        method: 'POST'
                    }).then(() => {
                        window.dispatchEvent(this.addToCartEvent)
                    }).catch(function (err) {
                        console.error(err)
                    });
                    break;
                case 'product-select':
                    if (productId === this.selectedProduct?.id) return;

                    this.selectedProduct = this.products.find(({ id }) => id === productId);
                    this.currentVariant = this.selectedProduct.variants
                        .find(({ default_selected }) => default_selected);
                    this.populateSelectedProductImages();
                    this.populateSelectedProductPrice();
                    this.populateSelectedProductOptions();
                    //this.populateSelectedProductReviews(productId);
                    this.displayTitle.innerHTML = this.selectedProduct.title;
document.querySelector('.prod_title').innerText  = this.selectedProduct.title;
                    var splitValues = (this.selectedProduct.title).split('- ');
                    var showcolorname = document.querySelector('.showcolorname');
                if(showcolorname){
                  showcolorname.textContent = splitValues[1];
                }

                    document.querySelector('.prod_title').innerText  = this.selectedProduct.title;
                    this.displayDescription.innerHTML = this.selectedProduct.description;
                    if (this.selectedProduct.model_info) {
                        this.displayModel.innerHTML = this.selectedProduct.model_info;
                        this.displayModel.closest('[data-product-description-considerations]').classList.remove('hidden');
                    } else {
                        this.displayModel.closest('[data-product-description-considerations]').classList.add('hidden');
                    }
                    if (this.selectedProduct.show_discount) {
                        this.displayDiscountMessage.classList.add('active');
                    } else {
                        this.displayDiscountMessage.classList.remove('active');
                    }

                    this.mainSelect.innerHTML = `${this.selectedProduct.variants.map((variant) => `
                        <option value="${variant.id}"
                            ${variant.id === this.currentVariant.id ? 'selected="selected"' : ''}
                        >
                            ${variant.title} - ${variant.price_money}
                        </option>
                    `).join('')}`


                    const bisForm = document.querySelector('.js-bis-form');
                    const success = document.querySelector('.js-bis-success.success');
                    success?.remove();
                    bisForm?.querySelector('button[type="submit"]')?.classList.remove('hidden');

                    // change tags to look for BIS per product
                    document.querySelector('[data-right-drawer-renderer="product-notify-me"]').dataset.tags = this.selectedProduct.tags.join(',')

                    history.replaceState(this.selectedProduct.title, '', this.currentVariant.url);
                    this.checkAtcButton();
                this.ancupdateEventListeners();
                    break;
                case 'option-choice':
                    if (!option) {
                        console.error('Input with [data-action="option-choice"] is missing a [data-option="value"] attr');
                        return;
                    }

                    this.currentVariant = this.selectedProduct.variants
                        .find(({ options }) => options.find((x) => x === option));
                    
                    this.populateSelectedProductPrice();
                    this.mainSelect.value = this.currentVariant.id;
                    history.replaceState(this.selectedProduct.title, '', this.currentVariant.url);
                    this.checkAtcButton();
                    window.dispatchEvent(this.variantUpdatedEvent);
                    break;
                
                default: break;
            }
        })
    }

    checkAtcButton() {
        const atc = document.querySelector('[data-action="add-to-cart"]');
        const notify = document.querySelector('[data-right-drawer-renderer="product-notify-me"]');
        const dataTags = notify.dataset.tags.toLowerCase();
const searchString = 'core'; 
const searchString2 = 'preorder'; 

const hideBIS = dataTags.includes(searchString);
const hideBIS2 = dataTags.includes(searchString2);
        const available = this.currentVariant.available;
        const defaultATCBtnText = atc.dataset.available;
console.log('this.currentVariant.preorder',this.currentVariant.preorder);
       if(this.currentVariant.preorder){
 var inputElement = document.querySelector('input[data-linepropertyname="_pre"][name="properties[Preorder]"]');
         if (!(inputElement)) {
        var inputElementnew = document.createElement('input');
        inputElementnew.type = 'hidden';
        inputElementnew.setAttribute('data-linepropertyname', '_pre');
        inputElementnew.name = 'properties[Preorder]';
        inputElementnew.value = 'Pre Order';
            document.querySelector('.product__description__form__right form').appendChild(inputElementnew);
    }

            atc.innerText = 'PRE ORDER';
             atc.classList.remove('hidden');
             notify.classList.add('hidden');
       }else{  
var inputElement2 = document.querySelector('input[data-linepropertyname="_pre"][name="properties[Preorder]"]');
    if (inputElement2) {
        inputElement2.remove();
    }
     
              if (!hideBIS) {
                  atc.innerText = !available ? 'OUT OF STOCK' : defaultATCBtnText;
                  atc.classList[`${available ? 'remove' : 'add'}`]('disabled');
                  atc.classList.remove('hidden');
                  notify.classList.add('hidden');
                  return;
              } else {
                
                  notify.innerText = 'NOTIFY ME';
                  notify.classList.remove('disabled');
                  atc.innerText = defaultATCBtnText;
                  atc.classList.remove('disabled');
              }
        }
        atc.classList[`${available ? 'remove' : 'add'}`]('hidden');
        notify.classList[`${available ? 'add' : 'remove'}`]('hidden');

        notify.dataset.variant = this.currentVariant.id;
        setOpenDrawerListeners(notify);
    }

    createCustomEvents() {
        this.addToCartEvent = new CustomEvent('coco-shuffle:add-to-cart', {});
        this.productUpdatedEvent = new CustomEvent('coco-shuffle:product-updated', {});
        this.variantUpdatedEvent = new CustomEvent('coco-shuffle:variant-updated', {});
    }

    populateSelectedProductImages() {
        this.imagesWrapper.style.transition = '0.2s';
        this.imagesWrapper.style.opacity = 0;
        this.imagesWrapper.style.minHeight = `${this.imagesWrapper.offsetHeight}px`;

        const onLoad = () => {
            this.imagesWrapper.style.opacity = 1;
            this.imagesWrapper.style.minHeight = 0;
            window.dispatchEvent(this.productUpdatedEvent);
        }
document.querySelector('.prod_img img').src = this.selectedProduct.featured_image;
        const template = this.querySelector('[data-template="product-image"]')?.innerText.replaceAll('`', '');
        setTimeout(() => {
            const imagesHtmlString = this.selectedProduct.images.map(({ alt, src }) => {
                if (!template) return `<img alt="${alt ? alt : this.selectedProduct.title}" src="${src}">`
                return template.replace('{src}', src).replace('{alt}', alt);
            }).join('')
            this.imagesWrapper.innerHTML = imagesHtmlString;

            const allImages = [...this.imagesWrapper.querySelectorAll('img')];
            allImages[allImages.length - 1].onload = onLoad;
        }, 200)
    }

    populateSelectedProductPrice() {
        if (!this.currentVariant) return;

        this.querySelector('[data-compare-price]').innerText = this.currentVariant.compare_at_price_money;
        this.querySelector('[data-product-price]').innerText = this.currentVariant.price_money;
        this.querySelector('[data-discounted-price]').innerText = this.currentVariant.discounted_price;
        document.querySelector('.prod_price').innerText = this.currentVariant.price_money;
// document.querySelector('.announcement-bar__messagee span').innerText = "$" + Math.floor(this.currentVariant.price / 100) / 4;
        // reset styles
        this.querySelector('[data-compare-price]').classList.remove('discounted');
        this.querySelector('[data-compare-price]').classList.remove('hidden');
        this.querySelector('[data-product-price]').classList.remove('sale');
        this.querySelector('[data-product-price]').classList.remove('discounted');
        this.querySelector('[data-discounted-price]').classList.remove('hidden');

        if (this.currentVariant.on_sale) {
            this.querySelector('[data-compare-price]').classList.add('discounted');
        } else {
            this.querySelector('[data-compare-price]').classList.add('hidden');
        }

        if (!this.selectedProduct.show_discount && this.currentVariant.on_sale) {
            this.querySelector('[data-product-price]').classList.add('sale');
            this.querySelector('[data-discounted-price]').classList.add('hidden');
        } else if (!this.selectedProduct.show_discount) {
            this.querySelector('[data-compare-price]').classList.add('hidden');
            this.querySelector('[data-discounted-price]').classList.add('hidden');
        } else if (this.selectedProduct.show_discount) {
            this.querySelector('[data-product-price]').classList.add('discounted');
            this.querySelector('[data-compare-price]').classList.add('hidden');
        }
    }

    populateSelectedProductOptions() {
      const notify2 = document.querySelector('[data-right-drawer-renderer="product-notify-me"]');
        const dataTags2 = notify2.dataset.tags.toLowerCase();
const searchString2 = 'core'; 
const hideBIS2 = dataTags2.includes(searchString2);
const hideBIS3 = this.selectedProduct.tags.includes("purple-dot-live-waitlist");
        const optionsHTMLString = this.selectedProduct.options_with_values.map(({ name, values }) => {
            if (values.length < 2) return;
          return `
            ${values.map((value) => {
              let displayValue="";
              for (let i = 0; i < this.selectedProduct.variants.length; i++) {
                const [firstPart, secondPart] = this.selectedProduct.variants[i].title.split(' ');
                 if (firstPart === value){
                 
                if (this.selectedProduct.variants[i].quantity == 1) {
                    displayValue = " - Only one left";
                }
      if (this.selectedProduct.variants[i].quantity <= 0 && hideBIS2){
         displayValue = " - Get on waitlist";
      }
              }
    
}
                const available = this.selectedProduct.variants.find(({ available, options }) => available && options.find((x) => x == value));
              return `
                   
                        <option 
                            
                            ${this.currentVariant?.options
                        ?.find((x) => x === value) ? 'selected' : ''}
                            class="product__form__variants__option ${available ? '' : 'disabledvariantoption'}" 
                            type="radio" 
                            name="${name}" 
                            value="${value}" 
                            v-id="${this.currentVariant.id}"
                            id="${value}"
                            data-action="option-choice" 
                            data-option="${value}"
                        >${value}${displayValue}</option>
                        
                `

                
            }).join('')}`
        }).join('')

        //this.displayOptions.innerHTML = optionsHTMLString;
        
        const optionsHTMLStringnew = this.selectedProduct.options_with_values.map(({ name, values }) => {
            if (values.length < 2) return;
          return `
            ${values.map((value, index) => {
              let displayValue="";
              for (let i = 0; i < this.selectedProduct.variants.length; i++) {
                const [firstPart, secondPart] = this.selectedProduct.variants[i].title.split(' ');
                 if (firstPart === value){
                 
                if (this.selectedProduct.variants[i].quantity == 1) {
                    displayValue = "<span class='ool'>Only one left</span>";
                }
      if (this.selectedProduct.variants[i].quantity <= 0 && hideBIS2){
if (hideBIS3) {
         displayValue = "<span style='font-size: 11px;color:#000;'>Preorder</span>";
} else {
         displayValue = "<span class='gowl'>Get on waitlist</span>";
}


      }
              }
    
}
              if (index === 0) {
              return `
                   
                        <li 
                            data-option="${value}"
                        ><span>${value}</span>${displayValue}</li>
                        <li 
                            data-option="${value}"
                        ><span>${value}</span>${displayValue}</li>
                        
                `
              }else{
                return `
                   
                        <li 
                            data-option="${value}"
                        ><span>${value}</span>${displayValue}</li>
                        
                `
              }
                
            }).join('')}`
        }).join('')

        this.displayOptionsnew.innerHTML = optionsHTMLStringnew;
    }
}

customElements.define('coco-shuffle', CocoShuffle);









window.addEventListener("klaviyoForms", function(e) {

  if (e.detail.type == 'submit') {
    var _learnq = window._learnq || [];
    var notifyButton = document.getElementById('notifyMe');
    var url_visit = notifyButton.getAttribute('data-variant');
    var vtitle =  document.querySelector('.product__description__form__title').textContent + " - " + document.querySelector('.sizesel_new li span').textContent
      _learnq.push(['identify', {
        'Variant ID' : url_visit,
        'Variant title': vtitle
      }]);
  } 
});





