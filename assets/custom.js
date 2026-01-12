/*########################################################################*/
/*####################------FIXED SCROLLING HEADER-------#################*/
/*########################################################################*/
/**
 * SmartHeader (Final Version)
 * - Handles hide/show on scroll
 * - Adds .blurred ONLY when user scrolls UP and header becomes visible (scrollTop > 10px)
 * - Removes .blurred when scrollTop <= 10
 * - Handles innerpage padding, ResizeObserver, fonts, resizing, etc.
 */

class SmartHeader {
    constructor(options = {}) {
        this.headerSelector = options.headerSelector || '.site-header';
        this.innerpageSelector = options.innerpageSelector || '.innerpage-content';

        this.blurClass = 'blurred';       // class already present in your CSS
        this.innerpageClass = 'has-innerpage';
        this.visibleClass = 'header-visible';
        this.hiddenClass = 'header-hidden';

        this.delta = 10;                 // threshold
        this.header = document.querySelector(this.headerSelector);
        this.lastScrollTop = window.pageYOffset || 0;
        this.headerHeight = 0;
        this.resizeTimeout = null;
        this.ticking = false;

        this.init();
    }

    init() {
        if (!this.header) return;

        this.header.style.transition = 'transform 0.28s ease';
        this.header.style.willChange = 'transform';

        this.updateHeaderHeight();
        this.applyInnerPagePadding();

        this.setupScrollHandler();
        this.setupResizeHandler();
        this.setupFontReady();
        this.setupResizeObserver();

        this.showHeader();
    }

    updateHeaderHeight() {
        this.headerHeight = this.header.offsetHeight;
    }

    applyInnerPagePadding() {
        const innerpage = document.querySelector(this.innerpageSelector);

        document.body.style.paddingTop = '';

        if (innerpage && this.header) {
            this.header.classList.add(this.innerpageClass);
            this.updateHeaderHeight();
            document.body.style.paddingTop = `${this.headerHeight}px`;
        } else {
            this.header.classList.remove(this.innerpageClass);
        }
    }

    setupFontReady() {
        if (document.fonts && document.fonts.ready) {
            document.fonts.ready.then(() => this.update());
        }
    }

    setupResizeObserver() {
        if ('ResizeObserver' in window) {
            new ResizeObserver(() => this.update()).observe(this.header);
        }
    }

    setupResizeHandler() {
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => this.update(), 120);
        });
    }

    setupScrollHandler() {
        const passive = this._supportsPassive() ? { passive: true } : false;

        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, passive);
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || 0;
        const delta = Math.abs(scrollTop - this.lastScrollTop);

        // Only process meaningful scroll
        if (delta <= this.delta) {
            this.lastScrollTop = scrollTop;
            return;
        }

        // === HEADER HIDE/SHOW LOGIC ===
        if (scrollTop > this.lastScrollTop && scrollTop > this.headerHeight) {
            // scrolling down
            this.hideHeader();
        } else {
            // scrolling up
            this.showHeader();

            // === BLUR LOGIC (CORRECTED) ===
            if (scrollTop > 10) {
                // header is visible & away from top → blur it
                this.header.classList.add(this.blurClass);
            }
        }

        // Remove blur when at top
        if (scrollTop <= 10) {
            this.header.classList.remove(this.blurClass);
        }

        this.lastScrollTop = scrollTop;
    }

    hideHeader() {
        this.header.style.transform = 'translateY(-100%)';
        this.header.classList.add(this.hiddenClass);
        this.header.classList.remove(this.visibleClass);

        // Ensure blur is removed while hidden
        this.header.classList.remove(this.blurClass);
    }

    showHeader() {
        this.header.style.transform = 'translateY(0)';
        this.header.classList.add(this.visibleClass);
        this.header.classList.remove(this.hiddenClass);
    }

    update() {
        this.updateHeaderHeight();
        this.applyInnerPagePadding();
    }

    _supportsPassive() {
        let supportsPassive = false;
        try {
            const opts = Object.defineProperty({}, 'passive', {
                get() { supportsPassive = true; }
            });
            window.addEventListener('test', null, opts);
            window.removeEventListener('test', null, opts);
        } catch (e) { }
        return supportsPassive;
    }
}

