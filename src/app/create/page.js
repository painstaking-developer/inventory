'use client';

import {useState, useEffect} from 'react';
import {useSearchParams} from 'next/navigation';
import MarkdownForm from "@/app/components/MarkdownForm/MarkdownForm";
import {base64EncodeUnicode, decodeBase64} from "@/app/utils/base64";
import {Button, Heading, Icon, Separator, Textarea} from "@chakra-ui/react";
import {Clipboard, IconButton, Input, InputGroup, HStack} from "@chakra-ui/react"
import {FiExternalLink} from 'react-icons/fi';

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

    const EndButtons = () => (
        <HStack spacing="1">
            <Clipboard.Trigger asChild>
                <Button
                    aria-label="Copy link"
                    variant="surface"
                    size="xs"
                    me="-1"
                >
                    <Clipboard.Indicator/>
                    Copy Link
                </Button>
            </Clipboard.Trigger>
            <Button
                as="a"
                href={shareUrl || undefined}
                rel="noopener noreferrer"
                aria-label="Open link"
                variant="surface"
                size="xs"
                isDisabled={!shareUrl}
                me="-2"
            >
                <FiExternalLink/>
                Open Page
            </Button>
        </HStack>
    );

    return (
        <div>
            <Heading>Markdown Form Editor</Heading>

            <Textarea
                value={md}
                onChange={(e) => setMd(e.target.value)}
                rows={10}
                style={{fontFamily: 'monospace'}}
                placeholder="Write your custom Markdown with %placeholders% here..."
            />

            <Clipboard.Root value={shareUrl}>
                <Clipboard.Label textStyle="label">Sharable Link</Clipboard.Label>
                <InputGroup endElement={<EndButtons/>}>
                    <Clipboard.Input asChild>
                        <Input/>
                    </Clipboard.Input>
                </InputGroup>
            </Clipboard.Root>

            <Separator my="4"/>

            <Heading>Live preview</Heading>

            <MarkdownForm md={md}/>
        </div>
    );
}