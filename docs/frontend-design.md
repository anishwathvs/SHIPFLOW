# 3D Logistics Frontend Design & Architecture Blueprint

## 1. Overview & Creative Vision

The frontend for the **Shipment Management System** is designed as a **cinematic, high-tech 3D Logistics Command Center**. Rather than a static, flat admin table, the interface combines real-time data visualization with an interactive WebGL/Three.js 3D viewport that brings shipments, global routes, and logistics nodes to life.

---

## 2. Visual Theme & Design Tokens

### Color Palette (Dark Mode Cinematic)
- **Obsidian Space (Canvas Base)**: `#090b10` / `#0f141f`
- **Glassmorphic Surface**: `rgba(18, 24, 38, 0.72)` with `backdrop-filter: blur(16px)`
- **Cyan Cyber Arc (In-Transit)**: `#00e5ff` (Glow: `rgba(0, 229, 255, 0.4)`)
- **Emerald Pulse (Delivered)**: `#00e676` (Glow: `rgba(0, 230, 118, 0.4)`)
- **Amber Warning (Created)**: `#ffb300` (Glow: `rgba(255, 179, 0, 0.4)`)
- **Crimson Alert (Cancelled)**: `#ff5252` (Glow: `rgba(255, 82, 82, 0.4)`)
- **Text Primary**: `#f1f5f9` (Inter / Outfit typography)
- **Text Secondary**: `#94a3b8`

---

## 3. 3D WebGL / Three.js Visual Elements

### A. Interactive 3D Logistics Globe & Hub
- **Wireframe & Dot Matrix Sphere**: Rotating dark globe with procedural city nodes connected by glowing Great-Circle cubic bezier arcs.
- **Dynamic Flight / Transit Particles**: Glowing pulse photons travelling along route lines from `source` to `destination`.
- **Selected Shipment Focus**: Clicking any shipment card in the table smoothly animates the Three.js camera (using cubic easing) to focus on that shipment's specific transit route.

### B. 3D Package / Cargo Visualizer (In Form)
- When the user types or slides the package **weight (kg)** in the creation form, a 3D isometric package container scales dynamically in real-time with smooth spring physics, reflecting weight tier changes and calculated cost.

### C. Mouse Parallax & Atmospheric Lighting
- Subtle mouse pointer-driven parallax tilts the 3D scene gently, creating depth without causing motion sickness.
- Bloom and ambient occlusion shaders give illuminated arcs a neon edge.

---

## 4. UI Components & Layout Hierarchy

```
┌────────────────────────────────────────────────────────────────────────┐
│  [Logo] NEXTGEN LOGISTICS      [API: Connected (Port 8080)]   [+ New]  │
├──────────────────────────────────┬─────────────────────────────────────┤
│                                  │                                     │
│     INTERACTIVE 3D GLOBE /       │       QUICK ACTION HUD              │
│       ROUTE NETWORK HUD          │  • Live Weight Cost Calculator      │
│   (Three.js WebGL Viewport)      │  • Active Transit Telemetry         │
│   • Orbit / Pan Controls         │  • Live Revenue Counter             │
│   • Route Arc Visualizer         │                                     │
│                                  │                                     │
├──────────────────────────────────┴─────────────────────────────────────┤
│  KPI METRICS:  [Total: 14]   [Transit: 6]   [Delivered: 7]  [Cost: ₹3.4k]
├────────────────────────────────────────────────────────────────────────┤
│  SEARCH & FILTER: [ Search ID / City... ]  [ALL] [TRANSIT] [DELIVERED] │
├────────────────────────────────────────────────────────────────────────┤
│  SHIPMENTS DATA GRID:                                                  │
│  ┌────────┬─────────────┬───────────┬────────┬─────────┬────────────┐  │
│  │ ID     │ ROUTE       │ PACKAGE   │ WEIGHT │ COST    │ STATUS     │  │
│  ├────────┼─────────────┼───────────┼────────┼─────────┼────────────┤  │
│  │ SH101  │ MAA -> BLR  │ Microchip │ 3.5 kg │ ₹100.00 │ IN_TRANSIT │  │
│  └────────┴─────────────┴───────────┴────────┴─────────┴────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Performance, Optimization & Accessibility

1. **Target 60 FPS**:
   - Geometries generated once with BufferGeometry.
   - Instanced meshes for route markers.
   - Render loop throttles down to low-power idle when no interaction occurs for 3 seconds.
2. **Lazy Loading**:
   - WebGL scene initializes after core DOM paint to guarantee instant Largest Contentful Paint (LCP).
3. **Reduced-Motion Support**:
   - Detects `prefers-reduced-motion: reduce` and disables orbit rotation and heavy particle animations in favor of static high-contrast graphics.
4. **Mobile & Low-End GPU Fallback**:
   - Detects WebGL capabilities; if unavailable, seamlessly renders a clean 2D vector transit map with SVG route lines.

---

## 6. Frontend ↔ Java REST API Integration Flow

- **Fetch Shipments**: Calls `GET /api/shipments` on mount; renders both table cards and 3D globe route coordinates.
- **Add Shipment**: Live calls `GET /api/calculate-cost?weight={w}` as user slides weight; submits `POST /api/shipments` on form save with instant UI optimistic update and glowing arc spawn.
- **Update Status**: Modal triggers `PATCH /api/shipments/{id}/status`; updates badge color and 3D particle state immediately.
