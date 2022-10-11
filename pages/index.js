import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import abi from "../utils/CoffeePortal.json";
import Head from "next/head";

export default function Home() {
    const contractAddress = "0x258a3F1777d9F30819F05a4220F57A1Ffa85A208";
    const contractABI = abi.abi;
    const [currentAccount, setCurrentAccount] = useState("");
    const [message, setMessage] = useState("");
    const [name, setName] = useState("");
    const [allCoffee, setAllCoffee] = useState([]);

    const checkIfWalletIsConnected = async () => {
        try {
            const { ethereum } = window;
            const accounts = await ethereum.request({ method: "eth_accounts" });

            if (accounts.length !== 0) {
                const account = accounts[0];
                setCurrentAccount(account);
                toast.success("🦄 Wallet is Connected", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                toast.warn("Make sure you have MetaMask Connected", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        } catch (error) {
            toast.error(`${error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    /**
     * Implement your connectWallet method here
     */
    const connectWallet = async () => {
        try {
            const { ethereum } = window;

            if (!ethereum) {
                toast.warn("Make sure you have MetaMask Connected", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                return;
            }

            const accounts = await ethereum.request({
                method: "eth_requestAccounts",
            });
            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);
        }
    };

    const buyCoffee = async () => {
        try {
            const { ethereum } = window;

            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const coffeePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                let count = await coffeePortalContract.getTotalCoffee();
                console.log(
                    "Retrieved total coffee count...",
                    count.toNumber()
                );

                /*
                 * Execute the actual coffee from your smart contract
                 */
                const coffeeTxn = await coffeePortalContract.buyCoffee(
                    message ? message : "Enjoy Your Coffee",
                    name ? name : "Anonymous",
                    ethers.utils.parseEther("0.001"),
                    {
                        gasLimit: 300000,
                    }
                );
                console.log("Mining...", coffeeTxn.hash);

                toast.info("Sending Fund for coffee...", {
                    position: "bottom-right",
                    autoClose: 18050,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                await coffeeTxn.wait();

                console.log("Mined -- ", coffeeTxn.hash);

                count = await coffeePortalContract.getTotalCoffee();

                console.log(
                    "Retrieved total coffee count...",
                    count.toNumber()
                );

                setMessage("");
                setName("");

                toast.success("Coffee Purchased!", {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            toast.error(`${error.message}`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    /*
     * Create a method that gets all coffee from your contract
     */
    const getAllCoffee = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const coffeePortalContract = new ethers.Contract(
                    contractAddress,
                    contractABI,
                    signer
                );

                const coffees = await coffeePortalContract.getAllCoffee();
                const coffeeCleaned = coffees.map((coffee) => {
                    return {
                        address: coffee.giver,
                        timestamp: new Date(coffee.timestamp * 1000),
                        message: coffee.message,
                        name: coffee.name,
                    };
                });

                /*
                 * Store our data in React State
                 */
                setAllCoffee(coffeeCleaned);
            } else {
                console.log("Ethereum object doesn't exist!");
            }
        } catch (error) {
            console.log(error);
        }
    };

    /*
     * This runs our function when the page loads.
     */
    useEffect(() => {
        let coffeePortalContract;
        getAllCoffee();
        checkIfWalletIsConnected();

        const onNewCoffee = (from, timestamp, message, name) => {
            console.log("NewCoffee", from, timestamp, message, name);
            setAllCoffee((prevState) => [
                ...prevState,
                {
                    address: from,
                    timestamp: new Date(timestamp * 1000),
                    message: message,
                    name: name,
                },
            ]);
        };

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            coffeePortalContract = new ethers.Contract(
                contractAddress,
                contractABI,
                signer
            );
            coffeePortalContract.on("NewCoffee", onNewCoffee);
        }

        return () => {
            if (coffeePortalContract) {
                coffeePortalContract.off("NewCoffee", onNewCoffee);
            }
        };
    }, []);

    const handleOnMessageChange = (event) => {
        const { value } = event.target;
        setMessage(value);
    };
    const handleOnNameChange = (event) => {
        const { value } = event.target;
        setName(value);
    };

    return (
        <div className="">
            <Head>
                <title>BuyMeaCoffee</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="">
                <h1 className="header">BuyMeACoffee</h1>
                {/*
                 * If there is currentAccount render this form, else render a button to connect wallet
                 */}

                {currentAccount ? (
                    <div className="form-wrapper">
                        <form className="">
                            <div className="form-element">
                                <label className="" htmlFor="name">
                                    Name
                                </label>
                                <input
                                    className=""
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    onChange={handleOnNameChange}
                                    required
                                />
                            </div>

                            <div className="mb-4 form-element">
                                <label className="" htmlFor="message">
                                    Send the Creator a Message
                                </label>

                                <textarea
                                    className=""
                                    rows="3"
                                    placeholder="Message"
                                    id="message"
                                    onChange={handleOnMessageChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="">
                                <button
                                    className="form-button"
                                    type="button"
                                    onClick={buyCoffee}
                                >
                                    Support $5
                                </button>
                            </div>
                        </form>
                    </div>
                ) : (
                    <button
                        className="connect-to-wallet form-button"
                        onClick={connectWallet}
                    >
                        Connect Your Wallet
                    </button>
                )}

                <div class="form-wrapper">
                    <h1>Our Supporters </h1>

                    {allCoffee.map((coffee, index) => {
                        return (
                            <div className="border-l-2 mt-10" key={index}>
                                <div className="container">
                                    {/* <!-- Dot Following the Left Vertical Line --> */}
                                    <div className=""></div>

                                    {/* <!-- Line that connecting the box with the vertical line --> */}
                                    <div className=""></div>

                                    {/* <!-- Content that showing in the box --> */}

                                    <div className="flex-auto">
                                        <h2 className="text-md">
                                            Supporter: {coffee.message}
                                        </h2>
                                        <h2 className="text-md">
                                            Message: {coffee.name}
                                        </h2>
                                        {/* <h3>Address: {coffee.address}</h3> */}
                                        <h6 className="text-md font-bold">
                                            {coffee.timestamp.toString()}
                                        </h6>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
            <ToastContainer
                position="bottom-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
}
