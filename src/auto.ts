/** Bundle entry: registers <thumb-snap> and re-exports the public API. */
import { defineThumbSnap } from './index';

defineThumbSnap();

export * from './index';
