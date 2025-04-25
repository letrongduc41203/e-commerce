import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';
import { FeaturedSection } from '../components/FeaturedSection';
import { BodySection } from '../components/BodySection';

function Home() {
    return (
        <div>
            <HeroSection />
            <ProductGrid />
            <BodySection />
            <FeaturedSection />
        </div>
    );
}

export default Home;