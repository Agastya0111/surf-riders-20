// Weapon catalog + monster/level tuning for Surf Riders 2.0

export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export type Weapon = {
  key: string;
  name: string;
  description: string;
  damage: number;
  speed: number; // attacks per second
  cost: number; // gold coins
  rarity: Rarity;
  icon: string;
};

export const WEAPONS: Weapon[] = [
  { key: "wooden_sword", name: "Wooden Sword", description: "Basic training blade. Every rider starts here.", damage: 8, speed: 1.2, cost: 0, rarity: "common", icon: "🗡️" },
  { key: "iron_sword", name: "Iron Sword", description: "Forged steel — balanced and reliable.", damage: 16, speed: 1.3, cost: 500, rarity: "common", icon: "⚔️" },
  { key: "pirate_cutlass", name: "Pirate Cutlass", description: "Curved blade of the seven seas.", damage: 26, speed: 1.5, cost: 1200, rarity: "uncommon", icon: "🏴‍☠️" },
  { key: "crystal_spear", name: "Crystal Spear", description: "Long reach, sharp point, cold shine.", damage: 38, speed: 1.4, cost: 2400, rarity: "uncommon", icon: "🔱" },
  { key: "trident", name: "Trident", description: "Weapon of the tide guardian.", damage: 54, speed: 1.6, cost: 4200, rarity: "rare", icon: "🪝" },
  { key: "fire_axe", name: "Fire Axe", description: "Burns through armor and hesitation.", damage: 74, speed: 1.2, cost: 6800, rarity: "rare", icon: "🪓" },
  { key: "ice_hammer", name: "Ice Hammer", description: "Slow but bone-shattering blow.", damage: 96, speed: 1.0, cost: 10000, rarity: "epic", icon: "🔨" },
  { key: "magic_staff", name: "Magic Staff", description: "Channels raw ocean magic.", damage: 122, speed: 1.7, cost: 14000, rarity: "epic", icon: "🪄" },
  { key: "lightning_blade", name: "Lightning Blade", description: "Strikes at the speed of the storm.", damage: 160, speed: 2.0, cost: 20000, rarity: "epic", icon: "⚡" },
  { key: "legendary_ocean_blade", name: "Legendary Ocean Blade", description: "The blade that shaped the seven seas.", damage: 220, speed: 2.2, cost: 30000, rarity: "legendary", icon: "🌊" },
];

export function getWeapon(key: string | null | undefined): Weapon {
  return WEAPONS.find((w) => w.key === key) ?? WEAPONS[0];
}

export function silverTargetForLevel(level: number): number {
  return Math.max(1, level) * 5000;
}

export function levelRewards(level: number) {
  return {
    gold: 200 + Math.floor(level * 60),
    xp: 100 + Math.floor(level * 25),
    bonusSilver: 500 + Math.floor(level * 100),
  };
}

export type Monster = {
  name: string;
  emoji: string;
  hp: number;
  damage: number;
  interval: number; // seconds between attacks
};

const MONSTER_ROSTER: Array<Pick<Monster, "name" | "emoji">> = [
  { name: "Rock Crab", emoji: "🦀" },
  { name: "Storm Squid", emoji: "🦑" },
  { name: "Reef Shark", emoji: "🦈" },
  { name: "Sea Serpent", emoji: "🐍" },
  { name: "Ghost Pirate", emoji: "☠️" },
  { name: "Kraken Spawn", emoji: "🐙" },
  { name: "Lava Eel", emoji: "🔥" },
  { name: "Ice Leviathan", emoji: "❄️" },
  { name: "Coral Guardian", emoji: "🪸" },
  { name: "Deep One", emoji: "👁️" },
];

export function monsterForLevel(level: number): Monster {
  const pick = MONSTER_ROSTER[(Math.max(1, level) - 1) % MONSTER_ROSTER.length];
  return {
    name: pick.name,
    emoji: pick.emoji,
    hp: Math.round(60 * Math.pow(1.32, level - 1)),
    damage: 6 + Math.floor(level * 1.4),
    interval: Math.max(1.1, 2.4 - level * 0.05),
  };
}

export const RARITY_COLOR: Record<Rarity, string> = {
  common: "text-muted-foreground",
  uncommon: "text-lagoon",
  rare: "text-foam",
  epic: "text-coral",
  legendary: "text-sunset",
};
