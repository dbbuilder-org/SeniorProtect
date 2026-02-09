# Senior Protection App - Technical Architecture

## System Overview

### Architecture Philosophy
- **Scalable**: Handle millions of checks per day
- **Fast**: Results in < 2 seconds
- **Reliable**: 99.9% uptime
- **Secure**: Protect user privacy
- **Maintainable**: Clean, documented code

---

## TECHNOLOGY STACK

### Frontend

**Mobile Apps**:
- **Framework**: React Native
  - Cross-platform (iOS + Android)
  - Native performance
  - Large community
  - Accessibility support
  - Alternatives: Flutter

**Web App**:
- **Framework**: React
  - Component-based
  - Virtual DOM performance
  - Rich ecosystem
  - Accessibility tools

**State Management**:
- React Context API (for simple state)
- Redux Toolkit (if complexity grows)
- React Query (for server state)

**UI Components**:
- Custom component library (accessibility-focused)
- No generic UI libraries (need custom sizing)
- Styled Components or Tailwind CSS

**Accessibility**:
- React Native Accessibility APIs
- ARIA labels
- Screen reader testing
- High contrast support

### Backend

**API Server**:
- **Language**: Node.js (TypeScript)
  - Fast, async I/O
  - JavaScript familiarity
  - Rich package ecosystem
  - Alternative: Python (FastAPI)

**Framework**: Express.js or Fastify
- RESTful API
- WebSocket support (for real-time features)
- Rate limiting
- Request validation

**Authentication**:
- JWT (JSON Web Tokens)
- Optional OAuth integration
- Session management
- Refresh token rotation

### Database

**Primary Database**: PostgreSQL
- Relational data (users, scams, reports)
- ACID compliance
- Full-text search
- JSON support for flexible data

**Schema Design**:
```sql
users
- id (uuid, primary key)
- email (varchar, unique)
- phone (varchar, nullable)
- created_at (timestamp)
- settings (jsonb)
- subscription_tier (enum)

scam_reports
- id (uuid, primary key)
- type (enum: email, text, call, website)
- content_hash (varchar, indexed)
- reporter_id (uuid, foreign key)
- threat_level (enum: safe, caution, danger)
- reported_at (timestamp)
- verified (boolean)

known_scams
- id (uuid, primary key)
- type (enum)
- pattern (text)
- indicators (jsonb)
- threat_level (enum)
- first_seen (timestamp)
- last_seen (timestamp)
- report_count (integer)

family_connections
- id (uuid, primary key)
- senior_id (uuid, foreign key)
- family_member_id (uuid, foreign key)
- alert_level (enum: none, medium, high)
- created_at (timestamp)

threat_checks
- id (uuid, primary key)
- user_id (uuid, foreign key)
- content_type (enum)
- content_hash (varchar, indexed)
- result (jsonb)
- checked_at (timestamp)
```

**Cache Layer**: Redis
- Session storage
- Rate limiting
- Frequently accessed data
- Real-time features (pub/sub)
- Check result caching (TTL: 1 hour)

**Document Store**: MongoDB (optional)
- Full message content (encrypted)
- Large text analysis
- Flexible schema for ML features

### Machine Learning

**ML Framework**: Python
- **NLP**: Hugging Face Transformers
  - Text classification
  - Sentiment analysis
  - Entity recognition
- **Training**: PyTorch or TensorFlow
- **Serving**: TensorFlow Serving or custom API

**Models**:

1. **Phishing Classifier**
   - Input: Email/text content
   - Output: Probability of phishing
   - Training data: Known phishing corpus

2. **Urgency Detector**
   - Input: Message text
   - Output: Urgency score (0-1)
   - Detects manipulation tactics

3. **Sender Reputation**
   - Input: Email address, domain
   - Output: Trust score
   - Historical data + community reports

4. **URL Risk Scorer**
   - Input: URL string
   - Output: Risk score
   - Features: domain age, TLD, pattern matching

**Model Deployment**:
- Containerized (Docker)
- API endpoints
- A/B testing framework
- Continuous training pipeline

### External APIs

**Threat Intelligence**:
- **Google Safe Browsing API**
  - Phishing sites
  - Malware sites
  - Unwanted software

