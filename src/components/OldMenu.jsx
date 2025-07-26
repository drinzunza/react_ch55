import { ref, onValue, push, set, get } from "firebase/database";
import { database } from "../config/firebase";
import { useState, useEffect } from "react";

function Menu() {
    const [menu, setMenu] = useState([]);
    const realTime = false;

    useEffect(() => {
        if (realTime) {
            const menuRef = ref(database, "menu");
            const unsubscribe = onValue(menuRef, (snapshot) => {
                const data = snapshot.val();
                const keys = Object.keys(data);
                const menuItems = keys.map(key => ({ id: key, ...data[key] }));
                setMenu(menuItems);
                console.log(menuItems);
            });

            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        } else {
            // read once the menu from realtime database
            const menuRef = ref(database, "menu");
            get(menuRef).then((snapshot) => {
                const data = snapshot.val();
                const keys = Object.keys(data);
                const menuItems = keys.map(key => ({ id: key, ...data[key] }));
                setMenu(menuItems);
                console.log(menuItems);
            });
        }

    }, []);

    const addToCart = (item) => {
        console.log(item);
        const cartRef = ref(database, "cart");
        const cartItem = {
            id: item.id,
            title: item.title,
            price: item.price,
            quantity: 1,
            status: "pending"
        }
        set(push(cartRef), cartItem);
    }


    return (
        <div>
            <h1>Menu</h1>
            {menu.map((item) => (
                <div key={item.id}>
                    <img src={item.image} alt={item.title} />
                    <h2>{item.title}</h2>
                    <p>${item.price}</p>
                    <button className="bg-blue-500 hover:bg-blue-700 text-sky-900 font-bold py-2 px-4 rounded" onClick={() => addToCart(item)}>Add to Cart</button>
                </div>
            ))}
        </div>
    )
}

export default Menu;