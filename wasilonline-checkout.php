<?php
/**
 * Plugin Name: WasilOnline Checkout
 * Description: Modern React-based checkout experience for WooCommerce
 * Version: 1.0.0
 * Author: WasilOnline
 * Text Domain: wasilonline-checkout
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('WASILONLINE_CHECKOUT_VERSION', '1.0.0');
define('WASILONLINE_CHECKOUT_PATH', plugin_dir_path(__FILE__));
define('WASILONLINE_CHECKOUT_URL', plugin_dir_url(__FILE__));

/**
 * Initialize plugin
 */
function wasilonline_checkout_init() {
    // Check WooCommerce dependency
    if (!class_exists('WooCommerce')) {
        add_action('admin_notices', 'wasilonline_checkout_wc_missing_notice');
        return;
    }

    // Register shortcode
    add_shortcode('wasilonline_checkout', 'wasilonline_checkout_render');
    
    // Enqueue assets
    add_action('wp_enqueue_scripts', 'wasilonline_checkout_enqueue_assets');
}
add_action('plugins_loaded', 'wasilonline_checkout_init');

/**
 * Admin notice for missing WooCommerce
 */
function wasilonline_checkout_wc_missing_notice() {
    ?>
    <div class="notice notice-error">
        <p><?php _e('WasilOnline Checkout requires WooCommerce to be installed and active.', 'wasilonline-checkout'); ?></p>
    </div>
    <?php
}

/**
 * Enqueue React app assets
 */
function wasilonline_checkout_enqueue_assets() {
    if (!is_page() && !is_singular()) {
        return;
    }

    $dist_path = WASILONLINE_CHECKOUT_PATH . 'dist/';
    $dist_url = WASILONLINE_CHECKOUT_URL . 'dist/';

    // Enqueue CSS
    if (file_exists($dist_path . 'assets/index.css')) {
        wp_enqueue_style(
            'wasilonline-checkout-style',
            $dist_url . 'assets/index.css',
            [],
            WASILONLINE_CHECKOUT_VERSION
        );
    }

    // Enqueue JS
    if (file_exists($dist_path . 'assets/index.js')) {
        wp_enqueue_script(
            'wasilonline-checkout-script',
            $dist_url . 'assets/index.js',
            ['jquery'],
            WASILONLINE_CHECKOUT_VERSION,
            true
        );

        // Localize data for React
        wp_localize_script(
            'wasilonline-checkout-script',
            'novaCheckoutData', // Keep window object name for now (React reads from this)
            wasilonline_get_checkout_data()
        );
    }
}

/**
 * Get payment gateways - IMPROVED VERSION
 */
function wasilonline_get_payment_gateways() {
    if (!function_exists('WC') || !WC()->payment_gateways) {
        return [];
    }

    $gateways = [];
    $all_gateways = WC()->payment_gateways->payment_gateways();

    foreach ($all_gateways as $gateway) {
        if ($gateway->enabled === 'yes') {
            $icon_html = $gateway->get_icon();
            
            // Extract clean icon URL from HTML
            $icon_url = '';
            if (preg_match('/<img.*?src=["\']([^"\']+)["\']/', $icon_html, $matches)) {
                $icon_url = $matches[1];
            }

            $gateways[] = [
                'id' => $gateway->id,
                'title' => $gateway->get_title(),
                'description' => $gateway->get_description(),
                'icon' => $icon_url,
                'iconHtml' => $icon_html,
                'order' => isset($gateway->order) ? $gateway->order : 0,
            ];
        }
    }

    // Sort by order
    usort($gateways, function($a, $b) {
        return $a['order'] - $b['order'];
    });

    return $gateways;
}

/**
 * Get vendors with products
 */
