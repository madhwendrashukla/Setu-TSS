/**
 * Audit Logger Utility for Admin Authentication
 * Captures IP, Geo Location, System Type (Laptop, Android, Mac, Windows, etc.), OS, Browser, and Status
 */

function getClientIp(req) {
  if (!req) return 'Unknown';
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const first = forwarded.split(',')[0].trim();
    if (first) return first.replace(/^::ffff:/, '');
  }
  const raw = req.headers['x-real-ip'] || req.socket?.remoteAddress || req.ip || '';
  return raw.replace(/^::ffff:/, '');
}

function parseUserAgent(ua = '') {
  let os = 'Unknown OS';
  let deviceType = 'Desktop / Laptop';
  let browser = 'Unknown Browser';

  if (!ua) return { os, deviceType, browser };

  const uaLower = ua.toLowerCase();

  // 1. Detect OS & System Type
  if (uaLower.includes('windows phone')) {
    os = 'Windows Phone';
    deviceType = 'Mobile';
  } else if (uaLower.includes('windows nt 10.0') || uaLower.includes('windows nt 11.0')) {
    os = 'Windows 10/11';
    deviceType = 'Windows PC / Laptop';
  } else if (uaLower.includes('windows nt 6.3')) {
    os = 'Windows 8.1';
    deviceType = 'Windows PC / Laptop';
  } else if (uaLower.includes('windows nt 6.2')) {
    os = 'Windows 8';
    deviceType = 'Windows PC / Laptop';
  } else if (uaLower.includes('windows nt 6.1')) {
    os = 'Windows 7';
    deviceType = 'Windows PC / Laptop';
  } else if (uaLower.includes('windows')) {
    os = 'Windows';
    deviceType = 'Windows PC / Laptop';
  } else if (uaLower.includes('android')) {
    const vMatch = ua.match(/Android\s+([\d.]+)/i);
    os = vMatch ? `Android ${vMatch[1]}` : 'Android';
    deviceType = uaLower.includes('tablet') || (!uaLower.includes('mobile') && uaLower.includes('android'))
      ? 'Android Tablet'
      : 'Android Mobile';
  } else if (uaLower.includes('ipad')) {
    const vMatch = ua.match(/OS\s+([\d_]+)/i);
    os = vMatch ? `iPadOS ${vMatch[1].replace(/_/g, '.')}` : 'iPadOS';
    deviceType = 'iPad (Tablet)';
  } else if (uaLower.includes('iphone')) {
    const vMatch = ua.match(/OS\s+([\d_]+)/i);
    os = vMatch ? `iOS ${vMatch[1].replace(/_/g, '.')}` : 'iOS';
    deviceType = 'iPhone (Mobile)';
  } else if (uaLower.includes('macintosh') || uaLower.includes('mac os x')) {
    const vMatch = ua.match(/Mac OS X\s+([\d_]+)/i);
    os = vMatch ? `macOS ${vMatch[1].replace(/_/g, '.')}` : 'macOS';
    deviceType = 'Mac / MacBook';
  } else if (uaLower.includes('cros')) {
    os = 'Chrome OS';
    deviceType = 'Chromebook';
  } else if (uaLower.includes('linux')) {
    os = 'Linux';
    deviceType = 'Linux PC / Laptop';
  }

  // 2. Detect Browser
  if (ua.includes('Edg/')) {
    const match = ua.match(/Edg\/([\d.]+)/);
    browser = `Edge ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (ua.includes('OPR/') || ua.includes('Opera/')) {
    const match = ua.match(/(?:OPR|Opera)\/([\d.]+)/);
    browser = `Opera ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (ua.includes('Brave') || (ua.includes('Chrome') && uaLower.includes('brave'))) {
    browser = 'Brave';
  } else if (ua.includes('Chrome') || ua.includes('CriOS')) {
    const match = ua.match(/(?:Chrome|CriOS)\/([\d.]+)/);
    browser = `Chrome ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (ua.includes('Firefox') || ua.includes('FxiOS')) {
    const match = ua.match(/(?:Firefox|FxiOS)\/([\d.]+)/);
    browser = `Firefox ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('CriOS')) {
    const match = ua.match(/Version\/([\d.]+)/);
    browser = `Safari ${match ? match[1].split('.')[0] : ''}`.trim();
  }

  return { os, deviceType, browser };
}

async function getIpLocation(ip, req) {
  // Check proxy headers first (Cloudflare, Vercel, AWS CloudFront)
  const headerCountry = req?.headers['cf-ipcountry'] || req?.headers['cloudfront-viewer-country'] || req?.headers['x-vercel-ip-country'];
  const headerCity = req?.headers['cf-ipcity'] || req?.headers['cloudfront-viewer-city'] || req?.headers['x-vercel-ip-city'];
  const headerRegion = req?.headers['cloudfront-viewer-country-region-name'] || req?.headers['x-vercel-ip-country-region'];

  if (headerCountry && headerCity) {
    return {
      city: headerCity,
      region: headerRegion || null,
      country: headerCountry
    };
  }

  // Handle local / private IPs
  if (
    !ip ||
    ip === '127.0.0.1' ||
    ip === '::1' ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.') ||
    ip.startsWith('172.16.') ||
    ip.startsWith('172.17.') ||
    ip.startsWith('172.18.') ||
    ip.startsWith('172.19.') ||
    ip.startsWith('172.2') ||
    ip.startsWith('172.3')
  ) {
    return {
      city: 'Localhost',
      region: 'Development',
      country: headerCountry || 'Local Network'
    };
  }

  // Query free IP geolocation service with a short timeout
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1800);
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      if (data && data.status === 'success') {
        return {
          city: data.city || headerCity || null,
          region: data.regionName || headerRegion || null,
          country: data.country || headerCountry || null,
        };
      }
    }
  } catch (err) {
    // Silently fall back
  }

  return {
    city: headerCity || null,
    region: headerRegion || null,
    country: headerCountry || 'Unknown'
  };
}

/**
 * Main logging entrypoint for Admin Login attempts
 */
async function logAdminLogin({ prisma, email, status, failureReason = null, req }) {
  try {
    const ip = getClientIp(req);
    const ua = req?.headers['user-agent'] || '';
    const { os, deviceType, browser } = parseUserAgent(ua);
    const location = await getIpLocation(ip, req);

    await prisma.adminLoginLog.create({
      data: {
        email: email || 'unknown',
        status: status.toUpperCase(),
        ip_address: ip,
        city: location.city,
        region: location.region,
        country: location.country,
        device_type: deviceType,
        os,
        browser,
        user_agent: ua ? ua.substring(0, 500) : null,
        failure_reason: failureReason,
      }
    });
  } catch (error) {
    console.error('[AuditLogger] Failed to record admin login log:', error.message);
  }
}

module.exports = {
  getClientIp,
  parseUserAgent,
  getIpLocation,
  logAdminLogin
};
