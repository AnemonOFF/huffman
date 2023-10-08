import { TreeNode } from "./types";

export function getCharCodes(text: string): Map<string, string> {
  const freqs = getCharsFrequency(text);
  const tree = getTree(freqs);

  const codes: Map<string, string> = new Map();
  getTreeCodes(tree, codes);
  return codes;
}

function getTreeCodes(
  tree: TreeNode | null,
  codes: Map<string, string>,
  code = ""
): void {
  if (!tree) {
    return;
  }

  if (!tree.left && !tree.right) {
    codes.set(tree.char, code ? code : "0");
    return;
  }

  getTreeCodes(tree.left, codes, code + "0");
  getTreeCodes(tree.right, codes, code + "1");
}

export function getCharsFrequency(text: string): [string, number][] {
  const freqs: Map<string, number> = new Map();

  for (const char of text) {
    const count = freqs.get(char);
    freqs.set(char, count ? count + 1 : 1);
  }

  return Array.from(freqs).sort((a, b) => b[1] - a[1]);
}

export function getTree(freqs: [string, number][]): TreeNode {
  const nodes: TreeNode[] = freqs.map((f) => ({
    char: f[0],
    freq: f[1],
    left: null,
    right: null,
  }));

  while (nodes.length > 1) {
    nodes.sort((a, b) => a.freq - b.freq);

    const left = nodes.shift()!;
    const right = nodes.shift()!;
    const parent: TreeNode = {
      char: "",
      freq: left.freq + right.freq,
      left,
      right,
    };

    nodes.push(parent);
  }

  return nodes[0];
}
