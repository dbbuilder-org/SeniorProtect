# Feature Specifications

## 1. Context-Aware Protection System

### Overview
The app actively monitors device context and offers protection at the right moment, rather than waiting for users to manually check things.

### Situation Detection

**Triggers:**
- User opens email application
- User copies a link or text
- User opens payment apps (Venmo, Zelle, PayPal, etc.)
- User opens phone/dialer app with suspicious number
- User receives SMS from unknown number
- Banking app opened

**Automatic Actions:**
```
Trigger: User copies URL
↓
Background: Parse and analyze URL
↓
If suspicious: Show notification
"I noticed you copied a link. Want me to check if it's safe first?"
[Yes, Check It] [No Thanks]
```

### Implementation Requirements
- Background service monitoring (with permission)
- Clipboard monitoring (iOS: on app focus, Android: background service)
- App usage detection via accessibility services
- Low battery impact (<2% daily)
- User privacy: no data leaves device unless explicitly checking

---

## 2. The "Three Questions" Safety Framework

### Purpose
Simplify complex security decisions into three human-understandable questions that cover all attack vectors.

### Question Framework

#### Question 1: "Who is this really from?"
**Analysis:**
- Sender email/phone verification
- Domain authentication (SPF, DKIM, DMARC)
- Phone number reverse lookup
- Comparison with known legitimate contacts
- Brand impersonation detection

**Output Format:**
```
WHO IS THIS FROM?

Claims to be: "Amazon Support"
Actually from: amazon-secure@gmail.com

⚠️ PROBLEM: Real Amazon emails come from @amazon.com
```

#### Question 2: "What do they want me to do?"
**Analysis:**
- Action extraction (click, download, pay, call, provide info)
- Urgency language detection
- Request legitimacy assessment
- Comparison with normal operations

**Output Format:**
```
WHAT DO THEY WANT?

• Click a link
• Enter your password
• "Verify your account"

⚠️ PROBLEM: Amazon never asks for passwords by email
```

#### Question 3: "Should I trust this?"
**Final Recommendation:**
- Risk scoring (0-100)
- Clear verdict: Safe / Caution / Danger
- Specific action guidance

**Output Format:**
```
MY ADVICE:

🔴 This is a SCAM
Delete this email immediately

[Delete It For Me] [Show Me Why]
```

---

## 3. Multi-Channel Input Methods

### Overview
Support how seniors actually interact with technology, not just ideal scenarios.

### Input Methods

#### 3.1 Text Input
- Direct paste into app
- Share from other apps
- Copy triggers automatic detection

#### 3.2 Photo Input
- Camera to photograph screen
- Photo from gallery
- OCR processing with high accuracy
- Works with printed emails (seniors often print)

#### 3.3 Voice Input
**Interaction:**
```
User: "Check this email from Amazon"
App: "I'd like to help! Can you read me the email?"
User: [reads email]
App: "Let me check that... This sounds like a scam because..."
```

**Features:**
- Natural conversation
- Clarifying questions
- Read results aloud
- No typing required

#### 3.4 Screen Scanning
- Hold phone camera to another device's screen
- Real-time text extraction
- Instant analysis
- Useful for checking messages on desktop

#### 3.5 Email/SMS Forwarding
- Dedicated email: check@seniorprotectapp.com
- Dedicated SMS number: (XXX) XXX-XXXX
- Auto-reply with analysis within 30 seconds
- Keep original message for context

#### 3.6 QR Code Access
- Physical card with QR codes
- "Check Email" QR
- "Check Website" QR
- "Check Phone Number" QR
- Direct to right feature

---

## 4. Phone Call Protection

### Overview
Critical feature since phone scams are highly effective against seniors.

### 4.1 Pre-Call Number Verification

**Before Calling:**
```
User about to dial: 1-800-XXX-XXXX
↓
App intercepts (if permission granted)
↓
Shows quick check:

⚠️ WARNING
This number has been reported 47 times as a scam

Claim they make: "IRS Tax Department"
Reality: The IRS never calls about taxes

[Cancel Call] [More Info] [Call Anyway]
```

**Database:**
- Known scammer numbers
- Reported numbers (community)
- Legitimate company numbers
- Reverse lookup integration

### 4.2 Call Shield Mode

**Activation:**
- Manual: "I'm on a suspicious call"
- Automatic: Detects call from flagged number

**During Call Features:**
- Real-time on-screen prompts
- "Banks NEVER ask for full account numbers"
- "Social Security NEVER threatens arrest"
- Recording option (where legal)
- Big red "End Call" button
- Family alert option

