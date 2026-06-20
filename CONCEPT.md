# CONCEPT — Next.js RPG Game

## Tổng quan

Game nhập vai turn-based chạy trên trình duyệt, xây dựng bằng Next.js. Người chơi tạo nhân vật, chiến đấu với quái vật, mua trang bị, nhặt loot và tăng cấp qua nhiều vòng lặp sự kiện.

---

## Game Flow

```
[Home Page]
  ├─ Continue Game  → Load from localStorage → [Select Event]
  └─ New Game       → Xóa save               → [Create Character]
                                                     ↓
                                              [Select Event]
                                            ┌──────┴──────┐
                                         [Shop]        [Battle]
                                            └──────┬──────┘
                                              [Select Event]  ← vòng lặp
```

---

## Các màn hình

### Home Page (`app/page.tsx`)
- Kiểm tra localStorage key `rpg_game`
- Nếu có save: nút **Continue** → `/select-event`
- Nếu không có: nút **New Game** → `/create-character`

### Create Character (`create-character/page.tsx`)
- Bước 1: Chọn 1 trong 4 class
- Bước 2: Phân bổ bonus stat points
- Bước 3: Xem Skill Tree của class, chọn tên nhân vật
- Khởi tạo player: Level 1, HP 100, MP 100, Gold 100, EXP 0
- Lưu vào Zustand store → `/select-event`

### Select Event (`select-event/page.tsx`)
- Mỗi lần vào: Random 1 shop + 1 enemy (khớp level player, không trùng enemy trước)
- Hiển thị 2 event card để player chọn:
  - **Shop Card**: Tên shop, ảnh shopkeeper
  - **Battle Card**: Tên/ảnh enemy, stats sơ lược

### Battle (`battle/page.tsx`)
- PopUp "Ready?" hiển thị thông tin enemy
- Turn-based combat (xem mục **Battle System**)
- Sau chiến đấu: Tính thưởng, kiểm tra level up → `/select-event`

### Shop (`shop/page.tsx`)
- Hiển thị 3 item ngẫu nhiên từ shop hiện tại
- Mua vào cart → Checkout khi nhấn "To Battle"
- Inventory max 6 items
- Item có skill → Unlock skill ở level 1

### Loot (`loot/page.tsx`)
- Random 1 item từ toàn bộ items pool
- Nhấn **Take** → Thêm vào inventory (theo `Game.takeItem`)
- Nhấn **Leave** → Bỏ qua
- Sau đó random sự kiện tiếp theo (Battle / Loot / Shop)

---

## Character Classes

Có 4 class, mỗi class có base stats và skill tree riêng.

| Class | HP | MP | ATK | DEF | INT | SPD | Đặc điểm |
|---|---|---|---|---|---|---|---|
| Knight | 50 | 100 | 5 | 8 | 0 | 3 | Tank, DEF cao |
| Warrior | 50 | 100 | 8 | 5 | 0 | 3 | DPS cận chiến |
| Assassin | 30 | 100 | 8 | 3 | 0 | 5 | Glass cannon, SPD cao |
| Mage | 30 | 100 | 3 | 5 | 5 | 3 | Magical DPS |

### Skill Trees

#### Knight
| Skill | Type | Target | Effect | MP Cost (L1/2/3) | Amplify |
|---|---|---|---|---|---|
| Holy Strike | Physical | Enemy | Dmg [-10/-15/-18] | 10/15/25 | 0.1/0.2/0.35 |
| Thick Skin | Buff | Self | DEF +3/5/8 (3 turns) | 5/10/10 | — |
| Iron Skin *(req: Thick Skin)* | Magical | Self | DEF +5/10/15 (3 turns) | 10/15/25 | 0.1/0.3/0.5 |
| Holy Water | Magical | Self | DEF+ATK +3/5/8 (1 turn) | 20/23/30 | 0.2/0.3/0.4 |
| Divine Sword *(req: Holy Strike)* | Physical | Enemy | Dmg [-13/-15/-20] | 15/20/30 | 0.1/0.3/0.5 |

#### Warrior
| Skill | Type | Target | Effect | MP Cost (L1/2/3) | Amplify |
|---|---|---|---|---|---|
| Battle Roar | Buff | Self | ATK +3/5/7 (3 turns) | 7/7/10 | — |
| Rage *(req: Battle Roar)* | Buff | Self | ATK+SPD +5/6/10 & +3/4/5 (3 turns) | 10/15/20 | — |
| Second Wind | Magical | Self | HP +6/7/8 (3 turns) | 10/15/17 | 0.1/0.2/0.3 |
| Battle Chop | Physical | Enemy | Dmg [-10/-12/-17] | 10/15/23 | 0.2/0.3/0.5 |
| Spin to Win | Physical | Enemy | Dmg [-7/-10/-15] | 7/10/15 | 0.1/0.15/0.2 |

