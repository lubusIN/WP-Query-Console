<?php
/**
 * Contributors: lubus, ajitbohra
 * Plugin Name: WP Query Console
 * Description: A plugin to quickly test various WP Queries
 * Author: <a href="http://www.lubus.in">LUBUS</a>
 * Version: 0.1
 * Tags: admin, query, console, developer
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

if ( ! class_exists( 'WP_Query_Console' ) ) :
/**
 * WP_Query_Console Class.
 *
 * Main Class.
 *
 * @since 1.0.0
 */
class WP_Query_Console {
	/**
	 * Instance.
	 *
	 * @since
	 * @access private
	 * @var WP_Query_Console
	 */
	static private $instance;

	/**
	 * Singleton pattern.
	 *
	 * @since
	 * @access private
	 */
	private function __construct() {
		$this->setup_constants();
        $this->init_hooks();
	}


	/**
	 * Get instance.
	 *
	 * @since
	 * @access public
	 * @return WP_Query_Console
	 */
	public static function get_instance() {
		if ( null === static::$instance ) {
			self::$instance = new static();

			self::$instance->init();
		}

		return self::$instance;
	}

	/**
	 * Hook into actions and filters.
	 *
	 * @since  1.0.0
	 */
	private function init_hooks() {
		// Set up localization on init Hook.
		add_action( 'init', array( $this, 'load_textdomain' ), 0 );
		add_action( 'admin_menu', array( $this, 'add_menu' ) );
		add_action( 'admin_enqueue_scripts', array( $this, 'register_script' ) );
		add_action( 'rest_api_init', array( $this, 'register_routes' ) );

		// Disable emojis
		add_action( 'init', array( $this, 'disable_emojis' ) );
	}

	/**
	 * Class Constructor
	 *
	 * Set up the WP Query Console class.
	 *
	 * @since  1.0.0
	 * @access private
	 */
	private function init() {
		// Plugin Init

	}

	/**
	 * Throw error on object clone
	 *
	 * The whole idea of the singleton design pattern is that there is a single
	 * object, therefore we don't want the object to be cloned.
	 *
	 * @since  1.0
	 * @access protected
	 *
	 * @return void
	 */
	public function __clone() {
		// Cloning instances of the class is forbidden.
		wqc_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'wqc' ), '1.0' );
	}

	/**
	 * Disable unserializing of the class
	 *
	 * @since  1.0
	 * @access protected
	 *
	 * @return void
	 */
	public function __wakeup() {
		// Unserializing instances of the class is forbidden.
		wqc_doing_it_wrong( __FUNCTION__, __( 'Cheatin&#8217; huh?', 'wqc' ), '1.0' );
	}

	/**
	 * Setup plugin constants
	 *
	 * @since  1.0
	 * @access private
	 *
	 * @return void
	 */
	private function setup_constants() {
		// Plugin version
		if ( ! defined( 'WQC_VERSION' ) ) {
			define( 'WQC_VERSION', '1.0.0' );
		}
		// Plugin Root File
		if ( ! defined( 'WQC_PLUGIN_FILE' ) ) {
			define( 'WQC_PLUGIN_FILE', __FILE__ );
		}
		// Plugin Folder Path
		if ( ! defined( 'WQC_PLUGIN_DIR' ) ) {
			define( 'WQC_PLUGIN_DIR', plugin_dir_path( WQC_PLUGIN_FILE ) );
		}
		// Plugin Folder URL
		if ( ! defined( 'WQC_PLUGIN_URL' ) ) {
			define( 'WQC_PLUGIN_URL', plugin_dir_url( WQC_PLUGIN_FILE ) );
		}
		// Plugin Basename aka: "WP-Query-Console/wp-query-console.php"
		if ( ! defined( 'WQC_PLUGIN_BASENAME' ) ) {
			define( 'WQC_PLUGIN_BASENAME', plugin_basename( WQC_PLUGIN_FILE ) );
		}
	}

	/**
	 * Loads the plugin language files.
	 *
	 * @since  1.0.0
	 * @access public
	 *
	 * @return void
	 */
	public function load_textdomain() {
		$locale = apply_filters( 'plugin_locale', get_locale(), 'WQC' );
		// wp-content/languages/plugin-name/plugin-name-en_EN.mo.
		load_textdomain( 'WQC', trailingslashit( WP_LANG_DIR ) . 'WP-Query-Console' . '/' . 'TAF' . '-' . $locale . '.mo' );
		// wp-content/plugins/plugin-name/languages/plugin-name-en_EN.mo.
		load_plugin_textdomain( 'WQC', false, basename( WQC_PLUGIN_DIR ) . '/languages/' );
	}

	/**
	 * Add plugin menu
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return void
	 */
	public function add_menu() {
		add_menu_page(
						'WP Query Console',
						'Query Console',
						'manage_options',
						'wp-query-console',
						array( $this, 'render_page' ),
						'dashicons-controls-play'
					);
	}

	/**
	 * Registers scripts
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return void
	 */
	public function register_script(){
		wp_register_script(
							'wqc-script',
							WQC_PLUGIN_URL . 'build/admin.js',
							array( 'wp-api' ) ,
							filemtime( WQC_PLUGIN_DIR . 'build/admin.js' ),
							true
						);
		wp_enqueue_script( 'wqc-script' );

		wp_register_style( 'wqc-style', WQC_PLUGIN_URL . 'build/admin.css' );
		wp_enqueue_style( 'wqc-style' );

		wp_localize_script( 'wqc-script', 'wqcRestApi',
			array(
				'nonce' => wp_create_nonce( 'wp_rest' ),
			)
		);

	}

	public function disable_emojis(){
		// Diable emojis
        remove_action('wp_head', 'print_emoji_detection_script', 7);
        remove_action('admin_print_scripts', 'print_emoji_detection_script');
        remove_action('admin_print_styles', 'print_emoji_styles');

	}

	/**
	 * Render plugin page
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return void
	 */
	public function render_page() {
		echo '<div id="wp-query-console" class="wrap"></div>';
	}

	/**
	 * Register API route
	 * @todo   : prevent cross domain api request
	 *
	 * @since  1.0.0
	 * @access public
	 */
	public function register_routes() {
		register_rest_route('wqc/v1', '/query', array(
			'methods'  => array( 'GET', 'POST' ),
			'callback' => array( $this, 'get_query_result' ),
		) );
	}

	/**
	 * Rest fetch query result callback
	 *
	 * @param WP_REST_Request $request
	 *
	 * @access public
	 * @return array|mixed|object
	 */
	public function get_query_result( $request ) {
		$parameters = $request->get_params();
		// Bailout
		if ( empty( $parameters ) || empty( $parameters['queryArgs'] ) ) {
			return new WP_REST_Response( array('status' => 'error', 'message' => 'Query args missing'), 400 );
		}

		$args_string = $parameters['queryArgs'];
		$selected_type = $parameters['queryType'];


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

			return new WP_REST_Response(array('status' => 'success', 'data' => json_encode( $query ) , 'message' => 'Query executed successfully'), 200);

		} else {
			return new WP_REST_Response(array('status' => 'error', 'data' => 'null'  ,'message' => 'Query args invalid'), 400);
		}
	}
}

endif;

WP_Query_Console::get_instance();
?>
