const BlinkDiff = require( 'blink-diff' );
const fs = require( 'fs' );

const DIFF_PATH = process.env.DIFF_PATH || 'photos-diffs';
const IMAGE_A_PATH = process.env.IMAGE_A_PATH || 'photos-a';
const IMAGE_B_PATH = process.env.IMAGE_B_PATH || 'photos-b';

/**
 * Run using `npm run diff`. Optionally pass in custom folders using env variables.
 *
 * Example:
 *   IMAGE_A_PATH=screenshots-a IMAGE_A_PATH=screenshots-b DIFF_PATH=results npm run diff
 */

function runDiff( image ) {
	if ( image[ 0 ] === '.' ) {
		return;
	}
	const diff = new BlinkDiff( {
		imageAPath: `${ IMAGE_A_PATH }/${ image }`,
		imageBPath: `${ IMAGE_B_PATH }/${ image }`,
		imageOutputPath: `./${ DIFF_PATH }/${ image }`,
		threshold: 50, // if at least 50 pixels are different, this will "fail".
	} );

	return new Promise( ( resolve, reject ) => {
		diff.run( ( error, result ) => {
			if ( error ) {
				reject( error );
			} else {
				resolve( diff.hasPassed( result.code ), result );
			}
		} );
	} );
}

( async () => {
	try {
		const files = await fs.promises.readdir( `./${ IMAGE_A_PATH }` );
		for ( const file of files ) {
			const result = await runDiff( file );
			console.log( file, result );
		}
	} catch ( error ) {
		console.error( error );
	}
} )();
