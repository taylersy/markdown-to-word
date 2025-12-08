import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import axios from 'axios';
import { FileDown, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import 'katex/dist/katex.min.css';

function App() {
  const [markdown, setMarkdown] = useState(`# 高等数学核心公式

泰勒展开式 (麦克劳林形式, $x_0 = 0$)

$$
f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(0)}{n!} x^n = f(0) + f'(0)x + \\frac{f''(0)}{2!} x^2 + \\cdots + \\frac{f^{(n)}(0)}{n!} x^n + R_n(x)
$$

余项 $R_n(x) = \\frac{f^{(n+1)}(\\xi)}{(n+1)!} x^{n+1}$ (拉格朗日余项, $\\xi$ 在 0 与 $x$ 之间)

高斯积分 (正态分布积分基础)

$$
\\int_{-\\infty}^{+\\infty} e^{-ax^2} dx = \\sqrt{\\frac{\\pi}{a}} \\quad (a > 0)
$$

格林公式 (平面曲线积分与二重积分关系)

$$
\\oint_{L} P dx + Q dy = \\iint_{D} \\left( \\frac{\\partial Q}{\\partial x} - \\frac{\\partial P}{\\partial y} \\right) dx dy
$$

其中 $L$ 为 $D$ 的取正向的边界曲线
`);

  const [isConverting, setIsConverting] = useState(false);

  const handleExport = async () => {
    setIsConverting(true);
    try {
      // Use environment variable for API URL, fallback to localhost for development
      const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${API_BASE_URL}/convert`, 
        { content: markdown }, 
        { responseType: 'blob' }
      );
      
      // Create a blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document.docx');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error converting file:', error);
      alert('Conversion failed. Please ensure the backend is running and Pandoc is installed.');
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 text-white p-1.5 rounded-lg">
            <span className="font-serif font-bold text-xl">fx</span>
          </div>
          <h1 className="text-xl font-bold text-gray-800">Markdown 转 Word (支持公式)</h1>
        </div>
        <button
          onClick={handleExport}
          disabled={isConverting}
          className={clsx(
            "flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors",
            isConverting 
              ? "bg-blue-400 cursor-not-allowed text-white"
              : "bg-blue-600 hover:bg-blue-700 text-white"
          )}
        >
          {isConverting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <FileDown className="w-5 h-5" />
          )}
          <span>{isConverting ? '正在导出...' : '导出 Word'}</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor */}
        <div className="flex-1 flex flex-col border-r border-gray-200 bg-white">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500">
            Markdown 编辑区
          </div>
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            className="flex-1 w-full p-6 resize-none focus:outline-none font-mono text-gray-800 text-base leading-relaxed"
            placeholder="在此输入 Markdown 内容..."
            spellCheck="false"
          />
        </div>

        {/* Preview */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-500 flex justify-between">
            <span>实时预览</span>
            <span className="text-xs text-gray-400">支持 LaTeX 公式</span>
          </div>
          <div className="flex-1 overflow-y-auto p-8 prose prose-blue max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={{
                // Custom rendering for math block if needed, but default is usually fine with katex css
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
