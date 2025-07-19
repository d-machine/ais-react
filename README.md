# Web

This document defines the conventions, file structure, and best practices to be followed

---

## 📁 Project Structure

```
as./src/
├── api
│ ├── api.ts # API 
├── components
│ └──  # Reusable UI components 
├── helper
│ └──  # General-purpose helper functions
├── hooks
│ └──  # Custom React hooks
├── lib
│ └──  # Third-party libraries or wrappers
├── main.tsx # App entry point
├── pages
│ ├── App.module.css # Styles for the main App
│ └── App.tsx # Root component
├── services
│ └──  #  service layer
├── styles
│ └──  # Global and shared styles
├── utils
│ └──  # Utility functions
└── vite-env.d.ts # TypeScript definitions for Vite
```


---


## 🧠 Naming Conventions

### 🔧 Functions

- Use **CamelCase** (PascalCase) for function names.

eg-
```ts
function FetchUserProfile() { ... }
function HandleLoginResponse() { ... }
```

Here is the updated `README.md` for your `exp-file` project, now including the full folder structure under `./src/`:

### 🧮 Variables

* Use **smallCamel** (camelCase) for variable names.

```ts
let userToken: string;
const isProfileComplete = true;
```

---

## 🎨 CSS / SCSS / Modules

* Use **kebab-case** for file and class names.
* Prefer **CSS Modules** for component styles.

```css
/* App.module.css */
.header-container { ... }
.login-form__input--focused { ... }
```

---

## 📁 Folder & File Naming

* Use **kebab-case** for folder and file names.
* Group logically related files in folders.

```bash
components/
  └── user-card/
      ├── user-card.tsx
      └── user-card.module.css
```

---

## ⚙️ Code Best Practices

* **DRY**: Don’t Repeat Yourself.
* Modularize: Component, Logic, API, Utility separation.
* Use TypeScript for all files (`.tsx` / `.ts`).
* Write meaningful commit messages.

---
