import type { BattleRecordView, OutcomeName, OutcomeTally } from "@janken-app/janken";
import type { JSX } from "react";

/** tallyLabels は戦績の枠の並びと名前です。 */
const tallyLabels: readonly { readonly outcome: OutcomeName; readonly label: string }[] = [
  { outcome: "win", label: "勝ち" },
  { outcome: "lose", label: "負け" },
  { outcome: "draw", label: "あいこ" },
];

/** percentageText は割合の表示です。計算できない（一度も判定していない）ときは「-」を出します。 */
function percentageText(tally: OutcomeTally): string {
  return tally.percentage === null ? "-" : `${String(tally.percentage)}%`;
}

/** BattleRecordPanelProps は戦績の表示に渡す値です。 */
export interface BattleRecordPanelProps {
  readonly record: BattleRecordView;
}

/** BattleRecordPanel は勝ち・負け・あいこの回数と割合を並べて表示します。 */
export function BattleRecordPanel({ record }: BattleRecordPanelProps): JSX.Element {
  return (
    <div className="record" role="group" aria-label="戦績">
      {tallyLabels.map(({ outcome, label }) => (
        <div key={outcome} role="group" aria-label={label}>
          <div className="label">{label}</div>
          <div className="count">{`${String(record[outcome].count)}回`}</div>
          <div className="pct">{percentageText(record[outcome])}</div>
        </div>
      ))}
    </div>
  );
}
