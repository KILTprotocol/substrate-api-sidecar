import {
	BlockWeightStore,
	ExtBaseWeightValue,
	MetadataConsts,
	PerClassValue,
} from '../../types/chains-config';
import { kusamaDefinitions } from './kusamaConsts';
import { polkadotDefinitions } from './polkadotConsts';
import { westendDefinitions } from './westendConsts';

/**
 * Creates an object that maps each runtime to their appropriate weight data.
 *
 * Each runtime imports their own `chainDefinitions`. `chainDefinitions`
 * are arrays that store objects which group a set of runtimes version and associated
 * extrinsic weight data.
 *
 * Example return object:
 * {
 * 	   ...
 *     24: { extrinsicBaseWeight: 125000000 },
 *     25: { extrinsicBaseWeight: 125000000 },
 *     26: { extrinsicBaseWeight: 125000000 },
 *     27: { blockWeights: { perClass: [Object] } },
 *     28: { blockWeights: { perClass: [Object] } }
 *     ...
 * }
 *
 * @param chainDefinitions An array of objects that group data based on runtimes
 * and their extrinsicBaseWeight metadata
 */
export function generateBlockWeightStore(
	chainDefinitions: MetadataConsts[]
): BlockWeightStore {
	const blockWeightStore: BlockWeightStore = {};

	for (const def of chainDefinitions) {
		const runtimeVersions = def.runtimeVersions;
		for (const version of runtimeVersions) {
			blockWeightStore[version] = {};

			if ((def as ExtBaseWeightValue).extrinsicBaseWeight) {
				(blockWeightStore[
					version
				] as ExtBaseWeightValue).extrinsicBaseWeight = (def as ExtBaseWeightValue).extrinsicBaseWeight;
			} else if ((def as PerClassValue).perClass) {
				(blockWeightStore[
					version
				] as PerClassValue).perClass = (def as PerClassValue).perClass;
			} else {
				throw new Error(
					'No Valid weight type found while generating block weight store'
				);
			}
		}
	}

	return blockWeightStore;
}

/**
 * Returns a set of runtimes pointing to their blockWeightDefinitions specific to
 * a chain
 *
 * @param specName specName from the metadata of the current block being fetched
 */
export function getBlockWeight(specName: string): BlockWeightStore {
	switch (specName) {
		case 'polkadot':
			return generateBlockWeightStore(polkadotDefinitions);
		case 'kusama':
			return generateBlockWeightStore(kusamaDefinitions);
		case 'westend':
			return generateBlockWeightStore(westendDefinitions);
		default:
			return {};
	}
}
