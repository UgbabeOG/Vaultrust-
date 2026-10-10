import type { ShipmentCheckpoint } from '../data/mockCustodyData';

function isFinalDestinationCheckpoint(checkpoint: ShipmentCheckpoint, destination: string): boolean {
  const location = checkpoint.location.trim().toLocaleLowerCase();
  const destinationLocation = destination.trim().toLocaleLowerCase();

  return (
    (destinationLocation !== '' && location === destinationLocation) ||
    /safe-hand\s+(?:handover|escort|exchange)|final custody release|final destination|destination reached|final delivery/i.test(
      `${checkpoint.location} ${checkpoint.status}`,
    )
  );
}

export function keepFinalDestinationLast(
  checkpoints: ShipmentCheckpoint[],
  destination: string,
): ShipmentCheckpoint[] {
  const regularCheckpoints: ShipmentCheckpoint[] = [];
  const finalDestinationCheckpoints: ShipmentCheckpoint[] = [];

  for (const checkpoint of checkpoints) {
    (isFinalDestinationCheckpoint(checkpoint, destination)
      ? finalDestinationCheckpoints
      : regularCheckpoints
    ).push(checkpoint);
  }

  return [...regularCheckpoints, ...finalDestinationCheckpoints];
}

export function insertCheckpointBeforeFinalDestination(
  checkpoints: ShipmentCheckpoint[],
  checkpoint: ShipmentCheckpoint,
  destination: string,
): ShipmentCheckpoint[] {
  const orderedCheckpoints = keepFinalDestinationLast(checkpoints, destination);
  const finalDestinationIndex = orderedCheckpoints.findIndex((item) =>
    isFinalDestinationCheckpoint(item, destination),
  );

  if (finalDestinationIndex === -1) return [...orderedCheckpoints, checkpoint];

  return [
    ...orderedCheckpoints.slice(0, finalDestinationIndex),
    checkpoint,
    ...orderedCheckpoints.slice(finalDestinationIndex),
  ];
}
