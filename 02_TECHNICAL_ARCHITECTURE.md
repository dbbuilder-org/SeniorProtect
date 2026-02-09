# Technical Architecture

## System Overview

### Architecture Pattern
**Microservices Architecture** with mobile-first design

**Core Components:**
1. Mobile Applications (iOS/Android)
2. Web Application (Progressive Web App)
3. Browser Extension (Chrome, Firefox, Safari, Edge)
4. Backend API Services
5. Analysis Engine
6. Database Layer
7. Third-Party Integrations
8. Admin Dashboard

---

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                              │
├──────────────┬──────────────┬──────────────┬────────────────┤
│   Mobile App │   Web App    │   Browser    │  Voice/SMS     │
│  (iOS/And.)  │    (PWA)     │  Extension   │   Gateway      │
└──────┬───────┴──────┬───────┴──────┬───────┴────────┬───────┘
       │              │              │                │
       └──────────────┴──────────────┴────────────────┘
                           │
                    [API Gateway]
                           │
       ┌───────────────────┴───────────────────┐
       │                                       │
┌──────▼────────┐                    ┌────────▼────────┐
│ REST API      │                    │  WebSocket      │
│ Services      │                    │  Service        │
└──────┬────────┘                    └────────┬────────┘
       │                                      │
       └──────────────┬───────────────────────┘
                      │
       ┌──────────────┴──────────────┐
       │                             │
┌──────▼────────┐            ┌───────▼────────┐
│  Analysis     │            │  User          │
│  Engine       │            │  Service       │
│  (AI/ML)      │            │                │
└──────┬────────┘            └───────┬────────┘
       │                             │
       └──────────────┬──────────────┘
                      │
       ┌──────────────┴──────────────┐
       │                             │
┌──────▼────────┐            ┌───────▼────────┐
│  PostgreSQL   │            │  Redis         │
│  (Primary DB) │            │  (Cache/Queue) │
└───────────────┘            └────────────────┘
       │
       └──────────────┐
                      │
       ┌──────────────▼──────────────┐
       │  Third-Party Services       │
       ├─────────────────────────────┤
       │ • Google Safe Browsing      │
       │ • VirusTotal                │
       │ • PhishTank                 │
       │ • WHOIS Lookup              │
       │ • Twilio (SMS/Voice)        │
       │ • SendGrid (Email)          │
       │ • Cloud Vision (OCR)        │
       └─────────────────────────────┘
