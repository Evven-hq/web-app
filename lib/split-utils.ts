export function splitEvenly(total: number, count: number) {
  if (count <= 0) return [];

  const totalCents = Math.round(total * 100);
  const baseCents = Math.floor(totalCents / count);
  const remainder = totalCents % count;

  return Array.from(
    { length: count },
    (_, index) => (baseCents + (index < remainder ? 1 : 0)) / 100,
  );
}

export function splitByPercentage(total: number, percentages: number[]) {
  if (percentages.length === 0) return [];

  const totalCents = Math.round(total * 100);
  let allocated = 0;

  return percentages.map((percentage, index) => {
    if (index === percentages.length - 1) {
      return (totalCents - allocated) / 100;
    }

    const cents = Math.round(total * percentage);
    allocated += cents;
    return cents / 100;
  });
}

export function splitByPercentageWithParticipants<
  T extends { split_percentage?: string | number | null },
>(total: number, participants: T[]) {
  if (participants.length === 0) return [];

  return participants.map((participant) => {
    const percentage = Number(participant.split_percentage ?? 0);
    return Math.round(total * (percentage / 100) * 100) / 100;
  });
}

export function remainderAmount(total: number, allocated: number) {
  const totalCents = Math.round(total * 100);
  const allocatedCents = Math.round(allocated * 100);
  return Math.max(0, (totalCents - allocatedCents) / 100);
}
