/**
 * Alien San - Restaurant Exponential Simulation
 */

class SimulationNode {
    constructor(id, name, referrer = null) {
        this.id = id;
        this.name = name;
        this.referrer = referrer;
        this.personalPoints = 0;
        this.teamPoints = 0;
        this.totalRewards = 0;
        this.totalSpent = 0;
    }
}

const PRICE_BASE = 20000;
const PRICE_FINAL = 23500; // Final price including ~15% margin
const PROFIT_PER_DISH = PRICE_BASE;
const LOYALTY_COST_PER_UNIT = PRICE_FINAL;

const PERSONAL_THRESHOLD = 10;
const REFERRAL_THRESHOLD = 25;

let allUsers = [];
let nextId = 1;

// 1. Initial 10 consumers
for (let i = 0; i < 10; i++) {
    allUsers.push(new SimulationNode(`USR-${nextId++}`, `Initial-${i}`));
}

// 2. Exponential Growth (Connect 3 people, repeat 5 times)
let currentLevel = allUsers.slice(); // Level 0
for (let l = 1; l <= 5; l++) {
    let nextLevel = [];
    currentLevel.forEach(parent => {
        for (let j = 0; j < 3; j++) {
            let child = new SimulationNode(`USR-${nextId++}`, `Level-${l}-Child`, parent);
            nextLevel.push(child);
            allUsers.push(child);
        }
    });
    currentLevel = nextLevel;
}

console.log(`POBLACIÓN TOTAL REGISTRADA: ${allUsers.length} Aliens.`);

// 3. Daily Consumption Simulation (30 days)
let totalMoneyCollected = 0;
let totalRewardsPersonal = 0;
let totalRewardsReferral = 0;

for (let day = 1; day <= 30; day++) {
    allUsers.forEach(user => {
        // Daily Lunch
        totalMoneyCollected += PRICE_FINAL;
        user.totalSpent += PRICE_FINAL;
        user.personalPoints += 1;

        // Check personal reward
        if (user.personalPoints >= PERSONAL_THRESHOLD) {
            user.personalPoints -= PERSONAL_THRESHOLD;
            user.totalRewards += 1;
            totalRewardsPersonal += 1;
        }

        // Check tier-2 recommendation reward
        if (user.referrer) {
            user.referrer.teamPoints += 1;
            if (user.referrer.teamPoints >= REFERRAL_THRESHOLD) {
                user.referrer.teamPoints -= REFERRAL_THRESHOLD;
                user.referrer.totalRewards += 1;
                totalRewardsReferral += 1;
            }
        }
    });
}

const totalGrossRevenue = totalMoneyCollected;
const totalCostOfRewards = (totalRewardsPersonal + totalRewardsReferral) * PRICE_FINAL;
const realMarginUsed = (totalCostOfRewards / totalGrossRevenue) * 100;

console.log("\n--- RESULTADO SIMULACIÓN 30 DÍAS (RESTAURANTE) ---");
console.log(`Ingreso Bruto Total: $${totalGrossRevenue.toLocaleString()} COP`);
console.log(`Premios Entregados (Personal): ${totalRewardsPersonal}`);
console.log(`Premios Entregados (Por Referido): ${totalRewardsReferral}`);
console.log(`Costo Total de Fidelización: $${totalCostOfRewards.toLocaleString()} COP`);
console.log(`Margen Real Utilizado: ${realMarginUsed.toFixed(2)}% (Misión: < 15%)`);
console.log("-----------------------------------------------");
console.log("¡Magia Alien San en acción: Duplicación masiva y retención garantizada!");
