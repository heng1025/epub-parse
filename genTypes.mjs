import { Extractor, ExtractorConfig } from '@microsoft/api-extractor';
import rimraf from 'rimraf';

const extractorConfig = ExtractorConfig.loadFileAndPrepare(
  './api-extractor.json',
);
// Invoke API Extractor
const extractorResult = Extractor.invoke(extractorConfig, {
  localBuild: true,
  showVerboseMessages: false,
});

if (extractorResult.succeeded) {
  console.log(`API Extractor completed successfully`);

  rimraf(`dist/types`, () => {
    console.log('rm types directory successfully');
  });
  process.exitCode = 0;
} else {
  console.error(
    `API Extractor completed with ${extractorResult.errorCount} errors` +
      ` and ${extractorResult.warningCount} warnings`,
  );
  process.exitCode = 1;
}
