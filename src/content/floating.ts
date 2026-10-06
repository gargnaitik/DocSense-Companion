import { MESSAGE_TYPES } from '../utils/constants';

let hostElement: HTMLElement | null = null;

export function injectFloatingButton() {
  if (hostElement) return;

  hostElement = document.createElement('div');
  hostElement.id = 'docsense-floating-host';
  // Use shadow DOM to prevent styles from bleeding in/out
  const shadow = hostElement.attachShadow({ mode: 'closed' });

  const style = document.createElement('style');
  style.textContent = `
    .docsense-btn-container {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      display: flex;
      align-items: center;
      font-family: system-ui, -apple-system, sans-serif;
    }
    .docsense-btn {
      background: linear-gradient(135deg, #7c3aed 0%, #6366f1 100%);
      color: white;
      border: none;
      border-radius: 9999px;
      padding: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      box-shadow: 0 4px 14px 0 rgba(124, 58, 237, 0.39);
      transition: all 0.2s ease;
      overflow: hidden;
      width: 48px;
      height: 48px;
    }
    .docsense-btn:hover {
      width: 180px;
      padding: 12px 20px;
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(124, 58, 237, 0.4);
    }
    .docsense-btn svg {
      width: 24px;
      height: 24px;
      flex-shrink: 0;
    }
    .docsense-text {
      white-space: nowrap;
      font-weight: 600;
      font-size: 14px;
      opacity: 0;
      transition: opacity 0.2s ease;
      transition-delay: 0.1s;
    }
    .docsense-btn:hover .docsense-text {
      opacity: 1;
    }
    .docsense-close {
      position: absolute;
      top: -8px;
      right: -8px;
      background: #333;
      color: white;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 2px solid white;
      font-size: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s;
    }
    .docsense-btn-container:hover .docsense-close {
      opacity: 1;
    }
  `;

  const container = document.createElement('div');
  container.className = 'docsense-btn-container';

  const button = document.createElement('button');
  button.className = 'docsense-btn';
  button.title = 'Save to DocSense';
  
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2v20"></path>
      <path d="M17 5H9.5a3.5 3.5 3.5 0 0 0 0 7h5a3.5 3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
    <span class="docsense-text">Save to DocSense</span>
  `;

  const closeBtn = document.createElement('div');
  closeBtn.className = 'docsense-close';
  closeBtn.innerHTML = '✕';
  closeBtn.title = 'Hide this button';

  button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: MESSAGE_TYPES.SAVE_PAGE });
  });

  closeBtn.addEventListener('click', () => {
    removeFloatingButton();
    chrome.storage.local.get('docsense_settings', (data) => {
      const settings = data.docsense_settings || {};
      chrome.storage.local.set({ docsense_settings: { ...settings, floatingButton: false } });
    });
  });

  container.appendChild(button);
  container.appendChild(closeBtn);
  shadow.appendChild(style);
  shadow.appendChild(container);
  
  document.body.appendChild(hostElement);
}

export function removeFloatingButton() {
  if (hostElement) {
    hostElement.remove();
    hostElement = null;
  }
}
