/**
 * Brand Profile Configuration - Brothers Cash & Carry
 * Central source of truth for all brand-related information
 */

export const brandProfile = {
    // Basic Information
    name: "Brothers Cash & Carry",
    tagline: "Quality @ Affordability",
    description: "Your trusted source for authentic international groceries from Asia, Africa, Latin America, and the Middle East. Quality products at affordable prices, delivered to your door in Sweden.",

    // Contact Information
    contact: {
        phone: "+46765670454",
        phoneFormatted: "076 567 04 54",
        whatsapp: "+46765670454",
        email: "support@cashncarry.se",
        supportEmail: "support@cashncarry.se",
    },

    // Physical Store Address
    address: {
        street: "Regndroppsgatan 3",
        area: "",
        postalCode: "194 49",
        city: "Upplands Väsby",
        country: "Sweden",
        formatted: "Regndroppsgatan 3, 194 49 Upplands Väsby, Sweden",
    },

    // Business Hours
    hours: {
        monday: { open: "09:00", close: "20:00", display: "9 AM - 8 PM" },
        tuesday: { open: "09:00", close: "20:00", display: "9 AM - 8 PM" },
        wednesday: { open: "09:00", close: "20:00", display: "9 AM - 8 PM" },
        thursday: { open: "09:00", close: "20:00", display: "9 AM - 8 PM" },
        friday: { open: "09:00", close: "20:00", display: "9 AM - 8 PM" },
        saturday: { open: "10:00", close: "19:00", display: "10 AM - 7 PM" },
        sunday: { open: "10:00", close: "19:00", display: "10 AM - 7 PM" },
    },

    // Website & Online Presence
    website: {
        url: "https://cashncarry.se",
        domain: "cashncarry.se",
    },

    // Social Media
    social: {
        facebook: "https://www.facebook.com/cashncarryse",
        instagram: "https://www.instagram.com/cashncarryse",
        youtube: "",
        tiktok: "",
        twitter: "",
        linkedin: "",
    },

    // Delivery Information
    delivery: {
        local: {
            freeThreshold: 500, // SEK
            minimumOrder: 0, // No minimum
            standardFee: 99, // SEK for orders below free threshold
            sameDayAreas: [
                "Upplands Väsby",
                "Märsta",
                "Vallentuna",
                "Sollentuna",
                "Täby",
            ],
            sameDayCutoffTime: "14:00",
            sameDayWindow: "17:00 - 21:00",
            coverageAreas: [
                "Stockholm",
                "Upplands Väsby",
                "Märsta",
                "Vallentuna",
                "Sollentuna",
                "Täby",
                "Sundbyberg",
                "Solna",
                "Kista",
                "Järfälla",
            ],
        },
        national: {
            carrier: "PostNord",
            noMinimum: true,
            minimumOrder: 0,
        },
        international: {
            available: false,
            carrier: "",
            noMinimum: false,
            minimumOrder: 0,
        },
        scheduledCity1: {
            name: "Märsta",
            deliveryDays: ["Tuesday", "Thursday", "Saturday"],
            deliveryWindow: "14:00 - 18:00",
            orderDeadline: "Day before by 18:00",
            minimumOrder: 0,
        },
        scheduledCity2: {
            name: "Vallentuna",
            deliveryDays: ["Wednesday", "Saturday"],
            timeSlots: ["09:00-12:00", "14:00-18:00"],
            orderDeadline: "24 hours before",
            minimumOrder: 0,
        },
    },

    // Product Categories
    productCategories: [
        "Asia",
        "Middle East",
        "Africa",
        "Latin America",
        "Frozen",
        "Beverages",
        "Rice",
        "Spices",
        "Cosmetics",
    ],

    // Services & Features
    features: [
        "Free delivery on orders over 500 SEK",
        "Fast delivery in Stockholm area",
        "Products from Asia, Africa, Latin America & Middle East",
        "Authentic international groceries",
        "Quality @ Affordability",
        "Easy online ordering",
    ],

    // SEO & Marketing
    seo: {
        keywords: [
            "international grocery",
            "asian grocery sweden",
            "african grocery stockholm",
            "middle eastern food",
            "latin american food",
            "halal food",
            "grocery delivery sweden",
            "ethnic food store",
        ],
        localAreas: [
            "Upplands Väsby",
            "Stockholm",
            "Märsta",
            "Vallentuna",
            "Sollentuna",
        ],
    },

    // Business Information
    business: {
        founded: "2014",
        type: "International Grocery Store",
        specialization: "Asian, African, Middle Eastern & Latin American Foods",
        certifications: ["Halal Products Available"],
        paymentMethods: ["Credit Card", "Debit Card", "Swish", "Klarna"],
    },
};

export default brandProfile;
