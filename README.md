Grab Screenshots
================

This is a collection of scripts for taking and comparing screenshots of WordPress admin pages.

## Quickstart

```
cd grab-screenshots
npm install
npm run snap
```

## Available scripts

The scripts use environment variables for configuration. Pass these in before the script command, ex:

```bash
WP_BASE_URL=http://localhost:8888 npm run snap
```

The following variables are used for `index.js`/`npm run snap`.

| Env Variable | Default | Description |
|--------------|---------|-------------|
| WP_USERNAME  | admin | Username to log in with, should have access to all pages that are requested. |
| WP_PASSWORD  | password | Password for account. |
| WP_BASE_URL  | http://trunk.wordpress.test/ | The URL to the running WordPress instance. Note, this does not _have_ to be a local install. |
| IMAGE_PATH | screenshots | Where the screenshots will be saved. This directory needs to exist already. |

### `index.js`

Run this with `npm run snap`. It will loop over all core color schemes and take screenshots of an assortment of pages, sometimes with elements hovered or focused. Read through the script to see the steps it takes.

### `diff.js`

Run this with `npm run diff`. Assuming you have two folders of matching screenshots, this will run [`blink-diff`](http://yahoo.github.io/blink-diff/) over each file-pair in the folders.

| Env Variable | Default | Description |
|--------------|---------|-------------|
| IMAGE_A_PATH | photos-a | First folder of screenshots. |
| IMAGE_B_PATH | photos-b | Second folder of screenshots. |
| DIFF_PATH    | photos-diffs | Output folder for visual diffs. |

### Putting them together

If you want to check the difference between two branches of WordPress, you could…

1. Check out `trunk` and build.
2. Run the first screenshot grab.
	```bash
	mkdir screenshots-trunk
	IMAGE_PATH=screenshots-trunk node index.js
	```
3. Check out your branch and build.
4. Run the second screenshot grab.
	```bash
	mkdir screenshots-branch
	IMAGE_PATH=screenshots-branch node index.js
	```
5. Run the image comparison script with each folder.
	```bash
	mkdir screenshots-diff
	IMAGE_A_PATH=screenshots-trunk IMAGE_B_PATH=screenshots-branch DIFF_PATH=screenshots-diff npm run diff
	```
6. 🎉 You should now have a folder `screenshots-diff` with the differences highlighted.
