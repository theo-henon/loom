# Ideas — Loom

> Parking lot for future ideas, improvements, planned integrations.
> No sorting, no prioritization — a living list.
> Ideas that become concrete leave this file for either VISION.md (if
> strategic) or direct implementation via `/spec` in the IDE (if tactical).

---

## Ideas

### Shareable scenario links
**Context:** Surfaced during project exploration — sharing scenarios between learners would increase the pedagogical value.
**Value:** A teacher could send a pre-built scenario link to students; students could share their own creations.
**Estimated effort:** Medium
**Dependencies:** Some form of scenario serialization (JSON) + URL encoding or a simple persistence layer.
**Date:** 2026-06-29

---

### Community scenario library
**Context:** Logical extension of the pre-built scenarios — a place to discover and contribute scenarios.
**Value:** Grows the pedagogical value without extra work from the core team; scenarios covering mutex, semaphores, producer/consumer, etc.
**Estimated effort:** Heavy
**Dependencies:** Shareable scenario links, some backend or GitHub-based storage.
**Date:** 2026-06-29

---

### Export scenarios as real code
**Context:** Raised during initial project setup — generating real code (Python, Java, Go) from block-based programs.
**Value:** Bridges the gap between visual learning and real-world coding; learners see the direct translation.
**Estimated effort:** Heavy
**Dependencies:** A well-defined block semantics model (needed anyway) + code generation templates per language.
**Date:** 2026-06-29

---

### Speed control for execution
**Context:** A natural UX improvement for the visualization.
**Value:** Users can slow down or speed up execution to observe fast-moving scenarios more easily.
**Estimated effort:** Quick
**Dependencies:** Phase 1.2 execution engine.
**Date:** 2026-06-29

---

### Mutex / semaphore blocks
**Context:** Covering the synchronization primitives that solve race conditions.
**Value:** Completes the concurrency curriculum — students learn the problem (race condition) and the solution (mutex).
**Estimated effort:** Medium
**Dependencies:** Phase 1.2 execution engine with a `blocked` state per thread.
**Date:** 2026-06-29

---

*More ideas will be added during `/spec` sessions when something surfaces without being MVP priority.*