**Display During Call:**
```
━━━━━━━━━━━━━━━━━━━━━━━━
🛡️ CALL SHIELD ACTIVE

⚠️ Remember:
• Don't share passwords
• Don't share full account numbers
• Don't make payments on this call
• Real companies give you time to think

[I Feel Unsafe - End Call]
[Alert My Family]
━━━━━━━━━━━━━━━━━━━━━━━━
```

### 4.3 Post-Call Analysis

**After Call Ends:**
```
How did that call go?

[Everything Was Fine]
[I'm Not Sure]
[I Think It Was a Scam]
[I Made a Mistake]

→ Based on selection, provide appropriate guidance
```

---

## 5. Payment Protection Layer

### Overview
Intercept payments before they happen - the last line of defense.

### 5.1 Payment App Detection

**Triggers:**
- Opening Venmo, Zelle, PayPal, Cash App
- Detecting keywords: "send," "pay," "transfer"
- Before transaction completes

### 5.2 Payment Verification Questions

**Required Questions:**
```
⏸️ PAYMENT CHECK

You're about to send $500 to:
John Smith (@jsmith4829)

Let me ask a few quick questions:

1. Do you know this person in real life?
   [Yes] [No]

2. Did they contact you first asking for money?
   [Yes] [No] [Not Sure]

3. Are they claiming there's an emergency?
   [Yes] [No]

4. Is this to fix a computer problem?
   [Yes] [No]

5. Did they ask you to buy gift cards instead?
   [Yes] [No]

[Continue with Questions] [Skip - I'm Sure]
```

**Risk Scoring:**
- No to Q1 + Yes to Q2 = HIGH RISK
- Yes to Q3 = HIGH RISK
- Yes to Q4 = HIGH RISK (tech support scam)
- Yes to Q5 = CRITICAL RISK

### 5.3 Gift Card Warning System

**Trigger Words Detection:**
- "gift card"
- "iTunes card"
- "Google Play card"
- "prepaid card"
- "reload card"
- "Steam card"

**Warning Display:**
```
🚨 GIFT CARD ALERT 🚨

Someone is asking you to pay with gift cards.

THIS IS THE #1 SIGN OF A SCAM

• No real company asks for gift card payment
• Not IRS, not Social Security, not tech support
• Not family emergency, not prizes
• NEVER, EVER legitimate

This is 99.9% a scam.

[Stop - Don't Buy Cards]
[Tell Me More]
[I Really Need to Do This]
```

---

## 6. Social Engineering Defense

### Overview
Detect psychological manipulation tactics used by scammers.

### 6.1 Pressure Tactics Detection

**Analyzed Patterns:**
- Time pressure: "within 24 hours," "immediately," "right now"
- Account threats: "will be suspended," "will be closed"
- Legal threats: "warrant," "arrest," "legal action"
- Loss framing: "lose access," "miss out," "expire"
- Secrecy requests: "don't tell anyone," "keep this confidential"
- Authority claims: "IRS," "FBI," "Microsoft support"

**Confidence Scoring:**
Each pattern adds to pressure score (0-100)
- 0-30: Normal communication
- 31-60: Some urgency (common in legitimate marketing)
- 61-80: High pressure (red flag)
- 81-100: Extreme pressure (definite scam)

### 6.2 Response to High Pressure

**Display:**
```
🚨 PRESSURE TACTICS DETECTED
Score: 85/100 - EXTREME PRESSURE

This message is trying to rush you into making a decision.
This is a common scam technique.

Real companies give you time to think.
Real emergencies don't come through email.

STOP. BREATHE. YOU HAVE TIME.

What you should do RIGHT NOW:
1. Don't respond to this message
2. Don't click any links
3. Let's verify this together

[Help Me Verify] [Call Real Company] [Talk to Family]
```

### 6.3 Urgency Counter

**Calming Message:**
```
You've received 3 urgent messages today.
That's a lot of "emergencies."

Remember:
✓ Real emergencies rarely come by email
✓ Real companies don't threaten you
✓ You always have time to verify

Take a breath. We'll check each one together.
```

---

## 7. Impersonation Detection

### 7.1 Family/Friend Impersonation

**Common Patterns:**
- "This is [name], new phone"
- "In trouble, need money"
- "Can't talk, text only"
- "Don't call, phone broken"

**Detection Logic:**
```
Message Analysis:
→ Claims to be known contact: Sarah
→ From unknown number
→ Requests money
→ Unusual communication pattern

Red Flag Score: 90/100
```

