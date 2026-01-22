<?php
/*
Plugin Name: WasilOnline Checkout
Description: Custom Multistep Checkout for WooCommerce/Dokan
Version: 1.0
*/

function nova_checkout_shortcode() {
    // Enqueue the React build files
    wp_enqueue_script('nova-react-app', plugin_dir_url(__FILE__) . 'dist/assets/index.js', array(), '1.0', true);
    wp_enqueue_style('nova-react-style', plugin_dir_url(__FILE__) . 'dist/assets/index.css');
    
    // Pass the API Key (Securely) and Vendor Data to frontend
    wp_localize_script('nova-react-app', 'NovaSettings', array(
        'apiKey' => get_option('nova_gemini_api_key'), // You'd add an admin setting for this
        'root' => get_site_url()
    ));

    return '<div id="root"></div>';
}
add_shortcode('nova_checkout', 'nova_checkout_shortcode');