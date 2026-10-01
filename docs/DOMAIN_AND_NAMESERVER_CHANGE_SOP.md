# Standard Operating Procedure (SOP)
## Domain Migration, Name Server Setup & AWS EC2 Deployment

**Server Details**:
- **EC2 Instance**: `i-0e98c3956ba3f38ca (setu-prod)`
- **Elastic / Public IP**: `13.200.49.118`
- **Operating System**: Ubuntu 24.04 LTS
- **Architecture**: Next.js (Port 3000) + Express Backend (Port 5000) + NGINX Reverse Proxy + Certbot (Let's Encrypt SSL)

---

## 📌 Table of Contents
1. [Phase 1: Understanding DNS & Name Servers](#phase-1-understanding-dns--name-servers)
2. [Phase 2: Step-by-Step Name Server / DNS Setup](#phase-2-step-by-step-name-server--dns-setup)
   - [Scenario A: Using Default Registrar DNS (GoDaddy / Namecheap / Hostinger)](#scenario-a-using-default-registrar-dns)
   - [Scenario B: Switching to Custom Name Servers (Cloudflare / AWS Route 53)](#scenario-b-switching-to-custom-name-servers)
3. [Phase 3: Connecting to EC2 & Updating NGINX](#phase-3-connecting-to-ec2--updating-nginx)
4. [Phase 4: Setting Up Free SSL Certificate (HTTPS)](#phase-4-setting-up-free-ssl-certificate-https)
5. [Phase 5: Updating Environment Variables & Rebuilding Web App](#phase-5-updating-environment-variables--rebuilding-web-app)
6. [Phase 6: Third-Party Integrations Checklist](#phase-6-third-party-integrations-checklist)
7. [Phase 7: Verification & Testing Checklist](#phase-7-verification--testing-checklist)

---

## Phase 1: Understanding DNS & Name Servers

- **Name Servers (NS)**: The authoritative servers that tell the internet where your domain's DNS records (A, CNAME, MX) live.
- **A Record**: Points your root domain (`setustartupschool.com` or `setustartupschool.in`) to your EC2 server's public IP (`13.200.49.118`).
- **CNAME Record**: Points subdomains like `www.setustartupschool.com` to your root domain.

---

## Phase 2: Step-by-Step Name Server / DNS Setup

### Scenario A: Using Default Registrar DNS (Recommended & Simplest)
If you bought the domain on GoDaddy, Namecheap, or Hostinger:

1. **Log in to your Domain Registrar** (e.g., GoDaddy, Namecheap, Hostinger).
2. Go to **My Domains** → Select your domain (`setustartupschool.com` / `setustartupschool.in`) → **DNS Management** (or DNS Records).
3. Ensure **Nameservers** are set to **Default / Standard Nameservers** provided by your registrar.
4. Add or edit the following **DNS Records**:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` (or leave blank) | `13.200.49.118` | `300` (or 1/2 hour) |
| **CNAME** | `www` | `setustartupschool.com` | `300` (or 1/2 hour) |

---

### Scenario B: Switching to Custom Name Servers (e.g., Cloudflare or AWS Route 53)
If you want to manage DNS through Cloudflare or AWS Route 53:

1. **In Cloudflare / Route 53**:
   - Create a DNS Zone for `setustartupschool.com`.
   - Add the **A record** (`@` → `13.200.49.118`) and **CNAME** (`www` → `setustartupschool.com`).
   - Copy the 2–4 assigned Name Servers (e.g., `ns1.cloudflare.com`, `ns2.cloudflare.com` or `ns-xxxx.awsdns.com`).
2. **In your Domain Registrar (where you purchased the domain)**:
   - Go to **Domain Settings** → **Nameservers**.
   - Select **Use Custom Nameservers**.
   - Paste the new Name Servers.
   - Click **Save**.

> **Note on Propagation**: DNS propagation usually takes between 5 to 30 minutes (up to 24 hours max).  
> Test propagation on your computer terminal:
> ```bash
> ping setustartupschool.com
> ```
> *(It should reply from `13.200.49.118`).*

---

## Phase 3: Connecting to EC2 & Updating NGINX

You can connect directly via **AWS EC2 Instance Connect** in the AWS Console, or via local terminal:
```bash
ssh -i /path/to/your-key.pem ubuntu@13.200.49.118
```

### 1. Create / Update the NGINX configuration
```bash
sudo nano /etc/nginx/sites-available/setustartupschool
```

Paste the following NGINX reverse-proxy configuration (replace `setustartupschool.com` with your exact domain name):

```nginx
upstream tss_backend {
    server 127.0.0.1:5000;
    keepalive 64;
}

upstream tss_frontend {
    server 127.0.0.1:3000;
    keepalive 64;
}

# HTTP to HTTPS redirect
server {
    listen 80;
    listen [::]:80;
    server_name setustartupschool.com www.setustartupschool.com;

    server_tokens off;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    location / {
        return 301 https://$host$request_uri;
    }
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name setustartupschool.com www.setustartupschool.com;

    server_tokens off;
    client_max_body_size 25M;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css application/json application/javascript text/javascript text/xml application/xml image/svg+xml font/woff font/woff2;

    # Express API backend (/api/*)
    location /api/ {
        proxy_pass http://tss_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 120s;
    }

    # Next.js static asset caching
    location /_next/static/ {
        proxy_pass http://tss_frontend;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    # Next.js frontend (/*)
    location / {
        proxy_pass http://tss_frontend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

### 2. Enable Site & Test NGINX
```bash
sudo ln -sf /etc/nginx/sites-available/setustartupschool /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## Phase 4: Setting Up Free SSL Certificate (HTTPS)

Generate SSL certificates via Certbot for both root and `www` domains:
```bash
sudo certbot --nginx -d setustartupschool.com -d www.setustartupschool.com
```

- When asked, select **Option 2 (Redirect)** so all insecure HTTP traffic automatically redirects to HTTPS.
- Certbot will automatically modify your NGINX config with the SSL paths.

Verify automatic SSL renewal:
```bash
sudo certbot renew --dry-run
```

---

## Phase 5: Updating Environment Variables & Rebuilding Web App

### 1. Update Backend `.env`
Navigate to your backend directory on EC2:
```bash
cd ~/thestartupschool-dev/backend   # (or your repo location)
nano .env
```
Update `FRONTEND_URL`:
```env
FRONTEND_URL=https://setustartupschool.com
```

### 2. Update Frontend `.env.production`
Next.js compiles public API variables at build time:
```bash
cd ~/thestartupschool-dev/web
nano .env.production
```
Set the API URL:
```env
NEXT_PUBLIC_API_URL=https://setustartupschool.com
```

### 3. Build & Restart PM2 Processes
```bash
# Pull latest code from GitHub
cd ~/thestartupschool-dev
git pull origin main

# Build the Next.js production bundle
cd web
npm install
npm run build

# Reload PM2 zero-downtime
cd ~/thestartupschool-dev
pm2 reload ecosystem.config.js --env production
pm2 save
```

---

## Phase 6: Third-Party Integrations Checklist

| Service | Action Required | Location |
| :--- | :--- | :--- |
| **Razorpay Gateway** | Add `setustartupschool.com` to Allowed Domains and update Webhook URL to `https://setustartupschool.com/api/payment/webhook` | Razorpay Dashboard → Settings |
| **Google Cloud OAuth** | Add `https://setustartupschool.com` to Authorized JavaScript Origins & Redirect URIs | Google Cloud Console → Credentials |
| **Google Search Console** | Add new domain property and submit sitemap: `https://setustartupschool.com/sitemap.xml` | Search Console |
| **Google Analytics (GA4)** | Update Web Stream URL to the new domain | GA4 Admin → Data Streams |
| **Business Email (MX)** | Configure MX records (e.g. Google Workspace, Zoho) in your DNS registrar | DNS Management |

---

## Phase 7: Verification & Testing Checklist

- [ ] **DNS Check**: Run `nslookup setustartupschool.com` → resolves to `13.200.49.118`.
- [ ] **SSL & Security**: Open `https://setustartupschool.com` → padlock icon is active.
- [ ] **HTTP Redirect**: Visit `http://setustartupschool.com` → redirects to `https://`.
- [ ] **API Endpoint**: Visit `https://setustartupschool.com/api/events` → returns JSON with HTTP 200.
- [ ] **Admin Login**: Visit `https://setustartupschool.com/admin` → log in and check dashboard.
- [ ] **Registration & Payment**: Test a checkout on an event tier.

---

*(Optional) Old Domain 301 Redirect:*  
If you want traffic from `foundersschool.in` to automatically redirect to `setustartupschool.com`, add this block in NGINX:
```nginx
server {
    listen 80;
    listen 443 ssl;
    server_name foundersschool.in www.foundersschool.in;
    return 301 https://setustartupschool.com$request_uri;
}
```
