/**
 * Alien San - Exponential Growth Simulation
 */

const LoyaltyEngine = require('./compensationEngine');

const sim = new LoyaltyEngine({
    personalThreshold: 10,
    referralThreshold: 25
});

// Mock Data
let userA = { id: 'user_a', name: 'Ana', personalPoints: 0, totalPurchases: 0, referralPointsFromTeam: 0 };
let userB = { id: 'user_b', name: 'Beto', personalPoints: 0, totalPurchases: 0, referralPointsFromTeam: 0, referrer: userA };

console.log("--- SIMULACIÓN DE CRECIMIENTO EXPONENCIAL ---");

// 1. Ana buys 5 units
console.log("\nAna compra 5 unidades...");
let res1 = sim.processPurchase(userA, { quantity: 5 });
res1.events.forEach(e => console.log(`Evento: ${e.message}`));

// 2. Beto (referred by Ana) buys 10 units
console.log("\nBeto compra 10 unidades (Beto gana su 11vo gratis)...");
let res2 = sim.processPurchase(userB, { quantity: 10 });
res2.events.forEach(e => console.log(`Evento: ${e.message}`));

// 3. Beto buys 20 more units (total 30)
console.log("\nBeto compra 20 unidades más...");
let res3 = sim.processPurchase(userB, { quantity: 20 });
res3.events.forEach(e => {
    console.log(`Evento: ${e.message}`);
});

console.log("\n--- RESULTADOS FINALES ---");
console.log(`Ana (Referente): Total Personal: ${userA.totalPurchases}, Puntos Equipo: ${userA.referralPointsFromTeam}`);
console.log(`Beto (Aliado): Total Personal: ${userB.totalPurchases}, Puntos Equipo: ${userB.referralPointsFromTeam}`);