/* Init */
document.addEventListener('DOMContentLoaded', function () {
    const headerInstance = new SmartHeader();
    window.smartHeader = headerInstance;
});




$(function() {
        

        // Accessibility: reveal header when focusing an element in top nav via keyboard
        $('.nav-left a, .nav-right button, .logo-centered').on('focus', function() {
            $header.removeClass('hidden');
        });

        // Example: clicking product cards placeholder
        $('.product-card, .suggest-card').on('click keypress', function(e) {
            if (e.type === 'click' || (e.type === 'keypress' && (e.which === 13 || e.which === 32))) {
                alert('Open product page (replace with real link).');
            }
        });

        // initialize state
        evaluateHeader($win.scrollTop(), 'none');
    });



/* ===========================================================
   1) COLOR SWATCHES — AUTO APPLY DIFFERENT COLORS
   =========================================================== */
(function () {
  const colors = [
    "#b89f79", "#000000", "#0026ff", "#008000", "#808080", "#8b4513",
    "#cd853f", "#001f3f", "#ff8c00", "#ff69b4", "#ff0000", "#c8a2c8", "#ffffff"
  ];

  const swatches = document.querySelectorAll(".filter-swatch");

  swatches.forEach((btn, i) => {
    const color = colors[i % colors.length]; // cycle colors
    btn.style.backgroundColor = color;
    btn.style.width = "26px";
    btn.style.height = "26px";
    btn.style.borderRadius = "4px";
    btn.style.border = "1px solid rgba(0,0,0,0.12)";
    btn.style.cursor = "pointer";
  });
})();


/* ===========================================================
   2) PRICE RANGE SLIDER (NO UI SLIDER)
   =========================================================== */
(function () {
  const priceContainer = document.querySelector("#priceCollapse");

  if (!priceContainer) return;

  // Remove old inputs:
  const old = priceContainer.querySelector(".mb-3");
  if (old) old.remove();

  // Create new slider wrapper
  const sliderWrap = document.createElement("div");
  sliderWrap.id = "priceRangeSlider";
  sliderWrap.style.margin = "10px 4px 20px 4px";
  priceContainer.appendChild(sliderWrap);

  // Inject slider
  noUiSlider.create(sliderWrap, {
    start: [0, 550],
    connect: true,
    step: 1,
    range: {
      min: 0,
      max: 550
    },
    format: wNumb({
      decimals: 0,
      prefix: "$"
    })
  });

  // Optional output display (add below slider)
  const valueDisplay = document.createElement("div");
  valueDisplay.style.fontSize = "13px";
  valueDisplay.style.marginTop = "10px";
  valueDisplay.textContent = "$0 — $550";
  priceContainer.appendChild(valueDisplay);

  sliderWrap.noUiSlider.on("update", function (values) {
    valueDisplay.textContent = values[0] + " — " + values[1];
  });
})();


/* ===========================================================
   3) PLUS / MINUS ICON TOGGLE FOR COLLAPSE PANELS
   =========================================================== */
(function () {
  const toggleButtons = document.querySelectorAll(
    '[data-bs-toggle="collapse"]'
  );

  toggleButtons.forEach((btn) => {
    const icon = btn.querySelector("i");
    const targetId = btn.getAttribute("data-bs-target");
    const collapseEl = document.querySelector(targetId);

    if (!collapseEl || !icon) return;

    // Set initial icon state
    const isOpen = collapseEl.classList.contains("show");
    icon.className = isOpen ? "bi bi-dash-lg" : "bi bi-plus-lg";

    // Listen to Bootstrap events
    collapseEl.addEventListener("show.bs.collapse", () => {
      icon.className = "bi bi-dash-lg";
    });

    collapseEl.addEventListener("hide.bs.collapse", () => {
      icon.className = "bi bi-plus-lg";
    });
  });
})();



 



/*COLOR SWATCHES JS ON PRODUCT LISTING*/ 
 
