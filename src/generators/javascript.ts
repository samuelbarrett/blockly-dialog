/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Order} from 'blockly/javascript';
import * as Blockly from 'blockly/core';

// Export all the code generators for our custom blocks,
// but don't register them with Blockly yet.
// This file has no side effects!
export const forBlock = Object.create(null);

forBlock['dialog_line'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  // TODO: change Order.ATOMIC to the correct operator precedence strength
  const value_character = generator.valueToCode(block, 'character', Order.ATOMIC);
  const statement_dialog = generator.statementToCode(block, 'dialog');

  // TODO: Assemble javascript into the code variable.
  const code = `{character: ${value_character}, dialog: ${statement_dialog}}`;
  return JSON.stringify(code);
}

forBlock['dialog_text'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const text_prompt = block.getFieldValue('prompt');

  const code = {
    prompt: text_prompt,
  };
  return JSON.stringify(code);
}

forBlock['character'] = function(
  block: Blockly.Block,
  generator: Blockly.CodeGenerator,
) {
  const text_name = block.getFieldValue('name');
  const text_characteristics = block.getFieldValue('characteristics');

  const code = {
    name: text_name,
    characteristics: text_characteristics
  };
  return [JSON.stringify(code), Order.ATOMIC];
}