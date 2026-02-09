# User Flows

## Primary User Flows

### Flow 1: Email/Text Scam Check (Copy/Paste)

**Scenario:** Margaret receives a suspicious email and wants to check if it's safe.

```
START → Home Screen

Step 1: User taps "Check Email or Text"
↓
Step 2: Input Method Selection Screen
   Options shown:
   - Paste the text [SELECTED]
   - Take a photo
   - Read it to me
   - Forward the email
↓
Step 3: Text Input Screen
   - Large text area displayed
   - Placeholder: "Paste your email or text message here"
   - User pastes email content
   - Taps "Check This Message" button
↓
Step 4: Analysis in Progress
   - "Checking for scams..." message
   - Spinner animation
   - "This usually takes just a moment"
   - Takes 2-3 seconds
↓
Step 5: Results Screen (SCAM DETECTED)
   Display:
   - Red header: "⚠️ THIS IS A SCAM ⚠️"
   - Large red circle icon
   - "DO NOT respond to this message"
   - Reason bullet points:
     • Fake sender address
     • Asks for your password
     • Creates false urgency
   - Action buttons:
     [Delete This Message]
     [Report This Scam]
   - Links: [Why is this a scam?] [Done]
↓
Step 6a: User taps "Delete This Message"
   - Confirmation: "Are you sure?"
   - [Yes, Delete It] [Cancel]
   - If confirmed: "Message deleted" + return to home
↓
Step 6b: User taps "Why is this a scam?"
   - Educational screen explaining the specific red flags
   - Examples of what real messages look like
   - [Got It] button
↓
END → Return to Home Screen
```

**Alternative Outcomes:**

**If SAFE:**
```
Step 5 (Safe Variant):
   - Green header: "✓ THIS IS SAFE"
   - Green circle icon
   - "This message appears to be legitimate."
   - Why it's safe (bullet points)
   - [Open Safely] button
   - [Learn More] [Done] links
```

**If CAUTION:**
```
Step 5 (Caution Variant):
   - Yellow header: "⚠️ BE CAREFUL ⚠️"
   - Yellow circle icon
   - "This message has some warning signs"
   - Things to watch out for (bullet points)
   - Recommendation steps
   - [Find Real Contact Info] button
   - [More Details] [I'll Be Careful] links
```

---

### Flow 2: URL/Website Check

**Scenario:** User receives a link and wants to verify it before clicking.

```
START → Home Screen

Step 1: User taps "Website Link"
↓
Step 2: Input Method Selection
   - Paste the link
   - Scan QR code [NEW]
   - From my messages
↓
Step 3: URL Input
   - Text field: "Paste the website address here"
   - Example shown: "https://example.com"
   - Paste URL
   - [Check This Link] button
↓
Step 4: Analysis (fast - 1 second)
   - "Checking this website..."
   - Quick animation
↓
Step 5: Results
   DANGER RESULT:
   - "🚫 DANGEROUS WEBSITE"
   - "Do NOT visit this site"
   - Reasons:
     • Known phishing site
     • Tries to look like Amazon
     • Reported 47 times this week
   - What it does:
     "This site will try to steal your login information"
   - [Block This Site] [Report It] [Done]
↓
Step 6: User taps "Block This Site"
   - "Site added to your block list"
   - "I'll warn you if you see it again"
   - [Done]
↓
END → Return to Home
```

**Safe URL Variant:**
```
Step 5 (Safe):
   - "✓ SAFE TO VISIT"
   - Green icon
   - "This is the official Amazon website"
   - Security info:
     • Verified domain
     • Valid security certificate
     • No red flags
   - [Visit This Site] [Done]
```

---

### Flow 3: Phone Number Verification

**Scenario:** User receives a call from an unknown number claiming to be Social Security.

```
START → Home Screen

Step 1: User taps "Phone Number"
↓
Step 2: Input Options
   - Type the number
   - From my recent calls
   - Paste from a message
↓
Step 3: Number Input
   - Large number pad displayed
   - Or: Select from recent calls list
   - User enters: 1-800-555-SCAM
   - [Check This Number] button
↓
Step 4: Analysis
   - "Looking up this number..."
   - 1-2 seconds
↓
Step 5: Results (SCAM DETECTED)
   - "🚨 SCAM NUMBER 🚨"
   - Large red warning
   - "DO NOT call this number back"
   - Details:
     • Reported 127 times as scam
     • Claims to be: IRS/Social Security
     • Actually: Phone scammer
   - What they do:
     "They'll try to scare you into sending money"
   - Truth about Social Security:
     "Social Security NEVER calls about suspended numbers"
   - [Block This Number] [Report It] [Done]
↓
Step 6: User taps "Block This Number"
   - "Number blocked on your device"
   - "You won't receive calls from this number"
   - [Done]
↓
END → Return to Home
```

