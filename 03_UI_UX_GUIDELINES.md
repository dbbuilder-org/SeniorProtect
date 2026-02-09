# UI/UX Guidelines

## Design Philosophy

**Core Principle:** "Technology should serve the user, not challenge them."

**Design Values:**
1. **Clarity over Cleverness** - Simple always wins
2. **Confidence over Fear** - Empower, don't alarm
3. **Respect over Condescension** - Dignity in every interaction
4. **Support over Surveillance** - Help, not monitor
5. **Progress over Perfection** - Celebrate small wins

---

## Accessibility Requirements

### WCAG 2.1 Level AAA Compliance

#### Text & Typography

**Font Sizes:**
- Minimum base: 18pt (22.5px)
- Headings: 24-32pt
- Body text: 18-20pt
- Small text (labels): Never below 16pt

**User Control:**
- Font size adjustment (100% - 200%)
- Three preset sizes: Standard, Large, Extra Large
- System font size respected

**Font Families:**
```css
/* Primary: Clear, readable sans-serif */
font-family: -apple-system, BlinkMacSystemFont, 
             'Segoe UI', 'Roboto', 'Oxygen', 
             'Ubuntu', 'Helvetica Neue', sans-serif;

/* Alternative for dyslexia: */
font-family: 'OpenDyslexic', sans-serif;
```

**Line Height & Spacing:**
```css
line-height: 1.6;        /* Minimum 1.5 for body text */
letter-spacing: 0.02em;  /* Slight letter spacing */
word-spacing: 0.05em;    /* Comfortable word spacing */
paragraph-spacing: 1.5em; /* Clear paragraph breaks */
```

#### Color & Contrast

**Contrast Ratios (WCAG AAA):**
- Normal text: 7:1 minimum
- Large text: 4.5:1 minimum
- UI components: 3:1 minimum

**Color Palette:**

**Primary Colors:**
```css
/* Safe/Success - Green */
--color-safe: #2E7D32;      /* Dark enough for contrast */
--color-safe-bg: #E8F5E9;   /* Light background */

/* Warning/Caution - Yellow/Orange */
--color-caution: #F57C00;
--color-caution-bg: #FFF3E0;

/* Danger/Scam - Red */
--color-danger: #C62828;
--color-danger-bg: #FFEBEE;

/* Neutral */
--color-primary: #1976D2;
--color-text: #212121;
--color-text-secondary: #616161;
--color-background: #FFFFFF;
--color-surface: #F5F5F5;
```

**Never Rely on Color Alone:**
- Always pair with icons
- Use text labels
- Add patterns or shapes
- Provide multiple cues

#### Visual Indicators

**Safe/Not Safe System:**
```
✓ Safe     ○ Caution    ✗ Danger
🟢 Green    🟡 Yellow    🔴 Red
✅ Check    ⚠️ Warning   🚫 Stop
```

#### Touch Targets

**Minimum Sizes:**
- Buttons: 60px × 60px (48px absolute minimum)
- Links: 48px × 48px
- Form inputs: 56px height
- Spacing between targets: 8px minimum

**Implementation:**
```css
.button {
    min-width: 120px;
    min-height: 60px;
    padding: 16px 24px;
    margin: 8px;
}
```

#### Screen Reader Support

**All interactive elements must have:**
- Descriptive labels
- ARIA attributes where needed
- Semantic HTML
- Skip navigation links
- Keyboard navigation

**Example:**
```html
<button 
    aria-label="Check if this email is safe"
    aria-describedby="check-hint">
    Check Email
</button>
<span id="check-hint" class="sr-only">
    Analyzes the email for scam indicators
</span>
```

### Voice Control & Dictation

**Voice Command Support:**
- All actions accessible by voice
- Clear command names
- Confirmation for critical actions
- Voice feedback option

**Example Commands:**
```
"Check email"
"Show my history"
"Call for help"
"Read results"
"Go back"
```

### Motor Impairment Support

**Features:**
- Large touch targets
- No complex gestures required
- Alternative to drag-and-drop
- No time-limited actions
- Undo always available

---

## Interface Patterns

### Navigation

#### Primary Navigation (Bottom Tab Bar - Mobile)

**Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│           Main Content Area             │
│                                         │
│                                         │
└─────────────────────────────────────────┘
┌─────────┬─────────┬─────────┬─────────┐
│  🏠     │  📧      │  📞      │  👤     │
│  Home   │  Check  │  Help   │  Me     │
└─────────┴─────────┴─────────┴─────────┘
```

**Tab Labels:**
- Home - Dashboard
- Check - Main analysis features
- Help - Support & education
- Me - Profile & settings

#### Secondary Navigation (Large Back Button)

```
┌─────────────────────────────────────────┐
│ ← Back                                  │
│                                         │
│           Screen Title                  │
│                                         │
```

**Requirements:**
- Back button always visible (except home)
- Minimum 48px × 48px
- Top left corner
- Clear "Back" label with arrow

### Home Screen

#### Dashboard Layout

```
┌─────────────────────────────────────────┐
│  Good morning, Margaret! 👋             │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  🛡️ You're Protected              │ │
│  │  3 scams blocked this week        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  What would you like to check today?   │
│                                         │
│  ┌─────────────────┐  ┌──────────────┐│
│  │  📧            │  │  🔗          ││
│  │  Email or      │  │  Website     ││
│  │  Text Message  │  │  Link        ││
│  └─────────────────┘  └──────────────┘│
│  ┌─────────────────┐  ┌──────────────┐│
│  │  📞            │  │  ❓          ││
│  │  Phone         │  │  Something   ││
│  │  Number        │  │  Else        ││
│  └─────────────────┘  └──────────────┘│
│                                         │
│  🎓 New scam alert in your area →      │
└─────────────────────────────────────────┘
```

**Key Elements:**
- Personal greeting
- Status indicator (protected/issues)
- Large, clear action buttons
- Educational content (optional)
- Always feel in control

### Check Flow

#### Step 1: Input Method Selection

```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│                                         │
│  Check an Email or Text                 │
│                                         │
│  How would you like to show me?         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  📋  Paste the text               │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  📸  Take a photo of it           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  🎤  Read it to me                │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  📧  Forward the email            │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Step 2: Analysis in Progress

```
┌─────────────────────────────────────────┐
│  ← Cancel                               │
│                                         │
│         Checking for scams...           │
│                                         │
│           🔍                            │
│         [Progress Spinner]              │
│                                         │
│   This usually takes just a moment      │
│                                         │
└─────────────────────────────────────────┘
```

**Loading States:**
- Clear progress indication
- Estimated time
- Cancel option
- Reassuring message

#### Step 3: Results Display

**Safe Result:**
```
┌─────────────────────────────────────────┐
│  ← Back to Home                         │
│                                         │
│           ✓ THIS IS SAFE                │
│              🟢                         │
│                                         │
│  This message appears to be legitimate. │
│                                         │
│  Why it's safe:                         │
│  • Sender is verified                   │
│  • No suspicious requests               │
│  • Links go to legitimate sites         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Open Safely                      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [ Learn More ]  [ Done ]              │
└─────────────────────────────────────────┘
```

**Danger Result:**
```
┌─────────────────────────────────────────┐
│  ← Back to Home                         │
│                                         │
│         ⚠️  THIS IS A SCAM  ⚠️          │
│              🔴                         │
│                                         │
│  DO NOT respond to this message         │
│                                         │
│  Why this is dangerous:                 │
│  • Fake sender address                  │
│  • Asks for your password               │
│  • Creates false urgency                │
│                                         │
│  What you should do:                    │
│  ┌───────────────────────────────────┐ │
│  │  🗑️  Delete This Message          │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  📢  Report This Scam             │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [ Why is this a scam? ]  [ Done ]     │
└─────────────────────────────────────────┘
```

**Caution Result:**
```
┌─────────────────────────────────────────┐
│  ← Back to Home                         │
│                                         │
│         ⚠️  BE CAREFUL  ⚠️              │
│              🟡                         │
│                                         │
│  This message has some warning signs    │
│                                         │
│  Things to watch out for:               │
│  • Sender address looks unusual         │
│  • Some urgency in the message          │
│                                         │
│  My recommendation:                     │
│  • Don't respond right away             │
│  • Contact the company directly         │
│  • Use a number you already have        │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Find Real Contact Info           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [ More Details ]  [ I'll Be Careful ] │
└─────────────────────────────────────────┘
```

