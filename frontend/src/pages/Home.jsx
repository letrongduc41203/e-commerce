import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';
import { FeaturedSection } from '../components/FeaturedSection';

export function Home() {
    return (
        <div>
            <HeroSection />
            <ProductGrid />
            <FeaturedSection />
        </div>
    );
} 