---

### Flow 4: Active Call Protection (Call Shield)

**Scenario:** User is on a suspicious call and activates Call Shield.

```
START → User is on phone call

Step 1: User opens app during call
   - App detects active call
   - Automatic prompt: "Are you on a suspicious call?"
   - [Yes - Help Me] [No - I'm Fine]
↓
Step 2: User taps "Yes - Help Me"
   - Call Shield activates
   - Large overlay appears
↓
Step 3: Call Shield Screen (Overlay)
   Display:
   ━━━━━━━━━━━━━━━━━━━━━━
   🛡️ CALL SHIELD ACTIVE
   
   ⚠️ Remember:
   • Don't share passwords
   • Don't share full account numbers  
   • Don't make payments on this call
   • Real companies give you time
   
   [I Feel Unsafe - End Call]
   [Alert My Family]
   [I'm Okay Now]
   ━━━━━━━━━━━━━━━━━━━━━━
↓
Step 4a: User taps "I Feel Unsafe"
   - Call immediately terminated
   - "Call ended for your safety"
   - "What happened?" quick survey
   - [Report This Call] button
↓
Step 4b: User taps "Alert My Family"
   - SMS sent to emergency contact:
     "Margaret activated Call Shield during a suspicious call. 
      Please check in with her."
   - "Alert sent to [Contact Name]"
   - Call Shield remains active
↓
Step 5: Call Ends (natural or terminated)
   - Post-call survey appears:
     "How did that call go?"
     [Everything Was Fine]
     [I'm Not Sure]
     [I Think It Was a Scam]
     [I Made a Mistake]
↓
Step 6: Based on selection, provide appropriate help
   If "I Think It Was a Scam":
   → Scam reporting flow
   
   If "I Made a Mistake":
   → Recovery coach flow (see Flow 8)
   
   If "Everything Was Fine":
   → "Great! Glad you're safe." Return to home
↓
END
```

---

### Flow 5: Payment Protection Intervention

**Scenario:** User opens Venmo to send money, app detects and intervenes.

```
START → User opens Venmo app

Step 1: Senior Protect detects payment app
   - Background monitoring active
   - Notification appears:
     "💡 Quick Check - Are you about to send money?"
     [Yes, Help Me Check] [No Thanks]
↓
Step 2: User taps "Yes, Help Me Check"
   - App opens to Payment Check screen
↓
Step 3: Payment Verification Questions
   Display:
   ━━━━━━━━━━━━━━━━━━━━━━
   ⏸️ PAYMENT CHECK
   
   Let me ask a few quick questions:
   
   1. Do you know this person in real life?
      [Yes] [No]
   
   2. Did they contact you first asking for money?
      [Yes] [No] [Not Sure]
   
   3. Are they claiming there's an emergency?
      [Yes] [No]
   
   4. Did someone tell you to use Venmo/Zelle?
      [Yes] [No]
   ━━━━━━━━━━━━━━━━━━━━━━
↓
Step 4: User answers questions
   Answers: No, Yes, Yes, Yes
   → HIGH RISK detected
↓
Step 5: Warning Screen
   - "🚨 THIS SOUNDS LIKE A SCAM 🚨"
   - Large red warning
   - "Based on your answers, this has all the signs of a scam"
   - Common scam pattern explanation:
     "Scammers often:"
     • Contact you first
     • Create fake emergencies
     • Ask for specific payment apps
     • Target people they don't know
   - "What you should do:"
     [STOP - Don't Send Money]
     [Call the Person at Their Real Number]
     [Talk to Family First]
   - [I Still Want to Send It] (small, bottom)
↓
Step 6a: User taps "STOP - Don't Send Money"
   - "Smart choice! You just avoided a scam."
   - Celebration message
   - "You protected yourself! 🎉"
   - [Report This Scam] [Done]
↓
Step 6b: User taps "Call Real Number" 
   - If contact saved: "I'll call [Name] at (555) 123-4567"
   - [Call Now] button
   - Direct dial to saved contact
↓
END → Return to Home
   - Add to scams blocked counter
```

---

### Flow 6: Photo/OCR Analysis

**Scenario:** User wants to check a printed email or message on another device.

