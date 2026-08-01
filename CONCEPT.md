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
                                              [Select Event]  ← đọc RunConfig.stages[currentStage]
                                            ┌──────┼──────┐
                                       [Battle]  [Shop]  [Forge]
                                            └──────┼──────┘
                                            currentStage + 1
                                              [Select Event]  ← vòng lặp theo timeline cố định
                                                     ↓
                                         (hết stage / thua trận)
                                                     ↓
                                              [Game Over]
```

Run hiện tại (`data/run-config.ts — RunConfig`) là 1 timeline **cố định 10 stage**: battle, battle, shop, battle, battle, forge, battle, battle, shop, battle(boss). Không còn random 2 lựa chọn Shop/Battle như bản thiết kế cũ — mỗi stage có `type` xác định trước (`battle` | `shop` | `forge`), stage battle cuối cùng có `isBoss: true`.

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
- Đọc `currentStage` từ `store/timeline-store.ts`, lấy `stageData = RunConfig.stages[currentStage]`
- Render section tương ứng `stageData.type`:
  - **`battle`** → `EnemyPickingSection` (`_components/battle/`)
  - **`shop`** → `ShopSection` (`_components/shop/`)
  - **`forge`** → `ForgeSection` (`_components/forge/`)
- Hết stage (qua khỏi stage cuối) → hiển thị màn "End of demo" với link về Home (chưa có màn chọn run mới)
- `RunTimeline` (`components/layouts/run-timeline/`) hiển thị thanh tiến trình toàn bộ 10 stage, ẩn ở các trang `create-character`, `high-score`, `battle`, `game-over`

#### Battle stage — `EnemyPickingSection`
- Nếu `stageData.isBoss`: hiển thị đúng 1 boss card (`getRandomBoss`)
- Ngược lại: hiển thị 3 enemy card ngẫu nhiên khớp level (`getRandomEnemies`)
- Chọn enemy → `selectEnemy(key)` → `/battle`

#### Shop stage — `ShopSection`
- Random 1 shop theo `stageData.shopId`, hiển thị 3 item ngẫu nhiên
- Thêm/bớt cart, giới hạn inventory 6 slot
- "Continue": kiểm tra đủ gold (chặn nếu cart vượt gold), áp dụng mua (items + bonus stats + skill unlock nếu có) → tăng `currentStage` → `/select-event`

#### Forge stage — `ForgeSection`
- `ItemsSelection`: chọn 2 item cùng `key` + cùng `itemLevel` để forge (xem **Forge System**)
- `ForgeResult`: hiển thị so sánh stat trước/sau
- "Done" → tăng `currentStage` → `/select-event`

### Battle (`battle/page.tsx`)
- Xem mục **Battle System** (generate-replay)
- Thắng → popup nhặt item (`DropItemDialog`, rarity theo `enemy.dropRarity`), tính thưởng, kiểm tra level up, tăng `currentStage` → `/select-event`
- Thua → `/game-over`

### Game Over (`game-over/page.tsx`)
- Hiển thị `Score` hiện tại
- Nút **Restart**: xóa `localStorage["rpg_game"]`, reset player + score → `/`
- Chưa có bảng thống kê chi tiết (thời gian chơi, số enemy đã hạ, v.v.)

> **Đã gộp**: `shop/page.tsx` và `loot/page.tsx` (2 trang độc lập cũ) không còn tồn tại. Logic shop chuyển vào `select-event/_components/shop/`; logic loot/drop-item chuyển thẳng vào `battle/page.tsx` (kích hoạt khi thắng trận, dùng `getRandomItemByRarity`).

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

### Generate-Replay (không còn live turn-based)
Battle giờ được **mô phỏng toàn bộ ngay khi vào màn hình** (`hooks/use-simulate-battle.ts — simulateBattle`), rồi **phát lại** dưới dạng animation, thay vì xử lý turn-based tương tác trực tiếp:
- `simulateBattle(player, enemy)` chạy vòng lặp tối đa `MAX_TURNS = 200`, tạo ra `BattleTimeline = { events: BattleEvent[], result }`
- Mỗi `BattleEvent` là 1 snapshot đầy đủ (player, enemy, buffCounter, combatLog, actions) sau 1 hành động
- `battle/page.tsx` lưu toàn bộ timeline này, rồi dùng 1 effect để phát lại từng event một (set state theo snapshot, chờ `ACTION_DELAY`/`ROUND_DELAY`, tăng cursor) — người chơi xem lại kết quả đã định sẵn, không còn bấm nút hành động theo lượt
- Khi phát hết event: hiện nút "Next" cùng kết quả thắng/thua

### Turn Order
- So sánh `player.stats.spd` vs `enemy.stats.spd` **ở turn đầu tiên**
- SPD cao hơn → đi trước; bằng nhau → Player đi trước
- Từ turn thứ 2 trở đi: đơn giản luân phiên Player/Enemy (không re-check SPD mỗi turn)

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

**Shop** (`select-event/_components/shop/ShopSection.tsx — handleCloseShop`):
- Cart giới hạn theo inventory 6 slot khi thêm item
- Khi checkout: kiểm tra tổng giá cart vượt `player.gold` → chặn, báo lỗi toast (fix mới, trước đây không kiểm tra)

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

| Rarity | Border Color (`RARITY_DATA`) |
|---|---|
| common | `border-gray-300` |
| uncommon | `border-green-500` |
| rare | `border-blue-500` |
| epic | `border-violet-500` |
| legendary | `border-orange-500` |

- **UI**: border màu theo rarity đã áp dụng ở mọi nơi hiển thị icon item — shop, inventory, forge (2 slot + danh sách chọn), drop-item dialog, forge result — thông qua component dùng chung `components/shared/ItemImageBlock.tsx` (shop, drop dialog) hoặc trực tiếp `RARITY_DATA[item.rarity]?.borderColor` (inventory, forge, vì layout khác kích thước chuẩn)
- **Drop Weight** (`hooks/use-shop.ts — rollDropRarity`): `dropRarity` trên enemy là **rarity trần** (mức cao nhất có thể rơi, không phải rarity cố định). Roll theo trọng số: mỗi bậc thấp hơn trần có xác suất gấp `RARITY_DROP_FALLOFF = 3` lần bậc kế trên (hằng số trong `constants/items.constants.ts`), rarity trần luôn là kết quả hiếm nhất có thể
  - Ví dụ `dropRarity: epic` → tỉ lệ thực tế ≈ common 67%, uncommon 22.5%, rare 7.5%, epic 2.5%
  - `dropRarity: common` → luôn ra common (100%, không có bậc thấp hơn để roll)
- `rarity` **không thay đổi** sau forge — chỉ phản ánh nguồn gốc/độ hiếm của item (forge chỉ tăng `itemLevel`)
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
Xem chi tiết ở **Select Event → Shop stage** (`ShopSection.tsx`). Tóm tắt:
1. Vào shop stage: hiển thị 3 item ngẫu nhiên từ danh sách shop tương ứng `stageId`
2. Click item → Thêm vào cart, trừ gold tạm; click lại → bỏ khỏi cart, hoàn gold
3. Nhấn "Continue" → kiểm tra đủ gold → xác nhận mua: items vào inventory, skill (nếu có) unlock level 1, `skillLevelData` cập nhật, gold trừ chính thức, chuyển sang stage tiếp theo

---

## Enemy System

### Enemy Database (6 kẻ thù)
| Enemy | Match Level | HP | ATK | DEF | SPD | XP | Gold | Score | Boss | Drop Rarity (trần) |
|---|---|---|---|---|---|---|---|---|---|---|
| Demon Slime | 1-2 | 10 | 10 | 3 | 1 | 5 | 5 | 3 | | common |
| Zombie Rat | 1-2 | 10 | 10 | 3 | 2 | 7 | 5 | 5 | | common |
| King Cobra | 2-3 | 15 | 7 | 3 | 3 | 16 | 5 | 10 | | common |
| Tiger | 1-3 | 20 | 10 | 5 | 3 | 20 | 5 | 20 | | uncommon |
| Orc | 3-5 | 45 | 30 | 5 | 2 | 40 | 10 | 50 | ✓ | uncommon |
| Dragon | 5-8 | 100 | 50 | 20 | 10 | 255 | 20 | 100 | ✓ | epic |

### Enemy Selection
- **Stage thường** (`isBoss: false`): `getRandomEnemies` lọc `matchLvl.includes(player.level) && !enemy.isBoss`, hiển thị 3 lựa chọn ngẫu nhiên
- **Stage boss** (`isBoss: true`): `getRandomBoss` lọc `enemy.isBoss && matchLvl.includes(player.level)`, hiển thị đúng 1 lựa chọn
- Sau khi thắng: `enemy.dropRarity` là rarity trần cho item rơi ra (xem **Rarity System → Drop Weight**)

---

## Event System (Run Timeline)

Đã thay thế bằng hệ thống timeline cố định — xem **Game Flow** và **Select Event** ở đầu tài liệu. Không còn khái niệm "Loot" là 1 stage riêng hay random giữa Shop/Battle: mỗi run có đúng 10 stage định trước trong `RunConfig.stages` (`data/run-config.ts`), loại stage là `battle` | `shop` | `forge`, tiến trình lưu ở `store/timeline-store.ts` (`currentStage` index).

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

- **Forge UI** — đã hoàn chỉnh: dialog chọn item, hold-to-forge, trừ 10G, hiển thị kết quả so sánh stat, border rarity. Còn thiếu: không loại item đã chọn khỏi danh sách chọn, slot không tự dịch chuyển khi xóa slot đầu
- **lvlRequired enforcement** — field đã có, chưa kiểm tra khi nhặt/equip item
- **Item consumption trong battle** — `consumeItem` đã có nhưng chưa gắn vào battle UI
- **Score leaderboard** — Score được tính nhưng chưa hiển thị
- **Sau khi hết Run** — hiện chỉ có màn "End of demo" tạm (link về Home), chưa có màn tổng kết run / chọn run tiếp theo
- **Game Over screen** — mới chỉ hiển thị Score + nút Restart, chưa có thống kê chi tiết (thời gian, số enemy hạ, item đã nhặt...)
- **Cân bằng chỉ số item** — stat hiện tại là tạm thời, cần pass balance sau khi có đủ gameplay loop
- **Item Effect (trigger theo điều kiện)** — item không chỉ cộng stat tĩnh mà có thể mang hiệu ứng kích hoạt theo điều kiện cụ thể, ví dụ:
  - Đầu trận (`on_battle_start`): buff/debuff ngay khi vào battle
  - Theo chỉ số (`hp_below_x%`, `mp_above_x`, ...): kích hoạt khi stat đạt ngưỡng
  - Theo turn (`on_turn_n`, `every_n_turns`): lặp lại theo chu kỳ
  - Khi bị tấn công / gây damage (`on_hit`, `on_taken_damage`): phản đòn, hồi máu, né...
  - Khi kết thúc trận (`on_battle_end`): hồi phục, cộng thêm reward
  - Cần thiết kế: cấu trúc data effect trên `IShopItem` (loại trigger, điều kiện, hiệu ứng), engine kiểm tra & kích hoạt effect trong vòng lặp battle (`use-game.ts`)
