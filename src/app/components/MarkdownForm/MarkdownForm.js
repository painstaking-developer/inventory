'use client';
import {useState, useEffect} from 'react';
import {marked} from 'marked';
import styles from './MarkdownForm.module.css';
import {Button, Clipboard, Group, Textarea} from "@chakra-ui/react"
import {Prose} from "@/app/components/ui/prose";
import Link from "next/link";
import {decodeBase64} from "@/app/utils/base64";
import {useSearchParams} from "next/navigation";
import {FiEdit} from "react-icons/fi";

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
    const searchParams = useSearchParams();
    const encoded_md = searchParams.get('i');
    const [isInvalid, setIsInvalid] = useState(false);
    const [decodedMd, setDecodedMd] = useState('');
    const [finalMarkdown, setFinalMarkdown] = useState('');

    useEffect(() => {
        if (encoded_md) {
            const decoded = decodeBase64(encoded_md);
            setDecodedMd(decoded);
            setIsInvalid(decoded === '*Invalid base64 input*');
        }
    }, [encoded_md]);

    useEffect(() => {
        let inputIndex = 0;
        const filled = chunks
            .map((chunk) => (chunk.type === 'text' ? chunk.value : (values[inputIndex++] || '')))
            .join('');

        if (typeof onFilledMarkdownChange === 'function') {
            onFilledMarkdownChange(filled);
        }
        if (typeof setFinalMarkdown === 'function') {
            setFinalMarkdown(filled);
        }
    }, [values, chunks, onFilledMarkdownChange, setFinalMarkdown]);


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
            {!isInvalid && (
                <Group className={styles.actions}>
                    <Clipboard.Root value={finalMarkdown}>
                        <Clipboard.Trigger asChild>
                            <Button variant="surface" size="sm">
                                <Clipboard.Indicator/>
                                <Clipboard.CopyText/>
                            </Button>
                        </Clipboard.Trigger>
                    </Clipboard.Root>
                    <Link href={`/create?i=${encoded_md}`} passHref>
                        <Button variant="surface" size="sm">
                            <FiEdit />
                            Modify this template
                        </Button>
                    </Link>
                </Group>
            )}
        </div>
    );
};

export default MarkdownForm;