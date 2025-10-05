// База даних товарів, які є в каталозі
const productsDatabase = [
    // Товари з каталогу (тільки ті, що реально відображаються)
    {
        id: 1,
        name: "Двері міжкімнатні DENVER",
        category: "interior-doors",
        material: "wood",
        color: "white",
        price: 74400, // 1860 € * 40 UAH
        image: "assets/Dvery1.PNG",
        description: "Екологічний лак, Звукоізоляція",
        rating: 4,
        reviews: 12,
        badge: "Новинка",
        features: ["Екологічний лак", "Звукоізоляція"]
    },
    {
        id: 2,
        name: "Двері міжкімнатні CLASSIC",
        category: "interior-doors",
        material: "mdf",
        color: "black",
        price: 49600, // 1240 € * 40 UAH
        image: "assets/Dvery2.PNG",
        description: "Сучасний дизайн, Легке встановлення",
        rating: 5,
        reviews: 25,
        features: ["Сучасний дизайн", "Легке встановлення"]
    },
    {
        id: 6,
        name: "Двері скляні PANORAMA",
        category: "interior-doors",
        material: "glass",
        color: "white",
        price: 63200, // 1580 € * 40 UAH
        image: "assets/Dvery3.PNG",
        description: "Збільшує простір, Легке миття",
        rating: 4,
        reviews: 14,
        features: ["Збільшує простір", "Легке миття"]
    },
    {
        id: 7,
        name: "Розсувні двері MODERN SLIDE",
        category: "sliding-doors",
        material: "metal",
        color: "white",
        price: 113600, // 2840 € * 40 UAH
        image: "https://via.placeholder.com/300x400/E8F5E8/228B22?text=SLIDE",
        description: "Економія простору, Тихі механізми",
        rating: 4,
        reviews: 8,
        badge: "Знижка",
        oldPrice: 128000, // 3200 € * 40 UAH
        features: ["Економія простору", "Тихі механізми"]
    },
    {
        id: 8,
        name: "Вхідні двері SECURE",
        category: "entrance-doors",
        material: "metal",
        color: "black",
        price: 136000, // 3400 € * 40 UAH
        image: "https://via.placeholder.com/300x400/000022/FFFFFF?text=ENTRANCE",
        description: "Підвищена безпека, Теплоізоляція",
        rating: 5,
        reviews: 32,
        features: ["Підвищена безпека", "Теплоізоляція"]
    },
    {
        id: 11,
        name: "Вікна дерев'яні ECO",
        category: "windows",
        material: "wood",
        color: "oak",
        price: 84000, // 2100 € * 40 UAH
        image: "https://via.placeholder.com/300x400/F0E68C/2F4F4F?text=WINDOW",
        description: "Екологічно, Теплоізоляція",
        rating: 4,
        reviews: 18,
        badge: "Популярний",
        features: ["Екологічно", "Теплоізоляція"]
    },
    {
        id: 9,
        name: "Двері міжкімнатні LUXURY",
        category: "interior-doors",
        material: "wood",
        color: "brown",
        price: 72000, // 1800 € * 40 UAH
        image: "https://via.placeholder.com/300x400/8B4513/FFFFFF?text=LUXURY",
        description: "Ексклюзивний дизайн, Ручна робота",
        rating: 5,
        reviews: 28,
        badge: "Преміум",
        features: ["Ексклюзивний дизайн", "Ручна робота"]
    }
];

// Функція пошуку товарів
function searchProducts(query) {
    if (!query || query.trim() === '') {
        return productsDatabase;
    }
    
    const searchTerm = query.toLowerCase().trim();
    
    return productsDatabase.filter(product => {
        // Пошук за назвою товару
        const nameMatch = product.name.toLowerCase().includes(searchTerm);
        
        // Пошук за категорією
        const categoryMatch = product.category.toLowerCase().includes(searchTerm);
        
        // Пошук за матеріалом
        const materialMatch = product.material.toLowerCase().includes(searchTerm);
        
        // Пошук за кольором
        const colorMatch = product.color.toLowerCase().includes(searchTerm);
        
        // Пошук за описом та характеристиками
        const descriptionMatch = product.description.toLowerCase().includes(searchTerm);
        const featuresMatch = product.features.some(feature => 
            feature.toLowerCase().includes(searchTerm)
        );
        
        return nameMatch || categoryMatch || materialMatch || colorMatch || 
               descriptionMatch || featuresMatch;
    });
}

// Функція отримання товару за ID
function getProductById(id) {
    return productsDatabase.find(product => product.id === id);
}

// Функція отримання товарів за категорією
function getProductsByCategory(category) {
    return productsDatabase.filter(product => product.category === category);
}

// Функція отримання товарів за ціновим діапазоном
function getProductsByPriceRange(minPrice, maxPrice) {
    return productsDatabase.filter(product => 
        product.price >= minPrice && product.price <= maxPrice
    );
}

// Експорт для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        productsDatabase,
        searchProducts,
        getProductById,
        getProductsByCategory,
        getProductsByPriceRange
    };
}
