import { useState } from 'react'

function Contact() {
    const [selectedOption, setSelectedOption] = useState("0");

    function handleSelection(e) {
        var selection = e.target.value;
        console.log("selected", selection);
        setSelectedOption(selection);
    }

    function getForm() {
        if(selectedOption == "1"){    
            return form1();
        }
        else if(selectedOption == "2") {
            return form2();
        }
    }

    function form1() {
        return (
            <div className='contact-form'>
                <h3>Form 1</h3>
                <div>
                    <label>Name</label>
                    <input />
                </div>
            </div>
        );
    }

    function form2() {
        return (
            <div className='contact-form'>
                <h3>Form 2</h3>
                <div>
                    <label>last name</label>
                    <input />
                </div>
            </div>
        );
    }

    return (
        <div className="contact">
            <div>
                Select something:
                <select onChange={handleSelection}>
                    <option value="1">Question 1</option>
                    <option value="2">Question 2</option>
                    <option value="3">Question 3</option>
                </select>
            </div>


            <hr />
            {getForm()}
        </div>
    )

}

export default Contact;