(function () {

  /* Your 8 uploaded images */
  const demoImages = [
    "images/product-1.jpg",
    "images/product-2.jpg",
    "images/product-3.jpg",
    "images/product-4.jpg",
    "images/product2-1.jpg",
    "images/product2-2.jpg",
    "images/product2-3.jpg",
    "images/product2-4.jpg"
  ];

  function getRandomImage() {
    return demoImages[Math.floor(Math.random() * demoImages.length)];
  }

  const swatches = document.querySelectorAll('.product-color-swatch');

  swatches.forEach(btn => {
    const color = (btn.dataset.color || '#ccc').trim();

    // Basic inline styling (visible swatch)
    btn.style.width = '14px';
    btn.style.height = '14px';
    btn.style.borderRadius = '50%';
    btn.style.display = 'inline-block';
    btn.style.border = '1px solid rgba(0,0,0,0.18)';
    btn.style.backgroundColor = color;
    btn.style.cursor = 'pointer';
    btn.style.marginRight = '6px';
    btn.style.padding = '0';
    btn.style.boxSizing = 'border-box';
    btn.style.verticalAlign = 'middle';
    btn.style.outline = 'none';
    btn.setAttribute('tabindex', '0');
    btn.setAttribute('role', 'button');
    btn.setAttribute('aria-pressed', 'false');

    function findProductImage(el) {
      const parent = el.closest('.product-block');
      if (!parent) return null;
      return parent.querySelector('.product-block__image');
    }

    btn.addEventListener('click', function () {

      // update selected state
      const parent = btn.closest('.product-block__colors');
      parent.querySelectorAll('.product-color-swatch').forEach(s => {
        s.classList.remove('is-selected');
        s.style.boxShadow = '';
        s.setAttribute('aria-pressed', 'false');
      });

      btn.classList.add('is-selected');
      btn.style.boxShadow = '0 0 0 2px rgba(0,0,0,0.14)';
      btn.setAttribute('aria-pressed', 'true');

      // 👉 RANDOM IMAGE SWITCH
      const img = findProductImage(btn);
      if (img) {
        const randomSrc = getRandomImage();
        img.src = randomSrc;
      }
    });

    btn.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });
  });

})();


/*PRODUCT DETAILS PAGE*/
// Interaction JS: swatches, sizes, add-to-cart, accordion icon state
    (function () {
      // Color swatches
      document.querySelectorAll('.product__swatch').forEach(function (sw) {
        const color = sw.dataset.color || sw.getAttribute('aria-label') || '#cccccc';
        // apply background color
        sw.style.backgroundColor = color;
        sw.setAttribute('tabindex', '0');

        sw.addEventListener('click', function () {
          const parent = sw.parentElement;
          parent.querySelectorAll('.product__swatch').forEach(s => s.classList.remove('is-selected'));
          sw.classList.add('is-selected');
        });
        sw.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            sw.click();
          }
        });
      });

      // Default select first swatch
      const firstSw = document.querySelector('.product__swatch');
      if (firstSw) firstSw.classList.add('is-selected');

      // Size selection
      document.querySelectorAll('.product__size').forEach(function (btn) {
        btn.addEventListener('click', function () {
          const parent = btn.closest('.product__sizes');
          parent.querySelectorAll('.product__size').forEach(s => s.classList.remove('is-selected'));
          btn.classList.add('is-selected');
        });
      });

      // Default select first size
      const firstSize = document.querySelector('.product__size');
      if (firstSize) firstSize.classList.add('is-selected');

      // Add to cart placeholder
      const addBtn = document.getElementById('addToCartBtn');
      if (addBtn) {
        addBtn.addEventListener('click', function () {
          addBtn.disabled = true;
          addBtn.textContent = 'Added';
          setTimeout(() => {
            addBtn.disabled = false;
            addBtn.innerHTML = '<i class="bi bi-bag me-2" aria-hidden="true"></i> Add to cart';
          }, 1200);
        });
      }

      // Accordion icon toggle: change icon in button text left/right if you'd like.
      // Using Bootstrap's collapse events to toggle an appended icon (kept minimal).
      document.querySelectorAll('.accordion-button').forEach(function (btn) {
        // Ensure the collapsed state is correct on load
        const target = document.querySelector(btn.getAttribute('data-bs-target'));
        if (target && target.classList.contains('show')) {
          btn.classList.remove('collapsed');
        } else {
          btn.classList.add('collapsed');
        }
      });

      // Optional: keyboard accessibility already handled by buttons
    })(); 
