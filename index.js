/* Set up vars for use in e2e-test-utils */
process.env.WP_USERNAME = "admin";
process.env.WP_PASSWORD = "password";
process.env.WP_BASE_URL = "http://trunk.wordpress.test/";

const puppeteer = require("puppeteer");
const { visitAdminPage } = require("@wordpress/e2e-test-utils");

const screenshotDOMElement = require("./utils");

const IMAGE_PATH = process.env.IMAGE_PATH || "screenshots";
const schemes = [
  "fresh",
  "light",
  "modern",
  "blue",
  "coffee",
  "ectoplasm",
  "midnight",
  "ocean",
  "sunrise",
];

/**
 * Load profile page and run the ajax request inline.
 */
async function setColorScheme(slug) {
  await visitAdminPage("profile.php");
  await page.evaluate(async (color_scheme) => {
    await jQuery.post(ajaxurl, {
      action: "save-user-color-scheme",
      color_scheme: color_scheme,
      nonce: jQuery("#color-nonce").val(),
    });
  }, slug);
}

(async () => {
  global.browser = await puppeteer.launch();
  global.page = await browser.newPage();

  for (var i = 0; i < schemes.length; i++) {
    const slug = schemes[i];
    await setColorScheme(slug);

    await page.setViewport({
      width: 1024,
      height: 600,
      deviceScaleFactor: 1,
    });
    await visitAdminPage("index.php");
    await page.screenshot({ path: `${IMAGE_PATH}/dashboard-${slug}.png` });

    await page.focus("#welcome-panel .button-hero");
    await screenshotDOMElement({
      path: `${IMAGE_PATH}/dashboard-button-focus-${slug}.png`,
      selector: "#welcome-panel",
      padding: 16,
    });

    await visitAdminPage("themes.php");
    await page.hover(".theme-browser .theme:not(.active)");
    await page.screenshot({ path: `${IMAGE_PATH}/themes-${slug}.png` });

    await visitAdminPage("edit.php");
    await page.focus("#adminmenu a[href='edit.php?post_type=page']");
    await page.hover("#adminmenu a[href='edit.php?post_type=page'] + ul a");
    await page.screenshot({ path: `${IMAGE_PATH}/edit-${slug}.png` });

    await visitAdminPage("customize.php");
    await page.hover("#accordion-section-title_tagline");
    await screenshotDOMElement({
      path: `${IMAGE_PATH}/customizer-${slug}.png`,
      selector: "#customize-controls",
    });

    await page.setViewport({
      width: 425,
      height: 600,
      deviceScaleFactor: 2,
    });
    await visitAdminPage("edit.php");
    await page.hover("#wp-admin-bar-site-name a");
    await page.screenshot({ path: `${IMAGE_PATH}/mobile-edit-${slug}.png` });

    await visitAdminPage("nav-menus.php");
    await page.screenshot({
      path: `${IMAGE_PATH}/mobile-nav-menus-${slug}.png`,
    });

    await visitAdminPage("site-health.php");
    await page.screenshot({
      path: `${IMAGE_PATH}/mobile-site-health-${slug}.png`,
    });
  }

  await browser.close();
})();