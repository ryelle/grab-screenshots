const BlinkDiff = require("blink-diff");
const fs = require("fs");

const DIFF_PATH = process.env.DIFF_PATH || "diffs";
const IMAGE_A_PATH = process.env.IMAGE_A_PATH || "photos";
const IMAGE_B_PATH = process.env.IMAGE_B_PATH || "photos-branch";

/**
 * Run using `npm run diff`. Optionally pass in custom folders using env variables.
 *
 * Example:
 *   IMAGE_A_PATH=screenshots-a IMAGE_A_PATH=screenshots-b DIFF_PATH=results npm run diff
 */

function runDiff(image) {
  var diff = new BlinkDiff({
    imageAPath: `${IMAGE_A_PATH}/${image}`,
    imageBPath: `${IMAGE_B_PATH}/${image}`,
    imageOutputPath: `./${DIFF_PATH}/${image}`,

    // thresholdType: BlinkDiff.THRESHOLD_PERCENT, defaults to pixels
    threshold: 50,
  });

  return new Promise((resolve, reject) =>
    diff.run((error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(diff.hasPassed(result.code), result);
      }
    })
  );
}

(async () => {
  try {
    const files = await fs.promises.readdir(`./${IMAGE_A_PATH}`);
    for (const file of files) {
      const result = await runDiff(file);
      console.log(file, result);
    }
  } catch (error) {
    console.error(error);
  }
})();
