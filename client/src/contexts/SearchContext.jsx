import React, { createContext, useContext, useState, useEffect } from 'react';

const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const clearSearch = () => {
        setSearchTerm('');
        setSearchResults([]);
        setIsSearching(false);
    };

    const performSearch = (products, term) => {
        if (!term.trim()) {
            return products;
        }
        
        const searchLower = term.toLowerCase();
        return products.filter(product => {
            const name = (product.productName || product.name || '').toLowerCase();
            const description = (product.description || '').toLowerCase();
            const category = (product.category?.categoryName || product.category || '').toLowerCase();
            
            return name.includes(searchLower) || 
                   description.includes(searchLower) || 
                   category.includes(searchLower);
        });
    };

    const value = {
        searchTerm,
        setSearchTerm,
        searchResults,
        setSearchResults,
        isSearching,
        setIsSearching,
        clearSearch,
        performSearch
    };

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within SearchProvider');
    }
    return context;
}