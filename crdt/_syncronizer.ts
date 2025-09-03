// import type { CRDTState, Operation } from "./state/types";

// export const hash = async (val: string) => {
// 	const data = new TextEncoder().encode(val);
// 	const hash = await crypto.subtle.digest("SHA-256", data);

// 	return Array.from(new Uint8Array(hash))
// 		.map((b) => b.toString(16).padStart(2, "0"))
// 		.join("");
// };

// export const hashOperation = async (obj: Operation): Promise<string> => {
// 	const str = JSON.stringify(obj);
// 	return hash(str);
// };

// export const getBucketHashes = async (
// 	state: CRDTState,
// 	bucketSize = 100,
// ): Promise<string[]> => {
// 	const bucketHashes: string[] = [];
// 	const stateBuckets = getBuckets(state, bucketSize);

// 	for (const bucket of stateBuckets) {
// 		let bucketHash = "";
// 		for (const op of bucket) {
// 			const opHash = await hashOperation(op);
// 			const combinedHash = await hash(bucketHash + opHash);
// 			bucketHash = combinedHash;
// 		}
// 		bucketHashes.push(bucketHash);
// 	}

// 	return bucketHashes;
// };

// export const getBucketsAt = async (
// 	state: CRDTState,
// 	indices: number[],
// 	bucketSize = 100,
// ): Promise<CRDTState> => {
// 	const stateBuckets = getBuckets(state, bucketSize);
// 	const relevant = stateBuckets.filter((_, i) => indices.includes(i));
// 	return relevant.flat();
// };

// export const getBuckets = (state: CRDTState, bucketSize = 100): CRDTState[] => {
// 	const buckets: CRDTState[] = [];

// 	for (let i = 0; i < state.length; i += bucketSize) {
// 		const bucket = state.slice(i, i + bucketSize);
// 		buckets.push(bucket);
// 	}

// 	return buckets;
// };

console.log("crdt/_syncronizer.ts acts as an archive for reference only");
