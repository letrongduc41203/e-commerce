import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ProductGrid } from '../components/ProductGrid';
import { FeaturedSection } from '../components/FeaturedSection';

function Home() {
    return (
        <div>
            <HeroSection />
            <ProductGrid />
            <FeaturedSection />
        </div>
    );
}

export default Home;