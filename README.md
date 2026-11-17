# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


## Static project demos

The existing Pages workflow also publishes four independent demo routes from `public/`:

- `/fog-map/`: recorded ambiguity report and source evidence.
- `/dynaflow-orchestrator/`: recorded real-model benchmark and workflow explorer.
- `/popup-optimizer/`: interactive browser-only optimizer over synthetic Dallas data.
- `/statebench-harness/`: real two-model results and model/tool comparisons.

The research viewers display saved measurements; new model experiments run through the Python CLIs. Generated demo assets are isolated from the existing home-page application. The source build session and measurement provenance are preserved in [portfolio/prototype-lab](https://github.com/veermshah/portfolio/tree/main/prototype-lab).