- **VirusTotal API**
  - URL reputation
  - File scanning
  - Domain analysis

- **PhishTank API**
  - Phishing URL database
  - Community reports

- **OpenPhish**
  - Real-time phishing feeds

**Email Verification**:
- **Email validation services**
- **SPF/DKIM/DMARC checkers**
- **Domain reputation APIs**

**Phone Number Validation**:
- **Twilio Lookup API**
- **NumVerify**
- **Scam number databases**

**WHOIS Lookup**:
- Domain registration info
- Domain age calculation

**OCR (Optical Character Recognition)**:
- **Tesseract.js** (client-side, basic)
- **Google Cloud Vision API** (server-side, advanced)
- **AWS Textract** (alternative)

---

## SYSTEM ARCHITECTURE

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   CLIENT LAYER                      │
│  ┌───────────┐  ┌───────────┐  ┌──────────────┐   │
│  │ Mobile    │  │  Web      │  │  Browser     │   │
│  │ App       │  │  App      │  │  Extension   │   │
│  │ (iOS/     │  │  (React)  │  │  (Chrome)    │   │
│  │ Android)  │  │           │  │              │   │
│  └───────────┘  └───────────┘  └──────────────┘   │
└────────────────────┬────────────────────────────────┘
                     │ HTTPS/WSS
                     ▼
┌─────────────────────────────────────────────────────┐
│                   API GATEWAY                       │
│  ┌─────────────────────────────────────────────┐   │
│  │ Load Balancer (nginx/AWS ALB)               │   │
│  │ - Rate Limiting                             │   │
│  │ - SSL Termination                           │   │
│  │ - Request Routing                           │   │
│  └─────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│                 APPLICATION LAYER                   │
│  ┌─────────────────────────────────────────────┐   │
│  │ API Servers (Node.js)                       │   │
│  │ - RESTful endpoints                         │   │
│  │ - WebSocket servers                         │   │
│  │ - Business logic                            │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Analysis Engine                             │   │
│  │ - URL validator                             │   │
│  │ - Email/text analyzer                       │   │
│  │ - Pattern matching                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ ML Service (Python)                         │   │
│  │ - Phishing classifier                       │   │
│  │ - Urgency detector                          │   │
│  │ - Content analysis                          │   │
│  └─────────────────────────────────────────────┘   │
└────────────┬───────────────────────────┬────────────┘
             │                           │
             ▼                           ▼
┌─────────────────────────┐  ┌──────────────────────┐
│    DATA LAYER           │  │  EXTERNAL SERVICES   │
│                         │  │                      │
│  ┌──────────────────┐   │  │  ┌────────────────┐ │
│  │ PostgreSQL       │   │  │  │ Google Safe    │ │
│  │ (Primary DB)     │   │  │  │ Browsing       │ │
│  └──────────────────┘   │  │  └────────────────┘ │
│                         │  │                      │
│  ┌──────────────────┐   │  │  ┌────────────────┐ │
│  │ Redis            │   │  │  │ VirusTotal     │ │
│  │ (Cache/Sessions) │   │  │  └────────────────┘ │
│  └──────────────────┘   │  │                      │
│                         │  │  ┌────────────────┐ │
│  ┌──────────────────┐   │  │  │ PhishTank      │ │
│  │ MongoDB          │   │  │  └────────────────┘ │
│  │ (Documents)      │   │  │                      │
│  └──────────────────┘   │  │  ┌────────────────┐ │
│                         │  │  │ OCR Service    │ │
│  ┌──────────────────┐   │  │  └────────────────┘ │
│  │ S3/Object Store  │   │  │                      │
│  │ (Files/Backups)  │   │  └──────────────────────┘
│  └──────────────────┘   │
└─────────────────────────┘
```

### Request Flow Example: Check Email

```
1. User pastes email in mobile app
   ↓
2. App sends to API: POST /api/v1/check/email
   - Headers: Authorization, Content-Type
   - Body: { content: "email text", contentType: "email" }
   ↓
3. API Gateway
   - Validates JWT token
   - Rate limit check (100 checks/hour per user)
   - Routes to API server
   ↓
