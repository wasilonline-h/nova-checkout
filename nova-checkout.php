<?php
/*
Plugin Name: Nova Checkout
Plugin URI: https://wasilonline.com
Description: Custom Multistep Checkout for WooCommerce/Dokan Multivendor
Version: 1.0.0
Author: WasilOnline
Text Domain: nova-checkout
*/

if (!defined('ABSPATH'))
    exit;

/**
 * Get cart items formatted for Nova Checkout
 */
function nova_get_cart_items()
{
    if (!function_exists('WC') || !WC()->cart) {
        return [];
    }

    $items = [];
    foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
        $product = $cart_item['data'];
        $product_id = $cart_item['product_id'];

        // Get vendor ID (Dokan)
        $vendor_id = get_post_field('post_author', $product_id);

        // Get product image
        $image_id = $product->get_image_id();
        $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium') : wc_placeholder_img_src('medium');

        $items[] = [
            'id' => $cart_item_key,
            'productId' => $product_id,
            'title' => $product->get_name(),
            'price' => (float) $product->get_price(),
            'image' => $image_url,
            'vendorId' => (string) $vendor_id,
            'description' => wp_strip_all_tags($product->get_short_description()),
            'quantity' => $cart_item['quantity']
        ];
    }

    return $items;
}

/**
 * Get vendors (Dokan sellers) from cart items
 */
function nova_get_cart_vendors()
{
    if (!function_exists('WC') || !WC()->cart) {
        return [];
    }

    $vendors = [];
    $vendor_ids = [];

    foreach (WC()->cart->get_cart() as $cart_item) {
        $product_id = $cart_item['product_id'];
        $vendor_id = get_post_field('post_author', $product_id);

        if (!in_array($vendor_id, $vendor_ids)) {
            $vendor_ids[] = $vendor_id;

            // Get vendor info (Dokan compatible)
            $vendor_name = get_the_author_meta('display_name', $vendor_id);
            $vendor_avatar = get_avatar_url($vendor_id, ['size' => 50]);

            // Get Dokan store info if available
            if (function_exists('dokan_get_store_info')) {
                $store_info = dokan_get_store_info($vendor_id);
                $vendor_name = !empty($store_info['store_name']) ? $store_info['store_name'] : $vendor_name;
            }

            $vendors[(string) $vendor_id] = [
                'id' => (string) $vendor_id,
                'name' => $vendor_name,
                'rating' => 4.5, // Default rating, can be enhanced with Dokan rating
                'avatar' => $vendor_avatar
            ];
        }
    }

    return $vendors;
}

/**
 * Get shipping options
 */
function nova_get_shipping_options()
{
    return [
        ['id' => 'free', 'name' => 'Standard Delivery', 'price' => 0, 'duration' => '5-7 business days'],
        ['id' => 'express', 'name' => 'Express Shipping', 'price' => 15.00, 'duration' => '2-3 business days'],
        ['id' => 'overnight', 'name' => 'Next Day Air', 'price' => 35.00, 'duration' => '1 business day'],
    ];
}

/**
 * Nova Checkout Shortcode
 */
/**
 * Get active payment gateways
 */
function nova_get_payment_gateways()
{
    if (!function_exists('WC') || !WC()->payment_gateways) {
        return [];
    }

    $gateways = [];
    // Fetch ALL gateways and check if enabled. 
    // This ensures they show up even if address isn't fully set yet.
    $all_gateways = WC()->payment_gateways->payment_gateways();

    foreach ($all_gateways as $gateway) {
        if ($gateway->enabled === 'yes') {
            $gateways[] = [
                'id' => $gateway->id,
                'title' => $gateway->get_title(),
                'description' => $gateway->get_description(),
                'icon' => $gateway->get_icon(),
            ];
        }
    }

    return $gateways;
}

/**
 * Nova Checkout Shortcode
 */
