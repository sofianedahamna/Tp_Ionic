// src/Composants/BurgerMenu.js
import React, { useState } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link } from 'react-router-dom';

function BurgerMenu() {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleClick}
            >
                <MenuIcon />
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleClose} component={Link} to="/profile">
                    Modifier le profil
                </MenuItem>
                <MenuItem onClick={handleClose} component={Link} to="/user-bornes/your-user-id">
                    Ma liste de bornes
                </MenuItem>
                {/* Nouvel élément de menu pour créer une borne */}
                <MenuItem onClick={handleClose} component={Link} to="/add-station">
                    Créer ma borne
                </MenuItem>
            </Menu>
        </div>
    );
}

export default BurgerMenu;
