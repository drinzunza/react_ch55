import { useEffect, useState } from 'react';
import {ref, onValue, get} from "firebase/database";
import { database } from '../config/firebase';


function Menu() {
    const [menu, setMenu] = useState([]);

    function loadMenuFromFB() {
        console.log("Loading menu with notifications");

        // Read menu on real-time way (listen to changes)
        const menuRef = ref(database, "menu");
        onValue(menuRef, (snapshot) => {
            const data = snapshot.val();
            console.log("data", data);
            
            // parse data from obj -> array
            const keys = Object.keys(data);
            const menuItems = keys.map(key => ({...data[key]}) );
            console.log("menuItems", menuItems);
            setMenu(menuItems);
        });
    }

    useEffect(function() {
        loadMenuFromFB();
        // loadOnce();
    }, []);

    return (
        <div className="menu">
            <h1>The menu from Firebase!!!</h1>

            {menu.map(prod => <div className={prod.outStock ? "item-deactivated" : 'item'}>
                { prod.outStock ? <h6>Out of stock</h6> : null }
                
                <h5>{prod.title}</h5>
                <p>{prod.description}</p>
                <label>{prod.category}</label>
                <label><b>{prod.price}</b></label>
                <hr />
            </div>)}
        </div>
    );
}

export default Menu;