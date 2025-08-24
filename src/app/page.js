'use client';

import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import styles from './page.module.css';
import MarkdownForm from "@/app/components/MarkdownForm/MarkdownForm";
import {decodeBase64} from "@/app/utils/base64";
import {Button, Clipboard} from "@chakra-ui/react"
import Link from "next/link";

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
                    </div>
                    <div>
                        <Link href="/create" passHref>
                            <Button as="a" variant="surface" size="sm">
                                Create your own
                            </Button>
                        </Link>
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
            </main>
        </div>
    );
}