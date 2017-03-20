<?php
/**
 * Contributors: lubus, ajitbohra
 * Plugin Name: WP Query Console
 * Description: A plugin to quickly test various WP Queries
 * Author: <a href="http://www.lubus.in">LUBUS</a>
 * Version: 0.1
 * Tags: admin, dashboard, widget, wordcamp
 * Requires at least: 3.0.1
 * Tested up to:  4.7.2
 * Stable tag: 0.1
 * License: GPLv3 or later
 * License URI: http://www.gnu.org/licenses/gpl-3.0.html
 *
 * @package WP_Query_Console
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 *  Styles.
 */
function lwqc_styles() {
	wp_register_style( 'css-codemirror', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/lib/codemirror.css', array(), '1.0', 'all' );
	wp_register_style( 'css-codemirror-theme-chrome-devtools', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/theme/chrome-devtools.css', array( 'css-codemirror' ), '1.0', 'all' );
	wp_register_style( 'css-style', plugin_dir_url( __FILE__ ) . 'assets/css/style.css', array(), '1.0', 'all' );

	wp_enqueue_style( 'css-codemirror' );
	wp_enqueue_style( 'css-codemirror-theme-chrome-devtools' );
	wp_enqueue_style( 'css-style' );
}

/**
 *  Scripts
 */
function lwqc_scripts() {
	wp_register_script( 'js-renderjson', plugin_dir_url( __FILE__ ) . 'assets/js/renderjson.js', array( 'jquery' ), '1.0', false );
	wp_register_script( 'js-codemirror', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/lib/codemirror.js', array(), '1.0', false );
	wp_register_script( 'js-codemirror-mode-htmlmixed', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/mode/htmlmixed/htmlmixed.js', array( 'js-codemirror' ), '1.0', false );
	wp_register_script( 'js-codemirror-mode-xml', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/mode/xml/xml.js', array( 'js-codemirror' ), '1.0', false );
	wp_register_script( 'js-codemirror-mode-javascript', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/mode/javascript/javascript.js', array( 'js-codemirror' ), '1.0', false );
	wp_register_script( 'js-codemirror-mode-css', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/mode/css/css.js', array( 'js-codemirror' ), '1.0', false );
	wp_register_script( 'js-codemirror-mode-clike', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/mode/clike/clike.js', array( 'js-codemirror' ), '1.0', false );
	wp_register_script( 'js-codemirror-mode-php', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/mode/php/php.js', array( 'js-codemirror' ), '1.0', false );
	wp_register_script( 'js-codemirror-addon-active-line', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/addon/selection/active-line.js', array( 'js-codemirror' ), '1.0', false );
	wp_register_script( 'js-codemirror-addon-matchbrackets', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/addon/edit/matchbrackets.js', array( 'js-codemirror' ), '1.0', false );
	wp_register_script( 'js-codemirror-addon-indent-fold', plugin_dir_url( __FILE__ ) . 'vendors/CodeMirror/addon/fold/indent-fold.js', array( 'js-codemirror' ), '1.0', false );
	wp_register_script( 'js-script', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', array( 'jquery', 'js-renderjson', 'js-codemirror' ), '1.0', false );

	wp_enqueue_script( 'js-renderjson' );
	wp_enqueue_script( 'js-codemirror' );
	wp_enqueue_script( 'js-codemirror-mode-htmlmixed' );
	wp_enqueue_script( 'js-codemirror-mode-xml' );
	wp_enqueue_script( 'js-codemirror-mode-javascript' );
	wp_enqueue_script( 'js-codemirror-mode-css' );
	wp_enqueue_script( 'js-codemirror-mode-clike' );
	wp_enqueue_script( 'js-codemirror-mode-php' );
	wp_enqueue_script( 'js-codemirror-addon-active-line' );
	wp_enqueue_script( 'js-codemirror-addon-matchbrackets' );
	wp_enqueue_script( 'js-codemirror-addon-indent-fold' );
	wp_enqueue_script( 'js-script' );
}

/**
 * Setup Plugin Page
 */
function lwqc_setup_menu() {
	$page = add_menu_page( 'WP Query Console', 'Query Console', 'manage_options', 'wp-query-console', 'lwqc_init', 'dashicons-controls-play' );
	add_action( "admin_print_scripts-{$page}", 'lwqc_scripts' ); // Add scripts.
	add_action( "admin_print_styles-{$page}", 'lwqc_styles' ); // Add styles.
}
add_action( 'admin_menu', 'lwqc_setup_menu' );

/**
 * Render Plugin Page.
 */
function lwqc_init() {
	?>

	<h1>WP Query Console</h1>

	<div class="wrap">
	<h3>Arguments</h3>
	<div class="notice notice-info">
		<p>Enter arguments <code>array</code> for the query</p>
	</div>

		<form id="query_args" method="post">

		<?php
					$args_code = (isset( $_POST['query-args'] ) ? wp_unslash( $_POST['query-args'] ) : "array('p' => 1)"); // Retain code during post.
		 			$selected_type = (isset( $_POST['wpqc-query-type'] ) ? wp_unslash( $_POST['wpqc-query-type'] ) : 'WP_Query'); // Query Type Selected Value.
		?>
		<textarea id="query-args" name="query-args" cols="80" rows="10" class="large-text"><?php echo $args_code; ?></textarea>
		<span id="wpqc-type-label">Query Type</span>
		<select id="wpqc-query-type" name="wpqc-query-type">
			<option value="WP_Query" <?php selected( $selected_type, 'WP_Query' ); ?>>WP_Query</option>
			<option value="WP_User_Query" <?php selected( $selected_type, 'WP_User_Query' ); ?>>WP_User_Query</option>
			<option value="WP_Comment_Query" <?php selected( $selected_type, 'WP_Comment_Query' ); ?>>WP_Comment_Query</option>
			<option value="WP_Term_Query" <?php selected( $selected_type, 'WP_Term_Query' ); ?>>WP_Term_Query</option>
			<option value="WP_Network_Query" <?php selected( $selected_type, 'WP_Network_Query' ); ?>>WP_Network_Query</option>
			<option value="WP_Site_Query" <?php selected( $selected_type, 'WP_Site_Query' ); ?>>WP_Site_Query</option>
		</select>
		<button id="wpqc-btn-execute" class="button button-primary" type="submit" name="execute">
			<i class="dashicons dashicons-controls-play"></i> Execute
		</button>
		<p class="wp-clearfix"></p>
	 </form>

	<div id="lwqc_query_result" class="welcome-panel">
		<div class="welcome-panel-content">
			<h3>Result</h3>
				<?php
				if ( isset( $_POST['query-args'] ) ) {
					$args_string = wp_unslash( $_POST['query-args'] );

					// Check for valid array value.
					try {
						$args_array = eval( "return $args_string;" ); // Converting user input into array.
						$args_array = (is_array( $args_array ) ? $args_array : null); // Check is input is valid array.
					} catch (ParseError $e) {
						$args_array = null;
					}

					if ( $args_array ) {
						switch ( $selected_type ) {
							case 'WP_Query':
									$query = new WP_Query( $args_array );
									$query = $query->posts;
								break;

							case 'WP_User_Query':
								  $query = new WP_User_Query( $args_array );
								  $query = $query->results;
								break;

							case 'WP_Comment_Query':
								  $query = new WP_Comment_Query( $args_array );
								break;

							case 'WP_Term_Query':
								  $query = new WP_Term_Query( $args_array );
								break;

							case 'WP_Network_Query':
								  $query = new WP_Network_Query( $args_array );
								break;

							case 'WP_Site_Query':
								  $query = new WP_Site_Query( $args_array );
								break;

							default:
									$query = new WP_Query( $args_array );
								break;
						}
						if ( ! $query ) {
							?>
							<div id="wpqc-no-data">
								<span class="dashicons dashicons-image-filter"></span>
								<h3>Nothing to show !</h3>
							</div>
							<?php

						}
					} else {
						?>
						<div id="wpqc-no-data">
							<span class="dashicons dashicons-warning"></span>
							<h3>Invalid argument array !</h3>
						</div>
						<?php

					}
				} else {
					?>
					<div id="wpqc-no-data">
					<span class="dashicons dashicons-smiley"></span>
					<h3>Ask me something</h3>
					</div>
					<?php

				} ?>
		</div>
	</div>
	</div>
<script>
<?php
if ( isset( $query ) && $query ) {
	?>
	var query_data = <?php echo wp_json_encode( $query ); ?>;
	document.getElementById("lwqc_query_result").appendChild(renderjson.set_show_to_level(1)(query_data));
<?php

} ?>

var editor = CodeMirror.fromTextArea(document.getElementById("query-args"), {
																				mode: "php",
																				lineNumbers: true,
																				styleActiveLine: true,
																				matchBrackets: true,
																				theme: 'chrome-devtools'
																			 });
</script>

<?php

}
?>
