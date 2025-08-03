'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MarkdownForm from "@/app/components/MarkdownForm/MarkdownForm";
import {base64EncodeUnicode, decodeBase64} from "@/app/utils/base64";
import { Textarea } from "@chakra-ui/react"

export default function CreatePage() {
    const [md, setMd] = useState('');
    const [shareUrl, setShareUrl] = useState('');
    const searchParams = useSearchParams();

    // Initialize from URL parameter
    useEffect(() => {
        const i = searchParams.get('i');
        if (i) {
            const decoded = decodeBase64(i);
            if (decoded && decoded !== '*Invalid base64 input*') {
                setMd(decoded);
            }
        }
    }, [searchParams]);

    // Update share URL when markdown changes
    useEffect(() => {
        if (md) {
            const encoded = base64EncodeUnicode(md);
            const url = `${window.location.origin}?i=${encoded}`;
            setShareUrl(url);
            // Update URL without navigation
            window.history.replaceState(null, '', `/create?i=${encoded}`);
        } else {
            setShareUrl('');
            window.history.replaceState(null, '', '/create');
        }
    }, [md]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            // Optionally add success feedback
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    return (
        <div>
            <h2>Markdown Form Editor</h2>

            <Textarea
                value={md}
                onChange={(e) => setMd(e.target.value)}
                rows={10}
                style={{ fontFamily: 'monospace' }}
                placeholder="Write your custom Markdown with %placeholders% here..."
            />

            <div>
                <label>
                    <strong>Shareable Link:</strong>
                </label>
                <br />
                <a href={shareUrl} style={{ fontFamily: 'monospace' }}>
                    {shareUrl}
                </a>
                <button onClick={handleCopy} disabled={!shareUrl}>
                    Copy to Clipboard
                </button>
            </div>

            <h3>Live Preview:</h3>
            <MarkdownForm md={md} />
        </div>
    );
}