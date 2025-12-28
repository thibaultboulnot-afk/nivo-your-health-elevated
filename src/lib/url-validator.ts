/**
 * Validates that a URL is from an allowed Stripe domain
 */
export const validateStripeUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    const allowedDomains = [
      'checkout.stripe.com',
      'billing.stripe.com',
    ];
    
    // Check if hostname matches or is subdomain of allowed domains
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || 
      urlObj.hostname.endsWith('.' + domain)
    );
  } catch {
    return false;
  }
};

/**
 * Safely redirects to a validated Stripe URL
 * Returns true if redirect was initiated, false if URL was invalid
 */
export const safeStripeRedirect = (url: string): boolean => {
  if (!validateStripeUrl(url)) {
    console.error('Invalid Stripe redirect URL detected');
    return false;
  }
  window.location.href = url;
  return true;
};
