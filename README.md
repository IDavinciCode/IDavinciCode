# Igor Davinci

**Automation & Commissioning Engineer** — packaging machinery, Italy.

I write the software that runs automatic packaging machines, and then I go on site and prove it works. Four years across roughly 24 PLC projects on Siemens, Omron and Rockwell platforms, with commissioning and customer acceptance testing in **7 countries across Europe and North America**.

Most of what I build lives behind an NDA, so this profile is mostly private repositories. What follows is what I work on.

---

### On the machine

- **Siemens S7-1500 / TIA Portal** — modular state-machine architectures, LAD and SCL
- **PLCopen motion control** — gearing, superimposed moves, axis managers, phase recovery
- **Functional safety** — Pilz PNOZmulti 2, Siemens F-CPU, PROFIsafe, speed monitoring and SLS
- **HMI** — WinCC Unified, WinCC Comfort, OPC UA
- **Field work** — customer acceptance testing in full autonomy, fault diagnosis, remote support over VPN

Also: Siemens STEP 7 on the classic S7-300 platform (still a large installed base, and retrofit work), Rockwell Logix 5000, Omron Sysmac Studio and CX-One, CODESYS, EPLAN.

---

### Ð-Unit — tooling for industrial automation

A desktop suite I build on my own time, to automate the parts of commissioning that are still done by hand.

- **Manifest-based microkernel.** The core knows no module by name. Adding a module is a folder and a manifest, with zero changes to the core.
- **Layering enforced by tests.** An architecture test fails the build if a layer imports upward. Not a documented convention, a verified one.
- **265 tests** on the suite, plus a domain benchmark with frozen ground truth.
- **Structured extraction engine.** Converts technical documentation into validated checklists. Accuracy tracked from 72% to **100% top-1** on a frozen benchmark set with verified ground truth.
- **Measured effect.** I/O verification for one machine goes from about two working days to under an hour.

Built with Python, SQL Server and SQLite, OPC UA, JavaScript, and a Tauri desktop shell.

Honest about the limits: single developer, tests run locally with no CI, packaged as a desktop app rather than published, partial type hints.

---

### Why it matters

I work in an environment with no formal software standards and no code review. Conventions travel by word of mouth and by copying from similar machines. Ð-Unit is the answer to that: the tooling that makes verifiable what would otherwise depend on who remembers what.

---

### Writing

A field manual for people entering industrial automation, in Italian. Seventeen chapters covering mechanics, control panel electrics, industrial networks, cybersecurity and functional safety, built around the incoming EU Machinery Regulation 2023/1230.

The rule I set for myself: if a junior uses it with their eyes and hands on the machine, it goes in the book. If it only serves whoever designs or calculates, it gets named and referenced.

Six chapters done. Work in progress.

---

📍 Faenza, Italy · 🇮🇹 🇧🇷 Italian and Portuguese native · Available for international travel

[LinkedIn](https://www.linkedin.com/in/igordavinci)