**User Prompt:**
```
⚠️ VERIFY THIS PERSON

This message claims to be from Sarah, but:
• It's from a number not saved in your phone
• Sarah's real number is (555) 123-4567
• They're asking for money
• They don't want you to call

VERIFY BEFORE SENDING MONEY:

[Call Sarah's Real Number] → Auto-dials saved contact
[Ask a Personal Question] → Suggests question only Sarah knows
[Alert My Family] → Sends alert to designated family member
```

### 7.2 Authority Impersonation

**Impersonation Database:**
Each authority has specific profile:

**IRS Profile:**
- Never calls about taxes owed
- Always sends written notice first
- Never demands immediate payment
- Never asks for gift cards
- Never threatens arrest

**Social Security Profile:**
- Never calls about suspended numbers
- Never asks for SSN over phone
- Never demands payment
- Never threatens legal action

**Tech Support Profile:**
- Never cold calls
- Never asks for remote access unsolicited
- Never requires immediate payment
- Microsoft/Apple never calls about viruses

**Bank Profile:**
- Knows your name (never "Dear Customer")
- Never asks for full account number
- Never asks for password/PIN
- Calls from recognized numbers

### 7.3 Brand Impersonation

**Visual Analysis:**
- Logo comparison (if image in email)
- Color scheme analysis
- Font comparison
- Layout pattern matching

**Domain Analysis:**
- Character substitution: am4zon.com, paypa1.com
- TLD variations: amazon.co, amazon.net
- Subdomain tricks: amazon-security.verify.com
- Homograph attacks: аmazon.com (Cyrillic 'a')

**Detection Output:**
```
🎭 IMPERSONATION DETECTED

Claims to be: Amazon
Real domain: amazon.com
This domain: amazon-secure.verify-account.com

⚠️ This is FAKE
• Real Amazon is just amazon.com
• Extra words like "secure" or "verify" are scams
• Legitimate companies use simple addresses

[Block This Sender] [Report Scam]
```

---

## 8. The "Undo" / Recovery Feature

### Overview
If a user realizes they've been scammed or made an error, provide immediate, actionable help.

### 8.1 Emergency Button

**Location:** Always visible, floating action button
**Label:** "I Think I Made a Mistake" or "Something's Wrong"

### 8.2 Triage Questions

**Immediate Assessment:**
```
I'm here to help. What happened?

[I clicked a link]
[I gave out information]
[I sent money]
[I downloaded something]
[I gave access to my computer]
[Something else]
```

### 8.3 Guided Response by Scenario

**Scenario: Clicked Link**
```
Immediate Steps:

1. ✓ Run security scan (starting now...)
2. Let's change your passwords
   → Which accounts were you logged into?
   
3. Monitor for unusual activity
   → I'll set up alerts for you

[Start Password Changes]
[Call My Bank]
[More Help]
```

**Scenario: Gave Out Information**
```
What information did you share?

[Bank account / routing number]
[Credit card number]
[Social Security number]
[Password]
[Other]

→ Based on selection, provide specific steps
```

**Example: SSN Given Out**
```
IMMEDIATE ACTIONS:

1. Freeze your credit (I'll help)
   • Equifax
   • Experian
   • TransUnion
   
2. Report identity theft
   → FTC: IdentityTheft.gov
   
3. Monitor your accounts
   → Set up fraud alerts

4. Contact Social Security
   → Report SSN misuse

[Start Credit Freeze] → Walks through each bureau
[Call SSA] → Dials 1-800-772-1213
[Create Report] → Opens IdentityTheft.gov
```

**Scenario: Sent Money**
```
Which service did you use?

[Zelle]
[Venmo]
[PayPal]
[Wire Transfer]
[Gift Cards]
[Other]

How long ago? [< 1 hour] [1-24 hours] [> 24 hours]

→ Different response based on timing and service
```

**Example: Zelle, < 1 hour**
```
Act fast - we might be able to stop this!

1. CALL YOUR BANK NOW
   → I'll dial for you: [Dial Bank]
   
2. Tell them: "Unauthorized Zelle transfer"
   
3. While on hold, let's:
   • Screenshot the transaction
   • Note the recipient info
   • Prepare details
   
4. Report the scam
   → FBI IC3
   → FTC
   
[Dial My Bank Now]
```

### 8.4 Evidence Collection

**Automatic Documentation:**
- Screenshots of relevant screens
- Timeline of events
- Contact information of scammer
- Transaction details
- Communication records

**Report Generation:**
```
I've created a report with:
✓ What happened
✓ When it happened
✓ Who contacted you
✓ Money/info involved
✓ Steps you've taken

[Download Report PDF]
[Email to Me]
[Share with Authorities]
```

### 8.5 Emotional Support

