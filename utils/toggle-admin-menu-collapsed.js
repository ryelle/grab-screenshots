/* global setUserSetting */

/**
 * Set the cookie for a "collapsed" admin menu.
 *
 * @param {boolean} collapsed Whether the menu should be open (false) or
 *                            closed (true). Defaults to true.
 */
module.exports = async function toggleAdminMenuCollapsed( collapsed = true ) {
	await page.evaluate( async ( localCollapsed ) => {
		setUserSetting( 'mfold', localCollapsed ? 'f' : 'o' );
	}, collapsed );
};
