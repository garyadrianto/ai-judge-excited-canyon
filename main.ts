/**
 * main.ts — entry for the make.fun competition "ai-excited-01".
 *
 * What it does: copies the PNG image shipped next to this script (entry.png in
 * the same directory as main.ts) into the competition output directory as
 * "entry.png" — that is <MAKEFUN_OUTPUT_DIR>/entry.png when the environment
 * variable MAKEFUN_OUTPUT_DIR is set and non-empty, otherwise /output/entry.png.
 * It creates the output directory recursively, checks that the source really
 * starts with the 8-byte PNG signature, copies the bytes exactly, verifies that
 * the written file is non-empty, and exits 0.
 *
 * Determinism: the program reads one fixed input file and writes its bytes
 * unchanged. It uses no randomness, no clock, no hashing of its own, no network
 * and no dependencies — only node:fs and node:path from the Node 22 standard
 * library — so both competition runs write identical bytes.
 */

const fs = require("node:fs");
const path = require("node:path");

/** The 8-byte PNG file signature: \x89 P N G \r \n \x1a \n */
const PNG_SIGNATURE: Buffer = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function main(): void {
  // Directory of this script, resolved without relying on the module format.
  const scriptArg: string = process.argv[1] ?? path.join(process.cwd(), "main.ts");
  const scriptDir: string = path.dirname(path.resolve(scriptArg));

  const sourcePath: string = path.join(scriptDir, "entry.png");

  const envDir: string | undefined = process.env.MAKEFUN_OUTPUT_DIR;
  const outputDir: string = envDir !== undefined && envDir.trim() !== "" ? envDir : "/output";
  const outputPath: string = path.join(outputDir, "entry.png");

  let bytes: Buffer;
  try {
    bytes = fs.readFileSync(sourcePath);
  } catch (error) {
    throw new Error(
      "Source image not found or unreadable: " +
        sourcePath +
        " (main.ts copies entry.png from its own directory; " +
        "original error: " +
        String(error) +
        ")"
    );
  }

  // Guard: the source must genuinely be a PNG, not a renamed or truncated file.
  if (bytes.length < PNG_SIGNATURE.length || !bytes.subarray(0, 8).equals(PNG_SIGNATURE)) {
    throw new Error(
      "Source file is not a PNG (bad magic bytes): " + sourcePath + " (" + bytes.length + " bytes)"
    );
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(outputPath, bytes);

  // Guard: the bytes landed on disk and the result is a non-empty file.
  const written: Buffer = fs.readFileSync(outputPath);
  if (written.length === 0) {
    throw new Error("Wrote an empty file to " + outputPath + "; refusing to report success.");
  }
  if (written.length !== bytes.length || !written.equals(bytes)) {
    throw new Error(
      "Copy verification failed for " +
        outputPath +
        ": wrote " +
        written.length +
        " bytes, expected " +
        bytes.length
    );
  }

  process.stdout.write("wrote " + outputPath + " (" + written.length + " bytes)\n");
}

main();
process.exit(0);