```
START → Home Screen

Step 1: User taps "Check Email or Text"
↓
Step 2: Input Method Selection
   User selects: "Take a photo of it"
↓
Step 3: Camera Permission Check
   If not granted:
   - "I need camera access to take photos"
   - "This lets you check printed messages"
   - [Allow Camera Access]
   - System permission dialog
↓
Step 4: Camera Screen
   - Camera viewfinder active
   - Frame guide overlay: "Position message within frame"
   - [Capture Photo] button
   - [Use from Gallery] link
   - [Cancel] button
↓
Step 5: Photo Captured
   - Preview shown
   - "Is this clear to read?"
   - [Yes, Check This] [Retake Photo]
↓
Step 6: OCR Processing
   - "Reading the text..."
   - Progress indicator
   - Takes 3-5 seconds
↓
Step 7: Text Extracted Preview
   - "Here's what I found:"
   - Extracted text displayed
   - "Does this look right?"
   - [Yes, Analyze This] [Text is Wrong - Retake]
↓
Step 8: Analysis
   - Same as standard email check flow
   - Results screen (Safe/Caution/Danger)
↓
END → Results and actions
```

---

### Flow 7: Voice Input Analysis

**Scenario:** User prefers to describe the message verbally.

```
START → Home Screen

Step 1: User taps "Check Email or Text"
↓
Step 2: Input Method Selection
   User selects: "Read it to me"
↓
Step 3: Microphone Permission Check
   If not granted:
   - Permission request and explanation
   - System dialog
↓
Step 4: Voice Input Screen
   Display:
   ━━━━━━━━━━━━━━━━━━━━━━
   🎤 I'm Listening
   
   Read me the message, or tell me about it.
   
   I'll understand either way.
   
   [●] Recording...
   [Stop Recording]
   ━━━━━━━━━━━━━━━━━━━━━━
↓
Step 5: User reads message aloud
   - Voice visualization (waveform)
   - Real-time transcription shown
   - "Got it" confirmation after pause
↓
Step 6: Transcription Review
   - "Here's what I heard:"
   - Text displayed
   - "Is this correct?"
   - [Yes, Check This] [Try Again]
↓
Step 7: Clarifying Questions (if needed)
   AI might ask:
   - "You mentioned they asked for your password. 
      Did they say which account?"
   - "What was the sender's email address?"
   - User can respond by voice or skip
↓
Step 8: Analysis
   - Standard scam analysis
   - Results given both visually AND spoken aloud
   - Voice: "This is a scam. Do not respond to this message."
↓
Step 9: Voice-Guided Next Steps
   - "Would you like me to:"
   - Options spoken and shown:
     • Delete the message
     • Report the scam  
     • Learn more about why it's a scam
   - User can tap or say their choice
↓
END → Action completed, return to home
```

---

### Flow 8: "I Made a Mistake" - Recovery Flow

**Scenario:** User realizes they may have fallen for a scam and activates recovery.

```
START → User taps "I Think I Made a Mistake" button
   (Available on home screen, always visible)

Step 1: Immediate Triage
   - "I'm here to help. Take a breath."
   - "What happened?"
   - Options:
     [I clicked a link]
     [I gave out information]
     [I sent money]
     [I downloaded something]
     [I gave computer access]
     [Something else]
↓
Step 2a: USER SELECTED "I sent money"
↓
Step 3: Money Sent - Quick Questions
   - "Which service did you use?"
     [Zelle] [Venmo] [PayPal] [Wire Transfer] 
     [Gift Cards] [Other]
   
   - "How long ago?"
     [< 1 hour] [1-24 hours] [> 24 hours]
↓
Step 4: Urgent Action Screen (if < 1 hour)
   ━━━━━━━━━━━━━━━━━━━━━━
   ⚡ ACT FAST - WE CAN HELP
   
   There's still time to stop this!
   
   IMMEDIATE STEPS:
   
   1. CALL YOUR BANK NOW
      [Call Bank Now] ← Auto-dials
   
   2. While calling, I'll:
      • Save transaction details
      • Prepare your report
      • Document everything
   
   [Start Call Now]
   ━━━━━━━━━━━━━━━━━━━━━━
↓
Step 5: During Bank Call
   - "On hold? Here's what to say:"
   - Script displayed:
     "I need to report an unauthorized Zelle transfer.
      It was sent to [details].
      This was a scam. I need it stopped immediately."
   - [Copy Script]
   - Evidence being collected in background
↓
Step 6: Post-Call Actions
   - "What did the bank say?"
     [They're investigating]
     [Money can't be recovered]
     [They need more information]
   
   Based on answer, provide next steps:
↓
Step 7: Recovery Checklist Created
   ━━━━━━━━━━━━━━━━━━━━━━
   RECOVERY PLAN
   
   ☑ Bank contacted ✓
   ☐ Report to FBI IC3
   ☐ Report to FTC
   ☐ Monitor accounts (30 days)
   ☐ Document everything
   
   Next: File FBI Report
   [Do This Now]
   ━━━━━━━━━━━━━━━━━━━━━━
↓
Step 8: Guided Through Each Step
   Each item opens:
   - Clear instructions
   - Direct links to forms
   - Pre-filled information where possible
   - [Mark Complete] checkbox
↓
Step 9: Emotional Support & Resources
   - "This wasn't your fault"
   - "You're handling this well"
   - "Would you like to talk to someone?"
     [AARP Fraud Watch] [Local Support] [Skip]
↓
Step 10: Follow-Up Schedule
   - "I'll check in with you:"
   - Day 3: "How's the recovery going?"
   - Week 1: "Time to review credit reports"
   - Week 2: "Check bank statements"
   - 30 days: "Final security checkup"
   
   [Set Up Reminders] [I'll Handle It Myself]
↓
END → Recovery plan saved, reminders scheduled
```

