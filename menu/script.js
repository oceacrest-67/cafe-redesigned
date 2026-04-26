/* 
    Brew & Byte - Menu Component Logic
    Dynamic Fetch-Based Menu Rendering
*/

const DATA_ROOT = 'data/';
const CONFIG = {
    categoryIconFallback: '🍽️',
    itemImage: '0.png',
};

// ── State Management ──
let allItems = [];
let categories = [];
let activeCategory = 'all';
let searchQuery = '';

// ── DOM Elements ──
const $categoryNav = document.getElementById('category-nav');
const $menuGrid = document.getElementById('menu-grid');
const $searchInput = document.getElementById('search-input');
const $clearSearch = document.getElementById('clear-search');
const $resultsMeta = document.getElementById('results-meta');
const $emptyState = document.getElementById('empty-state');
const $itemModal = document.getElementById('item-modal');
const $closeModal = document.getElementById('close-modal');

// ── Initialization ──
async function initMenu() {
    // GSAP Performance Optimization
    gsap.ticker.lagSmoothing(1000, 16);
    
    showSkeletons();
    try {
        const response = await fetch(`${DATA_ROOT}index.json`);
        if (!response.ok) throw new Error('Failed to load menu categories');
        
        const indexData = await response.json();
        categories = indexData.categories;

        // Parallel fetch for all item data
        const itemFetches = [];
        categories.forEach(cat => {
            cat.items.forEach(itemId => {
                itemFetches.push(fetchItemData(cat.id, itemId));
            });
        });

        const results = await Promise.all(itemFetches);
        allItems = results.filter(Boolean);

        renderCategoryNav();
        renderMenu();
        animateEntrance();

    } catch (error) {
        console.error('Menu Init Error:', error);
        $menuGrid.innerHTML = `<p class="error-msg">Unable to load the menu. Please try again later.</p>`;
    }
}

async function fetchItemData(categoryId, itemId) {
    try {
        const path = `${DATA_ROOT}${categoryId}/${itemId}/`;
        const response = await fetch(`${path}data.json`);
        if (!response.ok) return null;
        
        const data = await response.json();
        return {
            ...data,
            id: `${categoryId}-${itemId}`,
            categoryId,
            itemId,
            imagePath: `${path}${CONFIG.itemImage}`
        };
    } catch (e) {
        return null;
    }
}

// ── Rendering ──
function renderCategoryNav() {
    $categoryNav.innerHTML = '';
    
    // Add "All" category
    const allBtn = createCategoryBtn({ id: 'all', name: 'All', icon: '✨' });
    $categoryNav.appendChild(allBtn);

    categories.forEach(cat => {
        const btn = createCategoryBtn(cat);
        $categoryNav.appendChild(btn);
    });
}

function createCategoryBtn(cat) {
    const btn = document.createElement('button');
    btn.className = `cat-btn ${activeCategory === cat.id ? 'active' : ''}`;
    btn.innerHTML = `<span class="icon">${cat.icon || CONFIG.categoryIconFallback}</span> ${cat.name}`;
    btn.onclick = () => selectCategory(cat.id);
    return btn;
}

function selectCategory(catId) {
    activeCategory = catId;
    document.querySelectorAll('.cat-btn').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.includes(categories.find(c => c.id === catId)?.name || 'All'));
    });
    
    // Reset search when switching categories if needed, or keep it. Let's keep it for better UX.
    renderMenu();
}

function renderMenu() {
    const filtered = allItems.filter(item => {
        const matchesCat = activeCategory === 'all' || item.categoryId === activeCategory;
        const matchesSearch = !searchQuery || 
            item.name.toLowerCase().includes(searchQuery) || 
            item.description.toLowerCase().includes(searchQuery);
        return matchesCat && matchesSearch;
    });

    $menuGrid.innerHTML = '';
    
    if (filtered.length === 0) {
        $emptyState.style.display = 'block';
        $resultsMeta.textContent = '';
    } else {
        $emptyState.style.display = 'none';
        $resultsMeta.textContent = `${filtered.length} ${filtered.length === 1 ? 'item' : 'items'} found`;
        
        filtered.forEach((item, index) => {
            const card = createMenuCard(item, index);
            $menuGrid.appendChild(card);
        });
    }
}

