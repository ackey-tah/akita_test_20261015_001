# janken パッケージ

じゃんけんの手・勝敗判定・戦績・対戦の進行を表すパッケージです。コードは `packages/janken/src/domain/` にあります。

## 境界一覧

| 境界 | コードのフォルダ | 内容 |
| --- | --- | --- |
| [手と勝敗](hand-手と勝敗.md) | `hand/` | 手と、2 つの手から決まる勝敗 |
| [戦績](battle-record-戦績.md) | `battle-record/` | 勝ち・負け・あいこの回数と割合 |
| [対戦の進行](game-session-対戦の進行.md) | `game-session/` | 直前の勝負と戦績から、次に何ができるかを決める |

## 俯瞰図

```mermaid
%%{init: {"theme": "base", "themeVariables": {"nodeBorder": "#37474F", "classText": "#212121", "mainBkg": "#FFFFFF", "lineColor": "#6E7F8D"}, "themeCSS": ".edgeTerminals .edgeLabel p { background: #FFFFFF; color: #212121; padding: 0 2px; border-radius: 2px; }"}}%%
classDiagram
    direction TB
    class GameSession["対戦の進行<br>GameSession"] {
        <<Value Object / 対戦の進行>>
    }
    class Round["勝負<br>Round"] {
        <<Value Object / 対戦の進行>>
    }
    class BattleRecord["戦績<br>BattleRecord"] {
        <<Value Object / 戦績>>
    }
    class Hand["手<br>Hand"] {
        <<Value Object / 手と勝敗>>
    }
    class Outcome["勝敗<br>Outcome"] {
        <<Value Object / 手と勝敗>>
    }
    GameSession "1" *-- "1" BattleRecord : これまでの戦績
    GameSession "1" *-- "0..1" Round : 直前の勝負
    Round "1" *-- "2" Hand : プレイヤーと相手の手
    Round "1" *-- "1" Outcome : 判定した勝敗
    BattleRecord ..> "1" Outcome : 勝敗ごとに数える
    style GameSession fill:#C8E6C9,stroke:#1B5E20
    style Round fill:#C8E6C9,stroke:#1B5E20
    style BattleRecord fill:#C8E6C9,stroke:#1B5E20
    style Hand fill:#C8E6C9,stroke:#1B5E20
    style Outcome fill:#C8E6C9,stroke:#1B5E20
```

対戦の進行は、直前の勝負と戦績を 1 つにまとめた値です。プレイヤーが手を選ぶたびに、新しい勝負を判定して戦績に加えた新しい対戦の進行が作られます。相手の手をランダムに選ぶ部分（乱数）はドメインの外にあり、ドメインは「0 以上 1 未満の値をどの手に対応させるか」（等確率の規則）だけを持ちます。
