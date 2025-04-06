/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {blocks} from './blocks/dialog';
import {forBlock} from './generators/javascript';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from './serialization';
import {toolbox} from './toolbox';
import './index.css';
import ollama from 'ollama/browser';

// Register the blocks and generator with Blockly
Blockly.common.defineBlocks(blocks);
Object.assign(javascriptGenerator.forBlock, forBlock);

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('code');
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');

if (!blocklyDiv) {
  throw new Error(`div with id 'blocklyDiv' not found`);
}
const ws = Blockly.inject(blocklyDiv, {toolbox});
const generator = new Blockly.CodeGenerator("generator");

let responseHistory: string[] = [];

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
  // get each dialog line and create the chat history
  const dialog_lines: Blockly.Block[] = ws.getAllBlocks(true).filter((block) => block.type === 'dialog_line');
  const prompt = constructPrompt(dialog_lines);
  console.log(prompt);
  if (codeDiv) {
    codeDiv.innerHTML = JSON.stringify(prompt);
  }
  handlePrompt(prompt);
};

const handlePrompt = (prompt: any) => {
  // call the ollama API with the constructed prompt
  ollama.chat({
    model: 'llama3.2:1b',
    messages: prompt,
  }).then((response) => {
    buildScript(response.message.content);
  }).catch((error) => {
    console.error('Error:', error);
    if (outputDiv) {
      outputDiv.innerHTML = 'Error: ' + error.message;
    }
  });
}

// constructs the prompt based on the blocks in the workspace
const constructPrompt = (dialog_lines: Blockly.Block[]) => {
  return constructPerspectivePrompt(dialog_lines);
  //return constructOmniscientPrompt(dialog_lines);
};

const constructOmniscientPrompt = (dialog_lines: Blockly.Block[]) => {

}

const constructPerspectivePrompt = (dialog_lines: Blockly.Block[]) => {
  let messages = [];
  const currLine = dialog_lines[dialog_lines.length-1];
  const currDialog = currLine.getChildren(true).filter((child) => child.type === 'dialog_text')[0];
  const currCharacter = currLine.getInputTargetBlock('character');
  messages.push({role: 'system', content: `You are a fictional character named ${currCharacter?.getFieldValue('name')}. Your personality can be described as "${currCharacter?.getFieldValue('characteristics')}". You are having a conversation with another character.`});

  // get each prior dialog line and create the chat history
  for (const block of dialog_lines.slice(0, dialog_lines.length-1)) {
    const character = block.getInputTargetBlock('character');
    const dialog = block.getChildren(true).filter((child) => child.type === 'dialog_text')[0];
    const role = character?.getFieldValue('name') === currCharacter?.getFieldValue('name') ? 'assistant' : 'user';
    messages.push({role: `${role}`, content: `${character}: ${dialog?.getFieldValue('prompt')}`});
  }

  // conditionally control response prompt based on if this is the first line
  if (messages.length <= 1) {
    messages.push({role: 'user', content: `You start by saying a line of dialog as ${currCharacter?.getFieldValue('name')}, based on the following prompt: "${currDialog.getFieldValue('prompt')}".`});
  } else if (currDialog) {
    messages.push({role: 'user', content: `You now respond with a line of dialog as ${currCharacter?.getFieldValue('name')}, based on the conversation so far and on the following prompt: "${currDialog.getFieldValue('prompt')}".`});
  }
  return messages;
}

const buildScript = (response: string) => {
  // clear the output div
  if (outputDiv) {
    outputDiv.innerHTML = '';
  }

  // add the response to the history
  responseHistory.push(response);

  // add the response to the output div
  if (outputDiv) {
    const responseDiv = document.createElement('div');
    responseDiv.className = 'response';
    responseDiv.innerHTML = response;
    outputDiv.appendChild(responseDiv);
  }
}

// initial startup work
if (ws) {
  // Load the initial state from storage and run the code.
  load(ws);
  runCode();

  // Every time the workspace changes state, save the changes to storage.
  ws.addChangeListener((e: Blockly.Events.Abstract) => {
    // UI events are things like scrolling, zooming, etc.
    // No need to save after one of these.
    if (e.isUiEvent) return;
    save(ws);
  });

    // add change listener to the run button
  document.getElementById('run-button')?.addEventListener('click', () => {
    console.log('Run button clicked');
    runCode();
  });

  // // Whenever the workspace changes meaningfully, run the code again.
  // ws.addChangeListener((e: Blockly.Events.Abstract) => {
  //   // Don't run the code when the workspace finishes loading; we're
  //   // already running it once when the application starts.
  //   // Don't run the code during drags; we might have invalid state.
  //   if (
  //     e.isUiEvent ||
  //     e.type == Blockly.Events.FINISHED_LOADING ||
  //     ws.isDragging()
  //   ) {
  //     return;
  //   }
  //   runCode();
  // });
}
