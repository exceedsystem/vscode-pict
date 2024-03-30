import { spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';

const asyncFs = fs.promises;

const OPTION_LABEL: string = '# Options ';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('pict.run', async () => {
    if (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.document) {
      await vscode.window.showErrorMessage('Document is not open.');
      return;
    }
    const textEditor = vscode.window.activeTextEditor;
    const document = textEditor?.document;

    if (!document?.fileName || !fs.existsSync(document?.fileName) || document?.isDirty) {
      await vscode.window.showErrorMessage('Please save the document before running pict.');
      return;
    }

    const inputFilePath = document?.fileName;

    const eol = document.eol === vscode.EndOfLine.LF ? '\r' : '\r\n';

    const editorText = (await asyncFs.readFile(inputFilePath!)).toString();
    const pictParams = (
      editorText
        .split(eol)
        .filter((s) => s.startsWith(OPTION_LABEL))
        .at(0)
        ?.substring(OPTION_LABEL.length) ?? ''
    )
      .replace(/(?=\/[odanercs][:]*[^\/]*[odanercs]*)/g, '\t')
      .split('\t')
      .map((s) => s.trim())
      .filter((s) => s);

    let pictExecutablePath: string;
    switch (process.platform) {
      case 'win32':
        pictExecutablePath = context.asAbsolutePath(path.join('resources/win64', 'pict.exe'));
        break;
      case 'darwin':
        pictExecutablePath = context.asAbsolutePath(path.join('resources/macos_m1', 'pict'));
        break;
      default:
        throw new Error(`Unsupported platform(${process.platform}).`);
    }

    const workingDirPath = path.dirname(inputFilePath);
    let pictRet: SpawnRet = { stdout: '', error: '' };
    try {
      pictRet = await asyncSpawn(pictExecutablePath, workingDirPath, [inputFilePath, ...pictParams]);
    } catch (e) {
      await vscode.window.showErrorMessage(`An error ocurred during running pict.(${(e as SpawnRet).error})`);
      return;
    }

    const testcaseText = pictRet.stdout;

    const newDoc = await vscode.workspace.openTextDocument({ language: 'tsv', content: testcaseText });

    await vscode.window.showTextDocument(newDoc);
  });

  context.subscriptions.push(disposable);
}

export function deactivate() { }

async function asyncSpawn(command: string, cwd: string, args: string[]): Promise<SpawnRet> {
  return new Promise((resolve, reject) => {
    const cp = spawn(command, args, { cwd: cwd });
    let stdout = '';
    let error = '';
    cp.stdout.on('data', (d) => {
      stdout += d.toString();
    });
    cp.stderr.on('data', (e) => {
      error += e.toString();
    });
    cp.on('close', (c) => {
      if (c === 0) {
        resolve({ stdout, error });
      } else {
        reject({ stdout, error });
      }
    });
  });
}

interface SpawnRet {
  stdout: string;
  error: string;
}