**Alternative Branch - "I gave out information":**
```
Step 2b: Information Shared
↓
Step 3: What Information?
   [Bank account/routing]
   [Credit card number]
   [Social Security number]
   [Password]
   [Other]
↓
Step 4: SSN Exposure Path (example)
   IMMEDIATE ACTIONS:
   
   1. Freeze Your Credit
      All 3 bureaus:
      • Equifax [Freeze Now]
      • Experian [Freeze Now]
      • TransUnion [Freeze Now]
   
   2. Place Fraud Alert
      [Place Alert Now]
   
   3. Report Identity Theft
      [Go to IdentityTheft.gov]
   
   Each step guided, checkboxes to track
↓
[Continue with recovery checklist...]
```

---

### Flow 9: Family Connection Setup

**Scenario:** User wants to connect with family member for safety monitoring.

```
START → Settings Screen

Step 1: User taps "Family Connection"
↓
Step 2: Family Connection Intro
   - "Connect with family for extra safety"
   - Explanation:
     "Family members can see:
      ✓ How many scams were blocked
      ✓ If you ask for help
      
      They CANNOT see:
      ✗ Your messages or emails
      ✗ Websites you visit
      ✗ Personal information
      
      You're always in control."
   
   - [Connect Family Member] [Not Now]
↓
Step 3: User taps "Connect Family Member"
   - "How would you like to invite them?"
     [Send Text Message]
     [Send Email]
     [Show QR Code]
     [Enter Their Details]
↓
Step 4: Invitation Sent
   - "Invitation sent to Sarah!"
   - "They'll get a link to join"
   - "You can change their access anytime"
↓
Step 5: Family Member Accepts (their side)
   - They receive link
   - Download app
   - Accept connection
   - Set up their account
↓
Step 6: Connection Confirmed
   - Notification: "Sarah is now connected!"
   - "What can Sarah see?"
   - Permission settings shown:
     ✓ Weekly summaries
     ✓ Help requests
     ✓ Emergency alerts
     ✗ Message content
     ✗ Websites visited
   
   - [Edit Permissions] [Done]
↓
Step 7: Permission Customization (optional)
   Toggle switches for:
   - Daily summaries
   - Weekly summaries
   - Scam count visibility
   - Help request alerts
   - Emergency alerts
   - Activity indicators
   
   [Save Changes]
↓
END → Family connection active
```

---

### Flow 10: Practice Mode

**Scenario:** User wants to practice identifying scams safely.

```
START → Home Screen → Help Tab

Step 1: User taps "Practice Spotting Scams"
↓
Step 2: Practice Mode Intro
   - "🎓 PRACTICE MODE"
   - "Want to practice spotting scams?"
   - "I'll show you real examples (made safe)"
   - "You tell me: Safe or Scam?"
   - "No pressure, just learning!"
   
   [Start Practice] [Exit]
↓
Step 3: First Example Shown
   ━━━━━━━━━━━━━━━━━━━━━━
   Example 1 of 5
   
   Here's an email:
   
   From: security@paypa1-alert.com
   Subject: Account Locked
   
   Dear User,
   Your PayPal account has been locked.
   Click here to verify: [link]
   
   ━━━━━━━━━━━━━━━━━━━━━━
   
   What do you think?
   
   [This is SAFE]
   [This is a SCAM]
   [I'm Not Sure]
↓
Step 4: User selects answer
   User taps: "This is a SCAM"
↓
Step 5: Feedback & Education
   - "✓ Great job! This IS a scam!"
   - Animated checkmark
   - "Here's why:"
     1. Email: paypa1-alert.com
        Real PayPal is paypal.com
        (Notice the "1" instead of "l")
     
     2. "Dear User"
        Real PayPal knows your name
     
     3. Threats and urgency
        Classic scam pressure tactic
   
   - "You spotted it! ⭐"
   - [Next Example] [Explain More] [Exit Practice]
↓
Step 6: Progress Through Examples
   - 5 examples total
   - Mix of easy, medium, hard
   - Different types: email, text, website
   - Score tracked but not emphasized
↓
Step 7: Practice Complete
   ━━━━━━━━━━━━━━━━━━━━━━
   🎉 PRACTICE COMPLETE!
   
   Your Results:
   • Scams Identified: 4/5 (80%)
   • Correct answers: 4
   • Current streak: 3 in a row!
   
   You're getting really good at this!
   
   💪 Strength: Phone scams
   📚 Practice more: Email scams
   
   [Practice More] [Done]
   ━━━━━━━━━━━━━━━━━━━━━━
↓
END → Return to Help section
```

