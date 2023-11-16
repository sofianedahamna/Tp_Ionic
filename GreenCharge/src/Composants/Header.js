// Exemple de fichier src/Composants/Header.js
import React from 'react';
import BurgerMenu from './BurgerMenu';

function Header() {
    return (
        <header>
            {/* ... autres éléments d'en-tête ... */}
            <BurgerMenu />
        </header>
    );
}

export default Header;
