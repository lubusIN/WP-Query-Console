=== WP Query Console ===
Contributors: lubus,ajitbohra
Donate link: http://www.lubus.in
Tags: admin, test, query, development
Requires at least: 3.0.1
Tested up to:  4.9.4
Stable tag: 1.0
License: GPLv3
License URI: http://www.gnu.org/licenses/gpl-3.0.html

Test Various WordPress Queries

== Description ==
>**Disclaimer:** Plugin development is in progress & we are constantly improving the code. If you think code can be improved or have any suggestion feel free to send a PR or [open an issue](https://github.com/lubusIN/wp-query-console/issues).

Handy tool for developers to quickly test various WordPress queries (WP_Query, WP_User_Query, WP_Comment_Query, WP_Term_Query, WP_Network_Query, WP_Site_Query). Simply provide your arguments array and select the query type you would like to test. You will get the result as a collapsible tree.

----------

**Usage**

- Simply activate and new menu option "Query Console" will be added<br/>
- Enter you query arguments array in editor provided, select query type from dropdown & hit execute<br/>
- Check the result displayed

**Roadmap**

 - More info about query for debugging<br/>
 - Code refactoring and improvement<br/>
 - UI for arguments<br/>
 - Saving queries<br/>
 - Localization

If you have any suggestions/Feature request that you would like to see in the upcoming releases , feel free to let us know in the [issues section](https://github.com/lubusIN/wp-query-console/issues)

== Installation ==
***From your WordPress dashboard***
 1. Visit 'Plugins > Add New'
 2. Search for `WP Query Console`  or upload zip file
 3. Activate `WP Query Console` from your Plugins page

***Manual Installation***
 1. [Download](https://wordpress.org/plugins/wp-query-console/) "WP Query Console".
 2. Upload the `wp-query-console` directory to your '/wp-content/plugins/' directory, using your favorite method (ftp, sftp, scp, etc...)
 3. Activate `WP Query Console` from your Plugins page.

== Screenshots ==

1. Plugin in action

== Changelog ==

***v1.0***

Released on 16th March 2018

 - Complete rewrite using React [ Gutenberg Effect ;) ]

***v0.1***

Released on 19th March 2017

 - Initial plugin release