function wasilonline_get_vendors_with_products() {
    $cart = WC()->cart;
    if (!$cart) {
        return [];
    }

    $vendors = [];
    
    foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
        $product_id = $cart_item['product_id'];
        $product = wc_get_product($product_id);
        
        if (!$product) {
            continue;
        }

        // Get vendor ID (Dokan/WCFM/WC Vendors compatible)
        $vendor_id = get_post_field('post_author', $product_id);
        $vendor = get_userdata($vendor_id);
        
        if (!$vendor) {
            continue;
        }

        $vendor_key = 'vendor_' . $vendor_id;
        
        if (!isset($vendors[$vendor_key])) {
            $vendors[$vendor_key] = [
                'id' => $vendor_key,
                'name' => $vendor->display_name,
                'products' => []
            ];
        }

        $vendors[$vendor_key]['products'][] = [
            'id' => $product_id,
            'name' => $product->get_name(),
            'price' => $product->get_price(),
            'quantity' => $cart_item['quantity'],
            'subtotal' => $cart_item['line_subtotal']
        ];
    }

    return array_values($vendors);
}

/**
 * Get all checkout data for React
 */
function wasilonline_get_checkout_data() {
    $cart = WC()->cart;
    
    if (!$cart) {
        return [
            'cart' => ['items' => [], 'total' => 0],
            'vendors' => [],
            'shippingOptions' => [],
            'paymentGateways' => []
        ];
    }

    $cart_items = [];
    foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
        $product = $cart_item['data'];
        $cart_items[] = [
            'id' => $cart_item['product_id'],
            'name' => $product->get_name(),
            'price' => $product->get_price(),
            'quantity' => $cart_item['quantity'],
            'image' => wp_get_attachment_image_url($product->get_image_id(), 'thumbnail'),
            'vendor' => get_post_field('post_author', $cart_item['product_id'])
        ];
    }

    return [
        'cart' => [
            'items' => $cart_items,
            'subtotal' => $cart->get_subtotal(),
            'tax' => $cart->get_total_tax(),
            'total' => $cart->get_total('edit')
        ],
        'vendors' => wasilonline_get_vendors_with_products(),
        'shippingOptions' => wasilonline_get_shipping_options(),
        'paymentGateways' => wasilonline_get_payment_gateways(), // ✅ NOW PROPERLY INCLUDED
        'nonce' => wp_create_nonce('wc-checkout'),
        'ajaxUrl' => admin_url('admin-ajax.php')
    ];
}

/**
 * Get available shipping methods
 */
function wasilonline_get_shipping_options() {
    $packages = WC()->shipping()->get_packages();
    $options = [];

    foreach ($packages as $package_key => $package) {
        if (isset($package['rates']) && !empty($package['rates'])) {
            foreach ($package['rates'] as $rate) {
                $options[] = [
                    'id' => $rate->get_id(),
                    'label' => $rate->get_label(),
                    'cost' => $rate->get_cost(),
                    'method_id' => $rate->get_method_id()
                ];
            }
        }
    }

    return $options;
}

/**
 * Render checkout shortcode
 */
function wasilonline_checkout_render() {
    if (!WC()->cart || WC()->cart->is_empty()) {
        return '<p>' . __('Your cart is empty.', 'wasilonline-checkout') . '</p>';
    }

    return '<div id="wasilonline-react-app"></div>';
}

/**
 * AJAX: Create pending order and return payment URL
 */
