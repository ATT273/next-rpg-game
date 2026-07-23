# Next.js RPG Game

A turn-based RPG game built with Next.js, featuring character customization, auto-battle mechanics, shop system, and inventory management.

## Development Log

### 2024/08/11 - [Feature] Initial Project Setup
> Bootstrapped Next.js project with create-next-app

### 2024/09/01 - [Feature] Character Creation System
> Implemented character creation screen with class selection and customization options

### 2024/09/20 - [Feature] Battle Screen
> Added turn-based battle system with player vs enemy combat mechanics

### 2024/09/25 - [Feature] Loot Screen
> Implemented post-battle loot system for item and reward collection

### 2024/11/17 - [Update] UI/UX Redesign v1.0.0
> Complete overhaul of user interface and user experience design

### 2025/07/13 - [Feature] Buff Duration System
> Added duration tracking for skill buffs with turn-based expiration mechanics

### 2025/07/20 - [Feature] Currency & Event Selection
> Implemented gold currency system and select event screen for choosing between shop and battle encounters

### 2025/07/21 - [Refactor] Game Logic Restructuring
> Refactored game.ts into use-game.ts custom hook for better code organization and reusability

### 2025/08/08 - [Feature] Auto Battle Mode
> Implemented automatic battle system where player and enemy take turns sequentially

### 2025/08/10 - [Feature] Shop & Inventory Display
> Created shop interface and inventory management system with item browsing and purchase capabilities

### 2025/08/11 - [Feature] Item Management Enhancements
> Added item drop functionality, full inventory alerts, and integrated Sonner toast notifications

### 2025/08/14 - [Refactor] Code Cleanup & Build Fix
> General code refactoring and resolved build errors for production deployment

### 2025/11/16 - [Fix] Mage Healing Skill
> Fixed bug with mage class healing skill not working correctly

### 2025/11/24 - [Improve] Enhanced Action Display System
> Improved battle action visual feedback and animation system for better combat clarity

### 2025/12/21 - [Improve] Item Skill Mechanics
> Enhanced item system to allow items to grant skills to players when purchased or equipped

### 2025/12/21 - [Chore] Production Optimization
> Removed console logs, cleaned up unused fields, and updated Next.js to latest version

### 2026/01/07 - [Feature] Player Skill Tree & Level-Up Logic
> Added skill tree dialog and level-up skill selection logic, refined class skill data and related type definitions

### 2026/01/31 - [Improve] UI Upgrade & Asset Refresh
> Reworked character stats, inventory, and layout UI, and replaced class artwork with new source images

### 2026/02/28 - [Chore] Remove Unused Code
> Cleaned up unused logic in use-game.ts

### 2026/06/18 - [Feature] Item Drop & Rarity System
> Added item rarity data, drop item mechanics, and updated shop page and useGame:takeItem to support the new system

### 2026/06/20 - [Feature] Forge Item System
> Implemented item forging: combine 2 copies of the same item and rarity into 1 upgraded item, with gold cost validation and a hold-to-forge interaction

### 2026/07/17 - [Feature] Run Timeline System
> Introduced a per-run timeline (minion, shop, forge, and boss stages) driving the select-event flow, with a boss enemy pool, random boss selection, and a timeline UI to track run progress

### 2026/07/23 - [Feature] Skill Point Spending & Forge Item Level Display
> Added the skill tree dialog for spending skill points (increase/decrease skill level, confirm selection) and item level comparison display in the forge result screen

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
