import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/common.ts',
    'src/observation.ts',
    'src/evidence.ts',
    'src/session.ts',
    'src/claim.ts',
    'src/proof.ts'
  ],
  format: ['esm'],
  dts: true,
  clean: true,
  treeshake: true
});