import * as Blockly from 'blockly/core';

const dialogLine = {
  type: 'dialog_line',
  tooltip: 'Define a line of dialog spoken by a character.',
  helpUrl: '',
  message0: 'Character: %1 Dialog: %2',
  args0: [
    {
      type: 'input_value',
      name: 'character',
      check: 'Character'
    },
    {
      type: 'input_statement',
      name: 'dialog',
      check: 'String'
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 240
};

const dialogText = {
  type: 'dialog_text',
  tooltip: 'Describe something this character will say',
  helpUrl: '',
  message0: 'The robot says: %1 %2',
  args0: [
    {
      type: 'field_input',
      name: 'prompt',
      text: 'What will they say?'
    },
    {
      type: 'input_dummy',
      name: 'text_description'
    }
  ],
  previousStatement: null,
  nextStatement: null,
  colour: 300
};

const character = {
  type: "character",
  tooltip: "Describes a recurring character for your dialog, including personality, mood, or appearance.",
  helpUrl: "",
  message0: "Name:  %1 %2 ------------- Attributes ------------- %3 Description: %4 %5",
  args0: [
    {
      type: "field_input",
      name: "name",
      text: "Enter name"
    },
    {
      type: "input_dummy",
      name: "name_field"
    },
    {
      type: "input_dummy",
      name: "attributes_label"
    },
    {
      type: "field_input",
      name: "characteristics",
      text: "Describe this character"
    },
    {
      type: "input_dummy",
      name: "description"
    }
  ],
  output: null,
  colour: 120
};

export const blocks = Blockly.common.createBlockDefinitionsFromJsonArray([
    dialogLine, dialogText, character
]);