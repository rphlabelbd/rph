/* =========================================================================
   PRODUCT DATA
   Edit only this array (and the /images folder) to change the slider —
   everything else below reads from it.
   ========================================================================= */
const products = [
  {
    image: "images/product1.png",
    title: "Product One",
    description: "Premium Product",
    price: "$99",
    color: "#d9c9f0"
  },
  {
    image: "images/product2.png",
    title: "Product Two",
    description: "Premium Product",
    price: "$129",
    color: "#4fc3f7"
  },
  {
    image: "images/product3.png",
    title: "Product Three",
    description: "Premium Product",
    price: "$149",
    color: "#d7e14b"
  },
  {
    image: "images/product4.png",
    title: "Product Four",
    description: "Premium Product",
    price: "$199",
    color: "#16382b"
  },
  {
    image: "images/product5.png",
    title: "Product Five",
    description: "Premium Product",
    price: "$249",
    color: "#7cb518"
  }
];

/* =========================================================================
   SIMPLE FLAT SLIDER
   One slide visible at a time, fade + slight slide transition, auto-plays,
   pauses on hover, supports arrows / dots / swipe.
   ========================================================================= */
class ProductSlider {
  constructor({ track, dotsEl, prevBtn, nextBtn }, items) {
    this.track = track;
    this.dotsEl = dotsEl;
    this.prevBtn = prevBtn;
    this.nextBtn = nextBtn;
    this.items = items;
    this.count = items.length;
    this.index = 0;

    this.autoDelay = 3200;   // ms between auto-advances
    this.timer = null;
    this.isHovering = false;

    this._buildDom();
    this._bindEvents();
    this._render();
    this._startAuto();
  }

  _buildDom() {
    this.slideEls = this.items.map((item) => {
      const slide = document.createElement("div");
      slide.className = "slide";
      slide.style.setProperty("--swatch", item.color);
      slide.innerHTML = `
        <div class="slide__art">
          <img src="${item.image}" alt="${item.title}" loading="lazy"
               onerror="this.remove(); this.parentElement.querySelector('.slide__art-fallback').style.display='flex';">
          <div class="slide__art-fallback" style="display:none;">${item.title}</div>
        </div>
        <div class="slide__body">
          <h3 class="slide__name">${item.title}</h3>
          <p class="slide__desc">${item.description}</p>
          <span class="slide__price">${item.price}</span>
        </div>
      `;
      this.track.appendChild(slide);
      return slide;
    });

    this.dotEls = this.items.map((_, i) => {
      const dot = document.createElement("button");
      dot.className = "dot";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => this._goTo(i));
      this.dotsEl.appendChild(dot);
      return dot;
    });
  }

  _bindEvents() {
    this.prevBtn.addEventListener("click", () => this._goTo(this.index - 1));
    this.nextBtn.addEventListener("click", () => this._goTo(this.index + 1));

    const wrap = this.track.closest(".slider");
    wrap.addEventListener("mouseenter", () => { this.isHovering = true; });
    wrap.addEventListener("mouseleave", () => { this.isHovering = false; });

    // basic swipe support
    let startX = 0;
    this.track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    this.track.addEventListener("touchend", (e) => {
      const diff = e.changedTouches[0].clientX - startX;
      if (Math.abs(diff) > 40) this._goTo(this.index + (diff < 0 ? 1 : -1));
    }, { passive: true });
  }

  _startAuto() {
    if (this.timer) clearInterval(this.timer);
    this.timer = setInterval(() => {
      if (!this.isHovering) this._goTo(this.index + 1);
    }, this.autoDelay);
  }

  _goTo(newIndex) {
    this.index = (newIndex + this.count) % this.count;
    this._render();
  }

  _render() {
    this.slideEls.forEach((slide, i) => {
      slide.classList.remove("is-active", "is-prev");
      if (i === this.index) {
        slide.classList.add("is-active");
      } else if (i === (this.index - 1 + this.count) % this.count) {
        slide.classList.add("is-prev");
      }
    });
    this.dotEls.forEach((dot, i) => dot.classList.toggle("is-active", i === this.index));
  }
}

/* =========================================================================
   BOOT
   ========================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  new ProductSlider(
    {
      track: document.getElementById("track"),
      dotsEl: document.getElementById("dots"),
      prevBtn: document.getElementById("prevBtn"),
      nextBtn: document.getElementById("nextBtn")
    },
    products
  );
});
