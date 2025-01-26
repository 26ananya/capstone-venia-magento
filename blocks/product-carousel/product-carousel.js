function updateActiveSlide(slide) {
    const block = slide.closest('.product-carousel');
    const slideIndex = parseInt(slide.dataset.slideIndex, 10);
    block.dataset.activeSlide = slideIndex;
   
    const slides = block.querySelectorAll('.product-carousel-slide');
   
    slides.forEach((aSlide, idx) => {
      //aSlide.setAttribute('aria-hidden', idx !== slideIndex);
      aSlide.querySelectorAll('a').forEach((link) => {
        if (idx !== slideIndex) {
          link.setAttribute('tabindex', '-1');
        } else {
          link.removeAttribute('tabindex');
        }
      });
    });
   
    const indicators = block.querySelectorAll('.product-carousel-slide-indicator');
    indicators.forEach((indicator, idx) => {
      if (idx !== slideIndex) {
        indicator.querySelector('button').removeAttribute('disabled');
      } else {
        //indicator.querySelector('button').setAttribute('disabled', 'true');
      }
    });
  }
   
  function showSlide(block, slideIndex = 0) {
    const slides = block.querySelectorAll('.product-carousel-slide');
    console.log('hi')
    let realSlideIndex = slideIndex < 0 ? slides.length - 1 : slideIndex;
    if (slideIndex >= slides.length) realSlideIndex = 0;
    const activeSlide = slides[realSlideIndex];
   
    activeSlide.querySelectorAll('a').forEach((link) => link.removeAttribute('tabindex'));
    block.querySelector('.product-carousel-slides').scrollTo({
      top: 0,
      left: activeSlide.offsetLeft,
      behavior: 'smooth',
    });
  }

  function bindEvents(block) {
    const slideIndicators = block.querySelector('.product-carousel-slide-indicators');
    if (!slideIndicators) return;
   console.log(slideIndicators)
    slideIndicators.querySelectorAll('button').forEach((button) => {
        console.log(button);
        button.classList.add('test');
        button.setAttribute('disabled',false);
        
      button.addEventListener('click', (e) => {
        console.log('clicked');
        const slideIndicator = e.currentTarget.parentElement;
        showSlide(block, parseInt(slideIndicator.dataset.targetSlide, 10));
      });
    });
   
  
   
    const slideObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) updateActiveSlide(entry.target);
      });
    }, { threshold: 0.5 });
    block.querySelectorAll('.product-carousel-slide').forEach((slide) => {
      slideObserver.observe(slide);
    });
  }
   
  export default async function decorate(block) {
    const response = await fetch("query-index.json");
    const json = await response.json();
    const carouselData = json.data.filter(item => item.path.includes("/products"));
    const isSingleSlide = carouselData.length < 2;
    function generateCarousel(carouselData) {
      // Create the outer carousel container
      const carousel = document.createElement('div');
      carousel.classList.add('product-carousel');
      carousel.setAttribute('role', 'region');
      carousel.setAttribute('aria-roleprice', 'product-carousel');
      carousel.setAttribute('data-active-slide', '0');
   
      // Create the slides container
      const slidesContainer = document.createElement('div');
      slidesContainer.classList.add('product-carousel-slides-container');
   
      // Create navigation buttons
      const navButtons = document.createElement('div');
      navButtons.classList.add('product-carousel-navigation-buttons');
 
      slidesContainer.appendChild(navButtons);
   
      // Create the slides wrapper (ul)
      const slidesWrapper = document.createElement('ul');
      slidesWrapper.classList.add('product-carousel-slides');
      carouselData.forEach((data, index) => {
        const slide = createSlide(data, index);
        slidesWrapper.appendChild(slide);
      });
      slidesContainer.appendChild(slidesWrapper);
   
      // Create the slide indicators (ol)
      const slideIndicators = document.createElement('ol');
      slideIndicators.classList.add('product-carousel-slide-indicators');
      const isDesktop = window.matchMedia('(min-width: 900px)').matches;
   
      carouselData.forEach((_, index) => {
        if (isDesktop) {
          if (index % 5 == 0) {
            const indicator = createSlideIndicator(index, carouselData.length);
            slideIndicators.appendChild(indicator);
          }
        }
        else {
          if (index % 2 == 0) {
            const indicator = createSlideIndicator(index, carouselData.length);
            slideIndicators.appendChild(indicator);
          }
   
        }
      })
   
      // Create the carousel navigation controls
      const navControls = document.createElement('nav');
      navControls.setAttribute('aria-label', 'product-carousel Slide Controls');
      navControls.appendChild(slideIndicators);
      carousel.appendChild(slidesContainer);
      carousel.appendChild(navControls);
      return carousel;
   
      // Append the carousel to the body or desired container
   
    }
   
    function createSlide(data, index) {
      const slide = document.createElement('li');
      slide.classList.add('product-carousel-slide');
      slide.dataset.slideIndex = index;
      slide.setAttribute('data-slide-index', index);
      //slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
      slide.setAttribute('id', `product-carousel-1-slide-${index}`);
   
      // Create the slide image
      const imageDiv = document.createElement('a');
      imageDiv.classList.add('product-carousel-slide-image');
      const picture = document.createElement('picture');
   
      const sourceWebp1 = document.createElement('source');
      sourceWebp1.setAttribute('type', 'image/webp');
      sourceWebp1.setAttribute('srcset', `${data.image}?width=2000&format=webply&optimize=medium`);
      picture.appendChild(sourceWebp1);
   
      const sourceWebp2 = document.createElement('source');
      sourceWebp2.setAttribute('type', 'image/webp');
      sourceWebp2.setAttribute('srcset', `${data.image}?width=750&format=webply&optimize=medium`);
      picture.appendChild(sourceWebp2);
   
      const img = document.createElement('img');
      img.setAttribute('loading', 'lazy');
      img.setAttribute('src', `${data.image}?width=750&format=png&optimize=medium`);
      img.setAttribute('alt', data.altText);
      img.setAttribute('width', '1440');
      img.setAttribute('height', '660');
      picture.appendChild(img);
      imageDiv.appendChild(picture);
      imageDiv.setAttribute("href", data.path);
      slide.appendChild(imageDiv);
   
      // Create slide content (text and linlink)
      const contentDiv = document.createElement('div');
      contentDiv.classList.add('product-carousel-slide-content');
   
      const heading = document.createElement('h4');
      heading.setAttribute('id', `product-carousel-1-slide-title-${index}`);
      heading.textContent = data.title;
      contentDiv.appendChild(heading);
   
      const price = document.createElement('p');
      price.textContent = data.price;
      contentDiv.appendChild(price);
   
      const link = document.createElement('a');
      link.setAttribute('href', data.path);
      link.setAttribute('title', 'ADD TO CART');
      link.textContent = 'ADD TO CART';
      contentDiv.appendChild(link);
   
      slide.appendChild(contentDiv);
      return slide;
    }
   
    function createSlideIndicator(index, totalSlides) {
      const indicator = document.createElement('li');
      indicator.classList.add('product-carousel-slide-indicator');
      indicator.dataset.targetSlide = index;
      console.log(indicator.dataset.targetSlide );
      indicator.setAttribute('data-target-slide', index);
      const button = document.createElement('button');
      button.setAttribute('type', 'button');
      button.setAttribute('aria-label', `Show Slide ${index + 1} of ${totalSlides}`);
    //   if (index === 0) {
    //     button.setAttribute('disabled', 'true');
    //   }
      indicator.appendChild(button);
      return indicator;
    }
   
    // Initialize the carousel with the data
    const carousel = generateCarousel(carouselData);
    block.prepend(carousel);
   
    if (!isSingleSlide) {
      bindEvents(block);
    }
  }
   