**Throughout Process:**
```
This isn't your fault.
Scammers are professionals at this.
You're doing the right thing by getting help.
We'll get through this together.
```

**Resource Connections:**
- AARP Fraud Watch Network
- Local senior centers
- Victim support groups
- Counseling resources (if needed)

---

## 9. Learning System

### Overview
Education without overwhelm - teach through experience, celebrate progress.

### 9.1 Contextual Learning

**After Each Check:**
```
Result shown: "This is a SCAM"

[Want to Know Why?]
↓
"This was a scam because:
1. The sender email was fake
2. They asked for your password
3. They created false urgency

Real Amazon would never do these things."
```

**Learning Nugget:**
Short, actionable insight
- Max 2-3 sentences
- One key takeaway
- No jargon
- Positive framing

### 9.2 Weekly Scam Story

**Format:**
```
━━━━━━━━━━━━━━━━━━
🎓 SCAM OF THE WEEK

This week, watch for:
"Social Security Suspension" calls

The Scam:
Someone calls saying your SSN is suspended.
They sound official and urgent.

The Truth:
• Social Security numbers can't be "suspended"
• SSA never calls about this
• It's always a scam

Red Flags:
• Threat of arrest
• Demands immediate payment
• Asks for SSN confirmation

If you get this call:
Hang up immediately. You're safe.

[60 second read]
━━━━━━━━━━━━━━━━━━
```

### 9.3 Progress Tracking

**Achievement System:**
```
🎉 GREAT JOB!

You've protected yourself from:
• 12 scam emails
• 5 fake websites
• 3 suspicious calls

You're getting really good at spotting scams!

Keep it up! ⭐
```

**Milestones:**
- First scam detected
- First week protected
- 10 scams blocked
- Taught a friend
- Perfect month (no close calls)

### 9.4 Pattern Recognition Building

**After Similar Scams:**
```
I've noticed something interesting...

You've now seen 5 "Amazon account" scams.
They ALL had these same tricks:

✓ Fake @amazon email address
✓ "Verify immediately" language
✓ Suspicious links

You're learning the pattern!
Next time, you might spot it even faster! 🎯
```

### 9.5 No-Pressure Education

**Principles:**
- No tests or quizzes
- No scores or grades
- No "you should have known"
- Only positive reinforcement
- Learning at own pace
- Can skip any lesson

---

## 10. Family Connection System

### Overview
Optional feature that creates a safety net while respecting senior's independence and privacy.

### 10.1 Senior Control Panel

**What Senior Sees:**
```
━━━━━━━━━━━━━━━━━━
FAMILY CONNECTION

Connected to:
• Sarah (Daughter)
• Mike (Son)

What they can see:
✓ Number of threats blocked
✓ If I mark something as "need help"
✓ Emergency alerts only

What they CANNOT see:
• Content of my messages
• Websites I visit
• Who I talk to
• Any personal information

[Edit Who Can See]
[Pause Sharing]
[Turn Off Completely]
━━━━━━━━━━━━━━━━━━
```

**Controls:**
- Add/remove family members
- Adjust what they see (granular)
- Pause anytime
- Full off switch
- No tracking, ever

### 10.2 Family Dashboard

**What Family Member Sees:**
```
━━━━━━━━━━━━━━━━━━
MOM'S SAFETY DASHBOARD

This Week:
🛡️ 3 scams blocked
🟢 All threats handled
✓ No help needed

Activity Summary:
• Checked 2 websites ✓
• Verified 1 phone number ✓
• Declined 3 suspicious messages ✓

Mom's Status: Protected & Confident

Last checked in: 2 days ago

[Send Check-In Message]
[View Safety Tips for Mom]
━━━━━━━━━━━━━━━━━━
```

**Privacy-Preserving Details:**
- Counts, not content
- Risk levels, not specifics
- Pattern summaries, not data
- Only shows what senior allows

### 10.3 Alert Levels

**Level 1 - Info Only:**
Weekly summary email
- X threats blocked
- System working well
- No action needed

**Level 2 - Attention:**
Notification sent
- Higher than normal threat activity
- Multiple suspicious contacts
- Senior might need support
- Suggested: Check in with them

**Level 3 - Help Requested:**
Immediate notification
- Senior clicked "I need help"
- Senior clicked "I made a mistake"
- Action required
- Includes what happened (if senior shared)

**Level 4 - Emergency:**
Immediate alert (call + text)
- Critical threat detected
- Large payment attempt stopped
- Possible compromise detected
- Immediate family contact needed

### 10.4 Family Education

