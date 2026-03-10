// Loader
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 1000);
        // Trigger initial GSAP animations
        initHeroAnimations();
    }, 1500);
});

// Navbar Scroll Effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Floating Anti-Gravity Elements generator
const parallaxContainer = document.getElementById('parallax-container');
const floatingItems = [
    'https://cdn-icons-png.flaticon.com/512/1047/1047462.png', // coffee bean
    'https://cdn-icons-png.flaticon.com/512/1047/1047462.png',
    'https://cdn-icons-png.flaticon.com/512/450/450302.png', // leaf
    'https://cdn-icons-png.flaticon.com/512/2921/2921762.png', // splash/drop
];

function createFloatingElements() {
    for (let i = 0; i < 15; i++) {
        const item = document.createElement('div');
        item.classList.add('floating-item');
        
        // Random size between 20px and 60px
        const size = Math.random() * 40 + 20;
        item.style.width = `${size}px`;
        item.style.height = `${size}px`;
        
        // Random image
        item.style.backgroundImage = `url(${floatingItems[Math.floor(Math.random() * floatingItems.length)]})`;
        item.style.opacity = Math.random() * 0.4 + 0.1;
        item.style.filter = `blur(${Math.random() * 3}px)`;
        
        // Random position
        item.style.left = `${Math.random() * 100}%`;
        item.style.top = `${Math.random() * 100}%`;
        
        parallaxContainer.appendChild(item);

        // GSAP Anti-gravity animation
        gsap.to(item, {
            y: `-=${Math.random() * 200 + 100}`,
            x: `+=${Math.random() * 100 - 50}`,
            rotation: Math.random() * 360,
            duration: Math.random() * 10 + 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
}
createFloatingElements();

// Mouse Parallax for Hero Elements
document.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
    
    gsap.to('#hero-tilt', {
        rotationY: xAxis,
        rotationX: yAxis,
        ease: "power1.out",
        transformPerspective: 1000,
        transformOrigin: "center"
    });

    gsap.to('.floating-item', {
        x: xAxis * 2,
        y: yAxis * 2,
        ease: "power1.out"
    });
});

// Initial Hero Animations
function initHeroAnimations() {
    const tl = gsap.timeline();
    tl.to('.brand-name', { opacity: 1, y: 0, duration: 1, ease: 'power3.out' })
      .to('.tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
      .to('.sub-tagline', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6")
      .to('.cta-group', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, "-=0.6");
}

// 2. Best Seller Circular Slider Data & Logic
const sliderData = [
    { title: "Espresso Tango", price: "₹250", desc: "A perfect blend of citrus and strong espresso.", img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop" },
    { title: "Cold Brew Storm", price: "₹280", desc: "Slow steeped for 24 hours, extra smooth.", img: "https://images.unsplash.com/photo-1517701550927-30cfcb64d5ed?q=80&w=400&auto=format&fit=crop" },
    { title: "Caramel Latte", price: "₹220", desc: "Creamy whole milk, espresso, and rich caramel.", img: "https://images.unsplash.com/photo-1557006021-b85faa2bc5e2?q=80&w=400&auto=format&fit=crop" },
    { title: "Mocha Frost", price: "₹260", desc: "Iced chocolatey goodness topped with foam.", img: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?q=80&w=400&auto=format&fit=crop" },
    { title: "Vanilla Iced Coffee", price: "₹200", desc: "Classic iced coffee with Madagascar vanilla.", img: "https://images.unsplash.com/photo-1461023058943-07cb1ce8db11?q=80&w=400&auto=format&fit=crop" }
];

const orbit = document.getElementById('slider-orbit');
const activeTitle = document.getElementById('active-title');
const activePrice = document.getElementById('active-price');
const activeDesc = document.getElementById('active-desc');
const radius = window.innerWidth > 900 ? 400 : 200;
let currentAngle = 0;
let activeIndex = 0;

function initSlider() {
    const angleStep = 360 / sliderData.length;
    
    sliderData.forEach((item, index) => {
        const angle = angleStep * index;
        const radian = angle * (Math.PI / 180);
        
        const el = document.createElement('div');
        el.className = 'slider-item';
        if (index === 0) el.classList.add('active');
        
        const img = document.createElement('img');
        img.src = item.img;
        el.appendChild(img);
        
        // Position items on circle boundary based heavily on orbit element boundaries relative to the center
        const x = Math.cos(radian) * radius;
        const y = Math.sin(radian) * radius;
        
        el.style.transform = `translate(${x}px, ${y}px)`;
        // Store original transform to reapply scaling without breaking positions
        el.dataset.angle = angle;
        el.dataset.origX = x;
        el.dataset.origY = y;
        el.dataset.index = index;
        
        el.addEventListener('click', () => rotateToItem(index));
        
        orbit.appendChild(el);
    });
    
    updateSliderUI();
}

function rotateToItem(index) {
    if (activeIndex === index) return;
    
    // We want to bring selected item to bottom (angle 90deg technically with sin/cos standard, but visually it depends)
    // Let's just simply rotate the orbit incrementally
    const angleStep = 360 / sliderData.length;
    const diff = index - activeIndex;
    
    currentAngle -= diff * angleStep;
    orbit.style.transform = `translate(-50%, -50%) rotate(${currentAngle}deg)`;
    
    // Reverse rotation on items to keep them upright
    const items = document.querySelectorAll('.slider-item');
    items.forEach(item => {
        item.style.transform = `translate(${item.dataset.origX}px, ${item.dataset.origY}px) rotate(${-currentAngle}deg)`;
        item.classList.remove('active');
    });
    
    items[index].classList.add('active');
    // Ensure active gets scaled up
    items[index].style.transform = `translate(${items[index].dataset.origX}px, ${items[index].dataset.origY}px) rotate(${-currentAngle}deg) scale(2.5) translateZ(50px)`;
    
    activeIndex = index;
    updateSliderUI();
}

function updateSliderUI() {
    gsap.to('.active-item-info', { opacity: 0, duration: 0.3, onComplete: () => {
        activeTitle.innerText = sliderData[activeIndex].title;
        activePrice.innerText = sliderData[activeIndex].price;
        activeDesc.innerText = sliderData[activeIndex].desc;
        gsap.to('.active-item-info', { opacity: 1, duration: 0.3 });
    }});
}

initSlider();

// Auto rotate every 4s
setInterval(() => {
    let nextIndex = (activeIndex + 1) % sliderData.length;
    rotateToItem(nextIndex);
}, 4000);


// 3. Menu / Food Cards Logic
const menuData = [
    { title: "Chilli Cheese Toast", price: "₹200", cat: "fastfood", img: "https://images.unsplash.com/photo-1541580621-ea820e1766a5?q=80&w=400&auto=format&fit=crop", desc: "Spicy melted cheese on crispy artisan bread." },
    { title: "Peri Peri Chicken Burger", price: "₹350", cat: "fastfood", img: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop", desc: "Juicy chicken patty, spicy peri peri sauce, fresh lettuce." },
    { title: "Blueberry Cheesecake", price: "₹280", cat: "dessert", img: "https://images.unsplash.com/photo-1533134242443-d4fdac3b71f4?q=80&w=400&auto=format&fit=crop", desc: "New york style baked cheesecake with blueberry compote." },
    { title: "Thai Green Curry", price: "₹450", cat: "fastfood", img: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=400&auto=format&fit=crop", desc: "Served with fragrant Jasmine Rice." },
    { title: "Orange Milkshake", price: "₹220", cat: "coffee", img: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=400&auto=format&fit=crop", desc: "Creamy vanilla blended with fresh orange zest." },
    { title: "Mexican Veg Pizza", price: "₹380", cat: "fastfood", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=400&auto=format&fit=crop", desc: "Topped with jalapenos, corn, olives, and cheese." }
];

const menuGrid = document.querySelector('.menu-grid');
function renderMenu(filter = 'all') {
    menuGrid.innerHTML = '';
    const filtered = filter === 'all' ? menuData : menuData.filter(item => item.cat === filter);
    
    filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="card-img-wrapper">
                <img src="${item.img}" loading="lazy" alt="${item.title}">
            </div>
            <div class="card-info">
                <div class="card-header">
                    <h3 class="card-title">${item.title}</h3>
                    <span class="card-price">${item.price}</span>
                </div>
                <p class="card-desc">${item.desc}</p>
                <button class="add-to-cart">Add to Order</button>
            </div>
        `;
        menuGrid.appendChild(card);
    });
}
renderMenu();

// Filter Buttons
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderMenu(e.target.dataset.filter);
        
        // Animate cards entry
        gsap.from('.menu-card', {
            y: 50,
            opacity: 0,
            stagger: 0.1,
            duration: 0.5,
            ease: "power2.out"
        });
    });
});

// 4. Unique Gallery Interaction
const galleryTrack = document.getElementById('gallery-track');
const galleryImages = [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1507133750070-4cb503254c00?q=80&w=600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521017432531-fbd92d768814?q=80&w=600&auto=format&fit=crop",
];

galleryImages.forEach(imgSrc => {
    const el = document.createElement('div');
    el.className = 'polaroid';
    
    // Random initial tilts
    const rotation = Math.random() * 20 - 10;
    const yOffset = Math.random() * 40 - 20;
    el.style.transform = `rotate(${rotation}deg) translateY(${yOffset}px)`;
    
    el.innerHTML = `<img src="${imgSrc}" loading="lazy" alt="Gallery Image">`;
    galleryTrack.appendChild(el);
});

// Horizontal scroll on gallery container
const galleryContainer = document.querySelector('.gallery-container');
let isDown = false;
let startX;
let scrollLeft;

galleryContainer.addEventListener('mousedown', (e) => {
    isDown = true;
    startX = e.pageX - galleryContainer.offsetLeft;
    scrollLeft = galleryTrack.offsetLeft;
});
galleryContainer.addEventListener('mouseleave', () => isDown = false);
galleryContainer.addEventListener('mouseup', () => isDown = false);
galleryContainer.addEventListener('mousemove', (e) => {
    if(!isDown) return;
    e.preventDefault();
    const x = e.pageX - galleryContainer.offsetLeft;
    const walk = (x - startX) * 2; // scroll-fast
    galleryTrack.style.transform = `translateX(${walk}px)`;
});


// 5. Reviews Section (3D Orbit)
const reviewsData = [
    { name: "Rahul S.", text: "Best chilli cheese toast in Manikonda! Great vibe.", stars: "★★★★★", avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Priya M.", text: "Love the blueberry cheesecake and the cozy atmosphere.", stars: "★★★★☆", avatar: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Arjun K.", text: "Perfect place to chill. Their Orange Milkshake is extra-ordinary!", stars: "★★★★★", avatar: "https://randomuser.me/api/portraits/men/67.jpg" },
    { name: "Sneha R.", text: "Beautiful interiors and great coffee blends.", stars: "★★★★★", avatar: "https://randomuser.me/api/portraits/women/12.jpg" }
];

const reviewsOrbit = document.querySelector('.reviews-orbit');

reviewsData.forEach((review, index) => {
    const angleStep = 360 / reviewsData.length;
    const angle = angleStep * index;
    const radian = angle * (Math.PI / 180);
    const radX = 350; // Orbit width
    const radY = 100; // Orbit height for 3D perspective effect
    
    const x = Math.cos(radian) * radX;
    const y = Math.sin(radian) * radY;
    
    const bubble = document.createElement('div');
    bubble.className = 'review-bubble';
    
    // Adjust depth (z-index and scale based on y position in ellipse)
    const zScale = (y + radY) / (2 * radY); // 0 to 1
    const finalScale = 0.7 + (zScale * 0.3); // 0.7 to 1.0
    const zIndex = Math.floor(zScale * 100);
    
    bubble.style.left = `calc(50% + ${x}px - 140px)`; // 140 is half width
    bubble.style.top = `calc(50% + ${y}px - 75px)`; // approx half height
    bubble.style.transform = `scale(${finalScale})`;
    bubble.style.zIndex = zIndex;
    
    // Slight float animation with different delays
    bubble.style.animation = `bounce ${3 + Math.random()}s infinite alternate ease-in-out`;
    bubble.style.animationDelay = `${Math.random()}s`;

    bubble.innerHTML = `
        <div class="review-header">
            <img src="${review.avatar}" alt="Avatar">
            <div>
                <div class="review-name">${review.name}</div>
                <div class="review-stars">${review.stars}</div>
            </div>
        </div>
        <div class="review-text">"${review.text}"</div>
        <div class="reactions">☕ 😍</div>
    `;
    
    reviewsOrbit.appendChild(bubble);
});

// ScrollTrigger Animations Global
gsap.registerPlugin(ScrollTrigger);

// Fade in headers
gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header, {
        scrollTrigger: {
            trigger: header,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1
    });
});

// Glass container float up
gsap.from('.glass-container', {
    scrollTrigger: {
        trigger: '.location',
        start: "top 70%"
    },
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power3.out"
});
