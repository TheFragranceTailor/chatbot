function generateRecommendation(inputs) {
    const { smells, skinType, personality, budget, occasion } = inputs;

    // Example matching logic
    const fragrances = [
        { name: "Fragrance 1", category: "fresh", price: "$", intensity: "light" },
        { name: "Fragrance 2", category: "woody", price: "$$", intensity: "moderate" },
    ];

    return fragrances.filter((fragrance) =>
        (smells.includes(fragrance.category) || personality === "bold") &&
        fragrance.price === budget &&
        fragrance.intensity === occasion
    );
}
