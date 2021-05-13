/* global jQuery, ajaxurl */
const { visitAdminPage } = require( '@wordpress/e2e-test-utils' );

/**
 * Load profile page and run the ajax request inline.
 *
 * @param {string} slug The key for the color scheme.
 */
module.exports = async function setColorScheme( slug ) {
	await visitAdminPage( 'profile.php' );
	await page.evaluate( async ( colorScheme ) => {
		// We send an ajax request instead of clicking on the button so we can
		// wait for the ajax request to complete. Previously the page would
		// navigate away from the profile before the ajax request triggered.
		await jQuery.post( ajaxurl, {
			action: 'save-user-color-scheme',
			color_scheme: colorScheme,
			nonce: jQuery( '#color-nonce' ).val(),
		} );
	}, slug );
};