4. API Server
   - Generates content hash (SHA-256)
   - Checks cache (Redis): Has this been checked recently?
   - If cached: Return cached result
   - If not cached: Continue to analysis
   ↓
5. Analysis Engine
   - Parallel processing:
     a. Extract URLs → URL Validator Service
     b. Extract sender → Email Validator Service
     c. Content → ML Service (phishing classifier)
     d. Pattern matching → Known scams DB
   ↓
6. Aggregate Results
   - Combine scores from all sources
   - Apply weighting algorithm
   - Generate threat level (safe/caution/danger)
   - Create user-friendly explanation
   ↓
7. Store Results
   - Cache in Redis (TTL: 1 hour)
   - Log check in PostgreSQL
   - Update statistics
   ↓
8. Return to Client
   - JSON response with:
     {
       threatLevel: "danger",
       confidence: 0.95,
       indicators: [...],
       recommendation: "Delete this email",
       explanation: "This is a scam because..."
     }
   ↓
9. Client displays result in UI
```

---

## API DESIGN

### RESTful Endpoints

**Authentication**:
```
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
```

**Check Services**:
```
POST /api/v1/check/email
POST /api/v1/check/text
POST /api/v1/check/url
POST /api/v1/check/phone
POST /api/v1/check/image (with OCR)
```

**User Management**:
```
GET  /api/v1/user/profile
PUT  /api/v1/user/profile
GET  /api/v1/user/settings
PUT  /api/v1/user/settings
GET  /api/v1/user/statistics
```

**Trusted Sites**:
```
GET  /api/v1/sites/trusted
POST /api/v1/sites/bookmark
DELETE /api/v1/sites/bookmark/:id
```

**Family Features**:
```
POST /api/v1/family/connect
GET  /api/v1/family/connections
DELETE /api/v1/family/connection/:id
PUT  /api/v1/family/alerts/:id
GET  /api/v1/family/dashboard/:seniorId
```

**Scam Reporting**:
```
POST /api/v1/reports/scam
GET  /api/v1/reports/my-reports
GET  /api/v1/reports/community-stats
```

**Learning**:
```
GET  /api/v1/learn/scam-library
GET  /api/v1/learn/daily-tip
GET  /api/v1/learn/practice-mode
POST /api/v1/learn/practice-response
```

### Example API Request/Response

**Request**:
```http
POST /api/v1/check/email HTTP/1.1
Host: api.seniorprotect.com
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "content": "Dear valued customer, Your account has been suspended...",
  "metadata": {
    "sender": "security@amazun-support.com",
    "subject": "Urgent: Account Suspended",
    "timestamp": "2026-02-08T10:30:00Z"
  }
}
```

**Response** (Danger):
```json
{
  "id": "check_abc123",
  "threatLevel": "danger",
  "confidence": 0.96,
  "timestamp": "2026-02-08T10:30:05Z",
  "threeQuestions": {
    "whoIsThisFrom": {
      "claim": "Amazon Support",
      "reality": "security@amazun-support.com",
      "realEmail": "@amazon.com",
      "problem": "This is NOT from Amazon"
    },
    "whatDoTheyWant": [
      "Click on a link",
      "Enter your password",
      "Verify your account information"
    ],
    "shouldITrust": {
      "verdict": "scam",
      "reason": "This is a scam trying to steal your information"
    }
  },
  "indicators": [
    {
      "type": "sender_mismatch",
      "severity": "high",
      "description": "Sender domain doesn't match claimed company",
      "details": "Real Amazon emails come from @amazon.com, not @amazun-support.com"
    },
    {
      "type": "urgency_language",
      "severity": "high",
      "description": "Creates false urgency",
      "details": "Uses words like 'urgent' and 'suspended' to pressure you"
    },
    {
      "type": "credential_request",
      "severity": "critical",
      "description": "Asks for sensitive information",
      "details": "Legitimate companies never ask for passwords via email"
    }
  ],
  "recommendation": {
    "action": "delete",
    "message": "Delete this email immediately",
    "explanation": "This is a scam. Do not click any links or provide any information."
  },
  "links": [
    {
      "url": "http://amazun-security.tk/verify",
      "threatScore": 98,
      "isPhishing": true
    }
  ],
  "communityData": {
    "reportsCount": 47,
    "reportsToday": 12,
    "firstReported": "2026-02-08T08:00:00Z"
  }
}
```

**Response** (Safe):
```json
{
  "id": "check_def456",
  "threatLevel": "safe",
  "confidence": 0.92,
  "timestamp": "2026-02-08T10:35:00Z",
  "threeQuestions": {
    "whoIsThisFrom": {
      "claim": "Chase Bank",
      "reality": "alerts@chase.com",
      "verified": true,
      "problem": null
    },
    "whatDoTheyWant": [
      "Review your recent transaction"
    ],
    "shouldITrust": {
      "verdict": "safe",
      "reason": "This appears to be a legitimate alert from your bank"
    }
  },
  "indicators": [
    {
      "type": "verified_sender",
      "severity": "positive",
      "description": "From verified Chase Bank domain"
    },
    {
      "type": "secure_links",
      "severity": "positive",
      "description": "All links go to official Chase website"
    },
    {
      "type": "no_credentials_requested",
      "severity": "positive",
      "description": "Doesn't ask for passwords or account numbers"
    }
  ],
  "recommendation": {
    "action": "safe_to_proceed",
    "message": "This email appears safe",
    "explanation": "This is a legitimate notification from Chase Bank"
  }
}
```

---

## SECURITY ARCHITECTURE

### Data Protection

**Encryption**:
- **In Transit**: TLS 1.3
- **At Rest**: AES-256 encryption
- **Passwords**: bcrypt with salt (cost factor: 12)
- **Sensitive Data**: End-to-end encryption

**Data Minimization**:
- Store only necessary data
- No full email content unless encrypted
- Content hashes instead of full text when possible
- Automatic data deletion (90 days for checks)

**Privacy**:
- GDPR compliant
- User data deletion on request
- No selling of user data
- Transparent privacy policy
- Optional anonymous usage

### Authentication & Authorization

**JWT Strategy**:
- Access tokens (15 min expiry)
- Refresh tokens (7 days expiry)
- Token rotation on refresh
- Revocation support

**Rate Limiting**:
```javascript
// Per user
- 100 checks per hour
- 500 checks per day
- 10 API calls per minute

