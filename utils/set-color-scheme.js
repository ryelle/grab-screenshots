const { visitAdminPage } = require("@wordpress/e2e-test-utils");

/**
 * Load profile page and run the ajax request inline.
 */
module.exports = async function setColorScheme(slug) {
  await visitAdminPage("profile.php");
  await page.evaluate(async (color_scheme) => {
    await jQuery.post(ajaxurl, {
      action: "save-user-color-scheme",
      color_scheme: color_scheme,
      nonce: jQuery("#color-nonce").val(),
    });
  }, slug);
}
