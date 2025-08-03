'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import styles from './page.module.css';
import MarkdownForm from "@/app/components/MarkdownForm/MarkdownForm";
import {decodeBase64} from "@/app/utils/base64";

export default function HomePage() {
    const searchParams = useSearchParams();
    const [finalMarkdown, setFinalMarkdown] = useState('');
    const encoded_md = searchParams.get('i');
    const [decodedMd, setDecodedMd] = useState('');
    const [isInvalid, setIsInvalid] = useState(false);

    useEffect(() => {
        if (encoded_md) {
            const decoded = decodeBase64(encoded_md);
            setDecodedMd(decoded);
            setIsInvalid(decoded === '*Invalid base64 input*');
        }
    }, [encoded_md]);

    if (!encoded_md) {
        return (
            <div className={styles.page}>
                <main className={styles.main}>
                    <div>
                        There&apos;s nothing here.
                        <br />
                        <Link href="/create">Create your own!</Link>
                    </div>
                </main>
            </div>
        );
    }

    const handleCopyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(finalMarkdown);
            // Optionally add some user feedback here
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className={styles.page}>
            <main className={styles.main}>
                <MarkdownForm
                    md={decodedMd}
                    onFilledMarkdownChange={setFinalMarkdown}
                />
                {!isInvalid && (
                    <div className={styles.actions}>
                        <button
                            onClick={handleCopyToClipboard}
                            disabled={!finalMarkdown}
                            className={styles.button}
                        >
                            Copy to Clipboard
                        </button>
                        <Link
                            href={`/create?i=${encoded_md}`}
                            className={styles.link}
                        >
                            Create your own!
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}