#### Assassin
| Skill | Type | Target | Effect | MP Cost (L1/2/3) | Amplify |
|---|---|---|---|---|---|
| Backstab | Physical | Enemy | Dmg [-15/-16/-17] | 15/15/15 | 0.3/0.35/0.4 |
| Double Backstab *(req: Backstab)* | Physical | Enemy | Dmg [-18/-19/-20] | 20/23/25 | 0.3/0.4/0.45 |
| Cut Throat *(req: Double Backstab)* | Physical | Enemy | Dmg [-20/-25/-28] | 40/45/50 | 0.4/0.45/0.6 |
| Ambush & Assassinate | Physical | Enemy | Dmg [-25/-27/-30] | 25/28/30 | 0.07/0.1/0.15 |
| Poison Dagger | Magical | Enemy | Dmg [-3/-5/-7] (3 turns) | 10/15/20 | 0.1/0.15/0.2 |

#### Mage
| Skill | Type | Target | Effect | MP Cost (L1/2/3) | Amplify |
|---|---|---|---|---|---|
| Fireball | Magical | Enemy | Dmg [-15/-16/-18] | 10/12/15 | 0.3/0.35/0.5 |
| Ice Shard | Magical | Enemy | Dmg [-9/-10/-13] | 5/6/7 | 0.3/0.5/0.5 |
| Divine Light | Magical | Self | HP +10/12/15 (3 turns) | 5/7/15 | 0.1/0.15/0.3 |
| Fire Breath *(req: Fireball)* | Magical | Enemy | Dmg [-15/-18/-20] | 10/12/15 | 0.3/0.35/0.5 |
| Fire Storm *(req: Fire Breath)* | Magical | Enemy | Dmg [-18/-20/-25] + DoT | 30/40/50 | 0.3/0.5/0.6 |

> Skill từ book item (Fire Book → Fireball, Ice Book → Ice Shard) có thể học bởi tất cả class.

---

## Battle System

### Turn Order
- So sánh `player.stats.spd` vs `enemy.stats.spd`
- SPD cao hơn → đi trước
- Bằng nhau → Player đi trước

### Cấu trúc 1 Turn

**Lượt Player:**
1. **Normal Attack** (miễn phí, không tốn MP)
2. **Lần lượt dùng tất cả skills** nếu còn đủ MP
3. Kiểm tra Win Condition sau mỗi action

**Lượt Enemy:**
1. **Normal Attack**
2. Giảm buff duration của player (-1 mỗi turn)
3. Kiểm tra Win Condition

### Tính Damage

**Normal Attack:**
```
damage = max(0, ATK_attacker + bonus_ATK + buff_ATK - DEF_target - bonus_DEF - buff_DEF)
```

**Skill — Enemy target:**
```
# Physical skill
raw = |effect.value| + (player.ATK + bonus_ATK) × amplified

# Magical skill
raw = |effect.value| + (player.INT + bonus_INT) × amplified

damage = max(0, raw - enemy.DEF)
```

**Skill — Self target (Buff):**
- Cộng vào `player.buffStats[]` với `{ name, value, duration }`
- Nếu effect là HP → Hồi HP ngay (capped tại maxHP)
- Duration tính bằng turns; khi về 0 → buff hết hiệu lực

### Win Condition
| Trạng thái | Điều kiện |
|---|---|
| WIN | Enemy HP = 0 |
| LOSE | Player HP = 0 |
| CONTINUE | Cả hai còn sống |

### Battle Rewards (khi thắng)
- `player.exp += enemy.xp`
- `player.gold += enemy.gold`
- `score += enemy.score`
- Kiểm tra Level Up

---

## Progression System

### Experience Curve
```
XP cần để lên level N = 50 × 2^(N-1)
```
| Level | XP cần (tích lũy) |
|---|---|
| 1 | 0 |
| 2 | 50 |
| 3 | 100 |
| 4 | 200 |
| 5 | 400 |
| 6 | 800 |

### Level Up
- XP carry-over (phần dư được giữ lại)
- +1 Skill Point mỗi lần lên cấp
- Skill Point dùng để nâng cấp skill (level 1 → 2 → 3)

### Skill Level Up
- Mỗi skill có 3 levels
- Level 0 = khóa (chưa unlock)
- Unlock bằng cách mua item tương ứng (book, weapon có skill)
- Nâng cấp bằng Skill Points
- Level cao hơn = damage/buff mạnh hơn, MP cost cao hơn

