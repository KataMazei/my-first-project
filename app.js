const charactersData = [
    { id: 1, name: "Финн Парнишка", species: "Человек", kingdom: "Конфетное королевство", category: "Главные герои", icon: "⚔️", bio: "Последний человек Земли Ууу, бесстрашный герой и верный друг." },
    { id: 2, name: "Джейк Пёс", species: "Волшебный пёс", kingdom: "Конфетное королевство", category: "Главные герои", icon: "🐶", bio: "Волшебный пес, способный принимать любые формы. Наставник и брат Финна." },
    { id: 3, name: "Принцесса Бубыльгум", species: "Конфетная масса", kingdom: "Конфетное королевство", category: "Королевские особы", icon: "👑", bio: "Правительница Конфетного королевства, гениальный ученый и изобретатель." },
    { id: 4, name: "Ледяной Король", species: "Волшебник", kingdom: "Ледяные земли", category: "Злодеи", icon: "❄️", bio: "Правитель ледяного королевства, постоянно похищающий принцесс." },
    { id: 5, name: "Марселин", species: "Вампир / Демон", kingdom: "Дикие земли", category: "Главные герои", icon: "🎸", bio: "Королева вампиров, живущая уже более тысячи лет. Обожает рок-музыку." }
];

function toggleMenu() {
    document.getElementById('nav-links').classList.toggle('open');
}

function renderCards(containerId, items) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    let favorites = JSON.parse(localStorage.getItem('fav_chars')) || [];

    if (items.length === 0) {
        container.innerHTML = `<div class="empty-state">По вашему запросу ничего не найдено 🔍</div>`;
        return;
    }

    items.forEach(char => {
        const isFav = favorites.includes(char.id);
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <span class="fav-icon ${isFav ? 'active' : ''}" onclick="toggleFavorite(event, ${char.id})">❤</span>
            <div class="card-img-placeholder">${char.icon}</div>
            <div class="card-content">
                <h3 class="card-title">${char.name}</h3>
                <p style="font-size:14px; color:#666;">${char.category}</p>
                <button class="card-btn" onclick="openModal(${char.id})">Подробнее</button>
            </div>
        `;
        container.appendChild(card);
    });
}

function toggleFavorite(event, id) {
    event.stopPropagation();
    let favorites = JSON.parse(localStorage.getItem('fav_chars')) || [];
    if (favorites.includes(id)) {
        favorites = favorites.filter(favId => favId !== id);
        event.target.classList.remove('active');
    } else {
        favorites.push(id);
        event.target.classList.add('active');
    }
    localStorage.setItem('fav_chars', JSON.stringify(favorites));
    if(document.getElementById('favorites-grid')) loadFavoritesPage();
}

function openModal(id) {
    const char = charactersData.find(c => c.id === id);
    if (!char) return;
    document.getElementById('modal-title').innerText = char.name;
    document.getElementById('modal-species').innerText = char.species;
    document.getElementById('modal-kingdom').innerText = char.kingdom;
    document.getElementById('modal-bio').innerText = char.bio;
    document.getElementById('char-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('char-modal').style.display = 'none';
}

function initFilters() {
    const searchBar = document.getElementById('search-bar');
    const filterSelect = document.getElementById('category-filter');
    if (!searchBar || !filterSelect) return;

    function filterData() {
        const query = searchBar.value.toLowerCase();
        const category = filterSelect.value;
        const filtered = charactersData.filter(char => {
            const matchesSearch = char.name.toLowerCase().includes(query);
            const matchesCategory = (category === 'all' || char.category === category);
            return matchesSearch && matchesCategory;
        });
        renderCards('catalog-grid', filtered);
    }
    searchBar.addEventListener('input', filterData);
    filterSelect.addEventListener('change', filterData);
}

function loadFavoritesPage() {
    let favorites = JSON.parse(localStorage.getItem('fav_chars')) || [];
    const favItems = charactersData.filter(char => favorites.includes(char.id));
    renderCards('favorites-grid', favItems);
}

function validateForm(event) {
    event.preventDefault();
    const name = document.getElementById('username').value.trim();
    const fact = document.getElementById('userfact').value.trim();
    let isValid = true;

    if (name.length < 2) {
        document.getElementById('error-username').style.display = 'block';
        isValid = false;
    } else { document.getElementById('error-username').style.display = 'none'; }

    if (fact.length === 0) {
        document.getElementById('error-fact').style.display = 'block';
        isValid = false;
    } else { document.getElementById('error-fact').style.display = 'none'; }

    if (isValid) {
        document.getElementById('trivia-form').style.display = 'none';
        document.getElementById('success-panel').style.display = 'block';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    renderCards('featured-characters', charactersData.slice(0, 3));
    renderCards('catalog-grid', charactersData);
    initFilters();
    if(document.getElementById('favorites-grid')) loadFavoritesPage();
});
