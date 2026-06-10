'use client';

import { useState, useEffect } from 'react';

export function BottomSheetCTA() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, []);

    if (!isVisible) return null;

    return null;
}