---

## Item & Inventory System

### Inventory
- Max **6 items** cùng lúc
- Consumable items (HP Potion) có `maxQty > 1`
- Equipment items có `maxQty = 1`

### Duplicate Item Logic

**Loot** (`use-game.ts — takeItem`):
- Mỗi lần nhặt item → push 1 instance mới vào inventory (không stack)
- Mỗi item trong inventory có `instanceId` riêng (dùng cho forge)
- Inventory full (>= 6) → chặn, báo lỗi

**Shop** (`shop/page.tsx — handleCloseShop`): **Chưa có logic**, cần fix:
- Hiện tại push thẳng toàn bộ cart vào inventory (`[...player.items, ...cart]`)
- Không kiểm tra inventory full

### Item Types
| Type | Tác dụng |
|---|---|
| sword / weapon | ATK bonus |
| shield | DEF bonus |
| armor | DEF bonus |
| boots | DEF + SPD bonus |
| book | Unlock skill |
| hp_potion | Consumable, hồi HP |

### Rarity System

| Rarity | Drop Weight | Color |
|---|---|---|
| common | rất cao | trắng / xám |
| uncommon | cao | xanh lá |
| rare | trung bình | xanh dương |
| epic | thấp | tím |
| legendary | rất thấp | cam / vàng |

- `dropRarity` trên mỗi enemy quyết định rarity của item drop sau battle
- `rarity` **không thay đổi** sau forge — chỉ phản ánh nguồn gốc/độ hiếm của item
- `lvlRequired` — field đã có, **chưa có enforcement** (chưa kiểm tra khi equip/nhặt)

### Forge System

- Forge 2 instance cùng key + cùng `itemLevel` → 1 item `itemLevel + 1`
- `itemLevel` tối đa là **5**, mọi item bắt đầu từ `itemLevel: 1`
- `rarity` **không thay đổi** khi forge (Rusty Sword forge lv5 vẫn là common)
- **Công thức stat:**
  ```
  newStat = round(baseStat × (1 + 0.25 × newItemLevel)) + newItemLevel
  ```
  `baseStat` lấy từ data gốc trong `items.ts` (không dùng stat hiện tại của item)
- Item có stat = 0 (sách kỹ năng) không được hưởng lợi từ forge stat
- Chi phí forge: **10G**, đã trừ vào `player.gold` khi forge thành công; nút forge bị disable nếu không đủ gold

### Items Catalog (22 items)

> Cột **itemLevel** là level forge bắt đầu (tất cả = 1). Cột **Lvl Req** là level player cần để equip (chưa enforce).

#### Common (itemLevel: 1, lvlRequired: 1)
| Item | Type | Base Stats | Price |
|---|---|---|---|
| Rusty Sword | sword | ATK+1 | 10 |
| Iron Sword | weapon | ATK+3 | 5 |
| Iron Axe | weapon | ATK+4 | 5 |
| Broadsword | sword | ATK+5 | 30 |
| Oak Wand | weapon | ATK+2 | 5 |
| Wooden Shield | shield | DEF+3 | 20 |
| Iron Shield | shield | DEF+5 | 30 |
| Leather Boots | boots | DEF+2, SPD+1 | 20 |
| Chainmail Vest | armor | DEF+2 | 10 |
| Plate Armor | armor | DEF+10 | 50 |
| HP Potion | hp_potion | HP+10 | 5 |
| Fire Spell Book | book | Unlock Fireball | 5 |
| Ice Spell Book | book | Unlock Ice Shard | 5 |

#### Uncommon (itemLevel: 1, lvlRequired: 2)
| Item | Type | Base Stats | Price |
|---|---|---|---|
| Steel Sword | sword | ATK+7 | 40 |
| Knight Shield | shield | DEF+8 | 50 |
| Elixir | hp_potion | HP+30 | 20 |

#### Rare (itemLevel: 1, lvlRequired: 3)
| Item | Type | Base Stats | Price |
|---|---|---|---|
| Battle Axe | axe | ATK+12 | 120 |
| Arcane Tome | book | INT+5, Unlock Fire Breath | 100 |
| Shadow Cloak | armor | DEF+6, SPD+3 | 90 |

#### Epic (itemLevel: 1, lvlRequired: 5)
| Item | Type | Base Stats | Price |
|---|---|---|---|
| Dragonbone Sword | sword | ATK+20, INT+5 | 300 |
| Storm Tome | book | INT+10, Unlock Fire Storm | 280 |

