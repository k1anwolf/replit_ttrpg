import { z } from "zod";

export const factionSchema = z.enum(["player", "npc", "boss"]);
export type Faction = z.infer<typeof factionSchema>;

export const characteristicsSchema = z.object({
  strength: z.number().default(10),
  dexterity: z.number().default(10),
  constitution: z.number().default(10),
  intelligence: z.number().default(10),
  wisdom: z.number().default(10),
  charisma: z.number().default(10),
});
export type Characteristics = z.infer<typeof characteristicsSchema>;

export const statusSchema = z.object({
  id: z.string(),
  name: z.string(),
  duration: z.number(),
  durationType: z.enum(["rounds", "turns", "untilRemoved"]),
  description: z.string().optional(),
});
export type Status = z.infer<typeof statusSchema>;

export const hitCheckSchema = z.enum(["success", "fail", "critSuccess", "critFail"]);
export type HitCheck = z.infer<typeof hitCheckSchema>;

export const equipmentSlotSchema = z.enum([
  "head",
  "chest",
  "legs",
  "feet",
  "hands",
  "weapon",
  "offhand",
  "accessory1",
  "accessory2",
]);
export type EquipmentSlot = z.infer<typeof equipmentSlotSchema>;

export const equipmentItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  slot: equipmentSlotSchema,
  bonuses: z.array(statusSchema).default([]),
  description: z.string().optional(),
});
export type EquipmentItem = z.infer<typeof equipmentItemSchema>;

export const effectTypeSchema = z.enum([
  "damage",
  "heal",
  "restoreMP",
  "addStatus",
  "removeStatus",
  "customDamage",
  "customHeal",
]);
export type EffectType = z.infer<typeof effectTypeSchema>;

export const effectSchema = z.object({
  id: z.string(),
  type: effectTypeSchema,
  value: z.number().optional(),
  statusId: z.string().optional(),
  statusName: z.string().optional(),
  statusDuration: z.number().optional(),
  statusDurationType: z.enum(["rounds", "turns"]).optional(),
  statusDescription: z.string().optional(),
});
export type Effect = z.infer<typeof effectSchema>;

export const actionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["attack", "ability", "spell"]),
  cooldown: z.number().default(0),
  currentCooldown: z.number().default(0),
  description: z.string().optional(),
  effects: z.array(effectSchema).default([]),
  isAOE: z.boolean().default(false),
});
export type Action = z.infer<typeof actionSchema>;

export const deathSavesSchema = z.object({
  successes: z.number().min(0).max(3).default(0),
  failures: z.number().min(0).max(3).default(0),
});
export type DeathSaves = z.infer<typeof deathSavesSchema>;

export const participantSchema = z.object({
  id: z.string(),
  name: z.string(),
  initiative: z.number(),
  faction: factionSchema,
  hpMax: z.number(),
  hpCurr: z.number(),
  mpMax: z.number().default(0),
  mpCurr: z.number().default(0),
  ac: z.number().default(10),
  skills: z.array(z.string()).default([]),
  characteristics: characteristicsSchema,
  attacks: z.array(actionSchema).default([]),
  abilities: z.array(actionSchema).default([]),
  spells: z.array(actionSchema).default([]),
  statuses: z.array(statusSchema).default([]),
  deathSaves: deathSavesSchema.optional(),
  isDead: z.boolean().default(false),
  isUnconscious: z.boolean().default(false),
  isPermanentlyDead: z.boolean().default(false),
  damageDealt: z.number().default(0),
  equipment: z.record(equipmentSlotSchema, equipmentItemSchema).optional(),
});
export type Participant = z.infer<typeof participantSchema>;

export const eventLogSchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  message: z.string(),
  type: z.enum(["damage", "heal", "status", "turn", "round", "action", "rest"]),
});
export type EventLog = z.infer<typeof eventLogSchema>;

export const combatStateSchema = z.object({
  participants: z.array(participantSchema),
  currentTurnIndex: z.number().default(0),
  currentRound: z.number().default(1),
  eventLog: z.array(eventLogSchema).default([]),
});
export type CombatState = z.infer<typeof combatStateSchema>;

export const restSettingsSchema = z.object({
  shortRest: z.object({
    hpPercent: z.number().default(50),
    mpPercent: z.number().default(50),
  }),
  longRest: z.object({
    hpPercent: z.number().default(100),
    mpPercent: z.number().default(100),
  }),
});
export type RestSettings = z.infer<typeof restSettingsSchema>;

export const templateSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(["character", "enemy", "boss", "spell", "ability", "attack", "effect"]),
  data: z.any(),
  description: z.string().optional(),
});
export type Template = z.infer<typeof templateSchema>;

export const saveDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  timestamp: z.number(),
  combatState: combatStateSchema,
  templates: z.array(templateSchema).optional(),
  restSettings: restSettingsSchema,
});
export type SaveData = z.infer<typeof saveDataSchema>;