### Button Hierarchy

#### Primary Action
```css
.button-primary {
    background: #1976D2;
    color: white;
    font-size: 18px;
    font-weight: 600;
    padding: 18px 32px;
    border-radius: 8px;
    min-height: 60px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
```

**Example:** "Check Email", "Delete Message", "Call for Help"

#### Secondary Action
```css
.button-secondary {
    background: white;
    color: #1976D2;
    border: 2px solid #1976D2;
    font-size: 18px;
    padding: 18px 32px;
    border-radius: 8px;
    min-height: 60px;
}
```

**Example:** "Learn More", "Show Details", "Not Now"

#### Danger Action
```css
.button-danger {
    background: #C62828;
    color: white;
    font-size: 18px;
    font-weight: 600;
    padding: 18px 32px;
    border-radius: 8px;
    min-height: 60px;
}
```

**Example:** "Delete", "Block Sender", "End Call"

#### Text Link
```css
.link {
    color: #1976D2;
    font-size: 18px;
    text-decoration: underline;
    padding: 12px;
    /* Ensure touch target size */
}
```

**Example:** "Why is this a scam?", "Tell me more"

### Form Design

#### Text Input
```
┌─────────────────────────────────────────┐
│  Paste Email or Text                    │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │  [User input here]                │ │
│  │                                   │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Check This Message               │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Requirements:**
- Large text area (min 150px height)
- Clear label above input
- Placeholder text with example
- Big "Submit" button below
- No inline validation (avoid anxiety)

#### Checkbox/Radio Buttons
```
□  Remember my preference
   ┗━ Large checkbox (24px × 24px)
   ┗━ Text minimum 18px
   ┗━ Full row clickable
```

### Modal/Dialog Design

#### Confirmation Dialog
```
┌─────────────────────────────────────────┐
│                                         │
│              ⚠️                         │
│                                         │
│     Are you sure you want to           │
│     delete this message?                │
│                                         │
│     This action cannot be undone.       │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Yes, Delete It                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Cancel                           │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

**Requirements:**
- Clear question
- Explanation of consequence
- Two clear options
- Destructive action clearly labeled
- Easy to cancel

### Settings Screen

```
┌─────────────────────────────────────────┐
│  ← Back                Settings          │
│                                         │
│  Appearance                             │
│  ┌───────────────────────────────────┐ │
│  │  Text Size          Large      › │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  High Contrast       Off       › │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Notifications                          │
│  ┌───────────────────────────────────┐ │
│  │  Scam Alerts        ✓ On         │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  Weekly Summary     ✓ On         │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Detail Level                           │
│  ┌───────────────────────────────────┐ │
│  │  ○  Simple                        │ │
│  │  ●  Standard (Recommended)        │ │
│  │  ○  Detailed                      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Privacy                                │
│  ┌───────────────────────────────────┐ │
│  │  Family Connection     Edit    › │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Content & Microcopy

### Voice & Tone

**DO:**
- Use "you" and "I" (conversational)
- Be warm and supportive
- Use simple, everyday words
- Explain technical terms
- Celebrate successes

**DON'T:**
- Use jargon or acronyms
- Be condescending
- Create unnecessary fear
- Blame the user
- Overwhelm with information

### Example Messages

**Success Messages:**
```
✓ "Great! This looks safe."
✓ "You made a smart choice checking this!"
✓ "You're protected. This was a scam attempt."
```

**Warning Messages:**
```
⚠️ "Hold on - let's check this together first."
⚠️ "I'm seeing some warning signs here."
⚠️ "This needs a closer look before you proceed."
```

**Error Messages:**
```
"I couldn't complete that check. Can we try again?"
"Something went wrong on my end. Let me try again."
"I'm having trouble connecting. Check your internet?"
```

**Supportive Messages:**
```
"It's okay - that's why I'm here to help."
"You did the right thing by checking with me."
"Let's figure this out together."
"No worries, we can fix this."
```

### Button Labels

**DO:**
- "Check This Message"
- "Delete It"
- "Call for Help"
- "Show Me Why"
- "I'm Not Sure"

**DON'T:**
- "Submit"
- "OK"
- "Proceed"
- "Confirm"
- "Execute"

### Helper Text

**DO:**
```
"Paste the suspicious message here, and I'll check it for scam signs."
```

**DON'T:**
```
"Input text for analysis (max 5000 characters)."
```

---

## Animation & Motion

### Animation Principles

**Use animation to:**
- Guide attention
- Indicate progress
- Confirm actions
- Show relationships
- Reduce perceived wait time

**Never:**
- Distract or overwhelm
- Make users dizzy
- Block interaction
- Auto-play endlessly

### Animation Timing
```css
/* Fast: UI feedback */
--duration-fast: 150ms;

