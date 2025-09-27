
import React, { useEffect, useRef } from 'react';
import Quill from 'quill';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const QuillEditor: React.FC<QuillEditorProps> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current && typeof Quill !== 'undefined') {
      const quill = new Quill(editorRef.current, {
        theme: 'snow',
        modules: {
          toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            [{ 'font': [] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'align': [] }],
            ['link', 'image', 'video'],
            ['clean']
          ],
        },
        placeholder: 'Soạn thảo nội dung sản phẩm ở đây...',
      });
      
      quill.on('text-change', (delta, oldDelta, source) => {
        if (source === 'user') {
          onChange(quill.root.innerHTML);
        }
      });

      quillRef.current = quill;
    }
  }, [onChange]);

  useEffect(() => {
    // Cập nhật nội dung của Quill từ state của React khi nó thay đổi từ bên ngoài (ví dụ: AI generate)
    if (quillRef.current && quillRef.current.root.innerHTML !== value) {
      const selection = quillRef.current.getSelection();
      quillRef.current.root.innerHTML = value;
      // Khôi phục lại vị trí con trỏ nếu có
      if (selection) {
        setTimeout(() => quillRef.current?.setSelection(selection), 0);
      }
    }
  }, [value]);

  return <div ref={editorRef} style={{ minHeight: '250px' }} />;
};

export default QuillEditor;