**Resources for Family:**
```
HOW TO HELP

✓ DO:
• Ask "How's the app working?"
• Celebrate their smart decisions
• Listen without judgment
• Offer help if they ask

✗ DON'T:
• Say "I told you so"
• Take over their device
• Make them feel incompetent
• Share their incidents publicly

[More Tips] [Video Guide]
```

### 10.5 Check-In System

**Family-Initiated:**
```
Message to senior:
"Hey Mom! Just checking in. 
How's everything going? 😊

Love, Sarah"
```

**Non-Intrusive:**
- Scheduled or spontaneous
- Friendly tone, not security-focused
- Optional for senior to respond
- Builds connection, not surveillance

---

## 11. Practice Mode

### Overview
Safe environment to learn scam-spotting skills without real risk.

### 11.1 "Try Me Out" Feature

**Entry Point:**
```
🎓 PRACTICE MODE

Want to practice spotting scams?
I'll show you real examples (made safe).

You tell me: Safe or Scam?
No pressure, just learning!

[Start Practice]
```

### 11.2 Practice Scenarios

**Example 1: Phishing Email**
```
━━━━━━━━━━━━━━━━━━
Here's an email:

From: security@paypa1-alert.com
Subject: Account Locked - Verify Now

Dear User,

Your PayPal account has been locked due to 
suspicious activity. Click here to verify 
within 24 hours or your account will be 
permanently suspended.

Click Here: paypa1-verify.com/account

PayPal Security Team

━━━━━━━━━━━━━━━━━━

What do you think?

[This is SAFE]
[This is a SCAM]
[I'm Not Sure]
```

**After Answer - Educational Moment:**
```
Great job! This IS a scam! 🎯

Here's why:
1. Look at the email: paypa1-alert.com
   → Real PayPal is paypal.com (not "paypa1")
   
2. They said "Dear User"
   → Real PayPal knows your name
   
3. Threats and urgency
   → Classic scam tactic

You spotted it! ⭐

[Next Example] [Exit Practice]
```

### 11.3 Progressive Difficulty

**Level 1: Obvious Scams**
- Clear red flags
- Multiple mistakes
- Easy to spot

**Level 2: Moderate Scams**
- More sophisticated
- Fewer obvious errors
- Requires careful checking

**Level 3: Advanced Scams**
- Very convincing
- Subtle indicators
- Challenges even experts

### 11.4 Real-World Scenarios

**Practice Categories:**
- Email scams
- Text message scams
- Phone call scenarios (read script)
- Website checks
- Social media messages

### 11.5 Confidence Building

**Progress Display:**
```
YOUR PROGRESS

Practice Sessions: 5
Scams Identified: 12/15 (80%)
Current Streak: 4 in a row! 🔥

You're becoming an expert!

Weakest Area: Email impersonation
[Practice More Emails]

Strongest Area: Phone scams
Great job! ⭐
```

---

## 12. Automatic Safe List Building

### Overview
Learn the senior's personal context to provide more accurate, relevant warnings.

### 12.1 Learning Process

**Initial Setup (Optional):**
```
Let me learn what's normal for you.

Which of these do you use?
[Select all that apply]

Banks:
□ Chase
□ Bank of America
□ Wells Fargo
□ Local Credit Union
□ Other: _______

Email:
□ Gmail
□ Yahoo
□ Outlook
□ Other: _______

Shopping:
□ Amazon
□ Walmart
□ Target
□ Other: _______

[Save My Preferences]
[Skip - Learn As I Go]
```

**Ongoing Learning:**
- Sites marked as trusted
- Companies actually contacted
- Legitimate emails received
- Family members identified
- Regular contacts noted

### 12.2 Personalized Warnings

**Generic Warning:**
```
⚠️ This claims to be from a bank.
```

**Personalized Warning:**
```
⚠️ This claims to be from Chase.

I know you bank with Chase.

BUT this email is NOT from Chase:
• Real Chase: @chase.com
• This email: @chase-alert.com

This is targeting YOU specifically.
```

### 12.3 Context-Aware Analysis

**Example:**
Senior has Chase and Bank of America
↓
Email claims to be from Wells Fargo
↓
Lower priority warning: "You don't bank with Wells Fargo"
↓
But still check: "This might be fishing for which bank you use"

**Example:**
Senior frequently shops on Amazon
↓
Amazon-impersonation scam detected
↓
HIGH PRIORITY: "This fake Amazon email is targeting you specifically"

### 12.4 Trusted Contact Verification

**System Learns:**
- Who senior regularly communicates with
- Family members' email addresses
- Friends' phone numbers
- Doctor's office contacts
- Regular service providers