#### Legendary (itemLevel: 1, lvlRequired: 8)
| Item | Type | Base Stats | Price |
|---|---|---|---|
| Excalibur | sword | ATK+35, DEF+5, SPD+5, INT+5 | 999 |

### Bonus Stats Calculation
```
bonusStats = Σ item.stats  (với mọi item trong inventory)
```
Được tính lại và áp dụng vào mỗi damage calculation trong battle.

---

## Shop System

### Shops
| Shop | Shopkeeper | Items bán |
|---|---|---|
| Igor - Blacksmith | igor_blacksmith | Iron Sword, Iron Axe, Iron Shield |
| Melina - Enchanter | melina_enchantress | Oak Wand, Fire Book, Ice Book |

### Cơ chế mua hàng
1. Mỗi lần vào shop: Hiển thị 3 item ngẫu nhiên từ danh sách của shop đó
2. Click item → Thêm vào cart, trừ gold tạm
3. Click lại → Bỏ khỏi cart, hoàn gold
4. Nhấn "To Battle" → Xác nhận mua:
   - Items vào inventory
   - Skills (nếu có) unlock ở level 1
   - `skillLevelData` được cập nhật
   - Gold bị trừ chính thức

---

## Enemy System

### Enemy Database (6 kẻ thù)
| Enemy | Match Level | HP | ATK | DEF | SPD | XP | Gold | Score |
|---|---|---|---|---|---|---|---|---|
| Demon Slime | 1-2 | 10 | 10 | 3 | 1 | 5 | 5 | 3 |
| Zombie Rat | 1-2 | 10 | 10 | 3 | 2 | 7 | 5 | 5 |
| King Cobra | 2-3 | 15 | 7 | 3 | 3 | 16 | 5 | 10 |
| Tiger | 1-3 | 20 | 10 | 5 | 3 | 20 | 5 | 20 |
| Orc | 3-5 | 45 | 30 | 5 | 2 | 40 | 10 | 50 |
| Dragon | 5-8 | 100 | 50 | 20 | 10 | 255 | 20 | 100 |

### Enemy Selection
- Lọc theo `matchLvl.includes(player.level)`
- Loại trừ enemy vừa đánh (tránh repeat)
- Random từ pool còn lại

---

## Event System

### Event Types
| ID | Loại |
|---|---|
| 1 | Battle |
| 2 | Loot |
| 3 | Shop |

### Event Random
- Loot page sau khi xử lý → Random 1 event **khác** event hiện tại
- Select event page → Luôn hiển thị Shop + Battle để player chọn

---

## Player State (Zustand Store)

```typescript
Player {
  type: "player"
  name: string
  image: StaticImageData
  plClass: "knight" | "warrior" | "assassin" | "mage"
  level: number
  exp: number
  levelExp: number          // XP ngưỡng level tiếp
  stats: Stats              // HP, MP, maxHP, maxMP, ATK, DEF, SPD, INT
  bonusStats: BonusStats    // Cộng từ items
  buffStats: BuffStat[]     // Buff đang active (từ skill)
  items: IShopItem[]        // Inventory max 6
  skills: Skills[]          // Skills đã unlock (runtime)
  gold: number
  skillPoints: number
}
```

### Persistence
- Tự động lưu vào `localStorage["rpg_game"]` khi state thay đổi
- Load lại khi vào Home Page (Continue Game)

---

## Kế hoạch mở rộng (chưa implement)

- **Forge UI** — đã hoàn chỉnh: dialog chọn item, hold-to-forge, trừ 10G, hiển thị kết quả so sánh stat. Còn thiếu: không loại item đã chọn khỏi danh sách chọn, slot không tự dịch chuyển khi xóa slot đầu
- **UI hiển thị itemLevel** — hiện không có badge/icon nào thể hiện item level sau forge
- **UI màu theo rarity** — data rarity đã có, chưa có color mapping ở UI
- **lvlRequired enforcement** — field đã có, chưa kiểm tra khi nhặt/equip item
- **Shop duplicate check** — `handleCloseShop` push thẳng cart vào inventory, chưa kiểm tra full
- **Timeline / Event system** — thêm enemy type (normal / miniboss / boss), drop item theo loại quái
- **Skill Point spending UI** — Skill Points cộng lên nhưng chưa có màn hình dùng
- **Item consumption trong battle** — `consumeItem` đã có nhưng chưa gắn vào battle UI
- **Score leaderboard** — Score được tính nhưng chưa hiển thị
- **Cân bằng chỉ số item** — stat hiện tại là tạm thời, cần pass balance sau khi có đủ gameplay loop
