# OPD Queue Management System

A real-time OPD queue management system designed to digitize first-come-first-served hospital workflows without disrupting operations.

## Tech Stack
- React.js (Patient PWA + Reception Web App)
- Node.js + Express
- Firebase Authentication
- Firebase Firestore (real-time)

## Current Status
- Backend initialized
- Firebase Admin connected and verified

🔐 Phase 0 – Authentication & Roles (Completed & Locked)

• Firebase Authentication used for login
• Backend verifies Firebase ID tokens
• UID is extracted and attached to every request

User roles are stored in Firestore:
• patient
• reception

Design decisions:
• Tokens are used only for authentication
• Roles and permissions are fetched from Firestore
• Prevents fragile token-based role handling

🏥 Phase 1 – Core Entities (Completed & Locked)
Hospitals

• Name
• Location
• Active status

Doctors

• Linked to hospital via hospitalId
• Specialization
• Average consultation time
• Working hours
• Active status

Key decisions:
• doctorId is always the Firestore document ID
• hospitalId is derived from the doctor, never from token

Available APIs:
• Get all hospitals
• Get doctors by hospital
• Reception can see only doctors of their hospital

🚦 Phase 2 – Queue Engine (Completed & Locked)

Core ideas:
• One queue per doctor per day
• Strict FIFO ordering
• Queue is independent of UI

Queue Data

• Doctor ID
• Hospital ID
• Date
• Status
• Current index
• Delay minutes
• Booking open/close flag

Appointment Data

• Queue ID
• Doctor ID
• Hospital ID
• Patient ID (null for walk-ins)
• Patient name
• Queue number
• Status

Important design decision:
• Booking an appointment = joining the queue
• No separate “appointment booking” system

Queue guarantees:
• FIFO order never breaks
• Online and reception bookings coexist
• No role leakage
• No hacks

⏱ Phase 3 – Appointment Lifecycle & ETA Engine (Current)

Phase 3 makes the system behave like a real hospital OPD.

🧠 Appointment States (Simplified & Realistic)

Only four states are used:

• booked – patient joined queue but has not arrived
• checked_in – patient arrived at hospital
• waiting – patient missed turn and was skipped
• completed – consultation finished

Removed intentionally:
• no sent-to-doctor
• no cancelled
• no no-show

Reason:
• Real OPDs do not micromanage states
• Queue flow matters more than labels

🏃 Queue Movement Logic

Reception has one primary action:
• Send Next Patient

What happens:
• Previous patient is marked completed
• If next patient is not checked-in, they are auto-moved to waiting
• Queue index increments
• ETAs are recalculated

Key rule:
• Queue moves only by reception action
• Queue never stalls

⏳ Waiting Logic

• If patient is not checked-in at their turn, system auto-moves them to waiting
• Queue immediately proceeds to next patient
• If patient arrives later the same day:
– Reception can check them in
– Patient can be added back near the top

This mirrors real OPD behavior.

⏱ ETA Engine (Core Feature)

ETA purpose:
• Tells patients when they should expect to be called

ETA calculation:
• Current time
• Plus people ahead multiplied by doctor’s average consultation time
• Plus any manual delay

Important points:
• ETA is calculated only on backend
• Frontend never calculates ETA
• ETA is cached but recalculated dynamically

ETA updates when:
• Patient joins queue
• Reception sends next patient
• Patient is skipped to waiting
• Delay is added or removed
• Patient checks in

🛠 Phase 3 APIs Implemented

• Check-in patient
• Send next patient
• Add delay (emergency handling)
• End OPD day

Design rules followed:
• IDs are derived from database whenever possible
• Client is never trusted for critical identifiers
• Routes are REST-correct and safe

🌅 End of Day Handling

• Reception manually ends OPD day
• All remaining appointments are cleared
• Queue is closed
• No further bookings allowed

Next day behavior:
• Reception initializes a fresh queue
• No carry-over of appointments
• Prevents legal and operational issues

🔒 System Design Principles

• Firestore is the single source of truth
• Authentication ≠ authorization
• Simple state machine over complex workflows
• Human-controlled queue movement
• Automation only where it removes human error
• Designed for real hospitals, not demos

✅ Current Status

• Authentication stable
• Roles enforced
• Queue engine solid
• Waiting logic works
• ETA dynamic and accurate
• Phase 3 operational

🚀 Future Roadmap

• Emergency pause and resume
• Slot booking
• Multi-day appointments
• SMS and notifications
• System logs and analytics