**When Impersonation Attempt:**
```
⚠️ WARNING

This claims to be from your daughter Sarah.

Real Sarah: (555) 123-4567
           sarah@email.com

This message: (555) 999-8888
              unknown.number

Sarah's phone number hasn't changed in 2 years.
This is NOT Sarah.
```

### 12.5 Pattern Matching

**Learns Normal:**
- Typical transaction amounts
- Regular shopping habits
- Communication patterns
- Time-of-day patterns

**Detects Abnormal:**
```
⚠️ UNUSUAL ACTIVITY

You got a "package delivery" email.

BUT:
• You haven't ordered anything in 3 weeks
• This email came at 3am
• You don't usually shop at this site

This might be a scam.
```

---

## 13. Human Review / Second Opinion

### Overview
For edge cases where AI isn't certain, connect to human expertise.

### 13.1 "Not Sure?" Button

**When to Offer:**
- AI confidence < 70%
- User selects "I'm Not Sure"
- Conflicting signals
- New scam pattern
- User requests second opinion

**User Experience:**
```
I'm not 100% certain about this one.

Would you like a second opinion?

[Get Human Review]
↓
"Sending to our review team..."
↓
"Typically responds within 5 minutes"

[While You Wait]
• Don't respond to the message yet
• Don't click any links
• Keep the message open
• I'll notify you when review is ready
```

### 13.2 Review Service Options

**Option A: Professional Service**
- Paid security analysts
- 24/7 availability
- 5-minute response time
- Certified experts
- Cost: included or premium tier

**Option B: Volunteer Network**
- Vetted volunteers (cybersecurity professionals)
- Give back to community
- Slightly longer response (10-15 min)
- Cost: free
- Available during business hours

**Option C: AI-Enhanced Analysis**
- Secondary AI model
- Different analysis approach
- Cross-verification
- Instant result
- May still recommend human review

### 13.3 Review Process

**What Gets Sent:**
- Sanitized message content (personal info redacted)
- Metadata (sender info, links, headers)
- Context flags
- AI's uncertainty reasoning

**What Doesn't Get Sent:**
- User's personal information
- User's identity
- Previous messages
- Unrelated data

**Reviewer Sees:**
```
REVIEW REQUEST #4829

Type: Email
AI Confidence: 65%
Reason for Review: Mixed signals

[Sanitized Content Shown]

Red Flags (2):
• Urgency language
• Suspicious link

Green Flags (2):
• Legitimate-looking domain
• Proper formatting

Your Assessment:
[ ] Safe - False Positive
[ ] Caution - Potentially Suspicious
[ ] Danger - Confirmed Scam
[ ] Need More Info

Explanation: _______________

[Submit Review]
```

**User Receives:**
```
✓ REVIEW COMPLETE

Human expert says: DANGER - This is a scam

Here's why:
"While the domain looks legitimate, it's a 
very clever fake. The sender is impersonating 
[Company] using a similar but fake domain. 
The link goes to a phishing site.

My recommendation: Delete immediately."

Reviewed by: Certified Security Analyst
Confidence: 95%

[Delete This Message] [Report Scam] [More Info]
```

### 13.4 Feedback Loop

**Improve AI:**
- Human decisions train AI
- Reduce future uncertainty
- Better pattern recognition
- Fewer reviews needed over time

**Quality Control:**
- Track reviewer accuracy
- Cross-check decisions
- Flag inconsistencies
- Continuous improvement

---

## 14. Recovery Coach

### Overview
If user was scammed, provide comprehensive support through recovery process.

### 14.1 Initial Assessment

**Immediate Questions:**
```
I'm sorry this happened. Let's fix this together.

Quick questions:

1. When did this happen?
   [ ] Just now (< 1 hour)
   [ ] Today
   [ ] This week
   [ ] Longer ago

2. What did you lose?
   [ ] Money
   [ ] Personal information
   [ ] Computer access
   [ ] Nothing yet (but worried)

3. How are you feeling?
   [ ] Scared
   [ ] Angry
   [ ] Embarrassed
   [ ] Confused
   [ ] Other: _______

[Next: Create Recovery Plan]
```

### 14.2 Personalized Recovery Plan