// Per IP (unauthenticated)
- 10 checks per hour
- 100 API calls per hour
```

**API Security**:
- CORS whitelist
- Input validation
- SQL injection prevention (parameterized queries)
- XSS protection
- CSRF tokens for web
- Request signing

### Infrastructure Security

**Hosting**:
- AWS/GCP/Azure (multi-region)
- Auto-scaling
- DDoS protection
- WAF (Web Application Firewall)

**Monitoring**:
- Application monitoring (Datadog/New Relic)
- Security monitoring (SIEM)
- Intrusion detection
- Log aggregation
- Automated alerts

**Backups**:
- Daily database backups
- Point-in-time recovery
- Multi-region replication
- Disaster recovery plan

---

## ML PIPELINE

### Training Pipeline

```
Data Collection
    ↓
Data Preprocessing
    ↓
Feature Engineering
    ↓
Model Training
    ↓
Model Evaluation
    ↓
Model Versioning
    ↓
Deployment (if improved)
```

**Data Sources**:
- User reports (verified scams)
- Public phishing databases
- Community contributions
- Honeypot emails/texts
- Synthetic data generation

**Features for Phishing Classifier**:
- Sender domain features
- URL features
- Content features (urgency, keywords)
- Structural features
- Metadata features

**Model Evaluation**:
- Accuracy
- Precision/Recall
- F1 Score
- False positive rate (critical to minimize)
- Confusion matrix

### Inference Pipeline

```
Request
    ↓
Preprocessing
    ↓
Feature Extraction
    ↓
Model Prediction
    ↓
Post-processing
    ↓