function createMenuCard(item, index) {
    const card = document.createElement('div');
    card.className = 'menu-card';
    card.onclick = () => openModal(item);
    
    const isVeg = item.type === 'veg';

    card.innerHTML = `
        <div class="card-img-wrapper">
            <div class="type-indicator ${isVeg ? 'veg' : 'non-veg'}"></div>
            <img src="${item.imagePath}" alt="${item.name}" loading="lazy" decoding="async" onerror="this.src='../assets/images/pics/Logo.png'">
        </div>
        <div class="card-body">
            <h3 class="card-title">${item.name}</h3>
            <p class="card-description">${item.description}</p>
            <div class="card-footer">
                <span class="price">${item.price}</span>
                <button class="add-btn" aria-label="View Details"><i class="fa-solid fa-plus"></i></button>
            </div>
        </div>
    `;

    // Entrance animation using GSAP
    gsap.fromTo(card, 
        { opacity: 0, y: 30, scale: 0.95 },
        { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 0.5, 
            delay: (index % 8) * 0.05, 
            ease: "back.out(1.2)" 
        }
    );

    return card;
}

// ── Search Logic ──
let searchTimeout;
$searchInput.oninput = (e) => {
    const val = e.target.value.toLowerCase().trim();
    $clearSearch.classList.toggle('visible', val.length > 0);
    
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        searchQuery = val;
        renderMenu();
    }, 200);
};

$clearSearch.onclick = () => {
    $searchInput.value = '';
    searchQuery = '';
    $clearSearch.classList.remove('visible');
    renderMenu();
};

// ── Modal Logic ──
function openModal(item) {
    const isVeg = item.type === 'veg';
    
    document.getElementById('modal-item-name').innerText = item.name;
    document.getElementById('modal-item-desc').innerText = item.description;
    document.getElementById('modal-item-price').innerText = item.price;
    document.getElementById('modal-item-type').innerText = isVeg ? 'Vegetarian' : 'Non-Vegetarian';
    document.getElementById('modal-item-type').className = `item-type-badge ${isVeg ? 'veg' : 'non-veg'}`;
    
    const imgContainer = document.getElementById('modal-img-container');
    imgContainer.innerHTML = `<img src="${item.imagePath}" alt="${item.name}" onerror="this.src='../assets/images/pics/Logo.png'">`;

    $itemModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    // Modal Entrance Animation
    gsap.fromTo(".modal-content", 
        { y: "100%" }, 
        { y: "0%", duration: 0.5, ease: "power4.out" }
    );
    gsap.fromTo($itemModal, 
        { backgroundColor: "rgba(0,0,0,0)" }, 
        { backgroundColor: "rgba(0,0,0,0.4)", duration: 0.5 }
    );
}

function closeModal() {
    gsap.to(".modal-content", { 
        y: "100%", 
        duration: 0.4, 
        ease: "power4.in",
        onComplete: () => {
            $itemModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    gsap.to($itemModal, { backgroundColor: "rgba(0,0,0,0)", duration: 0.4 });
}

$closeModal.onclick = closeModal;
$itemModal.onclick = (e) => {
    if (e.target === $itemModal) closeModal();
};

// ── Helper UI ──
function showSkeletons() {
    $menuGrid.innerHTML = Array(8).fill(0).map(() => `
        <div class="menu-card" style="opacity: 1;">
            <div class="card-img-wrapper skeleton"></div>
            <div class="card-body">
                <div class="card-title skeleton" style="height: 18px; width: 70%; border-radius: 4px;"></div>
                <div class="card-description skeleton" style="height: 12px; margin-top: 8px; border-radius: 4px;"></div>
                <div class="card-description skeleton" style="height: 12px; margin-top: 4px; width: 85%; border-radius: 4px;"></div>
                <div class="card-footer" style="margin-top: 12px;">
                    <div class="skeleton" style="height: 20px; width: 40px; border-radius: 4px;"></div>
                    <div class="skeleton" style="height: 28px; width: 28px; border-radius: 50%;"></div>
                </div>
            </div>
        </div>
    `).join('');
}

function animateEntrance() {
    gsap.from("#header", { y: -50, opacity: 0, duration: 0.8, ease: "power3.out" });
}

// Start the app
initMenu();
