import { useWeb3Contract } from "react-moralis";
import React, {useEffect, useState} from "react";

export default function Donate() {
    // const {runContractFunction : donate} = useWeb3Contract(
    //     abi : //,
    //     address : //,
    //     functionName: //,
    //     params : {}//,
    //     msgValue : //,
    // )

    const [messgae, setMessage] = useState("");
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");

    const [allCoffee, setCoffee] = useState("");                                                                      

    return (
        <div className="donate-wrapper" >
            <div className="">
                <span className="">Name</span>
                <input />
            </div>
            <div>
                <span>Message</span>
                <input />
            </div>
            <button>Donate</button>
        </div>
    );
}