function wasilonline_create_order() {
    // Verify nonce
    if (!wp_verify_nonce($_REQUEST['nonce'] ?? '', 'wc-checkout')) {
        wp_send_json_error(['message' => 'Security check failed']);
        return;
    }

    // Get posted data
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!$data) {
        wp_send_json_error(['message' => 'Invalid request data']);
        return;
    }

    $details = $data['details'] ?? [];
    $payment_method = $data['paymentMethod'] ?? 'cod';
    $shipping_selection = $data['shippingSelection'] ?? [];

    try {
        // Create WooCommerce order (HPOS compatible)
        $order = wc_create_order();
        
        if (is_wp_error($order)) {
            throw new Exception($order->get_error_message());
        }

        // Add cart items to order
        $cart = WC()->cart;
        foreach ($cart->get_cart() as $cart_item_key => $cart_item) {
            $product = $cart_item['data'];
            $quantity = $cart_item['quantity'];
            
            $order->add_product($product, $quantity, [
                'subtotal' => $cart_item['line_subtotal'],
                'total' => $cart_item['line_total'],
            ]);
        }

        // Set billing address
        $order->set_billing_first_name(sanitize_text_field($details['firstName'] ?? ''));
        $order->set_billing_last_name(sanitize_text_field($details['lastName'] ?? ''));
        $order->set_billing_email(sanitize_email($details['email'] ?? ''));
        $order->set_billing_phone(sanitize_text_field($details['phone'] ?? ''));
        $order->set_billing_address_1(sanitize_text_field($details['address'] ?? ''));
        $order->set_billing_city(sanitize_text_field($details['city'] ?? ''));
        $order->set_billing_postcode(sanitize_text_field($details['zip'] ?? ''));
        $order->set_billing_country(sanitize_text_field($details['country'] ?? ''));

        // Set shipping address (same as billing or separate)
        $billing_same = $details['billingSameAsShipping'] ?? true;
        if ($billing_same) {
            $order->set_shipping_first_name($order->get_billing_first_name());
            $order->set_shipping_last_name($order->get_billing_last_name());
            $order->set_shipping_address_1($order->get_billing_address_1());
            $order->set_shipping_city($order->get_billing_city());
            $order->set_shipping_postcode($order->get_billing_postcode());
            $order->set_shipping_country($order->get_billing_country());
        } else {
            $order->set_shipping_first_name(sanitize_text_field($details['shippingFirstName'] ?? ''));
            $order->set_shipping_last_name(sanitize_text_field($details['shippingLastName'] ?? ''));
            $order->set_shipping_address_1(sanitize_text_field($details['shippingAddress'] ?? ''));
            $order->set_shipping_city(sanitize_text_field($details['shippingCity'] ?? ''));
            $order->set_shipping_postcode(sanitize_text_field($details['shippingZip'] ?? ''));
            $order->set_shipping_country(sanitize_text_field($details['shippingCountry'] ?? ''));
        }

        // Add shipping costs from selected methods
        $shipping_total = 0;
        foreach ($shipping_selection as $vendor_id => $shipping_method_id) {
            // Get shipping rate cost (simplified - you may need to lookup actual rates)
            $packages = WC()->shipping()->get_packages();
            foreach ($packages as $package) {
                if (isset($package['rates'][$shipping_method_id])) {
                    $rate = $package['rates'][$shipping_method_id];
                    $shipping_item = new WC_Order_Item_Shipping();
                    $shipping_item->set_method_id($rate->get_method_id());
                    $shipping_item->set_method_title($rate->get_label());
                    $shipping_item->set_total($rate->get_cost());
                    $order->add_item($shipping_item);
                    $shipping_total += floatval($rate->get_cost());
                }
            }
        }

        // Set payment method
        $available_gateways = WC()->payment_gateways->payment_gateways();
        if (isset($available_gateways[$payment_method])) {
            $order->set_payment_method($available_gateways[$payment_method]);
        } else {
            $order->set_payment_method_title($payment_method);
        }

        // Calculate totals
        $order->calculate_totals();

        // Set order status to pending payment
        $order->set_status('pending', __('Order created via WasilOnline Checkout', 'wasilonline-checkout'));
        
        // Save order
        $order->save();

        // Clear cart
        WC()->cart->empty_cart();

        // Get payment URL
        $pay_url = $order->get_checkout_payment_url();

        // For COD, we can complete immediately
        if ($payment_method === 'cod') {
            $order->set_status('processing', __('Cash on Delivery order', 'wasilonline-checkout'));
            $order->save();
            
            // Trigger Dokan order splitting if active
            if (function_exists('dokan')) {
                do_action('dokan_checkout_update_order_meta', $order->get_id());
            }
            
            wp_send_json_success([
                'success' => true,
                'order_id' => $order->get_id(),
                'order_number' => $order->get_order_number(),
                'redirect' => $order->get_checkout_order_received_url(),
                'message' => 'Order placed successfully!'
            ]);
            return;
        }

        // For other payment methods, redirect to payment
        wp_send_json_success([
            'success' => true,
            'order_id' => $order->get_id(),
            'order_number' => $order->get_order_number(),
            'redirect' => $pay_url,
            'needs_payment' => true,
            'message' => 'Redirecting to payment...'
        ]);

    } catch (Exception $e) {
        wp_send_json_error([
            'message' => $e->getMessage()
        ]);
    }
}
add_action('wp_ajax_wasilonline_create_order', 'wasilonline_create_order');
add_action('wp_ajax_nopriv_wasilonline_create_order', 'wasilonline_create_order');