```

---

## Technology Stack

### Frontend

#### Mobile Applications
**React Native** (Cross-platform iOS/Android)
- **Why:** Single codebase, native performance, large community
- **Version:** Latest stable (0.72+)
- **Key Libraries:**
  - React Navigation (navigation)
  - React Native Paper (Material Design components)
  - React Native Camera (QR scanning, photo capture)
  - React Native Voice (voice input)
  - AsyncStorage (local data)
  - Axios (HTTP client)

**Native Modules:**
- iOS: Swift for camera/accessibility features
- Android: Kotlin for camera/accessibility features

#### Web Application
**Progressive Web App (PWA)**
- **Framework:** React 18+
- **Build Tool:** Vite
- **UI Library:** Material-UI (MUI) or Chakra UI
- **State Management:** Redux Toolkit or Zustand
- **PWA Features:**
  - Service Worker for offline functionality
  - Web Push Notifications
  - Camera/media access
  - Installable on desktop/mobile

#### Browser Extension
**Architecture:** Manifest V3
- **Core:** JavaScript/TypeScript
- **Supported Browsers:** Chrome, Firefox, Safari, Edge
- **Key Components:**
  - Background Service Worker
  - Content Scripts (DOM monitoring)
  - Popup UI (React-based)
  - Options Page

**Features:**
- Real-time URL checking
- DOM monitoring for dangerous elements
- Form input warning
- Context menu integration

### Backend

#### API Layer
**Node.js with Express** or **Python with FastAPI**
- **Recommendation:** FastAPI (Python)
  - Better for ML integration
  - Async support
  - Auto-generated API docs
  - Type safety
  - High performance

**Alternative:** Node.js + Express
- Better for real-time features
- JavaScript consistency
- Large ecosystem

#### API Structure
```
/api/v1/
├── /auth                 # Authentication
├── /users                # User management
├── /analysis             # Core analysis endpoints
│   ├── /email           # Email scam check
│   ├── /url             # URL validation
│   ├── /phone           # Phone number check
│   └── /text            # Text message check
├── /sites               # Trusted sites directory
├── /scams               # Known scam database
├── /reports             # User scam reports
├── /family              # Family connection
├── /review              # Human review service
└── /webhook             # External integrations
```

### Analysis Engine

#### Machine Learning Stack
**Python-based ML Pipeline**

**NLP (Natural Language Processing):**
- **Transformers** (Hugging Face)
  - BERT for text classification
  - DistilBERT for mobile deployment
- **spaCy** for entity extraction
- **NLTK** for preprocessing

**Classification Models:**
- Binary classification (scam/not scam)
- Multi-class (type of scam)
- Sentiment analysis (urgency detection)
- Named entity recognition

**Training Data:**
- PhishTank dataset
- Spam email corpuses
- FTC scam reports
- User-reported scams
- Synthetic data generation

**Model Serving:**
- **TensorFlow Serving** or **TorchServe**
- REST API endpoints
- Batch processing for efficiency
- Edge deployment for mobile (TensorFlow Lite)

#### Rule-Based Analysis
**Pattern Matching:**
- Regex for URLs, emails, phone numbers
- Domain analysis algorithms
- SSL certificate validation
- WHOIS data analysis

**Heuristic Scoring:**
```python
def calculate_risk_score(message):
    score = 0
    
    # Urgency language
    if has_urgency_keywords(message):
        score += 25
    
    # Suspicious links
    if has_suspicious_links(message):
        score += 30
    
    # Sender verification
    if sender_mismatch(message):
        score += 35
    
    # Information requests
    if requests_sensitive_info(message):
        score += 20
    
    return min(score, 100)
```

### Database Architecture

#### Primary Database: PostgreSQL 15+
**Why PostgreSQL:**
- ACID compliance
- JSON support (for flexible data)
- Full-text search
- Mature and reliable
- Excellent performance

**Schema Design:**

```sql
-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_active TIMESTAMP,
    preferences JSONB,
    detail_level VARCHAR(20) DEFAULT 'standard'
);

-- Analysis results
CREATE TABLE analysis_results (
    analysis_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    content_type VARCHAR(50), -- email, url, phone, text
    content_hash VARCHAR(64), -- SHA-256 of content
    risk_score INTEGER,
    verdict VARCHAR(20), -- safe, caution, danger
    confidence FLOAT,
    analysis_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_created (user_id, created_at),
    INDEX idx_content_hash (content_hash)
);

-- Known scams database
CREATE TABLE known_scams (
    scam_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    scam_type VARCHAR(50),
    pattern TEXT,
    indicators JSONB,
    severity VARCHAR(20),
    first_seen TIMESTAMP,
    last_seen TIMESTAMP,
    report_count INTEGER DEFAULT 1,
    verified BOOLEAN DEFAULT FALSE
);

-- Trusted sites
CREATE TABLE trusted_sites (
    site_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(50),
    verified BOOLEAN DEFAULT FALSE,
    logo_url VARCHAR(500),
    official_contacts JSONB,
    INDEX idx_domain (domain)
);

