'use client';
import {useState, useEffect} from 'react';
import {marked} from 'marked';
import styles from './MarkdownForm.module.css';
import { Textarea } from "@chakra-ui/react"
import {Prose} from "@/app/components/ui/prose";

// Split Markdown on %...% and return chunks
const parseMarkdownToChunks = (md) => {
    const regex = /%([^%]+)%/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(md)) !== null) {
        const before = md.slice(lastIndex, match.index);
        const placeholder = match[1];
        if (before) parts.push({type: 'text', value: before});
        parts.push({type: 'input', placeholder});
        lastIndex = regex.lastIndex;
    }
    if (lastIndex < md.length) {
        parts.push({type: 'text', value: md.slice(lastIndex)});
    }
    return parts;
};

const MarkdownForm = ({md, onFilledMarkdownChange}) => {
    const chunks = parseMarkdownToChunks(md);
    const [values, setValues] = useState(() =>
        Array(chunks.filter(c => c.type === 'input').length).fill('')
    );

    useEffect(() => {
        if (typeof onFilledMarkdownChange === 'function') {
            let inputIndex = 0;
            const filled = chunks.map((chunk) => {
                if (chunk.type === 'text') return chunk.value;
                return values[inputIndex++] || '';
            }).join('');
            onFilledMarkdownChange(filled);
        }
    }, [values, chunks, onFilledMarkdownChange]);

    const handleInputChange = (index, newVal) => {
        setValues((prev) => {
            const updated = [...prev];
            updated[index] = newVal;
            return updated;
        });
    };

    let inputCounter = 0;

    return (
        <div className={styles.container}>
            {chunks.map((chunk, i) => {
                if (chunk.type === 'text') {
                    const html = marked.parse(chunk.value, {breaks: true});
                    return (
                        <Prose
                            key={i}
                            className={styles.textChunk}
                            dangerouslySetInnerHTML={{__html: html}}
                        />
                    );
                }
                if (chunk.type === 'input') {
                    const currentIndex = inputCounter++;
                    return (
                        <Textarea
                            variant="subtle"
                            autoresize
                            key={i}
                            className={styles.textarea}
                            placeholder={chunk.placeholder}
                            rows="3"
                            value={values[currentIndex]}
                            onChange={(e) => handleInputChange(currentIndex, e.target.value)}
                        />
                    );
                }
                return null;
            })}
        </div>
    );
};

export default MarkdownForm;