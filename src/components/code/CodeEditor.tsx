import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';

export interface CodeEditorProps {
  value: string;
  language: 'javascript' | 'html';
  onChange: (v: string) => void;
  height?: string;
}

export default function CodeEditor({ value, language, onChange, height = '300px' }: CodeEditorProps) {
  const extensions = useMemo(() => [language === 'html' ? html() : javascript()], [language]);
  return (
    <CodeMirror
      value={value}
      height={height}
      theme="dark"
      basicSetup={{ lineNumbers: true }}
      extensions={extensions}
      onChange={(v: string) => onChange(v)}
    />
  );
}