function nova_checkout_shortcode()
{
    // Check if WooCommerce is active
    if (!class_exists('WooCommerce')) {
        return '<p>WooCommerce is required for Nova Checkout.</p>';
    }

    // Cache-busting version
    $version = '1.0.3.' . time();

    // Enqueue the React build files with no jQuery dependency
    wp_enqueue_script(
        'nova-react-app',
        plugin_dir_url(__FILE__) . 'dist/assets/index.js',
        [], // No dependencies - standalone React app
        $version,
        true
    );

    // Add type="module" to prevent global scope conflicts
    add_filter('script_loader_tag', function ($tag, $handle) {
        if ($handle === 'nova-react-app') {
            return str_replace(' src', ' type="module" src', $tag);
        }
        return $tag;
    }, 10, 2);
    wp_enqueue_style(
        'nova-react-style',
        plugin_dir_url(__FILE__) . 'dist/assets/index.css',
        [],
        '1.0.0'
    );

    // Add Google Fonts
    wp_enqueue_style(
        'nova-google-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap',
        [],
        null
    );

    // Pass data to React frontend
    wp_localize_script('nova-react-app', 'NovaCheckoutData', [
        'cart' => nova_get_cart_items(),
        'vendors' => nova_get_cart_vendors(),
        'shippingOptions' => nova_get_shipping_options(),
        'paymentGateways' => nova_get_payment_gateways(),
        'siteUrl' => home_url(),
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('nova_checkout_nonce'),
        'currency' => get_woocommerce_currency_symbol(),
        'isLoggedIn' => is_user_logged_in(),
        'checkoutUrl' => wc_get_checkout_url(),
        'apiKey' => get_option('nova_gemini_api_key', ''),
    ]);

    return '<div id="root" class="nova-checkout-container"></div>';
}
add_shortcode('nova_checkout', 'nova_checkout_shortcode');

/**
 * Handle AJAX order submission
 */
function nova_submit_order()
{
    check_ajax_referer('nova_checkout_nonce', 'nonce');

    // Get posted data
    $posted_data = json_decode(file_get_contents('php://input'), true);

    if (!$posted_data) {
        wp_send_json_error(['message' => 'Invalid request data']);
        return;
    }

    // Create WooCommerce order
    try {
        $order = wc_create_order();

        // Add cart items to order
        foreach (WC()->cart->get_cart() as $cart_item_key => $cart_item) {
            $order->add_product(
                $cart_item['data'],
                $cart_item['quantity']
            );
        }

        // Set billing/shipping address
        $details = $posted_data['details'] ?? [];
        $order->set_address([
            'first_name' => $details['firstName'] ?? '',
            'last_name' => $details['lastName'] ?? '',
            'email' => $details['email'] ?? '',
            'address_1' => $details['address'] ?? '',
            'city' => $details['city'] ?? '',
            'postcode' => $details['zip'] ?? '',
            'country' => $details['country'] ?? '',
        ], 'billing');

        if (!empty($details['billingSameAsShipping']) || $details['billingSameAsShipping'] === true) {
            $order->set_address([
                'first_name' => $details['firstName'] ?? '',
                'last_name' => $details['lastName'] ?? '',
                'address_1' => $details['address'] ?? '',
                'city' => $details['city'] ?? '',
                'postcode' => $details['zip'] ?? '',
                'country' => $details['country'] ?? '',
            ], 'shipping');
        } else {
            $order->set_address([
                'first_name' => $details['billingFirstName'] ?? '',
                'last_name' => $details['billingLastName'] ?? '',
                'address_1' => $details['billingAddress'] ?? '',
                'city' => $details['billingCity'] ?? '',
                'postcode' => $details['billingZip'] ?? '',
                'country' => $details['billingCountry'] ?? '',
            ], 'shipping');
        }

        // Calculate totals
        $order->calculate_totals();

        // Set order status
        $order->set_status('pending');
        $order->save();

        // Clear the cart
        WC()->cart->empty_cart();

        wp_send_json_success([
            'orderId' => $order->get_id(),
            'orderNumber' => $order->get_order_number(),
            'message' => 'Order created successfully'
        ]);

    } catch (Exception $e) {
        wp_send_json_error(['message' => $e->getMessage()]);
    }
}
add_action('wp_ajax_nova_submit_order', 'nova_submit_order');
add_action('wp_ajax_nopriv_nova_submit_order', 'nova_submit_order');
