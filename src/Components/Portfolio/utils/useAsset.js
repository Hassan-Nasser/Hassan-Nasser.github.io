import React, { useState, useEffect } from 'react';
import { AssetPreloader } from './AssetPreloader';

export const useAsset = (type, id, initialData, ref, property = 'src') => {
    useEffect(() => {
        if (initialData && (typeof initialData === 'string' ? initialData.length > 0 : initialData.length > 0)) {
            if (ref.current) {
                if (property === 'backgroundImage') {
                    ref.current.style.backgroundImage = `url(${initialData})`;
                } else {
                    ref.current[property] = initialData;
                }
            }
            return;
        }
        if (!id) return;

        const unsub = AssetPreloader.getAsset(type, id, (loadedData) => {
            if (loadedData && ref.current) {
                if (property === 'backgroundImage') {
                    ref.current.style.backgroundImage = `url(${loadedData})`;
                } else {
                    ref.current[property] = loadedData;
                }
            }
        });
        return unsub;
    }, [type, id, initialData, ref, property]);
};