-- User trusted contacts
CREATE TABLE user_trusted_contacts (
    contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    contact_type VARCHAR(20), -- email, phone
    contact_value VARCHAR(255),
    contact_name VARCHAR(255),
    verified BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family connections
CREATE TABLE family_connections (
    connection_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    senior_user_id UUID REFERENCES users(user_id),
    family_user_id UUID REFERENCES users(user_id),
    permission_level VARCHAR(20),
    permissions JSONB,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scam reports
CREATE TABLE user_scam_reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    scam_type VARCHAR(50),
    content_hash VARCHAR(64),
    details JSONB,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending'
);

-- Human review queue
CREATE TABLE review_queue (
    review_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES analysis_results(analysis_id),
    priority INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    assigned_to UUID,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    reviewer_verdict VARCHAR(20),
    reviewer_notes TEXT
);
```

#### Cache Layer: Redis
**Use Cases:**
- Session management
- Rate limiting
- Real-time data (active threats)
- Analysis result caching
- Job queue (Celery/Bull)

**Redis Data Structures:**
```redis
# Cache analysis results (TTL: 1 hour)
SET analysis:{content_hash} {result_json} EX 3600

# Rate limiting (per user)
INCR rate_limit:{user_id}:{endpoint}
EXPIRE rate_limit:{user_id}:{endpoint} 60

# Active threat tracking
ZADD active_threats {timestamp} {threat_id}

# Real-time stats
HINCRBY stats:daily:scams_blocked {date} 1
```

#### Message Queue: Redis + Celery (Python) or Bull (Node.js)
**Async Tasks:**
- Email analysis
- Batch URL checking
- Report generation
- ML model inference
- Notification sending

### Cloud Infrastructure

#### Recommended: AWS (Alternative: GCP or Azure)

**Compute:**
- **AWS ECS/Fargate** (containerized services)
- **AWS Lambda** (serverless functions for lightweight tasks)
- **EC2** (for ML model serving if needed)

**Storage:**
- **S3** - Static assets, backups, ML models
- **RDS PostgreSQL** - Primary database
- **ElastiCache Redis** - Caching layer

**Networking:**
- **CloudFront** - CDN for global distribution
- **API Gateway** - API management and rate limiting
- **Route 53** - DNS management
- **ALB** - Application Load Balancer

**Security:**
- **WAF** - Web Application Firewall
- **Shield** - DDoS protection
- **KMS** - Key management
- **Secrets Manager** - Sensitive data storage

**Monitoring:**
- **CloudWatch** - Logs and metrics
- **X-Ray** - Distributed tracing
- **SNS/SQS** - Notifications and queuing

#### Container Orchestration
**Docker + Kubernetes** (or AWS ECS)
```yaml
# Example Kubernetes deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: analysis-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: analysis-service
  template:
    metadata:
      labels:
        app: analysis-service
    spec:
      containers:
      - name: analysis-service
        image: seniorprotect/analysis:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secrets
              key: url
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

---

## Third-Party Integrations

### Threat Intelligence APIs

#### Google Safe Browsing API
**Purpose:** URL reputation checking
```python
from google.cloud import safebrowsing

client = safebrowsing.SafeBrowsingClient()

def check_url_safety(url):
    threat_info = {
        'threatTypes': ['MALWARE', 'SOCIAL_ENGINEERING'],
        'platformTypes': ['ANY_PLATFORM'],
        'threatEntryTypes': ['URL'],
        'threatEntries': [{'url': url}]
    }
    
    response = client.lookup_threat(threat_info)
    return response
```

**Rate Limits:** 10,000 queries/day (free tier)
**Cost:** Free for most usage, paid tiers available

#### VirusTotal API
**Purpose:** Multi-engine URL/file analysis
**Rate Limits:** 4 requests/minute (free), 1000/day (paid)
**Use:** Batch checking, secondary verification

#### PhishTank
**Purpose:** Phishing URL database
**Update Frequency:** Hourly
**Access:** Free API, JSON download
**Integration:** Local cache + API fallback

#### OpenPhish
**Purpose:** Phishing feed
**Update Frequency:** Real-time
**Access:** Free and premium tiers

### Communication Services

#### Twilio
**Purpose:** SMS verification, voice calls, phone number lookup
```python
from twilio.rest import Client

client = Client(account_sid, auth_token)

# Send SMS check results
message = client.messages.create(
    body="Analysis complete: This message is a SCAM",
    from_='+1234567890',
    to=user_phone
)

# Lookup phone number
phone_number = client.lookups.phone_numbers(number).fetch()
carrier = phone_number.carrier['name']
```

#### SendGrid
**Purpose:** Email delivery (notifications, reports)
**Features:** Templates, analytics, deliverability monitoring

### OCR Services

#### Google Cloud Vision API
**Purpose:** Text extraction from images
**Accuracy:** ~99% for clear images
**Support:** 50+ languages
**Pricing:** First 1000 units/month free

```python
from google.cloud import vision

client = vision.ImageAnnotatorClient()

def extract_text_from_image(image_path):
    with open(image_path, 'rb') as image_file:
        content = image_file.read()
    
    image = vision.Image(content=content)
    response = client.text_detection(image=image)
    
    return response.text_annotations[0].description
```

#### Alternative: Tesseract OCR
**Purpose:** Self-hosted OCR
**Advantage:** No API costs, privacy
**Disadvantage:** Lower accuracy

### WHOIS Lookup

#### WHOIS API (multiple providers)
**Purpose:** Domain registration info, age verification
```python
import whois

def check_domain_age(domain):
    w = whois.whois(domain)
    creation_date = w.creation_date
    
    if isinstance(creation_date, list):
        creation_date = creation_date[0]
    
    age_days = (datetime.now() - creation_date).days
    return age_days
```

### Payment Integration (Optional for Premium)

#### Stripe
**Purpose:** Subscription management, payment processing
**Features:** PCI compliance, fraud detection, recurring billing

---

## Security Architecture

### Authentication & Authorization

#### Authentication Method: JWT (JSON Web Tokens)
```javascript
// Token structure
{
  "user_id": "uuid",
  "email": "user@example.com",
  "role": "user",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Flow:**
1. User logs in with credentials
2. Server validates and issues JWT (access + refresh token)
3. Client stores tokens securely
4. Access token sent with each request
5. Refresh token used to get new access token

#### Authorization Levels
- **User:** Standard senior user
- **Family:** Family member with limited access
- **Reviewer:** Human review team member
- **Admin:** System administrator
- **Support:** Customer support team

### Data Security

#### Encryption at Rest
- Database: AWS RDS encryption enabled
- S3: Server-side encryption (AES-256)
- Secrets: AWS Secrets Manager / KMS

#### Encryption in Transit
- All communication: TLS 1.3
- API endpoints: HTTPS only
- WebSocket: WSS (secure WebSocket)

#### Sensitive Data Handling
**PII Protection:**
```python
from cryptography.fernet import Fernet

def encrypt_sensitive_data(data, key):
    f = Fernet(key)
    encrypted = f.encrypt(data.encode())
    return encrypted

def decrypt_sensitive_data(encrypted_data, key):
    f = Fernet(key)
    decrypted = f.decrypt(encrypted_data)
    return decrypted.decode()
```

**Data Minimization:**
- Don't store full message content unnecessarily
- Hash content for deduplication
- Purge old analysis data (90-day retention)
- Anonymize for ML training

#### Privacy by Design
**Principles:**
1. Minimal data collection
2. User consent for all features
3. Data portability (export all data)
4. Right to deletion (GDPR compliance)
5. Transparent processing
6. Family connection requires explicit consent

### Rate Limiting

**API Rate Limits:**
```python
# Using Redis for rate limiting
from redis import Redis
from time import time

redis_client = Redis()

def rate_limit(user_id, limit=100, window=3600):
    key = f"rate_limit:{user_id}"
    current = redis_client.incr(key)
    
    if current == 1:
        redis_client.expire(key, window)
    
    if current > limit:
        return False
    
    return True
```

**Limits by Tier:**
- Free: 100 checks/hour
- Premium: 1000 checks/hour
- Family plan: 500 checks/hour per user

### DDoS Protection

- AWS Shield Standard (automatic)
- CloudFront (geographical distribution)
- WAF rules (rate limiting, IP blocking)
- Challenge-response for suspicious traffic

---

## Scalability & Performance

### Horizontal Scaling

**Stateless Services:**
- API servers: Scale based on CPU/memory
- Analysis workers: Scale based on queue depth
- Load balancing: Round-robin with health checks

**Database Scaling:**
- Read replicas for query performance
- Connection pooling (PgBouncer)
- Query optimization and indexing
- Partitioning by user_id or date

### Caching Strategy

**Multi-Level Cache:**
```
1. Client-side cache (local storage)
   ↓ (miss)
2. CDN cache (CloudFront)
   ↓ (miss)
3. Application cache (Redis)
   ↓ (miss)
4. Database
```

**Cache Keys:**
```redis
# URL reputation (cache for 1 hour)
url:{url_hash} → {risk_score, verdict, timestamp}

# Domain info (cache for 24 hours)
domain:{domain} → {whois_data, age, ssl_info}

# Known scam patterns (cache for 15 minutes)
scam_patterns:all → {pattern_array}

# User preferences (cache for 1 hour)
user:{user_id}:prefs → {preferences_json}
```

**Cache Invalidation:**
- Time-based expiration
- Event-driven invalidation (on updates)
- Manual purge for critical updates

### Performance Optimization

#### API Response Times
**Target:**
- P50: < 200ms
- P95: < 500ms
- P99: < 1000ms

**Techniques:**
- Async processing for heavy tasks
- Database query optimization
- Connection pooling
- Compression (gzip)
- Pagination for large results

#### Mobile App Performance
- Lazy loading
- Image optimization
- Bundle size reduction
- Code splitting
- Native module caching

### Monitoring & Observability

#### Metrics to Track
**System Health:**
- Request rate (requests/second)
- Error rate (%)
- Response time (p50, p95, p99)
- Database connection pool usage
- Cache hit rate

**Business Metrics:**
- Scams detected
- False positive rate
- User engagement
- Feature usage
- Conversion rate (free to premium)

#### Logging
**Structured Logging:**
```json
{
  "timestamp": "2026-02-08T10:30:00Z",
  "level": "INFO",
  "service": "analysis-api",
  "endpoint": "/api/v1/analysis/email",
  "user_id": "uuid",
  "request_id": "req_123",
  "duration_ms": 245,
  "status": "success",
  "verdict": "danger",
  "confidence": 0.95
}
```

**Log Aggregation:** CloudWatch Logs or ELK Stack

#### Alerting
**Critical Alerts:**
- Service downtime
- Error rate > 5%
- API latency > 2s
- Database connection failures
- High false positive rate (> 10%)

**Tools:**
- PagerDuty for on-call
- Slack for team notifications
- Email for non-critical

---

## Development & Deployment

### CI/CD Pipeline

**GitHub Actions Workflow:**
```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run tests
        run: |
          npm install
          npm test
      - name: Run linter
        run: npm run lint
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Docker image
        run: docker build -t seniorprotect/api:${{ github.sha }} .
      - name: Push to registry
        run: docker push seniorprotect/api:${{ github.sha }}
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster production \
            --service api-service \
            --force-new-deployment
```

### Environments

1. **Development:** Local development
2. **Staging:** Pre-production testing
3. **Production:** Live environment
4. **Disaster Recovery:** Backup region

### Version Control Strategy

**Git Flow:**
- `main` - Production code
- `develop` - Integration branch
- `feature/*` - Feature branches
- `hotfix/*` - Emergency fixes
- `release/*` - Release preparation

### Testing Strategy

**Unit Tests:**
- Backend: pytest (Python) or Jest (Node.js)
- Frontend: Jest + React Testing Library
- Coverage target: > 80%

**Integration Tests:**
- API endpoint testing
- Database integration
- Third-party API mocking

**E2E Tests:**
- Selenium or Playwright
- Critical user flows
- Mobile: Detox (React Native)

**Security Tests:**
- OWASP ZAP scanning
- Dependency vulnerability scanning (Snyk)
- Penetration testing (quarterly)

---

## Mobile-Specific Architecture

### React Native Architecture

**File Structure:**
```
mobile-app/
├── src/
│   ├── components/      # Reusable UI components
│   ├── screens/         # Screen components
│   ├── navigation/      # Navigation configuration
│   ├── services/        # API calls, business logic
│   ├── utils/           # Helper functions
│   ├── hooks/           # Custom React hooks
│   ├── context/         # React Context providers
│   ├── assets/          # Images, fonts
│   └── config/          # App configuration
├── ios/                 # iOS native code
├── android/             # Android native code
└── __tests__/           # Test files
```

### State Management

**Approach:** Redux Toolkit or Zustand

**Store Structure:**
```javascript
{
  user: {
    profile: {},
    preferences: {},
    isAuthenticated: boolean
  },
  analysis: {
    currentAnalysis: {},
    history: [],
    isLoading: boolean
  },
  notifications: {
    unread: [],
    settings: {}
  },
  offline: {
    queue: [],
    syncStatus: 'synced'
  }
}
```

### Offline Capability

**Strategy:**
- Cache API responses locally
- Queue actions when offline
- Sync when connection restored
- Show offline indicator

**Implementation:**
```javascript
// Offline queue middleware
const offlineMiddleware = store => next => action => {
  if (!navigator.onLine && isOfflineQueueable(action)) {
    // Store action for later
    offlineQueue.push(action);
    return;
  }
  
  return next(action);
};

// Sync when online
window.addEventListener('online', () => {
  syncOfflineQueue();
});
```

### Push Notifications

**iOS:** APNs (Apple Push Notification service)
**Android:** FCM (Firebase Cloud Messaging)

**Implementation:**
```javascript
import messaging from '@react-native-firebase/messaging';

// Request permission
const requestPermission = async () => {
  const authStatus = await messaging().requestPermission();
  return authStatus === messaging.AuthorizationStatus.AUTHORIZED;
};

// Handle notifications
messaging().onMessage(async remoteMessage => {
  showLocalNotification(remoteMessage);
});

// Background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in background:', remoteMessage);
});
```

---

## Browser Extension Architecture

### Manifest V3 Structure

```json
{
  "manifest_version": 3,
  "name": "Senior Protect",
  "version": "1.0.0",
  "permissions": [
    "activeTab",
    "storage",
    "notifications"
  ],
  "host_permissions": [
    "http://*/*",
    "https://*/*"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_start"
  }],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icon.png"
  }
}
```

### Extension Components

**Background Service Worker:**
```javascript
// background.js
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'loading' && tab.url) {
    checkUrlSafety(tab.url).then(result => {
      if (result.isDangerous) {
        // Block or warn
        chrome.tabs.update(tabId, {
          url: chrome.runtime.getURL('warning.html')
        });
      }
    });
  }
});
```

**Content Script:**
```javascript
// content.js - Monitors page for dangerous elements
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.tagName === 'FORM') {
        checkFormSafety(node);
      }
    });
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
```

---

## Disaster Recovery & Business Continuity

### Backup Strategy

**Database Backups:**
- Automated daily snapshots (AWS RDS)
- Point-in-time recovery (35-day retention)
- Cross-region replication

**Application Backups:**
- Docker images stored in ECR
- Infrastructure as Code (Terraform) in version control
- Configuration backups

### Failover Strategy

**Database Failover:**
- Multi-AZ deployment (automatic failover)
- Read replica promotion if needed
- RTO: < 5 minutes

**Application Failover:**
- Multi-region deployment
- DNS-based failover (Route 53)
- Load balancer health checks

### Incident Response

**Severity Levels:**
1. **Critical:** Service down, data loss risk
2. **High:** Major feature unavailable
3. **Medium:** Performance degradation
4. **Low:** Minor issues

**Response Times:**
- Critical: 15 minutes
- High: 1 hour
- Medium: 4 hours
- Low: Next business day

---

## Performance Benchmarks

### Target Performance

**API Response Times:**
- Email analysis: < 2 seconds
- URL check: < 1 second
- Phone lookup: < 500ms
- User data fetch: < 200ms

**Mobile App:**
- Cold start: < 3 seconds
- Screen transition: < 300ms
- Analysis submission: < 2 seconds

**Accuracy Targets:**
- True positive rate: > 95%
- False positive rate: < 5%
- False negative rate: < 2%

### Load Testing

**Tools:** Apache JMeter, Locust, k6

**Scenarios:**
- Sustained load: 1000 req/s
- Peak load: 5000 req/s
- Stress test: 10000 req/s

---

This technical architecture provides a solid foundation for building a scalable, secure, and performant senior protection app. The architecture can be adjusted based on specific requirements, budget constraints, and team expertise.