---

### Flow 11: Human Review Request

**Scenario:** App is uncertain about a message and user requests human review.

```
START → Results Screen (Caution/Uncertain)

Step 1: Standard analysis shows "Caution" result
   - "⚠️ BE CAREFUL"
   - Explanation of concerns
   - At bottom: "Not sure?" button
↓
Step 2: User taps "Get Second Opinion"
↓
Step 3: Review Request Screen
   - "I can get a human expert to review this"
   - "What you'll get:"
     ✓ Expert analysis (5 minutes)
     ✓ Clear recommendation
     ✓ Explanation of decision
   
   - "What gets sent:"
     ✓ The message content (private info removed)
     ✓ Why I'm uncertain
     ✗ Your personal information
   
   - Free: 3 reviews per month
   - After that: $2 per review or upgrade to Premium
   
   [Request Review] [Cancel]
↓
Step 4: User confirms
   - "Sending to review team..."
   - "You'll get a notification when ready"
   - "Usually takes about 5 minutes"
   - "You can close the app and I'll notify you"
   
   [View Status] [Done]
↓
Step 5: While Waiting Screen (optional)
   - Status: "In Review Queue"
   - Position: "2nd in line"
   - "Estimated time: 3 minutes"
   - "What to do while waiting:"
     • Don't respond to the message yet
     • Don't click any links
     • Keep the message available
   
   [Close]
↓
Step 6: Review Complete (Notification)
   Push notification:
   "✓ Review Complete - This is a SCAM"
   
   User opens app:
↓
Step 7: Expert Review Results
   ━━━━━━━━━━━━━━━━━━━━━━
   EXPERT REVIEW: SCAM
   
   Reviewed by: Certified Analyst
   Confidence: 95%
   
   Analysis:
   "While the domain looks legitimate,
   it's a very clever fake. The sender
   is impersonating [Company] using a
   similar domain. The link goes to a
   phishing site designed to steal
   your login credentials."
   
   My recommendation:
   • Delete this email immediately
   • Do not click any links
   • If concerned, contact [Company]
     directly using their official
     number: (555) 123-4567
   
   [Delete Message] [Report Scam]
   [Save This Report]
   ━━━━━━━━━━━━━━━━━━━━━━
↓
Step 8: Feedback Option
   - "Was this review helpful?"
   - [Very Helpful] [Helpful] [Not Helpful]
   - [Add Comment] (optional)
↓
END → Return to home with action taken
```

---

## Error & Edge Case Flows

### Network Disconnected During Check

```
Analysis in progress
↓
Network disconnects
↓
Error Screen:
- "📡 Connection Lost"
- "I need internet to check for scams"
- "Your message is saved"
- [Try Again] [Check Later] [Call for Help]
↓
If "Try Again":
  - Automatic retry when network returns
  - Resume from where it stopped
```

### Service Unavailable

```
Analysis request
↓
Backend service down
↓
Fallback Screen:
- "😕 Temporarily Unavailable"
- "I'm having trouble right now"
- "This doesn't mean your message is safe or unsafe"
- "What you can do:"
  - [Try Again in a Minute]
  - [Call Our Helpline: (555) PROTECT]
  - [Save and Check Later]
```

### Camera Access Denied

```
User tries photo check
↓
Camera permission denied
↓
Permission Explanation:
- "I need camera access to help you"
- "This lets you take photos of messages"
- "Your photos stay private - I only read the text"
- [Open Settings] [Use Different Method]
```

---

This user flow document covers the complete user journey through all major features, including happy paths, alternative branches, and error handling scenarios.
