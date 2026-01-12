// assets/component-custom-sleeves.js
import { Component } from '@theme/component';

/**
 * A custom element that manages custom sleeves selection
 * Ensures only one sleeve option can be selected at a time (radio-like behavior)
 * Adds line item properties to the product form when a sleeve is selected
 * @extends Component
 */
class CustomSleevesComponent extends Component {
  #hiddenInputs = new Map();

  connectedCallback() {
    super.connectedCallback();
    this.#initializeCheckboxes();
  }

  /**
   * Initializes checkbox event listeners
   */
  #initializeCheckboxes() {
    const checkboxes = this.querySelectorAll('.custom-sleeves__checkbox');
    
    checkboxes.forEach((checkbox) => {
      checkbox.addEventListener('change', (event) => {
        this.#handleCheckboxChange(event);
      });
    });
  }

  /**
   * Handles checkbox change event
   * Ensures only one checkbox is selected at a time
   * @param {Event} event - The change event
   */
  #handleCheckboxChange(event) {
    const checkedCheckbox = /** @type {HTMLInputElement} */ (event.target);
    if (!checkedCheckbox) return;
    
    const allCheckboxes = this.querySelectorAll('.custom-sleeves__checkbox');
    
    if (checkedCheckbox.checked) {
      // Uncheck all other checkboxes
      allCheckboxes.forEach((checkbox) => {
        const inputCheckbox = /** @type {HTMLInputElement} */ (checkbox);
        if (inputCheckbox !== checkedCheckbox) {
          inputCheckbox.checked = false;
          this.#removeHiddenInputs(inputCheckbox);
        }
      });
      
      // Add hidden inputs for the selected sleeve
      this.#addHiddenInputs(checkedCheckbox);
    } else {
      // Remove hidden inputs when unchecked
      this.#removeHiddenInputs(checkedCheckbox);
    }
  }

  /**
   * Adds hidden inputs to the product form for line item properties
   * @param {HTMLInputElement} checkbox - The checked checkbox
   */
  #addHiddenInputs(checkbox) {
    const formId = this.dataset.productFormId;
    if (!formId) return;
    
    const form = document.getElementById(formId);
    if (!form || !(form instanceof HTMLFormElement)) return;

    // Remove any existing hidden inputs first
    this.#removeHiddenInputs(checkbox);

    const sleeveTitle = checkbox.dataset.sleeveTitle || '';
    const sleeveSubtitle = checkbox.dataset.sleeveSubtitle || '';
    const sleevePrice = checkbox.dataset.sleevePrice || '';

    // Create hidden inputs for line item properties
    const properties = [
      { name: 'properties[Custom Sleeves]', value: sleeveTitle },
      { name: 'properties[Custom Sleeves Subtitle]', value: sleeveSubtitle },
      { name: 'properties[Custom Sleeves Price]', value: sleevePrice },
      { name: 'properties[Custom Sleeves Status]', value: 'Approval Pending' }
    ];

    properties.forEach((property) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = property.name;
      input.value = property.value;
      input.setAttribute('data-custom-sleeves-input', checkbox.value);
      
      form.appendChild(input);
      this.#hiddenInputs.set(`${checkbox.value}-${property.name}`, input);
    });
  }

  /**
   * Removes hidden inputs from the product form
   * @param {HTMLInputElement} checkbox - The checkbox whose inputs should be removed
   */
  #removeHiddenInputs(checkbox) {
    const formId = this.dataset.productFormId;
    if (!formId) return;
    
    const form = document.getElementById(formId);
    if (!form || !(form instanceof HTMLFormElement)) return;

    // Remove inputs by data attribute
    const inputsToRemove = form.querySelectorAll(
      `input[data-custom-sleeves-input="${checkbox.value}"]`
    );
    
    inputsToRemove.forEach((input) => {
      const inputElement = /** @type {HTMLInputElement} */ (input);
      inputElement.remove();
      const key = `${checkbox.value}-${inputElement.name}`;
      this.#hiddenInputs.delete(key);
    });
  }
}

customElements.define('custom-sleeves-component', CustomSleevesComponent);
