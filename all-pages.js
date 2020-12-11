/* Set up vars for use in e2e-test-utils */
process.env.WP_USERNAME = process.env.WP_USERNAME || 'admin';
process.env.WP_PASSWORD = process.env.WP_PASSWORD || 'password';
process.env.WP_BASE_URL = process.env.WP_BASE_URL || 'http://trunk.wordpress.test/';

const puppeteer = require( 'puppeteer' );
const { visitAdminPage } = require( '@wordpress/e2e-test-utils' );

const setColorScheme = require( './utils/set-color-scheme' );

const IMAGE_PATH = process.env.IMAGE_PATH || 'screenshots';
const COLOR_SCHEME = process.env.COLOR_SCHEME || 'fresh';

( async () => {
	global.browser = await puppeteer.launch();
	global.page = await browser.newPage();

	await setColorScheme( COLOR_SCHEME );

	await page.setViewport( {
		width: 1024,
		height: 600,
		deviceScaleFactor: 1,
	} );

	const linkList = await page.evaluate( () => {
		const links = [];
		// eslint-disable-next-line no-undef -- document is defined in page context.
		document
			.querySelectorAll( '#adminmenu a.menu-top' )
			.forEach( ( el ) => links.push( el.href ) );
		return links;
	} );

	for ( let i = 0; i < linkList.length; i++ ) {
		const url = new URL( linkList[ i ] );
		await visitAdminPage(
			url.pathname.replace( '/wp-admin/', '' ),
			url.searchParams,
		);
		if ( i === 3 ) {
			await page.focus( "#adminmenu a[href='edit.php?post_type=page']" );
			await page.hover( "#adminmenu a[href='edit.php?post_type=page'] + ul a" );
		}
		await page.screenshot( { path: `${ IMAGE_PATH }/ss-${ i }.png` } );
	}

	await browser.close();
} )();
