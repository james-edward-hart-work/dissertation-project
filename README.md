# Welcome to James Hart's Dissertation Project
*University of St Andrews - BSc Computer Science - Class of 2025*

My dissertation was to create a tool for visualising and simulating finite state automata, to assist education at the University of St Andrews. 

Users may create and simulate input on both **deterministic** and **non-deterministic** finite automata through two graphical interaction methods:
- Hotkeys 
- Context Menu

See **documentation/UserManual.pdf** for full usage instructions.

For further detail, please see **documentation/DissertationReport.pdf**, which contains my final dissertation submission, including background, design and technology decisions with trade-offs, and evaluation.

## Technology Stack

- **Language:** JavaScript (ES6+)
- **Frontend:** React, Next.js (App Router)
- **Backend / Runtime:** Node.js
- **Styling:** CSS Modules, Tailwind CSS
- **Testing:** Jest, React Testing Library
- **Tooling:** npm, ESLint

## Note for Recruiters
The project emphasises maintainability, modular design, testability and user-focused design by demonstrating:

- An interactive web application built for students and staff.
- Componentised dynamic UI, through state management, hooks and function components in React.
- Automated unit testing with Jest and React Testing Library.
- Clear project structure and version control history.
- Following the interaction design process and Jakob Nielsen’s 10 Usability Heuristics, supported by an open survey of students and staff with iterative usability improvements based on their feedback.

## Install All Node Modules
```npm install```

## Run The Application  - After Installing Dependencies
```npm run build```

```npm run start```

## Run Unit Tests

```npm run test```

## Generate Code Coverage Report

```npm run coverage```