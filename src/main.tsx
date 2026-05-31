import { render } from "preact";
import "./index.css";
import App from "./App";
import { getCurrentWebview } from "@tauri-apps/api/webview";
import { bus } from "./services/eventBus";

async function setupGlobalDragDrop() {
  try {
    const webview = getCurrentWebview();
    await webview.onDragDropEvent((event) => {
      switch (event.payload.type) {
        case 'enter':
        case 'over':
          bus.emit('native-drag-enter');
          break;
        case 'leave':
          bus.emit('native-drag-leave');
          break;
        case 'drop':
          bus.emit('native-drag-leave');
          const pdfs = event.payload.paths.filter(p => p.toLowerCase().endsWith('.pdf'));
          if (pdfs.length > 0) {
            bus.emit('native-drop', pdfs);
          }
          break;
      }
    });
  } catch (err) {
    console.error("Global DND Setup Failed:", err);
  }
}

setupGlobalDragDrop();

render(<App />, document.getElementById("root")!);
