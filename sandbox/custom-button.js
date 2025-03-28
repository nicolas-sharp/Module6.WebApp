// custom-button.js
class CustomButton extends HTMLElement {
    static get observedAttributes() {
      return ['color', 'rounded', 'disabled'];
    }
  
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `
        <style>
          button {
            padding: 10px 20px;
            background: ${this.getAttribute('color') || '#4CAF50'};
            color: white;
            border: none;
            border-radius: ${this.hasAttribute('rounded') ? '20px' : '4px'};
            cursor: pointer;
          }
          button:disabled {
            background: #cccccc !important;
            cursor: not-allowed;
          }
        </style>
        <button ${this.hasAttribute('disabled') ? 'disabled' : ''}>
          <slot></slot>
        </button>
      `;
    }
  
    attributeChangedCallback(name, oldValue, newValue) {
      const button = this.shadowRoot.querySelector('button');
      if (name === 'color') {
        button.style.background = newValue;
      }
      if (name === 'rounded') {
        button.style.borderRadius = newValue !== null ? '20px' : '4px';
      }
      if (name === 'disabled') {
        button.disabled = newValue !== null;
      }
    }
  }
  
  customElements.define('custom-button', CustomButton);