/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 * Type definitions from the typed-mxgraph project
 */

/**
 * Converts relative and absolute URLs to absolute URLs with protocol and domain.
 */
class UrlConverter {
  constructor() {
    // Empty constructor
  }

  /**
   * Specifies if the converter is enabled. Default is true.
   */
  enabled = true;

  /**
   * Specifies the base URL to be used as a prefix for relative URLs.
   */
  baseUrl: string | null = null;

  /**
   * Specifies the base domain to be used as a prefix for absolute URLs.
   */
  baseDomain: string | null = null;

  /**
   * Private helper function to update the base URL.
   */
  updateBaseUrl() {
    this.baseDomain = `${location.protocol}//${location.host}`;
    this.baseUrl = this.baseDomain + location.pathname;
    const tmp = this.baseUrl.lastIndexOf('/');

    // Strips filename etc
    if (tmp > 0) {
      this.baseUrl = this.baseUrl.substring(0, tmp + 1);
    }
  }

  /**
   * Returns <enabled>.
   */
  isEnabled() {
    return this.enabled;
  }

  /**
   * Sets <enabled>.
   */
  setEnabled(value: boolean) {
    this.enabled = value;
  }

  /**
   * Returns <baseUrl>.
   */
  getBaseUrl() {
    return this.baseUrl;
  }

  /**
   * Sets <baseUrl>.
   */
  setBaseUrl(value: string) {
    this.baseUrl = value;
  }

  /**
   * Returns <baseDomain>.
   */
  getBaseDomain() {
    return this.baseDomain;
  }

  /**
   * Sets <baseDomain>.
   */
  setBaseDomain(value: string) {
    this.baseDomain = value;
  }

  /**
   * Returns true if the given URL is relative.
   */
  isRelativeUrl(url: string) {
    return (
      url &&
      url.substring(0, 2) !== '//' &&
      url.substring(0, 7) !== 'http://' &&
      url.substring(0, 8) !== 'https://' &&
      url.substring(0, 10) !== 'data:image' &&
      url.substring(0, 7) !== 'file://'
    );
  }

  /**
   * Converts the given URL to an absolute URL with protol and domain.
   * Relative URLs are first converted to absolute URLs.
   */
  convert(url: string) {
    if (this.isEnabled() && this.isRelativeUrl(url)) {
      if (!this.getBaseUrl()) {
        this.updateBaseUrl();
      }

      if (url.charAt(0) === '/') {
        url = this.getBaseDomain() + url;
      } else {
        url = this.getBaseUrl() + url;
      }
    }

    return url;
  }
}

export default UrlConverter;