**Money Lost - Wire Transfer:**
```
RECOVERY PLAN: Wire Transfer Fraud

⏰ TIME IS CRITICAL - ACT NOW

☑ Step 1: Contact Your Bank
   → [Call Bank Now] - I'll dial (555) 123-4567
   → Say: "I need to report wire fraud"
   → Have ready: Transaction date, amount, recipient
   Status: [ ] Done

☑ Step 2: Report to FBI
   → [File IC3 Report] - Opens IC3.gov
   → Takes 10 minutes
   → Keep reference number
   Status: [ ] Done

☑ Step 3: Report to FTC
   → [Report Fraud] - Opens ReportFraud.ftc.gov
   → Document for records
   Status: [ ] Done

☑ Step 4: Monitor Accounts
   → Check daily for 30 days
   → Set up fraud alerts
   → [Set Up Alerts]
   Status: [ ] Done

☑ Step 5: Document Everything
   → I've saved all details
   → [Download Evidence Package]
   Status: [ ] Done

[Save Progress] [Mark Step Complete]
```

**Personal Info Compromised - SSN:**
```
RECOVERY PLAN: SSN Exposure

This is fixable. Follow these steps:

☑ Step 1: Place Fraud Alert
   → Free, lasts 1 year
   → [Place Alert] - I'll help
   Status: [ ] Done

☑ Step 2: Freeze Credit (All 3 Bureaus)
   → Equifax: [Freeze Here]
   → Experian: [Freeze Here]
   → TransUnion: [Freeze Here]
   Status: Equifax [ ] Experian [ ] TransUnion [ ]

☑ Step 3: Report Identity Theft
   → [File at IdentityTheft.gov]
   → Get Recovery Plan
   → Print for records
   Status: [ ] Done

☑ Step 4: Contact Social Security Administration
   → [Call SSA] - 1-800-772-1213
   → Report SSN misuse
   Status: [ ] Done

☑ Step 5: Review Credit Reports
   → Get free reports
   → [Request Reports]
   → Check for fraud
   Status: [ ] Done

☑ Step 6: Monitor Ongoing
   → 90-day check-ins
   → I'll remind you
   Status: [ ] Set Up

[Save Progress]
```

### 14.3 Progress Tracking

**Dashboard:**
```
━━━━━━━━━━━━━━━━━━
RECOVERY PROGRESS

Started: Feb 1, 2026
Days Since Incident: 3

Completed Steps: 4/6 ■■■■■□□
→ Great progress!

✓ Bank contacted
✓ FBI report filed
✓ Credit frozen
✓ Fraud alert placed
○ Credit monitoring setup
○ 30-day follow-up

Next Action:
"Set up credit monitoring"
[Do This Now]

━━━━━━━━━━━━━━━━━━
```

### 14.4 Emotional Support

**Throughout Process:**
```
Checkpoint after each step:

"Great job completing Step 1! 
You're taking control of the situation.

How are you feeling?
[ ] Better
[ ] Still Stressed
[ ] Need Help

[Continue] [Take a Break]"
```

**Affirmations:**
- "This wasn't your fault"
- "You're handling this well"
- "Every step makes you safer"
- "You're not alone in this"
- "Scammers are professionals - anyone can be fooled"

### 14.5 Resource Connections

**Support Services:**
```
Additional Help Available:

📞 AARP Fraud Watch Network
   1-877-908-3360
   [Call Now]

💬 Senior Fraud Support Group
   Free weekly meetings
   [Find Local Group]

🧑‍⚖️ Legal Aid (if needed)
   Free consultation
   [Connect with Attorney]

❤️ Counseling Resources
   If you're feeling overwhelmed
   [Find Counselor]

[I'm Okay] [I Need More Support]
```

### 14.6 Follow-Up Schedule

**Automated Check-Ins:**
```
Day 3: "How's the recovery going?"
Week 1: "Time to review credit reports"
Week 2: "Check bank statements for fraud"
30 Days: "Let's review what happened and what you learned"
90 Days: "Final security checkup"

[View Schedule] [Adjust Reminders]
```

---

## 15. Simplicity Slider

### Overview
Users control detail level - from extreme simplicity to full technical depth.

### 15.1 Detail Level Settings

**Three Levels:**

**Level 1: Simple Mode**
```
Result: "This is a SCAM ❌"
Action: "Delete it"
[That's All I Need]
```

**Level 2: Standard Mode (Default)**
```
Result: "This is a SCAM ❌"

Why: "The sender email is fake and they're 
trying to steal your password"

Action: "Delete this email and don't click any links"

[Learn More Details]
```

**Level 3: Detailed Mode**
```
Result: "This is a SCAM ❌"
Confidence: 98%

Analysis:
• Sender Verification: FAILED
  - Claims: support@amazon.com
  - Actually: support@amaz0n.com (note the zero)
  - SPF Check: Failed
  - DKIM: Not present
  
• Content Analysis:
  - Phishing keywords: 7 detected
  - Urgency score: 95/100
  - Grammar errors: 3
  
• Link Analysis:
  - Destination: phishing-site.ru
  - Domain age: 2 days
  - Blocklist: Present on 3 lists

Technical Details: [View Full Report]

Action: Delete immediately
```