/* Medium: Transitions */
--duration-medium: 300ms;

/* Slow: Page transitions */
--duration-slow: 500ms;

/* Easing: Natural motion */
--easing: cubic-bezier(0.4, 0.0, 0.2, 1);
```

### Specific Animations

**Button Press:**
```css
.button:active {
    transform: scale(0.95);
    transition: transform 150ms ease;
}
```

**Loading Spinner:**
```css
@keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.spinner {
    animation: spin 1s linear infinite;
}
```

**Success Checkmark:**
```css
@keyframes checkmark {
    0% {
        stroke-dashoffset: 100;
        opacity: 0;
    }
    50% {
        opacity: 1;
    }
    100% {
        stroke-dashoffset: 0;
        opacity: 1;
    }
}
```

**Slide In:**
```css
@keyframes slideIn {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.result-card {
    animation: slideIn 300ms ease;
}
```

### Reduced Motion

**Always respect user preference:**
```css
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}
```

---

## Responsive Design

### Mobile First

**Breakpoints:**
```css
/* Mobile: Default */
/* 320px - 767px */

/* Tablet: */
@media (min-width: 768px) { }

/* Desktop: */
@media (min-width: 1024px) { }

/* Large Desktop: */
@media (min-width: 1440px) { }
```

### Layout Adaptation

**Mobile (< 768px):**
- Single column
- Stacked elements
- Full-width buttons
- Bottom navigation

**Tablet (768px - 1023px):**
- Two columns where appropriate
- Larger buttons
- Side navigation option

**Desktop (> 1024px):**
- Multi-column layouts
- Sidebar navigation
- More context visible
- Optimized for mouse/trackpad

### Font Scaling

```css
/* Mobile */
html { font-size: 16px; }

/* Tablet */
@media (min-width: 768px) {
    html { font-size: 18px; }
}

/* Desktop */
@media (min-width: 1024px) {
    html { font-size: 20px; }
}
```

---

## Error States

### No Internet Connection

```
┌─────────────────────────────────────────┐
│                                         │
│              📡                         │
│                                         │
│     No Internet Connection              │
│                                         │
│     I need internet to check for scams. │
│                                         │
│     Please check your connection and    │
│     try again.                          │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Try Again                        │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Analysis Failed

```
┌─────────────────────────────────────────┐
│                                         │
│              😕                         │
│                                         │
│     Couldn't Complete Check             │
│                                         │
│     Something went wrong on my end.     │
│     Let's try that again.               │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Try Again                        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Call for Help Instead            │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Invalid Input

```
┌─────────────────────────────────────────┐
│                                         │
│  I couldn't find anything to check      │
│  in what you pasted.                    │
│                                         │
│  Could you try:                         │
│  • Pasting the full message             │
│  • Taking a photo instead               │
│  • Reading it to me                     │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Try a Different Way              │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

---

## Loading States

### Inline Loading

```
┌─────────────────────────────────────────┐
│  Your Recent Checks                     │
│                                         │
│  [Loading spinner] Loading...           │
│                                         │
└─────────────────────────────────────────┘
```

### Skeleton Screens

