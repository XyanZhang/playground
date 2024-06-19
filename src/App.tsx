import { useRef, useState } from 'react'
import { transform } from '@babel/standalone';

function App() {

  const [previewUrl, setPreviewUrl] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function onClick() {
    if(!textareaRef.current) {
      return ;
    }

    const res = transform(textareaRef.current.value, {
      presets: ['react', 'typescript'],
      filename: 'play.tsx'
    });
    console.log(res.code);
    let url:any = createUrl(res.code as string)
    console.log(url)
    setPreviewUrl(url);
    // loadJs
    loadJs(url)
  }

  // import React from "https://esm.sh/react"; 
  const code = `import { useEffect, useState } from "https://esm.sh/react";

  function App() {
    const [num, setNum] = useState(() => {
      const num1 = 1 + 2;
      const num2 = 2 + 3;
      return num1 + num2
    });
  
    return (
      <div onClick={() => setNum((prevNum) => prevNum + 1)}>{num}</div>
    );
  }
  export function add(a, b) {
    console.log(a)
    return a + b
  }
  export default App;
  `
  return (
    <div>
      <textarea ref={textareaRef} style={{ width: '500px', height: '300px'}} defaultValue={code}></textarea>
      <button onClick={onClick}>编译</button>
      {
        previewUrl && 
        <iframe src={previewUrl} frameBorder="0"></iframe>
      }
    </div>
  )
}

export default App


function createUrl(code: string) {
  const url = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));
  return url
  // document.body.appendChild(script);
}
function loadJs(url: URL) {
  const code2 = `import { add } from "${url}";
  console.log(add(2, 3));`;
  const script = document.createElement('script');
  script.type="module";
  script.textContent = code2;
  document.body.appendChild(script)
}