/**
 * Copyright (c) 2006-2015, JGraph Ltd
 * Copyright (c) 2006-2015, Gaudenz Alder
 * Updated to ES9 syntax by David Morrissey 2021
 * Type definitions from the typed-mxgraph project
 */

import Client from "src/Client";
import InternalEvent from "src/view/event/InternalEvent";
import { write, writeln } from "../util/domUtils";
import Resources from "../util/Resources";

/**
 * A simple class for creating HTML forms.
 *
 * @class MaxForm
 */
class MaxForm {
  constructor(className: string) {
    this.table = document.createElement('table');
    this.table.className = className;
    this.body = document.createElement('tbody');

    this.table.appendChild(this.body);
  }

  /**
   * Holds the DOM node that represents the table.
   */
  table: HTMLTableElement;

  /**
   * Holds the DOM node that represents the tbody (table body). New rows
   * can be added to this object using DOM API.
   */
  body: HTMLElement;

  /**
   * Returns the table that contains this form.
   */
  getTable(): HTMLTableElement {
    return this.table;
  }

  /**
   * Helper method to add an OK and Cancel button using the respective
   * functions.
   */
  addButtons(okFunct: Function, cancelFunct: Function): void {
    const tr = document.createElement('tr');
    let td = document.createElement('td');
    tr.appendChild(td);
    td = document.createElement('td');

    // Adds the ok button
    let button = document.createElement('button');
    write(button, Resources.get('ok') || 'OK');
    td.appendChild(button);

    InternalEvent.addListener(button, 'click', () => {
      okFunct();
    });

    // Adds the cancel button
    button = document.createElement('button');
    write(button, Resources.get('cancel') || 'Cancel');
    td.appendChild(button);

    InternalEvent.addListener(button, 'click', () => {
      cancelFunct();
    });

    tr.appendChild(td);
    this.body.appendChild(tr);
  }

  /**
   * Adds an input for the given name, type and value and returns it.
   */
  addText(name: string, value: any, type: string='text'): HTMLInputElement {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.value = value;

    return <HTMLInputElement>this.addField(name, input);
  }

  /**
   * Adds a checkbox for the given name and value and returns the textfield.
   */
  addCheckbox(name: string, value: boolean): HTMLInputElement {
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    this.addField(name, input);

    // IE can only change the checked value if the input is inside the DOM
    if (value) {
      input.checked = true;
    }
    return input;
  }

  /**
   * Adds a textarea for the given name and value and returns the textarea.
   */
  addTextarea(name: string, value: string, rows: number): HTMLTextAreaElement {
    const input = document.createElement('textarea');

    if (Client.IS_NS) {
      rows--;
    }

    input.setAttribute('rows', String(rows || 2));
    input.value = value;

    return <HTMLTextAreaElement>this.addField(name, input);
  }

  /**
   * Adds a combo for the given name and returns the combo.
   */
  addCombo(name: string, isMultiSelect: boolean, size?: number): HTMLSelectElement {
    const select = document.createElement('select');

    if (size != null) {
      select.setAttribute('size', String(size));
    }

    if (isMultiSelect) {
      select.setAttribute('multiple', 'true');
    }

    return <HTMLSelectElement>this.addField(name, select);
  }

  /**
   * Adds an option for the given label to the specified combo.
   */
  addOption(combo: HTMLElement, label: string, value: any, isSelected?: boolean): void {
    const option = document.createElement('option');

    writeln(option, label);
    option.setAttribute('value', value);

    if (isSelected) {
      option.setAttribute('selected', String(isSelected));
    }

    combo.appendChild(option);
  }

  /**
   * Adds a new row with the name and the input field in two columns and
   * returns the given input.
   */
  addField(name: string, input: Element): Element {
    const tr = document.createElement('tr');
    let td = document.createElement('td');
    write(td, name);
    tr.appendChild(td);

    td = document.createElement('td');
    td.appendChild(input);
    tr.appendChild(td);
    this.body.appendChild(tr);

    return input;
  }
}

export default MaxForm;
