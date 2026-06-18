import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const seatCount = 15_000;
const seatsPerRow = 150;
const rowCount = seatCount / seatsPerRow;
const sectionSize = rowCount / 5;
const priceTiers = ["vip", "premium", "standard"];
const statuses = ["available", "available", "available", "available", "available", "available", "available", "held", "reserved", "sold"];
const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputPath = join(scriptDir, "../apps/web/public/venue-large.json");

const sections = Array.from({ length: 5 }, (_, sectionIndex) => {
  const sectionLetter = String.fromCharCode(65 + sectionIndex);
  const firstRowIndex = sectionIndex * sectionSize;
  const seats = Array.from({ length: sectionSize * seatsPerRow }, (_, seatIndex) => {
    const rowOffset = Math.floor(seatIndex / seatsPerRow);
    const seatNumber = (seatIndex % seatsPerRow) + 1;
    const rowNumber = firstRowIndex + rowOffset + 1;
    const priceTier = priceTiers[Math.min(2, Math.floor(rowNumber / 35))];
    const status = statuses[(rowNumber * 17 + seatNumber * 13) % statuses.length];

    return {
      id: `${sectionLetter}-${rowNumber}-${seatNumber}`,
      row: `${sectionLetter}${rowNumber}`,
      number: seatNumber,
      x: 48 + (seatNumber - 1) * 22,
      y: 180 + rowNumber * 28,
      priceTier,
      status
    };
  });

  return {
    id: `section-${sectionLetter.toLowerCase()}`,
    name: `Section ${sectionLetter}`,
    seats
  };
});

const venue = {
  id: "large-venue",
  name: "Large Performance Arena",
  map: {
    width: 3_420,
    height: 3_120
  },
  sections
};

await writeFile(outputPath, `${JSON.stringify(venue)}\n`);
console.log(`Generated ${seatCount} seats at ${outputPath}`);