### 15.2 User Controls

**Settings Screen:**
```
━━━━━━━━━━━━━━━━━━
HOW MUCH DETAIL DO YOU WANT?

🔘 Simple
   Just tell me: Safe or Not Safe
   
○ Standard (Recommended)
   Tell me why it's safe or not
   
○ Detailed
   Show me all the technical details

[Save Preference]

You can always tap "Tell Me More" 
to see extra details on any result.
━━━━━━━━━━━━━━━━━━
```

### 15.3 Per-Result Override

**Always Available:**
```
Result shown in chosen detail level
↓
[Want More Details?] → Shows next level
↓
[Want Even More?] → Shows full technical report
↓
[Show Less] → Back to preferred level
```

---

## 16. Trusted Vendor Program

### Overview
Pre-verified legitimate companies can send notifications through the app, reducing false alarms.

### 16.1 Program Structure

**Verified Partners:**
- Major banks
- Healthcare providers
- Government agencies
- Pharmacies
- Utilities
- Major retailers

**Verification Requirements:**
- Business verification
- Security audit
- Privacy compliance
- User consent
- Regular re-verification

### 16.2 User Experience

**Setup:**
```
CONNECT TRUSTED SERVICES

Would you like to connect your verified accounts?

When connected:
✓ Real messages show up as "Verified"
✓ Fewer false alarms
✓ Easier to spot fakes
✓ Faster checking

Connect Your:
□ Chase Bank
□ Walgreens Pharmacy
□ Medicare
□ Utility Company
□ Other: _______

[Connect Selected] [Skip for Now]
```

**In Use:**
```
Checking email from "Chase"...

✓ VERIFIED MESSAGE
This is really from Chase Bank

You connected Chase on Jan 15, 2026
Message verified through secure channel

[Open Safely]

vs.

⚠️ FAKE MESSAGE
This claims to be from Chase but isn't

Real Chase sends through verified channel
This came from: chase-security@gmail.com

[Delete] [Report]
```

### 16.3 Trusted Message Channel

**How It Works:**
1. Company sends message to senior
2. Company pings verification API
3. App cross-references with verified channel
4. Message marked as verified or suspicious

**Benefits:**
- Reduced false positives
- Increased trust
- Clear legitimate/fake distinction
- Peace of mind

### 16.4 Privacy Protection

**User Controls:**
- Choose which companies to connect
- Disconnect anytime
- No data sharing with partners
- Verification only (no content access)

---

## 17. Additional Features

### 17.1 QR Code Scanner

**Purpose:** Many scams now use QR codes

**Features:**
- Scan QR code before following
- Shows where it really goes
- Checks destination safety
- Warns of redirects

**Display:**
```
QR Code Scanned

This QR code goes to:
sketchy-website.ru

⚠️ WARNING
• Very new domain (3 days old)
• Not related to the advertised site
• Found on scam blocklists

Do NOT scan this code.

[Report This QR Code]
```

### 17.2 Browser Extension

**Features:**
- Real-time site checking
- Blocks dangerous sites before loading
- Highlights safe sites
- Warns about forms requesting sensitive info

**Visual Indicator:**
```
Browser address bar shows:

🟢 amazon.com - Verified Safe
🔴 amaz0n.com - BLOCKED - Scam Site
🟡 new-store.com - Caution - Very New Site
```

### 17.3 Smart Home Device Integration

**Voice Assistant Integration:**
"Alexa, check if this email is safe"
"Hey Google, is this website legitimate?"

**Smart Display:**
Visual results on Echo Show, Nest Hub, etc.

### 17.4 Community Features

**Anonymous Scam Reports:**
- Share new scams encountered
- Help protect others
- See scams reported in your area
- Community strength indicator

**Local Alerts:**
```
🔔 LOCAL ALERT

15 people in Seattle reported this scam today:

"Microsoft refund" phone calls
Scammers claiming you're owed money
Asking for bank details to "process refund"

Be on the lookout!
```

### 17.5 Educational Content Library

**Resources:**
- Short video tutorials (1-2 min)
- Monthly webinars
- PDF guides (printable)
- Common scam gallery
- Success stories
- Expert interviews

**Format:**
- Bite-sized content
- No overwhelming information
- Search by topic
- Difficulty level marked
- Recommended for you

---

This completes the comprehensive feature specification. Each feature is designed with senior users in mind - prioritizing clarity, safety, and confidence-building over complexity.
