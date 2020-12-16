/* Set up vars for use in e2e-test-utils */
process.env.WP_USERNAME = process.env.WP_USERNAME || 'admin';
process.env.WP_PASSWORD = process.env.WP_PASSWORD || 'password';
process.env.WP_BASE_URL = process.env.WP_BASE_URL || 'http://trunk.wordpress.test/';

const puppeteer = require( 'puppeteer' );
const { visitAdminPage } = require( '@wordpress/e2e-test-utils' );

const screenshotDOMElement = require( './utils/screenshot' );
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

	let i;
	for ( i = 0; i < linkList.length; i++ ) {
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

	// Open a single image in details view.
	await visitAdminPage( 'upload.php', 'item=7' );
	await page.waitForSelector( 'img.details-image' );
	await page.screenshot( { path: `${ IMAGE_PATH }/ss-${ i }.png` } );

	// Open the contextual help panel.
	await visitAdminPage( 'edit.php' );
	await page.click( '#contextual-help-link' );
	await page.waitForSelector( '#tab-panel-overview' );
	// Wait 1s for the animation to complete.
	await page.waitForTimeout( 1000 );
	await screenshotDOMElement( {
		path: `${ IMAGE_PATH }/ss-${ i + 1 }.png`,
		selector: '#screen-meta',
		padding: 16,
	} );

	// Get the Site Health page.
	await visitAdminPage( 'site-health.php' );
	await page.waitForTimeout( 100 );
	await page.hover( '.health-check-accordion-trigger' );
	await page.screenshot( { path: `${ IMAGE_PATH }/ss-${ i + 2 }.png` } );

	await browser.close();
} )();