Response
```

**Performance**:
- Inference time: < 500ms
- Batch processing for multiple checks
- Model caching
- GPU acceleration (if needed)

---

## SCALING STRATEGY

### Horizontal Scaling

**Stateless API Servers**:
- Easy to add more instances
- Load balanced
- No session affinity needed

**Database Scaling**:
- Read replicas
- Connection pooling
- Query optimization
- Partitioning by date

**Cache Layer**:
- Redis cluster
- Distributed caching
- Cache invalidation strategy

### Performance Optimization

**Caching Strategy**:
```
1. Check Redis cache (content hash key)
2. If cache hit: Return immediately
3. If cache miss: Perform analysis
4. Cache result (TTL: 1 hour)
```

**Database Optimization**:
- Proper indexing
- Query optimization
- Materialized views for statistics
- Archive old data

**CDN**:
- Static assets
- API edge caching
- Reduced latency

**Async Processing**:
- Queue for non-urgent tasks
- Background jobs for reports
- Email notifications

---

## MONITORING & ANALYTICS

### Key Metrics

**System Health**:
- API response time (p50, p95, p99)
- Error rate
- Uptime
- Database performance
- Cache hit rate

**Business Metrics**:
- Daily active users
- Checks per day
- Scams detected
- False positive rate
- User retention
- Subscription conversions

**Security Metrics**:
- Failed login attempts
- Suspicious activity
- Rate limit hits
- Blocked malicious requests

### Logging

**Log Levels**:
- ERROR: System errors, exceptions
- WARN: Degraded performance, security warnings
- INFO: Important events, check results
- DEBUG: Detailed execution info

**Log Storage**:
- Centralized logging (ELK stack)
- Log rotation
- Retention: 90 days
- Searchable and queryable

---

## DEPLOYMENT STRATEGY

### CI/CD Pipeline

```
Code Push
    ↓
Automated Tests
    ↓
Build Docker Images
    ↓
Deploy to Staging
    ↓
Automated E2E Tests
    ↓
Manual QA Approval
    ↓
Deploy to Production
    ↓
Monitor for Issues
```

**Testing**:
- Unit tests (Jest)
- Integration tests
- E2E tests (Cypress/Detox)
- Performance tests
- Security scans

**Deployment Strategy**:
- Blue-green deployment
- Canary releases
- Feature flags
- Rollback capability

---

## DEVELOPMENT TOOLS

### Version Control
- Git (GitHub/GitLab)
- Branch strategy: GitFlow
- Pull request reviews
- Automated checks on PR

### Project Management
- JIRA or Linear
- Sprint planning
- Issue tracking

### Documentation
- API documentation (Swagger/OpenAPI)
- Code documentation (JSDoc/TypeDoc)
- Architecture diagrams (Draw.io, Mermaid)
- Runbook for operations

### Communication
- Slack for team communication
- PagerDuty for on-call
- Status page for users

---

## DISASTER RECOVERY

### Backup Strategy
- Automated daily backups
- Multiple geographic regions
- Regular restore testing
- Point-in-time recovery

### Incident Response
1. Detect issue (monitoring)
2. Alert on-call engineer
3. Triage and assess impact
4. Implement fix or rollback
5. Post-mortem analysis
6. Update runbooks

### Business Continuity
- Multi-region deployment
- Failover procedures
- Data replication
- Load balancer health checks

---

## COST ESTIMATION (Monthly, for 10K users)

**Infrastructure**:
- Cloud hosting: $2,000
- Database: $500
- Cache/Redis: $200
- CDN: $100
- Monitoring: $200
Total: ~$3,000/month

**External APIs**:
- Google Safe Browsing: Free (up to 10K lookups)
- VirusTotal: $490/month
- OCR Service: $200/month
- SMS for hotline: $500/month
Total: ~$1,190/month

**ML Training**:
- GPU instances: $500/month
- Storage: $100/month
Total: ~$600/month

**Total Operating Cost**: ~$4,800/month for 10K users
**Per User**: ~$0.48/month

At $9.99/month subscription with 20% conversion:
- Revenue: 2,000 paying users × $9.99 = $19,980/month
- Costs: $4,800/month
- Gross margin: ~76%

---

## FUTURE TECHNICAL CONSIDERATIONS

### Scalability
- Microservices architecture (if needed)
- GraphQL API (for complex queries)
- Edge computing for faster checks
- Real-time threat feeds

### Advanced ML
- Deep learning models
- Transfer learning
- Active learning from user feedback
- Personalized models per user

### Platform Expansion
- Desktop app
- Smart home integration
- Email plugin for desktop clients
- API for partners

---

*Last Updated: February 2026*