```
┌─────────────────────────────────────────┐
│  ┌───────────────────────────────────┐ │
│  │  ████████                         │ │
│  │  ██████                           │ │
│  └───────────────────────────────────┘ │
│  ┌───────────────────────────────────┐ │
│  │  ████████                         │ │
│  │  ██████                           │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

**Better than:** Blank screen or spinner alone

---

## Dark Mode (Optional)

### Color Adjustments

```css
@media (prefers-color-scheme: dark) {
    :root {
        --color-background: #121212;
        --color-surface: #1E1E1E;
        --color-text: #E0E0E0;
        --color-text-secondary: #A0A0A0;
        
        /* Keep safety colors recognizable */
        --color-safe: #4CAF50;
        --color-caution: #FF9800;
        --color-danger: #F44336;
    }
}
```

### Contrast Preservation

- Maintain contrast ratios in dark mode
- Reduce pure white (use off-white)
- Reduce pure black (use dark grey)
- Test with color blindness simulators

---

## Onboarding Flow

### First Launch

**Screen 1:**
```
┌─────────────────────────────────────────┐
│                                         │
│              🛡️                         │
│                                         │
│     Welcome to Senior Protect!          │
│                                         │
│     I'm here to help keep you safe      │
│     from online scams.                  │
│                                         │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Get Started                      │ │
│  └───────────────────────────────────┘ │
│                                         │
│           1 of 3                        │
└─────────────────────────────────────────┘
```

**Screen 2:**
```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│                                         │
│              📧                         │
│                                         │
│     I Check Messages for You            │
│                                         │
│     Send me emails, texts, or links     │
│     and I'll tell you if they're safe   │
│     or scams.                           │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Next                             │ │
│  └───────────────────────────────────┘ │
│                                         │
│           2 of 3                        │
└─────────────────────────────────────────┘
```

**Screen 3:**
```
┌─────────────────────────────────────────┐
│  ← Back                                 │
│                                         │
│              👥                         │
│                                         │
│     Optional: Connect Family            │
│                                         │
│     Let trusted family members see      │
│     when you're protected.              │
│     (You're always in control)          │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Connect Family                   │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [ Skip for Now ]                       │
│                                         │
│           3 of 3                        │
└─────────────────────────────────────────┘
```

### Tutorial Mode

**Available Anytime:**
- "Show Me How" button on complex screens
- Step-by-step walkthroughs
- Can exit anytime
- Never auto-play

---

## Notification Design

### Push Notification

**Structure:**
```
━━━━━━━━━━━━━━━━━━━━━━
Senior Protect

Scam Alert
We blocked a suspicious message claiming to be from your bank.

[View Details]
━━━━━━━━━━━━━━━━━━━━━━
```

**Types:**
- Scam blocked (immediate)
- Weekly summary
- New scam alert in area
- Family member checked in
- Security tip

### In-App Notification

```
┌─────────────────────────────────────────┐
│  [Icon] New Scam Alert                  │
│  "Tech support" scams are active in     │
│  Seattle. Be cautious of calls.         │
│                              [Dismiss] │
└─────────────────────────────────────────┘
```

**Placement:** Top of screen, dismissible

---

## Component Library Structure

### Atomic Design System

**Atoms:**
- Buttons
- Icons
- Text inputs
- Labels
- Badges

**Molecules:**
- Search bar
- Card header
- Form field with label
- Risk indicator

**Organisms:**
- Navigation bar
- Result card
- Settings panel
- Analysis form

**Templates:**
- Check flow
- Settings screen
- Results screen
- Home dashboard

**Pages:**
- Complete screens with real content

---

## Platform-Specific Considerations

### iOS

**Follow iOS Human Interface Guidelines:**
- Use native navigation patterns
- SF Symbols for icons
- iOS standard gestures
- Face ID / Touch ID integration
- iOS share sheet
- Haptic feedback

### Android

**Follow Material Design:**
- Material You theming
- Android navigation patterns
- Material icons
- Floating Action Button
- Android share sheet
- Material motion

### Web

**Progressive Enhancement:**
- Works without JavaScript
- Keyboard navigation
- Browser back button works
- Bookmark-able states
- Print-friendly

---

This UI/UX guideline provides comprehensive direction for creating an intuitive, accessible, and senior-friendly interface. All designs should prioritize clarity, safety, and user confidence above all else.
