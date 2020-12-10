/* global document */
// From https://gist.github.com/malyw/b4e8284e42fdaeceab9a67a9b0263743
/**
 * Takes a screenshot of a DOM element on the page, with optional padding.
 *
 * @param {!{path:string, selector:string, padding:(number|undefined)}=} opts
 * @return {!Promise<!Buffer>} Promise resolves when the screenshot is saved.
 */
module.exports = async function screenshotDOMElement( opts = {} ) {
	const padding = 'padding' in opts ? opts.padding : 0;
	const path = 'path' in opts ? opts.path : null;
	const selector = opts.selector;

	if ( ! selector ) {
		throw Error( 'Please provide a selector.' );
	}

	// selector is passed through evaluate into the page context via pageSelector.
	const rect = await page.evaluate( ( pageSelector ) => {
		const element = document.querySelector( pageSelector );
		if ( ! element ) {
			return null;
		}
		const { x, y, width, height } = element.getBoundingClientRect();
		return { left: x, top: y, width, height, id: element.id };
	}, selector );

	if ( ! rect ) {
		throw Error( `Could not find element that matches selector: ${ selector }.` );
	}

	return await page.screenshot( {
		path,
		clip: {
			x: rect.left - padding,
			y: rect.top - padding,
			width: rect.width + ( padding * 2 ),
			height: rect.height + ( padding * 2 ),
		},
	} );
};
